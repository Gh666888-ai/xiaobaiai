import { createMarkdownBody } from "./markdown.js";

import { REMOTE_MODE, apiHeaders, apiUrl } from "./api-client.js";

export function initChat({
  apiBase,
  maxHistory,
  activationWarmupKey,
  getAgentName,
  defaultInputPlaceholder,
  onUserMessage = null,
} = {}) {
  const chatHistory = document.getElementById("chat-history");
  const chatMessages = document.getElementById("chat-messages");
  const msgInput = document.getElementById("msg-input");
  const chatArea = document.getElementById("chat-area");
  const sendBtn = document.getElementById("send-btn");
  const startupRitual = document.getElementById("startup-ritual");
  const startupRitualTitle = document.getElementById("startup-ritual-title");

  let inputLocked = false;
  let closeTimer = null;
  let hasPendingJarvisMessage = false;
  let pendingMessageDismissed = false;
  let audioCtx = null;
  let audioUnlocked = false;
  let warmupTimer = null;
  let ritualTimer = null;
  let ritualStepTimers = [];

  function setStartupRitualStep(activeIndex, title = "小白正在启动") {
    if (!startupRitual) return;
    startupRitualTitle.textContent = title;
    startupRitual.querySelectorAll(".startup-ritual-step").forEach((step, index) => {
      step.classList.toggle("done", index < activeIndex);
      step.classList.toggle("active", index === activeIndex);
    });
  }

  function showStartupRitual({ title, durationMs = 900, lockInput = false } = {}) {
    if (!startupRitual) return;
    startupRitual.hidden = false;
    if (lockInput) setComposerLocked(true, "小白正在完成首次激活准备…");
    if (ritualTimer) {
      clearTimeout(ritualTimer);
      ritualTimer = null;
    }
    ritualStepTimers.forEach(timer => clearTimeout(timer));
    ritualStepTimers = [];
    const steps = [0, 1, 2, 3, 4];
    const stepMs = Math.max(80, Math.floor(durationMs / steps.length));
    steps.forEach((step, index) => {
      ritualStepTimers.push(setTimeout(() => setStartupRitualStep(step, title), index * stepMs));
    });
    ritualTimer = setTimeout(() => {
      startupRitual.hidden = true;
      if (lockInput) releaseWarmupLock();
    }, durationMs);
  }

  function setComposerLocked(locked, reason = "") {
    inputLocked = locked;
    msgInput.disabled = locked;
    sendBtn.disabled = locked;
    msgInput.placeholder = locked ? (reason || "系统正在准备中…") : defaultInputPlaceholder();
  }

  function releaseWarmupLock() {
    if (warmupTimer) {
      clearTimeout(warmupTimer);
      warmupTimer = null;
    }
    if (ritualTimer) {
      clearTimeout(ritualTimer);
      ritualTimer = null;
    }
    ritualStepTimers.forEach(timer => clearTimeout(timer));
    ritualStepTimers = [];
    try { sessionStorage.removeItem(activationWarmupKey); } catch {}
    if (startupRitual) startupRitual.hidden = true;
    setComposerLocked(false);
  }

  function applyActivationWarmupLock() {
    let until = 0;
    try {
      until = Number(sessionStorage.getItem(activationWarmupKey) || 0);
    } catch {}

    const remaining = until - Date.now();
    if (remaining <= 0) {
      releaseWarmupLock();
      showStartupRitual({ title: "小白快速唤醒中", durationMs: 850, lockInput: false });
      return;
    }

    const seconds = Math.max(1, Math.ceil(remaining / 1000));
    setComposerLocked(true, `系统刚激活，正在准备模型…约 ${seconds}s`);
    showStartupRitual({ title: "首次激活启动中", durationMs: remaining, lockInput: true });
  }

  function isHoveringChat() {
    return chatArea.matches(":hover") || chatHistory.matches(":hover") || chatMessages.matches(":hover");
  }

  function ensureAudioContext() {
    if (!audioCtx) {
      if (!audioUnlocked) return null;  // 手势前不创建，避免 Chrome autoplay 警告
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      try { audioCtx = new AudioCtx(); } catch { return null; }
    }
    return audioCtx;
  }

  function unlockAudioOnFirstGesture() {
    const unlock = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;
      // 首次手势后才创建/恢复 AudioContext，避免 Chrome autoplay 策略警告
      const ctx = ensureAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    window.addEventListener("touchstart", unlock, true);
  }

  async function playJarvisAlert() {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    try { if (ctx.state === "suspended") await ctx.resume(); } catch { return; }
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.28);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    master.connect(ctx.destination);

    const oscA = ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.setValueAtTime(740, now);
    oscA.frequency.exponentialRampToValueAtTime(880, now + 0.18);
    oscA.connect(master);

    const oscB = ctx.createOscillator();
    oscB.type = "triangle";
    oscB.frequency.setValueAtTime(1110, now + 0.12);
    oscB.frequency.exponentialRampToValueAtTime(1320, now + 0.34);
    oscB.connect(master);

    oscA.start(now); oscA.stop(now + 0.32);
    oscB.start(now + 0.12); oscB.stop(now + 0.5);

    oscA.addEventListener("ended", () => oscA.disconnect(), { once: true });
    oscB.addEventListener("ended", () => oscB.disconnect(), { once: true });
    setTimeout(() => master.disconnect(), 700);
  }

  function isTyping() {
    return document.activeElement === msgInput || msgInput.value.trim().length > 0;
  }

  async function fetchChatHistory() {
    if (REMOTE_MODE) return [];
    try {
      const res = await fetch(`${apiBase}/conversations?limit=${maxHistory}`);
      if (!res.ok) return [];
      const rows = await res.json();
      if (!Array.isArray(rows)) return [];
      return rows
        .filter(r => r && (r.role === "user" || r.role === "jarvis") && typeof r.content === "string")
        .map(r => {
          if (r.role === "user" && r.from_id && r.from_id !== "ID:000001") {
            return { role: "external", text: r.content, label: r.from_id };
          }
          return { role: r.role, text: r.content };
        });
    } catch { return []; }
  }

  function openChat(autoClose = false) {
    chatHistory.classList.add("open");
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (autoClose && (!hasPendingJarvisMessage || pendingMessageDismissed) && !isTyping()) scheduleClose(4500);
  }

  function closeChat() {
    if ((hasPendingJarvisMessage && !pendingMessageDismissed) || isTyping() || isHoveringChat()) return;
    chatHistory.classList.remove("open");
  }

  function scheduleClose(ms = 100) {
    if ((hasPendingJarvisMessage && !pendingMessageDismissed) || isTyping() || isHoveringChat()) return;
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(closeChat, ms);
  }

  function addMsg(role, text, options = {}) {
    const { alert = role === "jarvis", pending = true, label } = options;
    const defaultLabel = role === "user" ? "You" : role === "jarvis" ? getAgentName() : "Peer";
    const labelText = label || defaultLabel;
    const div = document.createElement("div");
    div.className = `msg msg-${role}`;
    const labelSpan = document.createElement("span");
    labelSpan.className = "msg-label";
    labelSpan.textContent = labelText;
    div.appendChild(labelSpan);
    div.appendChild(createMarkdownBody(text));
    chatMessages.appendChild(div);

    while (chatMessages.children.length > maxHistory) {
      chatMessages.removeChild(chatMessages.firstChild);
    }

    if (role === "jarvis") {
      hasPendingJarvisMessage = pending;
      pendingMessageDismissed = !pending;
      if (alert) playJarvisAlert();
      if (pending) openChat();
    } else if (role === "user") {
      hasPendingJarvisMessage = false;
      pendingMessageDismissed = false;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function restoreChatHistory() {
    const history = await fetchChatHistory();
    history.forEach(i => addMsg(i.role, i.text, { persist: false, alert: false, pending: false, label: i.label }));
    if (history.length) {
      pendingMessageDismissed = true;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  async function send({ channel = null, label = null } = {}) {
    if (inputLocked) return;
    const text = msgInput.value.trim();
    if (!text) return;
    msgInput.value = "";
    // onUserMessage 返回字符串则用作后端 payload；返回 false 则不发后端
    const override = onUserMessage?.(text);
    addMsg("user", text, { label: label || undefined });
    openChat();
    scheduleClose(1000);
    if (override === false) return;

    try {
      const backendText = (typeof override === "string") ? override : text;
      const payload = REMOTE_MODE
        ? { content: backendText, task: backendText, channel: "MOBILE_APP", mode: "tianshu-task", source: "mobile-desktop-brain" }
        : { content: backendText, from_id: "ID:000001" };
      if (channel) payload.channel = channel;
      const resp = await fetch(REMOTE_MODE ? apiUrl("/tasks") : `${apiBase}/message`, {
        method: "POST",
        headers: apiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        let message = `HTTP ${resp.status}`;
        try {
          const body = await resp.json();
          message = body.error || body.message || message;
        } catch {}
        throw new Error(message);
      }
    } catch (error) {
      console.warn("[send]", error.message);
      const hint = /401|xiaobai_member_login_required/.test(error.message || "")
        ? "消息已在本地界面保留，但会员登录状态过期，请重新登录后再发送。"
        : "消息暂时没有进入处理队列，请检查本地服务或稍后重试。";
      addMsg("jarvis", hint);
      openChat(true);
    }
  }

  chatArea.addEventListener("mouseenter", () => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    openChat();
  });
  chatArea.addEventListener("mouseleave", () => scheduleClose());
  msgInput.addEventListener("focus", () => openChat());
  msgInput.addEventListener("blur", () => { if (!isTyping()) scheduleClose(); });
  msgInput.addEventListener("input", () => {
    if (isTyping()) openChat();
    else if (!hasPendingJarvisMessage || pendingMessageDismissed) scheduleClose();
  });
  msgInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  });
  sendBtn.addEventListener("click", send);

  document.addEventListener("pointerdown", event => {
    if (chatArea.contains(event.target)) return;
    if (hasPendingJarvisMessage && !isTyping()) {
      pendingMessageDismissed = true;
      closeChat();
      return;
    }
    if (!isTyping()) {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      chatHistory.classList.remove("open");
    }
  });

  function deleteLastUserMsg() {
    const msgs = chatMessages.querySelectorAll('.msg-user')
    if (!msgs.length) return
    const last = msgs[msgs.length - 1]
    last.style.transition = 'opacity 0.3s ease'
    last.style.opacity = '0'
    setTimeout(() => last.remove(), 300)
  }

  function updateLastJarvisMsg(newText) {
    const msgs = chatMessages.querySelectorAll('.msg-jarvis');
    if (!msgs.length) return;
    const last = msgs[msgs.length - 1];
    // 移除原 markdown body（label span 之后的所有子节点）
    const children = Array.from(last.children);
    for (let i = 1; i < children.length; i++) children[i].remove();
    last.appendChild(createMarkdownBody(newText));
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  return {
    addMsg,
    deleteLastUserMsg,
    updateLastJarvisMsg,
    applyActivationWarmupLock,
    isComposerLocked: () => inputLocked,
    isTyping,
    openChat,
    restoreChatHistory,
    send,
    unlockAudioOnFirstGesture,
  };
}
