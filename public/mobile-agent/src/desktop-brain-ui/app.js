import { renderBrainUiApp } from "./app-shell.js";
import { API } from "./api-client.js";
import { bootstrapACUI } from "./acui/bootstrap.js";
import { initChat } from "./chat.js";
import { initPanelCollapse } from "./panel-collapse.js";
import { ThoughtStream } from "./thought-stream.js";
import { initVoicePanel } from "./voice-panel.js";
import { initHotspot, toggleHotspot, setHotspotMode, moveVoicePanelToBody, restoreVoicePanel } from "./hotspot.js";
import { initPersonCard, setPersonCardMode, showPersonCardByName, extractPersonCardQuery, updatePersonCardFromAssistantText } from "./person-card.js";
import { initDocPanel, setDocPanelMode } from "./doc.js";
renderBrainUiApp(document.body);
const THEME_KEY = "jarvis-brain-ui-theme";
const PHYSICS_STORAGE_KEY = "jarvis-brain-ui-physics";
const BACKGROUND_MODE_KEY = "xiaobai-background-mode";
const CUSTOM_BACKGROUND_KEY = "xiaobai-custom-background";
const ACTIVATION_WARMUP_KEY = "bailongma_activation_warmup_until";
const UI_ZOOM_STORAGE_KEY = "bailongma_ui_zoom_factor";
const MAX_CHAT_HISTORY = 60;
const DEFAULT_AGENT_NAME = "小白";
const DEFAULT_UI_ZOOM = 1.1;
const MIN_UI_ZOOM = 0.8;
const MAX_UI_ZOOM = 1.8;
const UI_ZOOM_STEP = 0.1;
const UI_ZOOM_WHEEL_STEP = 0.05;
const MEMORY_GRAPH_STORAGE_KEY = "bailongma-memory-graph-enabled";
const MEMORY_GRAPH_ENABLED = localStorage.getItem(MEMORY_GRAPH_STORAGE_KEY) !== "false";
const MOBILE_UPDATE_PACKAGE_URL = "../downloads/xiaobai-mobile/Xiaobai-Tianshu-Mobile-Web-0.1.14.zip";

const themeSwitcher = document.getElementById("theme-switcher");
const resetViewBtn = document.getElementById("reset-view-btn");
const physicsControl = document.getElementById("physics-control");
const physicsToggle = document.getElementById("physics-toggle");
const gravitySlider = document.getElementById("gravity-slider");
const repulsionSlider = document.getElementById("repulsion-slider");
const nodeSizeSlider = document.getElementById("node-size-slider");
const gravityValue = document.getElementById("gravity-value");
const repulsionValue = document.getElementById("repulsion-value");
const nodeSizeValue = document.getElementById("node-size-value");
const brandNameEl = document.getElementById("agent-brand-name");
const graphEl = document.getElementById("graph");
const checkUpdateBtn = document.getElementById("check-update-btn");
const diagnosticsBtn = document.getElementById("diagnostics-btn");
const updateStatusEl = document.getElementById("update-status");
const updateCardEl = document.getElementById("update-card");
const updateCloseBtn = document.getElementById("update-close-btn");

let agentName = DEFAULT_AGENT_NAME;
let removeUpdaterStatusListener = null;
let currentUiZoom = DEFAULT_UI_ZOOM;
let chat = null;

function addMsg(...args) { return chat?.addMsg(...args); }
function openChat(...args) { return chat?.openChat(...args); }
function updateLastJarvisMsg(...args) { return chat?.updateLastJarvisMsg(...args); }
function isTyping() { return chat?.isTyping() || false; }

let openSettingsPanel = null;

function defaultInputPlaceholder() {
  return `向 ${agentName} 发送消息…`;
}

function setUpdateStatus(message, state = "idle") {
  if (!updateStatusEl) return;
  updateStatusEl.textContent = message;
  updateStatusEl.dataset.state = state;
}

function setUpdateButtonState({ disabled = false, label = "检查更新" } = {}) {
  if (!checkUpdateBtn) return;
  checkUpdateBtn.disabled = disabled;
  checkUpdateBtn.textContent = label;
}

function formatDiagnostics(diag = {}) {
  const lastError = diag.lastError?.message ? `最近错误：${diag.lastError.message}` : "最近错误：无";
  const updater = diag.lastUpdaterStatus
    ? `更新状态：${diag.lastUpdaterStatus.stage || "unknown"} ${diag.lastUpdaterStatus.message || ""}`.trim()
    : `更新状态：${diag.updateChannelEnabled ? "已启用" : "未启用"}`;
  const updateFeed = diag.updateFeedUrl ? `更新源：${diag.updateFeedUrl}` : "更新源：未配置";
  const recent = Array.isArray(diag.events) && diag.events.length
    ? `最近事件：${diag.events.slice(-3).map(e => e.stage).join(" → ")}`
    : "最近事件：无";
  return [
    `版本：${diag.currentVersion || diag.version || "unknown"}`,
    `端口：${diag.backendPort || "unknown"}`,
    updateFeed,
    updater,
    lastError,
    recent,
    `日志：${diag.logPath || "unknown"}`,
  ].join("\n");
}

function setUpdateCardHidden(hidden) {
  if (!updateCardEl) return;
  updateCardEl.classList.toggle("hidden", Boolean(hidden));
}

function clampZoomFactor(factor) {
  return Math.min(MAX_UI_ZOOM, Math.max(MIN_UI_ZOOM, Number(factor) || DEFAULT_UI_ZOOM));
}

function saveUiZoom(factor) {
  try {
    localStorage.setItem(UI_ZOOM_STORAGE_KEY, String(factor));
  } catch {}
}

function loadSavedUiZoom() {
  try {
    const raw = Number(localStorage.getItem(UI_ZOOM_STORAGE_KEY));
    if (Number.isFinite(raw)) return clampZoomFactor(raw);
  } catch {}
  return DEFAULT_UI_ZOOM;
}

function applyUiZoom(factor, { persist = true } = {}) {
  const nextZoom = clampZoomFactor(factor);
  currentUiZoom = nextZoom;

  const bridge = window.xiaobai || window.bailongma;
  if (bridge?.isElectron && typeof bridge.setZoomFactor === "function") {
    bridge.setZoomFactor(nextZoom);
  } else {
    document.documentElement.style.zoom = String(nextZoom);
  }

  if (persist) saveUiZoom(nextZoom);
}

function stepUiZoom(delta) {
  const nextZoom = Math.round((currentUiZoom + delta) * 100) / 100;
  applyUiZoom(nextZoom);
}

function initUiZoom() {
  const bridge = window.xiaobai || window.bailongma;
  const initialZoom = loadSavedUiZoom();

  if (!bridge?.isElectron) {
    applyUiZoom(initialZoom, { persist: false });
  } else {
    try {
      const bridgeZoom = bridge.getZoomFactor?.();
      if (typeof bridgeZoom === "number" && Number.isFinite(bridgeZoom)) {
        currentUiZoom = clampZoomFactor(bridgeZoom);
      }
    } catch {}
    applyUiZoom(initialZoom, { persist: false });
  }

  window.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    stepUiZoom(event.deltaY < 0 ? UI_ZOOM_WHEEL_STEP : -UI_ZOOM_WHEEL_STEP);
  }, { passive: false, capture: true });

  window.addEventListener("keydown", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;

    const key = event.key;
    if (key === "+" || key === "=" || key === "Add") {
      event.preventDefault();
      stepUiZoom(UI_ZOOM_STEP);
      return;
    }

    if (key === "-" || key === "_" || key === "Subtract") {
      event.preventDefault();
      stepUiZoom(-UI_ZOOM_STEP);
      return;
    }

    if (key === "0") {
      event.preventDefault();
      applyUiZoom(DEFAULT_UI_ZOOM);
    }
  });
}

function setAgentName(nextName) {
  const normalized = String(nextName || "").trim() || DEFAULT_AGENT_NAME;
  agentName = normalized;
  document.title = `${normalized} · Cognitive Surface`;
  if (brandNameEl) brandNameEl.textContent = normalized === "小白" ? "小白天枢" : `${normalized} AI Agent`;
  if (graphEl) graphEl.setAttribute("aria-label", `${normalized} memory graph`);
  const input = document.getElementById("msg-input");
  if (input && !chat?.isComposerLocked?.()) input.placeholder = defaultInputPlaceholder();
  document.querySelectorAll(".msg-jarvis .msg-label").forEach((el) => {
    el.textContent = normalized;
  });
}

async function loadAgentProfile() {
  try {
    const res = await fetch(`${API}/agent-profile`);
    if (!res.ok) return;
    const data = await res.json();
    setAgentName(data.name);
  } catch {}
}

const physicsSettings = {
  gravity: 1,
  repulsion: 1.35,
  nodeSize: 1,
};

requestAnimationFrame(() => {
  themeSwitcher.classList.add("visible");
  resetViewBtn.classList.add("visible");
  physicsControl.classList.add("visible");
});

async function initUpdaterUi() {
  if (!checkUpdateBtn || !updateStatusEl) return;

  const bridge = window.xiaobai || window.bailongma;
  if (!bridge?.isElectron) {
    setUpdateStatus("下载手机新版", "muted");
    setUpdateButtonState({ disabled: false, label: "下载新版" });
    checkUpdateBtn.addEventListener("click", () => {
      window.open(MOBILE_UPDATE_PACKAGE_URL, "_blank", "noopener");
    });
    diagnosticsBtn?.addEventListener("click", () => {
      window.open("../download", "_blank", "noopener");
    });
    return;
  }

  setUpdateStatus("准备检查版本", "idle");

  try {
    const version = await bridge.getVersion?.();
    if (version) setUpdateStatus(`当前版本 ${version}`, "idle");
  } catch {}

  removeUpdaterStatusListener = bridge.onUpdaterStatus?.((payload = {}) => {
    const stage = payload.stage || "idle";
    const version = payload.version ? ` ${payload.version}` : "";
    const percent = typeof payload.percent === "number" ? ` (${Math.round(payload.percent)}%)` : "";

    switch (stage) {
      case "checking":
        setUpdateCardHidden(false);
        setUpdateStatus("正在检查更新…", "checking");
        setUpdateButtonState({ disabled: true, label: "检查中" });
        break;
      case "available":
        setUpdateCardHidden(false);
        setUpdateStatus(`发现新版本${version}，开始下载`, "available");
        setUpdateButtonState({ disabled: true, label: "下载中" });
        break;
      case "downloading":
        setUpdateCardHidden(false);
        setUpdateStatus(`正在下载更新${percent}`, "downloading");
        setUpdateButtonState({ disabled: true, label: "下载中" });
        break;
      case "downloaded":
        setUpdateCardHidden(false);
        setUpdateStatus(`新版本${version} 已下载，关闭重开即可安装`, "ready");
        setUpdateButtonState({ disabled: false, label: "重新检查" });
        break;
      case "error":
        setUpdateCardHidden(false);
        setUpdateStatus(`更新失败：${payload.message || "请稍后重试"}`, "error");
        setUpdateButtonState({ disabled: false, label: "重试更新" });
        break;
      case "disabled":
        setUpdateCardHidden(false);
        setUpdateStatus(`更新通道未启用：${payload.updateFeedUrl || "未配置更新源"}`, "muted");
        setUpdateButtonState({ disabled: false, label: "查看诊断" });
        break;
      case "dev":
        setUpdateCardHidden(false);
        setUpdateStatus(payload.message || "开发模式下不检查更新", "muted");
        setUpdateButtonState({ disabled: true, label: "开发模式" });
        break;
      default:
        setUpdateStatus(payload.message || `当前版本 ${payload.currentVersion || ""}`.trim(), "idle");
        setUpdateButtonState({ disabled: false, label: "检查更新" });
        if (/latest|已是|最新/i.test(payload.message || "")) {
          setUpdateCardHidden(true);
        }
        break;
    }
  }) || null;

  checkUpdateBtn.addEventListener("click", async () => {
    setUpdateCardHidden(false);
    setUpdateStatus("正在检查更新…", "checking");
    setUpdateButtonState({ disabled: true, label: "检查中" });

    try {
      const result = await bridge.checkForUpdates?.();
      if (!result?.ok && result?.message) {
        const muted = result.reason === "disabled" || result.reason === "dev";
        setUpdateStatus(muted ? result.message : `更新失败：${result.message}`, muted ? "muted" : "error");
        setUpdateButtonState({ disabled: false, label: muted ? "查看诊断" : "重试更新" });
      }
    } catch (error) {
      setUpdateStatus(`更新失败：${error?.message || "请稍后重试"}`, "error");
      setUpdateButtonState({ disabled: false, label: "重试更新" });
    }
  });

  diagnosticsBtn?.addEventListener("click", async () => {
    setUpdateCardHidden(false);
    setUpdateStatus("正在读取诊断…", "checking");
    try {
      const diag = await bridge.getDiagnostics?.();
      setUpdateStatus(formatDiagnostics(diag || {}), diag?.lastError ? "error" : "idle");
    } catch (error) {
      setUpdateStatus(`诊断失败：${error?.message || "请稍后重试"}`, "error");
    }
  });

  updateCloseBtn?.addEventListener("click", () => {
    setUpdateCardHidden(true);
  });
}

function readCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function readPhysicsSettings() {
  try {
    const raw = localStorage.getItem(PHYSICS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.gravity === "number") physicsSettings.gravity = parsed.gravity;
      if (typeof parsed.repulsion === "number") physicsSettings.repulsion = parsed.repulsion;
      if (typeof parsed.nodeSize === "number") physicsSettings.nodeSize = parsed.nodeSize;
    }
  } catch {}
}

function savePhysicsSettings() {
  try {
    localStorage.setItem(PHYSICS_STORAGE_KEY, JSON.stringify(physicsSettings));
  } catch {}
}

function updatePhysicsReadout() {
  gravitySlider.value = String(physicsSettings.gravity);
  repulsionSlider.value = String(physicsSettings.repulsion);
  nodeSizeSlider.value = String(physicsSettings.nodeSize);
  gravityValue.textContent = `${physicsSettings.gravity.toFixed(2)}x`;
  repulsionValue.textContent = `${physicsSettings.repulsion.toFixed(2)}x`;
  nodeSizeValue.textContent = `${physicsSettings.nodeSize.toFixed(2)}x`;
}

let themeColors = {};
function refreshThemeColors() {
  themeColors = {
    cool: readCSSVar("--cool"),
    warm: readCSSVar("--warm"),
    nodeLow: readCSSVar("--node-low"),
    nodeHigh: readCSSVar("--node-high"),
    dim: readCSSVar("--dim"),
    ink2: readCSSVar("--ink2"),
    linkStroke: readCSSVar("--link-stroke"),
    bg0: readCSSVar("--bg0"),
  };
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
  document.querySelectorAll(".theme-dot").forEach(el => {
    el.classList.toggle("active", el.dataset.t === theme);
  });
  setTimeout(() => {
    refreshThemeColors();
    renderLegend();
    if (MEMORY_GRAPH_ENABLED && nodeSel && !nodeSel.empty()) {
      refreshNodeVisuals();
      linkSel.attr("stroke", themeColors.linkStroke);
    }
  }, 20);
}

(function initTheme() {
  let saved = "midnight";
  try { saved = localStorage.getItem(THEME_KEY) || "midnight"; } catch {}
  applyTheme(saved);
})();

themeSwitcher.querySelectorAll(".theme-dot").forEach(el => {
  el.addEventListener("click", () => applyTheme(el.dataset.t));
});

function applyBackgroundMode(mode = "galaxy", imageData = "") {
  const useCustom = mode === "custom" && imageData;
  document.body.classList.toggle("has-custom-background", !!useCustom);
  document.documentElement.style.setProperty("--custom-background-image", useCustom ? `url("${imageData}")` : "none");
  const modeSelect = document.getElementById("settings-background-mode");
  if (modeSelect) modeSelect.value = useCustom ? "custom" : "galaxy";
}

function loadBackgroundSettings() {
  let mode = "galaxy";
  let imageData = "";
  try {
    mode = localStorage.getItem(BACKGROUND_MODE_KEY) || "galaxy";
    imageData = localStorage.getItem(CUSTOM_BACKGROUND_KEY) || "";
  } catch {}
  applyBackgroundMode(mode, imageData);
}

function resizeBackgroundImage(file, maxWidth = 1920, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("读取照片失败"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("照片格式无法识别"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / Math.max(1, img.width));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initBackgroundSettings() {
  loadBackgroundSettings();
  const modeSelect = document.getElementById("settings-background-mode");
  const fileInput = document.getElementById("settings-background-file");
  const resetBtn = document.getElementById("settings-reset-background");
  const feedback = document.getElementById("settings-background-feedback");
  const showBackgroundFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = "settings-feedback" + (isError ? " error" : "");
    setTimeout(() => {
      if (feedback.textContent === message) feedback.textContent = "";
    }, 3200);
  };

  modeSelect?.addEventListener("change", () => {
    const imageData = localStorage.getItem(CUSTOM_BACKGROUND_KEY) || "";
    const mode = modeSelect.value;
    if (mode === "custom" && !imageData) {
      modeSelect.value = "galaxy";
      showBackgroundFeedback("请先选择一张照片", true);
      return;
    }
    localStorage.setItem(BACKGROUND_MODE_KEY, mode);
    applyBackgroundMode(mode, imageData);
  });

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showBackgroundFeedback("请选择图片文件", true);
      return;
    }
    try {
      const imageData = await resizeBackgroundImage(file);
      localStorage.setItem(CUSTOM_BACKGROUND_KEY, imageData);
      localStorage.setItem(BACKGROUND_MODE_KEY, "custom");
      applyBackgroundMode("custom", imageData);
      showBackgroundFeedback("背景照片已应用");
    } catch (err) {
      showBackgroundFeedback(err?.message || "背景照片应用失败", true);
    } finally {
      fileInput.value = "";
    }
  });

  resetBtn?.addEventListener("click", () => {
    localStorage.removeItem(CUSTOM_BACKGROUND_KEY);
    localStorage.setItem(BACKGROUND_MODE_KEY, "galaxy");
    applyBackgroundMode("galaxy", "");
    showBackgroundFeedback("已恢复银河系宇宙背景");
  });
}

initBackgroundSettings();

physicsToggle.addEventListener("click", () => {
  const nextOpen = !physicsControl.classList.contains("open");
  physicsControl.classList.toggle("open", nextOpen);
  physicsToggle.setAttribute("aria-expanded", String(nextOpen));
});

gravitySlider.addEventListener("input", () => {
  physicsSettings.gravity = Number(gravitySlider.value);
  applyPhysicsSettings();
});

repulsionSlider.addEventListener("input", () => {
  physicsSettings.repulsion = Number(repulsionSlider.value);
  applyPhysicsSettings();
});

nodeSizeSlider.addEventListener("input", () => {
  physicsSettings.nodeSize = Number(nodeSizeSlider.value);
  applyPhysicsSettings();
});

let W = window.innerWidth;
let H = window.innerHeight;

const svg = d3.select("#graph").attr("width", W).attr("height", H);
const tip = d3.select("#tip");

const defs = svg.append("defs");
defs.html(`
  <filter id="neb-glow" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="3.2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
`);

const world = svg.append("g");
const gLink = world.append("g").attr("stroke-linecap", "round");
const gNode = world.append("g");

const zoom = d3.zoom()
  .scaleExtent([0.1, 5])
  .filter(event => event.type === "wheel")
  .on("zoom", event => world.attr("transform", event.transform));

svg.call(zoom);
svg.on("wheel.zoom", null);
svg.on("dblclick.zoom", null);

svg.node().addEventListener("wheel", event => {
  event.preventDefault();
  const current = d3.zoomTransform(svg.node());
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  const nextScale = Math.max(0.1, Math.min(5, current.k * factor));
  const k = nextScale / current.k;
  const px = W / 2, py = H / 2;
  const nextX = px - (px - current.x) * k;
  const nextY = py - (py - current.y) * k;
  svg.call(zoom.transform, d3.zoomIdentity.translate(nextX, nextY).scale(nextScale));
}, { passive: false });

function resetZoom() {
  svg.transition().duration(420).call(
    zoom.transform,
    d3.zoomIdentity
  );
}

const glowSet = new Map();
const usePulseSet = new Map();
let linkData = [];
let nodeData = [];
let linkSel = gLink.selectAll("line");
let nodeSel = gNode.selectAll("circle");

const nodeCountEl = document.getElementById("node-count");
const linkCountEl = document.getElementById("link-count");
const connStateEl = document.getElementById("conn-state");

function updateStats() {
  nodeCountEl.textContent = String(nodeData.length);
  linkCountEl.textContent = String(linkData.length);
}

function setConnectionState(text, live = true) {
  connStateEl.innerHTML = live
    ? `<span class="live-dot"></span>${text}`
    : text;
  connStateEl.classList.toggle("live", live);
}

function isGlowing(nid) {
  const expiry = glowSet.get(nid);
  if (!expiry) return false;
  if (Date.now() > expiry) { glowSet.delete(nid); return false; }
  return true;
}

function highlightNodes(nids, duration = 2400) {
  if (!MEMORY_GRAPH_ENABLED || !sim) return;
  if (!nids || !nids.length) return;
  const now = Date.now();
  const expiry = now + duration;
  nids.forEach(nid => {
    const key = String(nid);
    glowSet.set(key, expiry);
    usePulseSet.set(key, { start: now, end: expiry });
  });
  refreshNodeVisuals();
  sim.alpha(Math.max(sim.alpha(), 2)).restart();
  setTimeout(() => {
    nids.forEach(nid => {
      const key = String(nid);
      glowSet.delete(key);
      usePulseSet.delete(key);
    });
    refreshNodeVisuals();
  }, duration + 80);
}

function nodeUseProgress(nid) {
  const key = String(nid);
  const pulse = usePulseSet.get(key);
  if (!pulse) return 0;
  const now = Date.now();
  if (now >= pulse.end) {
    usePulseSet.delete(key);
    return 0;
  }
  const total = Math.max(1, pulse.end - pulse.start);
  return 1 - ((now - pulse.start) / total);
}

function nodeStrength(d) {
  if (typeof d._strength !== "number") {
    const deg = Math.min(1, (d._deg || 0) / 12);
    d._strength = 0.35 + deg * 0.55;
  }
  return d._strength;
}

function nodeColor(d) {
  if (d._core) return themeColors.warm || "#d39872";
  const age = (Date.now() - (d._ts || Date.now())) / 18000;
  const fade = Math.max(0.25, 1 - age);
  const t = 0.18 + nodeStrength(d) * 0.5 * fade;
  const interp = d3.interpolateRgb(themeColors.nodeLow || "#3a556e", themeColors.nodeHigh || "#cfe3f5");
  let color = interp(Math.min(1, t));
  const base = d3.color(color);
  if (base) color = base.darker(0.55) + "";
  const useBoost = nodeUseProgress(d._nid);
  if (isGlowing(d._nid) || useBoost > 0) {
    const c = d3.color(color);
    if (c) return c.brighter(2 + useBoost * 2) + "";
  }
  return color;
}

function nodeRadius(d) {
  const base = d._core ? 9 : 3.4 + Math.min((d._deg || 0) * 0.9, 5.4);
  const childScale = 1 + Math.min(1.5, (d._childCount || 0) * 0.18);
  const useBoost = nodeUseProgress(d._nid);
  const glowScale = isGlowing(d._nid) ? 1.08 : 1;
  const pulseScale = 1 + (Math.sin((1 - useBoost) * Math.PI * 3) * 0.04 + useBoost * 0.12);
  const scaledBase = base * physicsSettings.nodeSize;
  return Math.min(scaledBase * 2.5, scaledBase * childScale * glowScale * Math.max(1, pulseScale));
}

const sim = MEMORY_GRAPH_ENABLED
  ? d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d._nid))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(W / 2, H / 2 - 10))
    .force("x", d3.forceX(W / 2))
    .force("y", d3.forceY(H / 2 - 10))
    .force("radial", d3.forceRadial(180, W / 2, H / 2 - 10))
    .force("collision", d3.forceCollide())
    .alphaDecay(0.028)
    .velocityDecay(0.3)
    .on("tick", tick)
  : null;

function linkDistance(link) {
  const countFactor = Math.min(34, Math.sqrt(Math.max(1, nodeData.length)) * 4.2);
  if (link._kind === "visual_parent") return 82 + countFactor * 0.45;
  if (link._kind === "visual_random") return 108 + countFactor;
  return 76 + countFactor * 0.55;
}

function linkStrength(link) {
  if (link._kind === "visual_parent") return 0.2;
  if (link._kind === "visual_random") return 0.035;
  return 0.16;
}

function chargeStrength(node) {
  const countBoost = Math.min(76, Math.sqrt(Math.max(1, nodeData.length)) * 3.5);
  const baseCharge = -92 - countBoost * 0.4 - (node._deg || 0) * 2.4 - (node._childCount || 0) * 1.2;
  return baseCharge * physicsSettings.repulsion;
}

function radialStrength() {
  const baseSpread = nodeData.length > 36 ? 0.1 : 0.1;
  return baseSpread * physicsSettings.gravity;
}

function centerPullStrength() {
  const basePull = nodeData.length > 36 ? 0.04 : 0.055;
  return basePull * physicsSettings.gravity;
}

function collisionRadius(node) {
  const countPadding = nodeData.length > 36 ? 6 : 4;
  return nodeRadius(node) + countPadding;
}

function updateSimulationForces() {
  if (!MEMORY_GRAPH_ENABLED || !sim) return;
  sim.force("link")
    .distance(linkDistance)
    .strength(linkStrength);

  sim.force("charge")
    .strength(chargeStrength);

  sim.force("x")
    .x(W / 2)
    .strength(centerPullStrength());

  sim.force("y")
    .y(H / 2 - 10)
    .strength(centerPullStrength());

  sim.force("radial")
    .radius(Math.min(Math.max(24, Math.sqrt(Math.max(1, nodeData.length)) * 6), 64))
    .x(W / 2)
    .y(H / 2 - 10)
    .strength(radialStrength());

  sim.force("collision")
    .radius(collisionRadius)
    .strength(0.82)
    .iterations(nodeData.length > 40 ? 2 : 1);
}

function applyPhysicsSettings(restartAlpha = 2) {
  updatePhysicsReadout();
  if (!MEMORY_GRAPH_ENABLED || !sim) {
    savePhysicsSettings();
    return;
  }
  updateSimulationForces();
  refreshNodeVisuals();
  sim.alpha(Math.max(sim.alpha(), restartAlpha)).restart();
  savePhysicsSettings();
}

function refreshNodeVisuals() {
  if (!MEMORY_GRAPH_ENABLED) return;
  if (!nodeSel || nodeSel.empty()) return;
  nodeSel
    .attr("r", nodeRadius)
    .attr("fill", nodeColor)
    .attr("filter", d => (d._core || isGlowing(d._nid) || nodeUseProgress(d._nid) > 0) ? "url(#neb-glow)" : null)
    .style("animation", d => nodeUseProgress(d._nid) > 0 ? "neb-node-use 10s ease-out" : null);
}

function dampTangentialMotion() {
  if (!MEMORY_GRAPH_ENABLED || !sim) return;
  const cx = W / 2;
  const cy = H / 2 - 10;
  const twitching = sim.alpha() > 0.45;

  nodeData.forEach(node => {
    if (!node || node.fx != null || node.fy != null) return;

    const dx = (node.x ?? cx) - cx;
    const dy = (node.y ?? cy) - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) return;

    const rx = dx / dist;
    const ry = dy / dist;
    const tx = -ry;
    const ty = rx;
    const vx = node.vx || 0;
    const vy = node.vy || 0;
    const radialVelocity = vx * rx + vy * ry;
    const tangentialVelocity = vx * tx + vy * ty;
    const tangentialDamping = twitching ? 0.14 : 0.24;

    node.vx = radialVelocity * rx + tangentialVelocity * tangentialDamping * tx;
    node.vy = radialVelocity * ry + tangentialVelocity * tangentialDamping * ty;
  });
}

function naturalTwitch() {
  if (!MEMORY_GRAPH_ENABLED || !sim) return;
  if (nodeData.length < 2) {
    sim.alpha(1).restart();
    return;
  }

  const nodeById = new Map(nodeData.map(node => [String(node._nid), node]));
  const anchorMap = new Map();
  linkData.forEach(link => {
    if (link._kind !== "visual_parent" && link._kind !== "visual_random") return;
    const sourceId = typeof link.source === "object" ? String(link.source._nid) : String(link.source);
    const targetId = typeof link.target === "object" ? String(link.target._nid) : String(link.target);
    if (!anchorMap.has(sourceId) && nodeById.has(targetId)) {
      anchorMap.set(sourceId, nodeById.get(targetId));
    }
  });

  const twitchCount = Math.max(6, Math.floor(nodeData.length * 0.3));
  const candidates = shuffleArray(nodeData.filter(node => !node._core)).slice(0, twitchCount);

  candidates.forEach(node => {
    const anchor = anchorMap.get(String(node._nid)) || nodeData[deterministicIndex(node._nid, nodeData.length)];
    if (!anchor) return;

    const anchorX = anchor.x ?? (W / 2);
    const anchorY = anchor.y ?? (H / 2 - 10);
    const angle = Math.random() * Math.PI * 2;
    const offset = 36 + Math.random() * 52;
    const nextX = anchorX + Math.cos(angle) * offset;
    const nextY = anchorY + Math.sin(angle) * offset;
    const currentX = node.x ?? nextX;
    const currentY = node.y ?? nextY;

    node.x = currentX * 0.7 + nextX * 0.3;
    node.y = currentY * 0.7 + nextY * 0.3;
    node.vx = (node.vx || 0) + (nextX - currentX) * 0.14;
    node.vy = (node.vy || 0) + (nextY - currentY) * 0.14;
  });

  sim.alpha(0.85).restart();
}

function tick() {
  if (!MEMORY_GRAPH_ENABLED) return;
  dampTangentialMotion();

  linkSel
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  nodeSel
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
}

function computeDegrees() {
  const nodeById = new Map(nodeData.map(n => [n._nid, n]));
  nodeData.forEach(n => {
    n._deg = 0;
    n._childCount = 0;
  });
  linkData.forEach(l => {
    const s = typeof l.source === "object" ? l.source : nodeById.get(String(l.source));
    const t = typeof l.target === "object" ? l.target : nodeById.get(String(l.target));
    if (s) s._deg = (s._deg || 0) + 1;
    if (t) t._deg = (t._deg || 0) + 1;
  });

  nodeData.forEach(node => {
    const childTargets = semanticChildTargets(node);
    if (childTargets.size) {
      node._childCount = childTargets.size;
      return;
    }

    const selfId = String(node._nid || "");
    node._childCount = nodeData.reduce((count, candidate) => (
      candidate.parent_id != null && String(candidate.parent_id) === selfId ? count + 1 : count
    ), 0);
  });
}

function showTip(event, d) {
  const label = d.title || (d.content || "").slice(0, 120) || d._nid;
  const type = d._core ? "self" : (d.event_type || "memory");
  tip
    .style("display", "block")
    .style("left", `${event.clientX + 14}px`)
    .style("top", `${event.clientY + 12}px`)
    .html(`<span class="tip-type">${type}</span><div>${label}</div>`);
}

function parseEntities(raw) {
  try {
    const p = typeof raw === "string" ? JSON.parse(raw || "[]") : (raw || []);
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}

function parseLinks(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw || "[]") : (raw || []);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function semanticChildTargets(node) {
  const targets = new Set();
  parseLinks(node.links).forEach(link => {
    if (!link || typeof link !== "object") return;
    const relation = String(link.relation || "").toLowerCase();
    const targetId = String(link.target_id || link.targetId || "").trim();
    if (relation === "parent_of" && targetId) targets.add(targetId);
  });
  return targets;
}

function markCore() {
  nodeData.forEach(n => { n._core = false; });
  const core = nodeData.find(n => parseEntities(n.entities).includes("agent:jarvis"))
    || nodeData[0];
  if (core) core._core = true;
}

function renderLegend() {
  const el = document.getElementById("legend");
  if (!el) return;
  const total = nodeData.length;
  const active = nodeData.filter(n => (Date.now() - (n._ts || 0)) < 15000).length;
  const known = Math.max(0, total - active - 1);
  const decayed = nodeData.filter(n => (Date.now() - (n._ts || 0)) > 60000).length;

  const items = [
    { name: "限制", count: 1, color: themeColors.warm },
    { name: "记忆", count: active, color: themeColors.nodeHigh },
    { name: "知识", count: known, color: themeColors.cool },
    { name: "衰减", count: decayed, color: themeColors.dim },
  ];

  el.innerHTML = items.map(i =>
    `<div class="legend-item">
      <span class="legend-dot" style="background:${i.color}"></span>
      <span class="legend-name">${i.name}</span>
      <span class="legend-count">${i.count}</span>
    </div>`
  ).join("");
}

function renderGraph(restartAlpha = 2) {
  if (!MEMORY_GRAPH_ENABLED || !sim) {
    updateStats();
    renderLegend();
    return;
  }
  computeDegrees();
  markCore();
  updateStats();
  renderLegend();

  linkSel = linkSel.data(linkData, d => d._lid);
  linkSel.exit().remove();
  linkSel = linkSel.enter().append("line")
    .attr("stroke", themeColors.linkStroke || "rgba(143,182,216,0.18)")
    .attr("stroke-width", 0.6)
    .merge(linkSel);

  nodeSel = nodeSel.data(nodeData, d => d._nid);
  nodeSel.exit().transition().duration(280).attr("r", 0).remove();

  const enter = nodeSel.enter().append("circle")
    .attr("r", 0)
    .attr("fill", nodeColor)
    .style("cursor", "pointer")
    .call(d3.drag()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(2).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x; d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null; d.fy = null;
      }))
    .on("mouseover", showTip)
    .on("mousemove", event => {
      tip.style("left", `${event.clientX + 14}px`)
         .style("top", `${event.clientY + 12}px`);
    })
    .on("mouseout", () => tip.style("display", "none"))
    .on("click", (event, d) => {
      d._ts = Date.now();
      d._strength = Math.min(1, (d._strength || 0.5) + 0.25);
      highlightNodes([d._nid], 900);
    });

  enter.transition().duration(360).attr("r", nodeRadius);
  nodeSel = enter.merge(nodeSel);

  sim.nodes(nodeData);
  sim.force("link").links(linkData);
  updateSimulationForces();
  sim.alpha(0.5).restart();
  refreshNodeVisuals();
}

function deterministicIndex(seed, mod) {
  let hash = 2166136261;
  const text = String(seed);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % mod;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createVisualOrder(nodes) {
  const coreNode = nodes.find(n => n._core || parseEntities(n.entities).includes("agent:jarvis")) || null;
  const rest = shuffleArray(nodes.filter(n => !coreNode || n._nid !== coreNode._nid));
  return coreNode ? [coreNode, ...rest] : rest;
}

function chooseVisualParent(child, candidates, childCounts) {
  if (!candidates.length) return null;
  const weighted = [];
  candidates.forEach(candidate => {
    const currentChildren = childCounts.get(candidate._nid) || 0;
    const maxChildren = maxVisualChildren(candidate);
    const recencyBias = Math.max(0, 400000 - Math.abs((child._ts || 0) - (candidate._ts || 0))) / 100000;
    const coreBias = candidate._core ? 1.4 : 0;
    const strengthBias = (candidate._strength || 0.4) * 0.8;
    const remainingCapacity = Math.max(0, maxChildren - currentChildren);
    const capacityBias = currentChildren === 0 ? 1.2 : 0.35 + remainingCapacity * 0.25;
    const entryCount = 1 + Math.max(0, Math.round((recencyBias + coreBias + strengthBias + capacityBias) * 2));
    for (let w = 0; w < entryCount; w++) {
      weighted.push(candidate);
    }
  });
  if (!weighted.length) return candidates[Math.floor(Math.random() * candidates.length)] || null;
  return weighted[Math.floor(Math.random() * weighted.length)] || null;
}

function getCurrentVisualChildCounts(nodes) {
  const counts = new Map(nodes.map(n => [n._nid, 0]));
  linkData.forEach(link => {
    if (link._kind !== "visual_parent") return;
    const parentId = typeof link.target === "object" ? String(link.target._nid) : String(link.target);
    counts.set(parentId, (counts.get(parentId) || 0) + 1);
  });
  return counts;
}

function maxVisualChildren(node) {
  if (!node) return 2;
  if (node._core) return 4;
  const degree = node._deg || 0;
  const strength = node._strength || 0;
  return (degree >= 4 || strength >= 0.72) ? 4 : 2;
}

function addSupplementalVisualLinks(linkSet, childCounts) {
  const ordered = createVisualOrder(nodeData);
  const extraLinks = Math.min(18, Math.max(2, Math.floor(nodeData.length / 5)));
  let added = 0;

  for (let i = 1; i < ordered.length && added < extraLinks; i++) {
    const source = ordered[i];
    const candidates = shuffleArray(
      ordered.slice(0, i).filter(node => {
        if (node._nid === source._nid) return false;
        return (childCounts.get(node._nid) || 0) < maxVisualChildren(node);
      })
    );

    const target = candidates[0];
    if (!target) continue;

    const lid = `visual-extra:${source._nid}=>${target._nid}`;
    const rev = `visual-extra:${target._nid}=>${source._nid}`;
    const base = `visual:${source._nid}=>${target._nid}`;
    const baseRev = `visual:${target._nid}=>${source._nid}`;
    if (linkSet.has(lid) || linkSet.has(rev) || linkSet.has(base) || linkSet.has(baseRev)) continue;

    linkSet.add(lid);
    linkData.push({ source: source._nid, target: target._nid, _lid: lid, _kind: "visual_random" });
    childCounts.set(target._nid, (childCounts.get(target._nid) || 0) + 1);
    added += 1;
  }
}

function addRandomVisualLinks(linkSet) {
  if (nodeData.length < 2) return;

  const ordered = createVisualOrder(nodeData);
  const childCounts = new Map(ordered.map(n => [n._nid, 0]));

  for (let i = 1; i < ordered.length; i++) {
    const child = ordered[i];
    const candidates = ordered
      .slice(0, i)
      .filter(node => (childCounts.get(node._nid) || 0) < maxVisualChildren(node));

    const parent = chooseVisualParent(child, candidates, childCounts);
    if (!parent || parent._nid === child._nid) continue;

    const lid = `visual:${child._nid}=>${parent._nid}`;
    const rev = `visual:${parent._nid}=>${child._nid}`;
    if (linkSet.has(lid) || linkSet.has(rev)) continue;

    linkSet.add(lid);
    linkData.push({ source: child._nid, target: parent._nid, _lid: lid, _kind: "visual_parent" });
    childCounts.set(parent._nid, (childCounts.get(parent._nid) || 0) + 1);
  }

  addSupplementalVisualLinks(linkSet, childCounts);
}

function findAnchorNode(memory, nodeMap) {
  const nodes = Array.from(nodeMap.values());
  const childCounts = getCurrentVisualChildCounts(nodes);
  const candidates = createVisualOrder(nodes)
    .filter(node => (childCounts.get(node._nid) || 0) < maxVisualChildren(node));
  return chooseVisualParent(memory, candidates, childCounts)
    || nodeData.find(n => n._core)
    || nodeData[0]
    || null;
}

async function loadMemories() {
  if (!MEMORY_GRAPH_ENABLED) return;
  try {
    const rows = await fetch(`${API}/memories?limit=120`).then(r => r.json());
    if (!Array.isArray(rows)) return;

    const prevPositions = new Map(nodeData.map(n => [n._nid, {
      x: n.x, y: n.y, vx: n.vx, vy: n.vy, fx: n.fx, fy: n.fy,
    }]));

    nodeData = rows.map(row => {
      const nid = row.mem_id || String(row.id);
      const prev = prevPositions.get(nid);
      return {
        ...row,
        _nid: nid,
        _ts: prev ? Date.now() : Date.now() - Math.random() * 8000,
        x: prev ? prev.x : W / 2 + (Math.random() - 0.5) * 180,
        y: prev ? prev.y : H / 2 + (Math.random() - 0.5) * 180,
        vx: prev ? prev.vx : 0,
        vy: prev ? prev.vy : 0,
        fx: prev ? prev.fx : null,
        fy: prev ? prev.fy : null,
      };
    });

    const linkSet = new Set();
    linkData = [];
    addRandomVisualLinks(linkSet);

    renderGraph(1.1);
  } catch (error) {
    console.warn("[graph] load failed:", error.message);
    setConnectionState("Offline", false);
  }
}

function addNewNodes(memories) {
  if (!MEMORY_GRAPH_ENABLED) return;
  const nodeMap = new Map(nodeData.map(n => [n._nid, n]));
  const newNids = [];
  memories.forEach(memory => {
    const nid = memory.id || memory.mem_id;
    if (!nid || nodeMap.has(String(nid))) return;
    const anchor = findAnchorNode(memory, nodeMap);
    const anchorX = anchor?.x ?? W / 2;
    const anchorY = anchor?.y ?? (H / 2 - 10);
    const node = {
      ...memory,
      _nid: String(nid),
      mem_id: String(nid),
      event_type: memory.event_type || memory.type || "fact",
      _ts: Date.now(),
      _strength: 0.85,
      x: anchorX + (Math.random() - 0.5) * 72,
      y: anchorY + (Math.random() - 0.5) * 72,
      vx: 0, vy: 0,
    };
    nodeData.push(node);
    nodeMap.set(node._nid, node);
    newNids.push(node._nid);
  });
  if (!newNids.length) return;

  const linkSet = new Set();
  linkData = [];
  addRandomVisualLinks(linkSet);
  renderGraph(2);
  highlightNodes(newNids, 10000);
}

if (MEMORY_GRAPH_ENABLED) {
  setInterval(() => naturalTwitch(), 6000);
  setInterval(() => { nodeData.forEach(n => { if (n._strength) n._strength *= 0.97; }); }, 2500);
}

function parseUserMessageInput(raw) {
  const text = String(raw || "");
  const match = text.match(/^\[([^\]]+)\]\s+(\S+)\s+\[([^\]]+)\]\s+([\s\S]*)$/);
  if (!match) return { content: text.trim(), time: null };
  return { fromId: match[1], timestamp: match[2], channel: match[3], content: match[4].trim(), time: formatMsgTime(match[2]) };
}

function formatMsgTime(stamp) {
  if (!stamp) return null;
  const m = String(stamp).match(/T(\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}:${m[3]}`;
  const m2 = String(stamp).match(/(\d{2}):(\d{2}):(\d{2})/);
  if (m2) return `${m2[1]}:${m2[2]}:${m2[3]}`;
  return null;
}

const L1 = new ThoughtStream("si-l1", "cool", {
  readCSSVar,
  thinkingLabel: "正在思考中",
  thinkingDoneLabel: "思考完成",
  toolDetailLength: 140,
});
const L2 = new ThoughtStream("si-l2", "warm", {
  readCSSVar,
  thinkingLabel: "思考中",
  thinkingDoneLabel: "思考完成",
  toolDetailLength: 220,
});

// L1 = 用户消息触发的处理流；L2 = TICK 触发的处理流。
// 后端 emit 的 stream_*/tool_call 事件不带路径标记，
// 通过最近一次 message_received / tick 事件来决定路由到哪块面板。
let currentPath = "l2";
function currentStream() { return currentPath === "l1" ? L1 : L2; }
let refreshAgentDashboard = null;

function isBusyErrorMessage(message = "") {
  return /(429|rate limit|too many requests|busy|overload|temporarily unavailable|server busy|resource exhausted)/i.test(String(message || ""));
}

function formatRetryDelay(ms) {
  if (!ms || ms < 1000) return `${ms || 0}ms`;
  return `${(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1)}s`;
}

let tokenAccum = 0;
let tokenWindow = Date.now();
const tokRateEl = document.getElementById("tok-rate");

function bumpTokens(text) {
  tokenAccum += (text || "").length / 3.4;
  const now = Date.now();
  if (now - tokenWindow > 700) {
    const rate = tokenAccum / ((now - tokenWindow) / 1000);
    tokRateEl.textContent = rate.toFixed(1);
    tokenAccum = 0;
    tokenWindow = now;
    setTimeout(() => { if (tokRateEl.textContent !== "—" && tokenAccum === 0) tokRateEl.textContent = "—"; }, 4000);
  }
}

function connectSSE() {
  setConnectionState("connecting", true);
  const es = new EventSource(`${API}/events`);

  es.onopen = () => setConnectionState("已连接", true);

  es.onmessage = event => {
    try { handle(JSON.parse(event.data)); } catch (_) {}
  };

  es.onerror = () => {
    setConnectionState("reconnect", false);
    es.close();
    setTimeout(connectSSE, 3000);
  };
}

function extractNids(memList) {
  return (memList || [])
    .map(m => m.mem_id || (m.id != null ? String(m.id) : null))
    .filter(Boolean);
}

function handle({ type, data = {} }) {
  switch (type) {
    case "message_received": {
      currentPath = "l1";
      const parsed = parseUserMessageInput(data.input);
      L1.newLine("收到用户消息", {
        content: parsed.content,
        time: parsed.time || undefined,
      });
      break;
    }
    case "tick":
      currentPath = "l2";
      L2.newLine("心跳 tick");
      break;
    case "stream_start":
      currentStream().startThinkingSession();
      break;
    case "stream_chunk":
      // 不再显示具体思考内容，仅用于驱动 token 速率指示
      currentStream().clearStatus();
      bumpTokens(data.text);
      break;
    case "stream_end":
      currentStream().stopThinking();
      break;
    case "tool_call":
      currentStream().tool(data.name, data.args, data.result, data.ok);
      break;
    case "agent_delegation":
      if (typeof refreshAgentDashboard === "function") refreshAgentDashboard({ quiet: true });
      break;
    case "response":
      // 一轮完成：停所有动画
      currentStream().end();
      break;
    case "llm_retry": {
      currentStream().startThinkingSession();
      const nextAttempt = Number(data.nextAttempt || 2);
      const delayText = formatRetryDelay(Number(data.delayMs || 0));
      currentStream().setStatus("LLM busy, retry " + nextAttempt + " in " + delayText, "busy");
      break;
    }
    case "message_requeued": {
      currentStream().startThinkingSession();
      const retryCount = Number(data.retryCount || 1);
      currentStream().setStatus("LLM busy, queued retry " + retryCount + "/3", "busy");
      break;
    }
    case "message_dropped":
      currentStream().startThinkingSession();
      currentStream().setStatus("LLM busy, retry limit reached", "failed");
      break;
    case "error":
      if (isBusyErrorMessage(data.error)) {
        currentStream().startThinkingSession();
        currentStream().setStatus("LLM busy, please retry shortly", "busy");
      }
      break;
    case "injector_result": {
      const nids = [...extractNids(data.matchedMemories), ...extractNids(data.recallMemories)];
      if (nids.length) highlightNodes(nids, 10000);
      break;
    }
    case "memories_written":
      if (Array.isArray(data.memories) && data.memories.length) {
        addNewNodes(data.memories);
      }
      break;
    case "message":
      if (data.from === "consciousness") {
        lastJarvisContent = data.content;
        addMsg("jarvis", data.content);
        updatePersonCardFromAssistantText(data.content);
        openChat(true);
      }
      break;
    case "message_in":
      if (data.from_id && data.from_id !== "ID:000001") {
        addMsg("external", data.content, { label: data.from_id, alert: false });
        openChat(true);
      }
      break;
    case "agent_name_updated":
      setAgentName(data.name);
      break;
    case "media_mode":
      window.dispatchEvent(new CustomEvent("bailongma:media", { detail: data }));
      break;
    case "hotspot_mode":
      setHotspotMode(!!data.active || data.action === "show" || data.action === "open", { source: "agent_event" });
      break;
    case "settings_mode":
      if (data.action === "open" || data.active) openSettingsPanel?.(data.tab || null);
      break;
    case "voice_replay_last":
      if (lastJarvisContent) playTTSReply(lastJarvisContent, { voiceTraceId: data.voiceTraceId || null });
      break;
    case "voice_stop_tts":
      stopCurrentTTS({ resumeVoice: true, clearText: true });
      break;
    case "doc_panel_mode":
      setDocPanelMode(!!data.active || data.action === "open", { topicId: data.topic || null, source: "agent_event" });
      break;
    case "person_card_mode":
      setPersonCardMode(!!data.active || data.action === "show" || data.action === "open" || data.action === "update", { source: "agent_event", card: data.card || null });
      break;
    case "social_status":
      window.dispatchEvent(new CustomEvent("bailongma:social_status", { detail: data }));
      break;
    case "audio_created":
      if (data.autoPlay && data.path) {
        const audioUrl = `${API}/${data.path}`;
        const audioEl = new Audio(audioUrl);
        audioEl.play().catch(() => {});
      }
      break;
    case "tts_reply":
      if (data.text) playTTSReply(data.text, { voiceTraceId: data.voiceTraceId || null });
      break;
    case "key_configured":
      chat.deleteLastUserMsg();
      if (data.service === 'tts' && data.ttsText) playTTSReply(data.ttsText, { voiceTraceId: data.voiceTraceId || null });
      break;
    case "startup_self_check_started":
      playJarvisStartupSound();
      setTimeout(() => playTTSReply("系统启动，正在进行自检"), 1500);
      break;
    default:
      break;
  }
}

// ── Jarvis 风格启动自检音效 ───────────────────────────────────────────────────
function playJarvisStartupSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;

    // Layer 1: 低频机械嗡鸣（锯齿波，模拟机器上电）
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();
    drone.type = "sawtooth";
    drone.frequency.setValueAtTime(50, t);
    drone.frequency.linearRampToValueAtTime(90, t + 0.5);
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 350;
    droneFilter.Q.value = 3;
    droneGain.gain.setValueAtTime(0, t);
    droneGain.gain.linearRampToValueAtTime(0.09, t + 0.06);
    droneGain.gain.linearRampToValueAtTime(0.06, t + 0.4);
    droneGain.gain.linearRampToValueAtTime(0, t + 0.65);
    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(ctx.destination);
    drone.start(t);
    drone.stop(t + 0.7);

    // Layer 2: 系统上线频率扫描（正弦波，从低到高）
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(280, t + 0.12);
    sweep.frequency.exponentialRampToValueAtTime(2800, t + 1.0);
    sweepGain.gain.setValueAtTime(0, t + 0.12);
    sweepGain.gain.linearRampToValueAtTime(0.13, t + 0.22);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 1.05);
    sweep.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweep.start(t + 0.12);
    sweep.stop(t + 1.1);

    // Layer 3: 三声确认哔哔（方波，模拟系统自检通过）
    [[880, 1.15], [1100, 1.28], [1320, 1.41]].forEach(([freq, bt]) => {
      const beep = ctx.createOscillator();
      const beepGain = ctx.createGain();
      const beepFilter = ctx.createBiquadFilter();
      beep.type = "square";
      beep.frequency.value = freq;
      beepFilter.type = "bandpass";
      beepFilter.frequency.value = freq;
      beepFilter.Q.value = 8;
      beepGain.gain.setValueAtTime(0.14, t + bt);
      beepGain.gain.exponentialRampToValueAtTime(0.001, t + bt + 0.075);
      beep.connect(beepFilter);
      beepFilter.connect(beepGain);
      beepGain.connect(ctx.destination);
      beep.start(t + bt);
      beep.stop(t + bt + 0.09);
    });

    setTimeout(() => ctx.close().catch(() => {}), 2500);
  } catch (_) {
    // 浏览器不支持 AudioContext 时静默忽略
  }
}

// ── TTS 语音回复播放 ──────────────────────────────────────────────────────────
let ttsAudioEl = null;
let ttsPlaybackSeq = 0;
let ttsCurrentText = '';          // 当前正在播放的完整文本（TTS 清理后的纯文本）
let ttsInterruptedRemaining = ''; // 被打断时剩余未播放的文本
let lastJarvisContent = '';       // 最近一条 jarvis 消息的原始内容（含 markdown）
let ttsInterruptedOriginalContent = ''; // 打断时保存的原始消息，用于误触发恢复
let ttsInterruptionApplied = false;     // 是否已将打断标记应用到聊天界面
let ttsInterruptionDbTimer = null;      // 延迟提交 DB 更新的计时器（误触发时取消）

function stopCurrentTTS({ resumeVoice = true, clearText = true } = {}) {
  ttsPlaybackSeq += 1;
  if (ttsAudioEl) {
    const oldAudio = ttsAudioEl;
    ttsAudioEl = null;
    try { oldAudio.pause(); } catch {}
    try {
      oldAudio.removeAttribute("src");
      oldAudio.load?.();
    } catch {}
  }
  if (clearText) ttsCurrentText = '';
  if (resumeVoice) window.bailongmaVoice?.resumeAfterMedia();
}

// 从音频播放进度估算已播放文本的字符数，找到合适的断句点
// 返回 { remaining: 未播放文本, spokenUpTo: 已播放到的字符位置 }
function calcRemainingText(text, currentTime, duration) {
  if (!text || !duration || duration <= 0) return { remaining: '', spokenUpTo: 0 };
  const progress = Math.min(1, currentTime / duration);
  const spokenChars = Math.floor(text.length * progress);
  const BOUNDARIES = /[。！？，.!?,\n]/g;
  let bestPos = spokenChars;
  let match;
  BOUNDARIES.lastIndex = Math.max(0, spokenChars - 10);
  while ((match = BOUNDARIES.exec(text)) !== null) {
    if (match.index >= spokenChars) {
      bestPos = match.index + 1;
      break;
    }
  }
  return { remaining: text.slice(bestPos).trim(), spokenUpTo: bestPos };
}

// 根据 TTS 纯文本中的说话比例，估算原始 markdown 中的截断位置
function findMarkdownCutPos(markdown, ttsFullLen, ttsSpokenUpTo) {
  if (!markdown || ttsFullLen <= 0) return 0;
  const ratio = ttsSpokenUpTo / ttsFullLen;
  const approxPos = Math.floor(markdown.length * ratio);
  const BOUNDARIES = /[。！？\n.!?]/g;
  let bestPos = approxPos;
  BOUNDARIES.lastIndex = Math.max(0, approxPos - 15);
  let match;
  while ((match = BOUNDARIES.exec(markdown)) !== null) {
    if (match.index >= approxPos) { bestPos = match.index + 1; break; }
  }
  return bestPos;
}

// 将打断标记应用到聊天界面，并延迟提交 DB 更新（3.5s 内误触发则撤销）
function applyTTSInterruption(spokenUpTo) {
  const originalContent = lastJarvisContent || ttsCurrentText;
  if (!originalContent) return;
  ttsInterruptedOriginalContent = originalContent;
  ttsInterruptionApplied = true;

  const cutPos = findMarkdownCutPos(originalContent, ttsCurrentText.length, spokenUpTo);
  const spokenMarkdown = originalContent.slice(0, cutPos).trimEnd();
  const displayText = spokenMarkdown ? spokenMarkdown + ' ✋' : '✋';
  const dbContent = spokenMarkdown || '✋';

  updateLastJarvisMsg(displayText);

  // 延迟写 DB：若随后判定为误触发（resumeTTSIfNoSpeech），计时器会被取消
  if (ttsInterruptionDbTimer) clearTimeout(ttsInterruptionDbTimer);
  ttsInterruptionDbTimer = setTimeout(() => {
    ttsInterruptionDbTimer = null;
    fetch(`${API}/tts/interrupted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spokenContent: dbContent }),
    }).catch(() => {});
  }, 4000);
}

// 供 voice-panel 打断检测调用：停止当前 TTS 播放，记录打断位置
window.stopTTS = () => {
  if (!ttsAudioEl) return;
  const audio = ttsAudioEl;
  const { remaining, spokenUpTo } = calcRemainingText(
    ttsCurrentText,
    audio.currentTime,
    audio.duration,
  );
  // duration 未加载时（NaN）spokenUpTo=0，remaining=''，fallback 到完整文本
  ttsInterruptedRemaining = remaining || ttsCurrentText;
  applyTTSInterruption(spokenUpTo);
  stopCurrentTTS({ resumeVoice: false, clearText: false });
};

// 供 voice-panel 在检测到冲击噪音时调用：降低 TTS 音量但不停止
window.duckTTS = () => {
  if (ttsAudioEl) ttsAudioEl.volume = 0.15;
};

// 供 voice-panel 在判定为噪音后调用：恢复原音量
window.unduckTTS = () => {
  if (ttsAudioEl) ttsAudioEl.volume = 1.0;
};

// 供 voice-panel 在"噪音误触发"时调用：从打断处继续播放，并恢复聊天记录
window.resumeTTSIfNoSpeech = () => {
  const text = ttsInterruptedRemaining;
  ttsInterruptedRemaining = '';
  if (!text) return;
  // 取消 DB 更新并还原聊天界面
  if (ttsInterruptionDbTimer) { clearTimeout(ttsInterruptionDbTimer); ttsInterruptionDbTimer = null; }
  if (ttsInterruptionApplied && ttsInterruptedOriginalContent) {
    updateLastJarvisMsg(ttsInterruptedOriginalContent);
  }
  ttsInterruptionApplied = false;
  ttsInterruptedOriginalContent = '';
  playTTSReply(text);
};

async function playTTSReply(text, { voiceTraceId = null } = {}) {
  const seq = ttsPlaybackSeq + 1;
  stopCurrentTTS({ resumeVoice: false, clearText: false });
  ttsPlaybackSeq = seq;
  ttsCurrentText = text;
  ttsInterruptedRemaining = '';
  ttsInterruptionApplied = false;
  ttsInterruptedOriginalContent = '';
  try {
    const traceParam = voiceTraceId ? `&voiceTraceId=${encodeURIComponent(voiceTraceId)}` : "";
    const url = `${API}/tts/stream?text=${encodeURIComponent(text)}${traceParam}`;
    ttsAudioEl = new Audio(url);
    ttsAudioEl.volume = 1.0; // 确保从满音量开始（避免上一次 duck 状态残留）
    ttsAudioEl.onplaying = () => {
      if (!voiceTraceId) return;
      fetch(`${API}/diagnostics/voice-latency-stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceTraceId, stage: "ttsAudioStartedAt", status: "speaking" }),
      }).catch(() => {});
    };
    // 停掉云端 ASR，但保持 mic 硬件开着以便打断检测
    window.bailongmaVoice?.suspendForTTS?.();
    ttsAudioEl.onended = () => {
      if (seq !== ttsPlaybackSeq) return;
      ttsAudioEl = null;
      ttsCurrentText = '';
      window.bailongmaVoice?.resumeAfterMedia();
    };
    ttsAudioEl.onerror = () => {
      if (seq !== ttsPlaybackSeq) return;
      ttsAudioEl = null;
      ttsCurrentText = '';
      window.bailongmaVoice?.resumeAfterMedia();
    };
    ttsAudioEl.play().catch(() => {
      if (seq !== ttsPlaybackSeq) return;
      window.bailongmaVoice?.resumeAfterMedia();
    });
  } catch {
    if (seq !== ttsPlaybackSeq) return;
    ttsCurrentText = '';
    window.bailongmaVoice?.resumeAfterMedia();
  }
}

resetViewBtn.addEventListener("click", resetZoom);

document.querySelectorAll(".panel, .console, .theme-switcher, .reset-view").forEach(el => {
  el.addEventListener("wheel", event => event.stopPropagation(), { passive: true });
});

physicsControl.addEventListener("wheel", event => event.stopPropagation(), { passive: true });

window.addEventListener("resize", () => {
  W = window.innerWidth;
  H = window.innerHeight;
  svg.attr("width", W).attr("height", H);
  if (!MEMORY_GRAPH_ENABLED || !sim) return;
  sim.force("center", d3.forceCenter(W / 2, H / 2 - 10))
     .force("x", d3.forceX(W / 2))
     .force("y", d3.forceY(H / 2 - 10))
     .force("radial", d3.forceRadial(180, W / 2, H / 2 - 10));
  updateSimulationForces();
  sim.alpha(5).restart();
});

let _lastVisualRefresh = 0;
d3.timer(() => {
  if (!MEMORY_GRAPH_ENABLED) return true;
  if (glowSet.size === 0 && usePulseSet.size === 0) return;
  const now = Date.now();
  if (now - _lastVisualRefresh < 48) return;
  _lastVisualRefresh = now;
  refreshNodeVisuals();
});

setAgentName(DEFAULT_AGENT_NAME);
initUiZoom();
readPhysicsSettings();
updatePhysicsReadout();
refreshThemeColors();
chat = initChat({
  apiBase: API,
  maxHistory: MAX_CHAT_HISTORY,
  activationWarmupKey: ACTIVATION_WARMUP_KEY,
  getAgentName: () => agentName,
  defaultInputPlaceholder,
  onUserMessage: (text) => {
    if (document.body.classList.contains('hotspot-mode') && /关闭|退出|关掉|隐藏/.test(text)) {
      toggleHotspot();
      return;
    }
    if (document.body.classList.contains('person-card-mode') && /关闭|退出|关掉|隐藏/.test(text)) {
      setPersonCardMode(false, { source: 'chat_input' });
      return;
    }
    const personQuery = extractPersonCardQuery(text);
    if (personQuery) {
      showPersonCardByName(personQuery, { source: 'chat_input' });
    }
    if (/热点|热搜/.test(text) && !document.body.classList.contains('hotspot-mode')) {
      toggleHotspot();
    }
  },
});
chat.applyActivationWarmupLock();
if (MEMORY_GRAPH_ENABLED) {
  if (graphEl) graphEl.style.display = "block";
  loadMemories();
  setInterval(() => {
    loadMemories();
  }, 5 * 60 * 1000);
}
connectSSE();
loadAgentProfile();
initPersonCard();
initDocPanel().catch((err) => console.warn('[DocPanel] 初始化失败:', err));
chat.restoreChatHistory();
initUpdaterUi();
chat.unlockAudioOnFirstGesture();

bootstrapACUI();
initPanelCollapse();

// ── TTS 设置面板初始化 ────────────────────────────────────────────────────────
function initTTSSettings() {
  const providerSel = document.getElementById("tts-provider-select");
  const voiceSel    = document.getElementById("tts-voice-select");
  const testBtn     = document.getElementById("tts-test-btn");
  const testStatus  = document.getElementById("tts-test-status");
  const diagBtn     = document.getElementById("voice-diagnostics-btn");
  const diagResult  = document.getElementById("voice-diagnostics-result");
  if (!providerSel) return;

  let allVoices = {};

  const credSections = {
    doubao:     document.getElementById("tts-creds-doubao"),
    minimax:    document.getElementById("tts-creds-minimax"),
    openai:     document.getElementById("tts-creds-openai"),
    elevenlabs: document.getElementById("tts-creds-elevenlabs"),
    volcano:    document.getElementById("tts-creds-volcano"),
  };

  function showCredSection(provider) {
    Object.entries(credSections).forEach(([k, el]) => {
      if (el) el.style.display = k === provider ? "" : "none";
    });
  }

  function updateVoiceOptions(provider, savedId) {
    if (!voiceSel) return;
    const voices = allVoices[provider] || [];
    voiceSel.innerHTML = voices.map(v =>
      `<option value="${v.id}">${v.label}</option>`
    ).join("");
    if (savedId && voices.some(v => v.id === savedId)) {
      voiceSel.value = savedId;
    }
  }

  providerSel.addEventListener("change", () => {
    showCredSection(providerSel.value);
    updateVoiceOptions(providerSel.value);
  });

  // 加载现有配置 + 声音列表
  fetch(`${API}/settings/tts`).then(r => r.json()).then(({ tts, voices }) => {
    if (voices) allVoices = voices;
    const provider = tts?.ttsProvider || "doubao";
    if (tts?.ttsProvider) providerSel.value = tts.ttsProvider;
    else providerSel.value = "doubao";
    updateVoiceOptions(provider, tts?.ttsVoiceId);
    const appidEl = document.getElementById("tts-volcano-appid");
    if (appidEl && tts?.volcanoAppId?.value) appidEl.value = tts.volcanoAppId.value;
    const baseurlEl = document.getElementById("tts-openai-baseurl");
    if (baseurlEl && tts?.openaiTtsBaseURL) baseurlEl.value = tts.openaiTtsBaseURL;
    showCredSection(provider);
  }).catch(() => {});

  showCredSection(providerSel.value);

  // TTS 配置写入 saveVoiceBtn 的保存流程（通过独立请求）
  const origSaveBtn = document.getElementById("settings-save-voice");
  if (origSaveBtn) {
    origSaveBtn.addEventListener("click", () => {
      const ttsBody = { ttsProvider: providerSel.value };
      const voiceId  = voiceSel?.value?.trim();
      if (voiceId) ttsBody.ttsVoiceId = voiceId;
      const minimaxKey = document.getElementById("tts-minimax-key")?.value?.trim();
      if (minimaxKey) ttsBody.minimaxKey = minimaxKey;
      const doubaoKey = document.getElementById("tts-doubao-key")?.value?.trim();
      if (doubaoKey) ttsBody.doubaoKey = doubaoKey;
      const openaiKey = document.getElementById("tts-openai-key")?.value?.trim();
      if (openaiKey) ttsBody.openaiTtsKey = openaiKey;
      const baseURL = document.getElementById("tts-openai-baseurl")?.value?.trim();
      if (baseURL) ttsBody.openaiTtsBaseURL = baseURL;
      const elevenKey = document.getElementById("tts-elevenlabs-key")?.value?.trim();
      if (elevenKey) ttsBody.elevenLabsKey = elevenKey;
      const volcanoAppId = document.getElementById("tts-volcano-appid")?.value?.trim();
      if (volcanoAppId) ttsBody.volcanoAppId = volcanoAppId;
      const volcanoToken = document.getElementById("tts-volcano-token")?.value?.trim();
      if (volcanoToken) ttsBody.volcanoToken = volcanoToken;

      fetch(`${API}/settings/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ttsBody),
      }).then(() => {
        ["tts-minimax-key", "tts-doubao-key", "tts-openai-key", "tts-elevenlabs-key", "tts-volcano-token"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
      }).catch(() => {});
    });
  }

  // 试听按钮：先保存当前服务商+声音选择，再触发合成
  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      testBtn.disabled = true;
      if (testStatus) testStatus.textContent = "保存配置中…";
      try {
        // 先把当前 UI 的服务商+声音写入后端，确保试听用的是当前选择
        const preBody = { ttsProvider: providerSel.value };
        const currentVoice = voiceSel?.value?.trim();
        if (currentVoice) preBody.ttsVoiceId = currentVoice;
        const minimaxKey2 = document.getElementById("tts-minimax-key")?.value?.trim();
        if (minimaxKey2) preBody.minimaxKey = minimaxKey2;
        const doubaoKey = document.getElementById("tts-doubao-key")?.value?.trim();
        if (doubaoKey) preBody.doubaoKey = doubaoKey;
        const openaiKey = document.getElementById("tts-openai-key")?.value?.trim();
        if (openaiKey) preBody.openaiTtsKey = openaiKey;
        const elevenKey = document.getElementById("tts-elevenlabs-key")?.value?.trim();
        if (elevenKey) preBody.elevenLabsKey = elevenKey;
        const volcanoAppId = document.getElementById("tts-volcano-appid")?.value?.trim();
        if (volcanoAppId) preBody.volcanoAppId = volcanoAppId;
        const volcanoToken = document.getElementById("tts-volcano-token")?.value?.trim();
        if (volcanoToken) preBody.volcanoToken = volcanoToken;
        await fetch(`${API}/settings/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preBody),
        });
        if (testStatus) testStatus.textContent = "合成中…";
        const ttsResp = await fetch(`${API}/tts/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "你好，这是语音合成测试，声音是否清晰自然？" }),
        });
        if (!ttsResp.ok) {
          let errMsg = `合成失败 (HTTP ${ttsResp.status})`;
          try { const j = await ttsResp.json(); errMsg = j.error || errMsg; } catch {}
          if (testStatus) testStatus.textContent = errMsg;
          return;
        }
        const ttsBlob = await ttsResp.blob();
        if (ttsBlob.size === 0) {
          if (testStatus) testStatus.textContent = "合成失败：API 返回空数据，请检查 Key 和账户配置";
          return;
        }
        const ttsUrl = URL.createObjectURL(ttsBlob);
        const ttsAudio = new Audio(ttsUrl);
        ttsAudio.onended = () => { URL.revokeObjectURL(ttsUrl); if (testStatus) testStatus.textContent = ""; };
        ttsAudio.onerror = () => { URL.revokeObjectURL(ttsUrl); if (testStatus) testStatus.textContent = "播放失败"; };
        await ttsAudio.play();
        if (testStatus) testStatus.textContent = "播放中";
        setTimeout(() => { if (testStatus && testStatus.textContent === "播放中") testStatus.textContent = ""; }, 8000);
      } catch {
        if (testStatus) testStatus.textContent = "失败，请检查配置和 API Key";
      } finally {
        testBtn.disabled = false;
      }
    });
  }

  if (diagBtn) {
    diagBtn.addEventListener("click", async () => {
      diagBtn.disabled = true;
      if (diagResult) diagResult.textContent = "体检中…";
      try {
        const resp = await fetch(`${API}/diagnostics/voice`);
        const data = await resp.json().catch(() => null);
        if (!resp.ok || !data) throw new Error(data?.error || `体检失败 (HTTP ${resp.status})`);
        const lines = [
          `总体：${data.ok ? "可用" : "需要处理"}，耗时 ${data.totalMs ?? "-"}ms`,
          `LLM：${data.llm?.ok ? "正常" : "异常"} · ${data.llm?.provider || "-"} · ${data.llm?.model || "-"} · ${data.llm?.message || ""}`,
          `ASR：${data.asr?.ok ? "正常" : "异常"} · ${data.asr?.provider || "-"} · ${data.asr?.message || ""}`,
          `TTS：${data.tts?.ok ? "正常" : "异常"} · ${data.tts?.providerLabel || data.tts?.provider || "-"} · ${data.tts?.voiceId || "-"}`,
        ];
        if (data.tts?.test) {
          lines.push(`TTS首包：${data.tts.test.ok ? "通过" : "失败"} · ${data.tts.test.firstChunkMs ?? "-"}ms · ${data.tts.test.message || ""}`);
        }
        if (data.tts?.fallbackReason) lines.push(`兜底：${data.tts.fallbackReason}`);
        try {
          const latencyResp = await fetch(`${API}/diagnostics/voice-latency`);
          const latencyData = await latencyResp.json();
          const trace = latencyData?.trace;
          if (trace?.durations) {
            const d = trace.durations;
            const totalMs = d.totalToTtsStartMs ?? d.totalToReplyMs ?? null;
            const grade = totalMs == null
              ? "等待完整链路"
              : totalMs <= 1200
                ? "实时"
                : totalMs <= 3000
                  ? "可对话"
                  : "偏慢";
            lines.push("");
            lines.push(`最近语音：${grade} · ${trace.status || "-"} · ${trace.contentPreview || ""}`);
            lines.push(`排队 ${d.backendQueueMs ?? "-"}ms · LLM首字 ${d.llmFirstChunkMs ?? "-"}ms · 回复完成 ${d.llmReplyMs ?? "-"}ms`);
            lines.push(`TTS请求 ${d.ttsRequestMs ?? "-"}ms · 音频首声 ${d.ttsAudioStartMs ?? "-"}ms · 总首声 ${d.totalToTtsStartMs ?? "-"}ms`);
            if ((d.llmFirstChunkMs || 0) > 3000) lines.push("判断：主要慢在 LLM 首字，建议切更快模型或继续扩充本地快回。");
            else if ((d.ttsAudioStartMs || 0) > 1500) lines.push("判断：主要慢在 TTS 到首声，建议检查豆包流式 TTS。");
          }
        } catch {}
        if (diagResult) diagResult.textContent = lines.join("\n");
      } catch (err) {
        if (diagResult) diagResult.textContent = err?.message || "体检失败，请检查本地服务是否运行";
      } finally {
        diagBtn.disabled = false;
      }
    });
  }
}

window.addEventListener("beforeunload", () => {
  if (typeof removeUpdaterStatusListener === "function") {
    removeUpdaterStatusListener();
    removeUpdaterStatusListener = null;
  }
});

// ── Settings modal ──
(function initSettings() {
  const settingsBtn     = document.getElementById("settings-btn");
  const overlay         = document.getElementById("settings-overlay");
  const closeBtn        = document.getElementById("settings-close");
  const providerSelect  = document.getElementById("settings-provider-select");
  const modelSelect     = document.getElementById("settings-model-select");
  const llmKeyInput     = document.getElementById("settings-llm-key");
  const saveLlmBtn      = document.getElementById("settings-save-llm");
  const llmFeedback     = document.getElementById("settings-llm-feedback");
  const tempSlider      = document.getElementById("settings-temperature");
  const tempVal         = document.getElementById("settings-temperature-val");
  const saveTempBtn     = document.getElementById("settings-save-temperature");
  const tempFeedback    = document.getElementById("settings-temperature-feedback");
  const agentModelGrid  = document.getElementById("agent-model-grid");
  const saveAgentModelsBtn = document.getElementById("settings-save-agent-models");
  const resetAgentModelsBtn = document.getElementById("settings-reset-agent-models");
  const agentModelsFeedback = document.getElementById("settings-agent-models-feedback");
  const agentConnectLocalBtn = document.getElementById("agent-connect-local");
  const agentConnectStatus = document.getElementById("agent-connect-status");
  const agentDashboardRefreshBtn = document.getElementById("agent-dashboard-refresh");
  const agentDetectRefreshBtn = document.getElementById("agent-detect-refresh");
  const agentSmokeTestBtn = document.getElementById("agent-smoke-test");
  const agentSmokeStatus = document.getElementById("agent-smoke-status");
  const agentDelegationPermission = document.getElementById("agent-delegation-permission");
  const agentDashboardFeedback = document.getElementById("agent-dashboard-feedback");
  const agentDashboardModels = document.getElementById("agent-dashboard-models");
  const agentDashboardJobs = document.getElementById("agent-dashboard-jobs");
  const agentApprovalRequests = document.getElementById("agent-approval-requests");
  const agentDashboardStats = document.getElementById("agent-dashboard-stats");
  const agentOrchestrationMemory = document.getElementById("agent-orchestration-memory");
  const agentRoutePlan = document.getElementById("agent-route-plan");
  const agentPersonalStudio = document.getElementById("agent-personal-studio");
  const agentEvolutionStatus = document.getElementById("agent-evolution-status");
  const agentEvolutionToggleBtn = document.getElementById("agent-evolution-toggle");
  const agentEvolutionRunBtn = document.getElementById("agent-evolution-run");
  const agentEvolutionAutopilotRunBtn = document.getElementById("agent-evolution-autopilot-run");
  const agentEvolutionAutoApplyToggleBtn = document.getElementById("agent-evolution-auto-apply-toggle");
  const agentEvolutionProposalBtn = document.getElementById("agent-evolution-proposal-run");
  const agentEvolutionDryRunBtn = document.getElementById("agent-evolution-dry-run");
  const agentEvolutionApprovalInput = document.getElementById("agent-evolution-approval");
  const agentEvolutionApplyBtn = document.getElementById("agent-evolution-apply");
  const agentEvolutionProposal = document.getElementById("agent-evolution-proposal");
  const agentEvolutionFeedback = document.getElementById("agent-evolution-feedback");
  const agentAssetsRefreshBtn = document.getElementById("agent-assets-refresh");
  const agentAssetsFeedback = document.getElementById("agent-assets-feedback");
  const agentAssetsSummary = document.getElementById("agent-assets-summary");
  const agentAssetsSkills = document.getElementById("agent-assets-skills");
  const agentAssetsRuns = document.getElementById("agent-assets-runs");
  const agentAssetsModels = document.getElementById("agent-assets-models");
  const minimaxKeyInput = document.getElementById("settings-minimax-key");
  const saveMinimaxBtn  = document.getElementById("settings-save-minimax");
  const minimaxFeedback = document.getElementById("settings-minimax-feedback");
  const saveSocialBtn   = document.getElementById("settings-save-social");
  const socialFeedback  = document.getElementById("settings-social-feedback");
  const feishuDiagnoseBtn = document.getElementById("social-feishu-diagnose");
  const feishuDiagnoseFeedback = document.getElementById("social-feishu-diagnose-feedback");
  const feishuDiagnoseResult = document.getElementById("social-feishu-diagnose-result");
  const saveVoiceBtn    = document.getElementById("settings-save-voice");
  const voiceFeedback   = document.getElementById("settings-voice-feedback");
  const voiceThreshSlider = document.getElementById("settings-voice-threshold");
  const voiceThreshVal    = document.getElementById("settings-voice-threshold-val");
  const autoLaunchCheckbox = document.getElementById("settings-auto-launch");
  const saveAutoLaunchBtn = document.getElementById("settings-save-auto-launch");
  const autoLaunchFeedback = document.getElementById("settings-auto-launch-feedback");

  if (!settingsBtn || !overlay) return;

  [agentEvolutionRunBtn, agentEvolutionAutopilotRunBtn, agentEvolutionAutoApplyToggleBtn, agentEvolutionDryRunBtn].forEach((btn) => {
    if (btn) btn.style.display = "none";
  });
  if (agentEvolutionApprovalInput?.parentElement) {
    agentEvolutionApprovalInput.parentElement.style.display = "none";
  }
  if (agentEvolutionProposalBtn) {
    agentEvolutionProposalBtn.textContent = "研究并生成方案";
  }

  let cachedProviders = null;
  const AGENT_MODEL_LABELS = {
    codex: "Codex",
    "claude-code": "Claude Code",
    openclaw: "OpenClaw",
    hermes: "Hermes",
    "gemini-cli": "Gemini CLI",
    opencode: "OpenCode",
    aider: "Aider",
    goose: "Goose",
    cline: "Cline",
    "roo-code": "Roo Code",
    continue: "Continue",
    cursor: "Cursor",
    windsurf: "Windsurf",
    "copilot-cli": "Copilot CLI",
    openhands: "OpenHands",
    "swe-agent": "SWE-agent",
    kiro: "Kiro",
    amp: "Amp",
    manus: "Manus",
    "browser-use": "browser-use",
    dotagents: "DotAgents",
    thoth: "Thoth",
  };
  const AGENT_INTENT_LABELS = {
    engineering: "工程",
    engineering_review: "复核",
    desktop_app: "桌面",
    memory_continuity: "记忆",
    digital_human: "数字人",
    skill_adaptation: "技能",
    web_browser: "网页",
    document_work: "文档",
    general: "通用",
  };
  let agentEvolutionEnabled = false;
  let agentEvolutionAutoApplyLowRisk = true;
  let agentEvolutionProposalId = "";
  let agentEvolutionProposalReady = false;
  const agentSmokeState = {
    status: "idle",
    startedAt: null,
    updatedAt: null,
    jobs: [],
    collected: [],
    errors: [],
  };

  // ── Tab 切换 ──
  overlay.querySelectorAll(".settings-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      overlay.querySelectorAll(".settings-nav-item").forEach(b => b.classList.remove("active"));
      overlay.querySelectorAll(".settings-tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      overlay.querySelector(`.settings-tab[data-tab="${tab}"]`)?.classList.add("active");
      if (tab === "social") loadSocialSettings();
      if (tab === "security") loadSecuritySettings();
      if (tab === "llm") loadAgentModelSettings();
      if (tab === "agents") {
        loadAgentDashboard();
        loadAgentRoutePlan();
        loadAgentOrchestrationMemory();
        loadEvolutionStatus();
      }
      if (tab === "assets") loadAgentAssets();
    });
  });

  function showFeedback(el, msg, isError = false) {
    if (!el) return;
    el.textContent = msg;
    el.className = "settings-feedback" + (isError ? " error" : "");
    setTimeout(() => { el.textContent = ""; el.className = "settings-feedback"; }, 3000);
  }

  async function loadAutoLaunchSettings() {
    if (!autoLaunchCheckbox) return;
    const bridge = window.xiaobai || window.bailongma;
    if (!bridge?.getAutoLaunch) {
      autoLaunchCheckbox.disabled = true;
      if (saveAutoLaunchBtn) saveAutoLaunchBtn.disabled = true;
      showFeedback(autoLaunchFeedback, "当前环境不支持开机自启设置", true);
      return;
    }
    try {
      const status = await bridge.getAutoLaunch();
      autoLaunchCheckbox.checked = !!status?.enabled;
      autoLaunchCheckbox.disabled = !status?.available;
      if (saveAutoLaunchBtn) saveAutoLaunchBtn.disabled = !status?.available;
      if (!status?.available) showFeedback(autoLaunchFeedback, "打包安装后可用");
    } catch (err) {
      showFeedback(autoLaunchFeedback, err?.message || "读取开机自启失败", true);
    }
  }

  saveAutoLaunchBtn?.addEventListener("click", async () => {
    const bridge = window.xiaobai || window.bailongma;
    if (!bridge?.setAutoLaunch || !autoLaunchCheckbox) return;
    try {
      const status = await bridge.setAutoLaunch(autoLaunchCheckbox.checked);
      autoLaunchCheckbox.checked = !!status?.enabled;
      showFeedback(autoLaunchFeedback, status?.enabled ? "已开启开机自启" : "已关闭开机自启");
    } catch (err) {
      showFeedback(autoLaunchFeedback, err?.message || "保存失败", true);
    }
  });

  (window.xiaobai || window.bailongma)?.onAutoLaunchStatus?.((status = {}) => {
    if (autoLaunchCheckbox) autoLaunchCheckbox.checked = !!status.enabled;
    showFeedback(autoLaunchFeedback, status.enabled ? "已开启开机自启" : "已关闭开机自启");
  });

  // ── LLM / 媒体 ──
  function refreshConfigSummary({ llm, minimax }) {
    const cfgLlm = document.getElementById("settings-cfg-llm");
    const cfgLlmDot = document.getElementById("settings-cfg-llm-dot");
    const cfgMedia = document.getElementById("settings-cfg-media");
    const cfgMediaDot = document.getElementById("settings-cfg-media-dot");
    if (cfgLlm) cfgLlm.textContent = `${llm.provider || "—"} · ${llm.model || "—"}`;
    if (cfgLlmDot) {
      cfgLlmDot.textContent = "●";
      cfgLlmDot.className = `settings-config-dot ${llm.activated ? "active" : "inactive"}`;
      cfgLlmDot.title = llm.activated ? "运行中" : "未激活";
    }
    if (cfgMedia) cfgMedia.textContent = `minimax · ${minimax.configured ? "已配置" : "未配置"}`;
    if (cfgMediaDot) {
      cfgMediaDot.textContent = "●";
      cfgMediaDot.className = `settings-config-dot ${minimax.configured ? "active" : "inactive"}`;
    }
  }

  function populateModelSelect(models, current) {
    if (!modelSelect || !models) return;
    modelSelect.innerHTML = models
      .map(m => `<option value="${m.id}"${m.deprecated ? " data-deprecated" : ""}>${m.label}</option>`)
      .join("");
    if (current) modelSelect.value = current;
  }

  function populateProviderSelect(providers, current) {
    if (!providerSelect || !providers) return;
    const selected = current || providerSelect.value || "auto";
    const options = [`<option value="auto">自动识别</option>`]
      .concat(Object.entries(providers).map(([id, provider]) => {
        const label = provider.label || id;
        return `<option value="${id}">${label}</option>`;
      }));
    providerSelect.innerHTML = options.join("");
    providerSelect.value = providers[selected] || selected === "auto" ? selected : "auto";
  }

  function applyCustomProviderUI(llm) {
    const customSection = document.getElementById("settings-custom-llm-section");
    const modelRow = document.getElementById("settings-model-row");
    if (llm?.provider === "custom") {
      if (customSection) customSection.style.display = "";
      if (modelRow) modelRow.style.display = "none";
      const baseUrlEl = document.getElementById("settings-custom-baseurl");
      const modelEl = document.getElementById("settings-custom-model");
      if (baseUrlEl && llm.baseURL) baseUrlEl.value = llm.baseURL;
      if (modelEl && llm.model) modelEl.value = llm.model;
    } else {
      if (customSection) customSection.style.display = "none";
      if (modelRow) modelRow.style.display = "";
    }
  }

  function escapeAttr(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function listToText(value) {
    return Array.isArray(value) ? value.join("，") : String(value || "");
  }

  function renderAgentSkillCard(skill = {}) {
    const rules = Array.isArray(skill.validation_rules) ? skill.validation_rules : [];
    const tools = Array.isArray(skill.required_tools) ? skill.required_tools : [];
    return `
      <div class="agent-dashboard-card">
        <div class="agent-dashboard-card-head">
          <strong>${escapeAttr(skill.title || "未命名技能")}</strong>
          <span>${escapeAttr(skill.category || "custom")}</span>
        </div>
        <div class="agent-dashboard-sub">${escapeAttr(skill.skill_id || "")}</div>
        <div class="agent-route-why">${escapeAttr(skill.description || "暂无描述")}</div>
        <div class="agent-route-list">${tools.slice(0, 6).map(tool => `<span>${escapeAttr(tool)}</span>`).join("") || `<span>按任务选择工具</span>`}</div>
        <div class="agent-route-list">${rules.slice(0, 3).map(rule => `<span>${escapeAttr(rule)}</span>`).join("")}</div>
      </div>
    `;
  }

  function renderAgentRunCard(run = {}) {
    const tools = Array.isArray(run.tool_calls) ? run.tool_calls : [];
    const statusClass = run.status === "completed" ? "active" : run.status === "failed" ? "danger" : "";
    const eligibility = run.skill_eligibility || {};
    const canPromote = run.status === "completed" && eligibility.eligible === true;
    return `
      <div class="agent-dashboard-card">
        <div class="agent-dashboard-card-head">
          <strong>${escapeAttr((run.task || "任务").slice(0, 36))}</strong>
          <span class="${statusClass}">${escapeAttr(run.status || "unknown")}</span>
        </div>
        <div class="agent-dashboard-sub">${escapeAttr(run.run_id || "")}</div>
        <div class="agent-dashboard-sub">${escapeAttr(run.started_at || "")}</div>
        <div class="agent-route-list">${tools.slice(0, 7).map(call => `<span>${escapeAttr(call.name || "tool")}${call.ok === false ? " · 失败" : ""}</span>`).join("") || `<span>未调用工具</span>`}</div>
        ${canPromote ? `<button class="settings-save-btn agent-promote-run" data-run-id="${escapeAttr(run.run_id || "")}" type="button">保存成技能</button>` : ""}
        ${run.status === "completed" && !canPromote ? `<div class="agent-dashboard-sub">${escapeAttr(eligibility.reason || "简单任务只保留任务记录，不保存成技能")}</div>` : ""}
      </div>
    `;
  }

  function renderModelEventCard(event = {}) {
    return `
      <div class="agent-dashboard-source">
        <span>${escapeAttr(event.provider || "provider")} · ${escapeAttr(event.model || "model")}</span>
        <b>${event.success ? "成功" : "失败"} · ${escapeAttr(event.latency_ms || 0)}ms</b>
        <em>${escapeAttr(event.error || event.capability || "")}</em>
      </div>
    `;
  }

  async function promoteRunToSkill(runId) {
    if (!runId) return;
    try {
      const res = await fetch(`${API}/agent-skills/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: runId }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "保存失败");
      showFeedback(agentAssetsFeedback, "已保存成技能");
      await loadAgentAssets();
    } catch (err) {
      showFeedback(agentAssetsFeedback, err?.message || "保存失败", true);
    }
  }

  async function loadAgentAssets() {
    if (!agentAssetsSummary) return;
    try {
      agentAssetsSummary.textContent = "读取中…";
      const data = await fetch(`${API}/agent-assets?limit=30`).then(r => r.json());
      const runs = Array.isArray(data.runs) ? data.runs : [];
      const skills = Array.isArray(data.skills) ? data.skills : [];
      const modelEvents = Array.isArray(data.model_events) ? data.model_events : [];
      agentAssetsSummary.innerHTML = `
        <div class="agent-dashboard-card">
          <div class="agent-dashboard-card-head"><strong>资产状态</strong><span>${escapeAttr(new Date().toLocaleTimeString())}</span></div>
          <div class="agent-route-list">
            <span>任务记录 ${runs.length}</span>
            <span>技能 ${skills.length}</span>
            <span>模型事件 ${modelEvents.length}</span>
          </div>
          <div class="agent-dashboard-warning">真正沉淀的是流程、工具、验收和用户技能，不是某一次模型回答。</div>
        </div>
      `;
      if (agentAssetsSkills) {
        agentAssetsSkills.innerHTML = skills.length
          ? skills.slice(0, 10).map(renderAgentSkillCard).join("")
          : `<div class="agent-dashboard-empty">还没有保存技能。完成一次可复用任务后，可在最近任务里保存。</div>`;
      }
      if (agentAssetsRuns) {
        agentAssetsRuns.innerHTML = runs.length
          ? runs.slice(0, 12).map(renderAgentRunCard).join("")
          : `<div class="agent-dashboard-empty">还没有任务记录。</div>`;
        agentAssetsRuns.querySelectorAll(".agent-promote-run").forEach(btn => {
          btn.addEventListener("click", () => promoteRunToSkill(btn.dataset.runId));
        });
      }
      if (agentAssetsModels) {
        agentAssetsModels.innerHTML = modelEvents.length
          ? modelEvents.slice(-12).reverse().map(renderModelEventCard).join("")
          : `<div class="agent-dashboard-empty">还没有模型事件。</div>`;
      }
    } catch (err) {
      agentAssetsSummary.textContent = "读取失败";
      showFeedback(agentAssetsFeedback, err?.message || "读取失败", true);
    }
  }

  agentAssetsRefreshBtn?.addEventListener("click", loadAgentAssets);

  function renderAgentModelSettings(profiles = [], overrides = {}) {
    if (!agentModelGrid) return;
    const byId = new Map((profiles || []).map(profile => [profile.agent_id, profile]));
    const ids = (profiles || [])
      .map(profile => profile.agent_id)
      .filter(Boolean)
      .sort((a, b) => {
        const rank = id => ["codex", "claude-code", "openclaw", "hermes"].indexOf(id);
        const ar = rank(a);
        const br = rank(b);
        if (ar !== -1 || br !== -1) return (ar === -1 ? 99 : ar) - (br === -1 ? 99 : br);
        return String(AGENT_MODEL_LABELS[a] || a).localeCompare(String(AGENT_MODEL_LABELS[b] || b));
      });
    agentModelGrid.innerHTML = ids.map(id => {
      const profile = byId.get(id) || { agent_id: id, route_weight_by_intent: {} };
      const override = overrides?.[id] || {};
      const enabled = override.enabled === true || profile.user_configured === true;
      const weights = override.route_weight_by_intent || profile.route_weight_by_intent || {};
      const detected = profile.detected_available === true || override.enabled === true;
      const sourceText = profile.profile_source === "user_override" ? "手动优先" : (profile.profile_source === "auto_detected" ? "自动探测" : "内置默认");
      const sourceClass = profile.profile_source === "user_override" ? "manual" : (detected ? "auto" : "missing");
      const connectionHint = detected
        ? (profile.invoke_cmd ? `已检测到 ${profile.invoke_cmd}` : "已连接")
        : "未在这台电脑检测到，可手动填写后启用";
      return `
        <section class="agent-model-row" data-agent-id="${escapeAttr(id)}">
          <div class="agent-model-head">
            <label class="agent-model-toggle">
              <input type="checkbox" data-field="enabled" ${enabled ? "checked" : ""}>
              <span>${escapeAttr(AGENT_MODEL_LABELS[id] || id)}</span>
            </label>
            <span class="agent-model-source ${sourceClass}">${escapeAttr(sourceText)}</span>
            <span class="agent-model-source ${detected ? "auto" : "missing"}">${escapeAttr(connectionHint)}</span>
          </div>
          <div class="agent-model-fields">
            <label class="agent-model-field">模型
              <input class="settings-input" data-field="observed_model" type="text" value="${escapeAttr(override.observed_model || profile.observed_model || "")}" placeholder="如 gpt-5.5 / Claude Sonnet / MiniMax-M2.7">
            </label>
            <label class="agent-model-field">运行时
              <input class="settings-input" data-field="runtime" type="text" value="${escapeAttr(override.runtime || profile.runtime || "")}" placeholder="CLI / Gateway / Local service">
            </label>
            <label class="agent-model-field">提供商
              <input class="settings-input" data-field="provider" type="text" value="${escapeAttr(override.provider || profile.provider || "")}" placeholder="OpenAI / Anthropic / OpenClaw">
            </label>
            <label class="agent-model-field">延迟/稳定性
              <input class="settings-input" data-field="latency_profile" type="text" value="${escapeAttr(override.latency_profile || profile.latency_profile || "")}" placeholder="fast / medium / high">
            </label>
          </div>
          <div class="agent-model-fields">
            <label class="agent-model-field wide">适合任务
              <textarea class="settings-input agent-model-textarea" data-field="best_for" placeholder="用逗号分隔">${escapeAttr(listToText(override.best_for || profile.best_for))}</textarea>
            </label>
            <label class="agent-model-field wide">避免任务
              <textarea class="settings-input agent-model-textarea" data-field="avoid_for" placeholder="用逗号分隔">${escapeAttr(listToText(override.avoid_for || profile.avoid_for))}</textarea>
            </label>
          </div>
          <div class="agent-model-weight-grid">
            ${Object.entries(AGENT_INTENT_LABELS).map(([intent, label]) => `
              <label class="agent-model-weight">${escapeAttr(label)}
                <input class="settings-input" data-intent="${escapeAttr(intent)}" type="number" min="0" max="100" step="1" value="${escapeAttr(weights[intent] ?? "")}">
              </label>
            `).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  async function loadAgentModelSettings() {
    if (!agentModelGrid) return;
    try {
      const data = await fetch(`${API}/settings/agent-models`).then(r => r.json());
      renderAgentModelSettings(data.profiles || [], data.overrides || {});
    } catch {
      agentModelGrid.innerHTML = `<div class="settings-hint">Agent 模型路由读取失败</div>`;
    }
  }

  function parseAgentList(value) {
    return String(value || "")
      .split(/[,，;\n]/)
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  function collectAgentModelOverrides() {
    const overrides = {};
    if (!agentModelGrid) return overrides;
    agentModelGrid.querySelectorAll(".agent-model-row").forEach(row => {
      const id = row.dataset.agentId;
      if (!id) return;
      const enabled = !!row.querySelector('[data-field="enabled"]')?.checked;
      const item = { enabled };
      ["observed_model", "runtime", "provider", "latency_profile"].forEach(field => {
        const value = row.querySelector(`[data-field="${field}"]`)?.value?.trim();
        if (value) item[field] = value;
      });
      ["best_for", "avoid_for"].forEach(field => {
        const list = parseAgentList(row.querySelector(`[data-field="${field}"]`)?.value);
        if (list.length) item[field] = list;
      });
      const weights = {};
      row.querySelectorAll("[data-intent]").forEach(input => {
        const intent = input.dataset.intent;
        const value = Number(input.value);
        if (intent && Number.isFinite(value)) weights[intent] = Math.max(0, Math.min(100, Math.round(value)));
      });
      if (Object.keys(weights).length) item.route_weight_by_intent = weights;
      overrides[id] = item;
    });
    return overrides;
  }

  function formatMs(ms) {
    const value = Number(ms);
    if (!Number.isFinite(value)) return "—";
    if (value < 1000) return `${Math.round(value)}ms`;
    return `${(value / 1000).toFixed(value < 10000 ? 1 : 0)}s`;
  }

  function sourceLabel(source = "") {
    if (source === "user_override") return "手动";
    if (source === "runtime_report") return "实际委托";
    if (source === "auto_detected") return "自动检测";
    if (source === "local_config") return "本地配置";
    if (source === "runtime_detection") return "运行时";
    if (source === "built_in") return "兜底";
    return source || "未知";
  }

  function sourceDetailLines(item = {}) {
    return (item.sources || [])
      .filter(source => source && source.source !== "built_in")
      .slice(0, 3)
      .map(source => {
        const label = sourceLabel(source.source);
        const model = source.observed_model || "unknown";
        const meta = [source.provider, source.reported_at].filter(Boolean).join(" · ");
        return `<div class="agent-dashboard-source"><span>${escapeAttr(label)}</span><b>${escapeAttr(model)}</b>${meta ? `<em>${escapeAttr(meta)}</em>` : ""}</div>`;
      }).join("");
  }

  function formatShortTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function renderAgentSmokeStatus() {
    if (!agentSmokeStatus) return;
    const jobRows = agentSmokeState.jobs.length
      ? agentSmokeState.jobs.map(job => `
        <div class="agent-smoke-row">
          <strong>${escapeAttr(AGENT_MODEL_LABELS[job.agent_id] || job.agent_id || "unknown")}</strong>
          <span>${escapeAttr(job.job_id || job.error || "pending")}</span>
        </div>
      `).join("")
      : `<div class="agent-smoke-muted">尚未启动测试任务</div>`;
    const resultRows = agentSmokeState.collected.length
      ? agentSmokeState.collected.slice(-4).map(item => `
        <div class="agent-smoke-result">
          <strong>${escapeAttr(AGENT_MODEL_LABELS[item.agent_id] || item.agent_id || "unknown")}</strong>
          <span>${escapeAttr(item.status || "unknown")} · ${escapeAttr(formatMs(item.duration_ms))}</span>
          <div>${escapeAttr(item.summary || item.error || "无摘要")}</div>
        </div>
      `).join("")
      : `<div class="agent-smoke-muted">暂无已收集结果</div>`;
    const errorRows = agentSmokeState.errors.length
      ? `<div class="agent-smoke-errors">${agentSmokeState.errors.slice(-3).map(item => escapeAttr(item.error || item.message || item.reason || String(item))).join(" · ")}</div>`
      : "";
    const statusLabel = {
      idle: "未运行",
      starting: "启动中",
      polling: "收集中",
      completed: "已完成",
      failed: "失败",
    }[agentSmokeState.status] || agentSmokeState.status;
    agentSmokeStatus.innerHTML = `
      <div class="agent-smoke-head">
        <strong>闭环测试：${escapeAttr(statusLabel)}</strong>
        <span>启动 ${escapeAttr(formatShortTime(agentSmokeState.startedAt))} · 更新 ${escapeAttr(formatShortTime(agentSmokeState.updatedAt))}</span>
      </div>
      <div class="agent-smoke-columns">
        <div>
          <div class="agent-smoke-title">任务</div>
          ${jobRows}
        </div>
        <div>
          <div class="agent-smoke-title">结果</div>
          ${resultRows}
        </div>
      </div>
      ${errorRows}
    `;
  }

  function renderAgentDelegationPermission(data = {}) {
    if (!agentDelegationPermission) return;
    const allowed = data.delegation_allowed === true;
    const modelCount = Array.isArray(data.models) ? data.models.length : 0;
    if (allowed) {
      agentDelegationPermission.innerHTML = `
        <div class="agent-dashboard-card agent-delegation-permission-card ok">
          <div class="agent-dashboard-card-head">
            <strong>已允许小白指挥本机 Agent</strong>
            <span>${escapeAttr(modelCount)} 个候选</span>
          </div>
          <div class="agent-dashboard-sub">以后不会重复要求配置；遇到删除、提交、推送、部署、发外部消息、输入密钥等高风险动作，仍会单独让你批准。</div>
          <div class="agent-job-actions">
            <button class="settings-save-btn agent-delegation-deny" type="button">关闭委托</button>
          </div>
        </div>
      `;
      return;
    }

    agentDelegationPermission.innerHTML = `
      <div class="agent-dashboard-card agent-delegation-permission-card">
        <div class="agent-dashboard-card-head">
          <strong>允许小白指挥本机 Agent 吗</strong>
          <span>${escapeAttr(modelCount)} 个候选</span>
        </div>
        <div class="agent-route-why">批准后，小白可以把代码复核、桌面检查、浏览器观察、记忆整理等子任务分派给 Codex、Claude Code、OpenClaw、Hermes 和已检测到的主流 Agent。</div>
        <div class="agent-route-list">
          <span>好处：复杂任务更快闭环</span>
          <span>好处：能自动选择更合适的执行通道</span>
          <span>边界：高风险动作仍需你点批准</span>
        </div>
        <div class="agent-job-actions">
          <button class="settings-save-btn agent-delegation-approve" type="button">批准</button>
          <button class="settings-save-btn agent-delegation-deny" type="button">拒绝</button>
        </div>
      </div>
    `;
  }

  function setAgentSmokeState(patch = {}) {
    Object.assign(agentSmokeState, patch, { updatedAt: new Date().toISOString() });
    renderAgentSmokeStatus();
  }

  function labelAgentBridgeDiagnosis(diagnosis = {}) {
    const labels = {
      direct_callable: "可直接调用",
      mcp_bridge_configured: "MCP/本地桥接已就绪",
      mcp_bridge_unreachable: "MCP/本地桥接暂时不可达",
      desktop_bridge_available: "可走 OpenClaw 桌面桥接",
      desktop_bridge_blocked: "桌面桥接未就绪",
      human_gate: "需要你完成登录或授权",
      runtime_not_callable: "进程或网关未就绪",
      manual_connection_required: "需要手动连接",
      not_installed_or_not_detected: "未检测到这个 Agent",
    };
    return labels[diagnosis.layer] || diagnosis.status || diagnosis.blocker || "连接状态待确认";
  }

  function summarizeAgentBridgeDiagnosis(diagnosis = {}) {
    if (diagnosis.layer === "direct_callable") return "可以直接接收小白分派的任务。";
    if (diagnosis.layer === "mcp_bridge_configured") return "优先通过小白自己的 MCP/本地桥接发送任务。";
    if (diagnosis.can_desktop_fallback || diagnosis.openclaw_fallback_ready) return "协议桥接失败时，可以降级到 OpenClaw 桌面桥接。";
    if (diagnosis.blocker === "login_auth_or_approval_required") return "需要你先在对应 Agent 里完成登录、授权或确认。";
    if (diagnosis.blocker === "agent_not_found") return "需要先安装、打开或配置这个 Agent，再重新检测。";
    if (diagnosis.can_retry) return "可以稍后重试连接。";
    return (diagnosis.next_actions || [])[0] || "按提示处理后重新连接。";
  }

  function collectAgentBridgeDiagnoses(data = {}) {
    const items = [];
    const push = (diagnosis, fallbackAgentId = "") => {
      if (!diagnosis || typeof diagnosis !== "object") return;
      const agentId = diagnosis.agent_id || fallbackAgentId || "";
      const key = `${agentId}:${diagnosis.layer || ""}:${diagnosis.blocker || ""}:${diagnosis.via || ""}`;
      if (items.some(item => item.key === key)) return;
      items.push({ key, agentId, diagnosis });
    };
    push(data.diagnosis);
    (Array.isArray(data.diagnoses) ? data.diagnoses : []).forEach(item => push(item));
    ["manual", "failed", "bridged"].forEach(field => {
      (Array.isArray(data[field]) ? data[field] : []).forEach(item => push(item.diagnosis, item.agent_id));
    });
    return items.slice(0, 4);
  }

  function renderAgentBridgeDiagnostics(data = {}) {
    const items = collectAgentBridgeDiagnoses(data);
    if (!items.length) return "";
    const rows = items.map(({ agentId, diagnosis }) => `
      <div class="agent-connect-diagnosis-row">
        <strong>${escapeAttr(AGENT_MODEL_LABELS[agentId] || agentId || "Agent")}</strong>
        <span>${escapeAttr(labelAgentBridgeDiagnosis(diagnosis))}</span>
        <em>${escapeAttr(summarizeAgentBridgeDiagnosis(diagnosis))}</em>
      </div>
    `).join("");
    const nextAction = items.flatMap(item => item.diagnosis.next_actions || [])[0] || "";
    return `
      <div class="agent-connect-diagnosis">
        <div class="agent-route-subtitle">连接诊断</div>
        ${rows}
        ${nextAction ? `<div class="agent-dashboard-warning">下一步：${escapeAttr(nextAction)}</div>` : ""}
      </div>
    `;
  }

  function setAgentConnectStatus(data = {}, state = "idle") {
    if (!agentConnectStatus) return;
    agentConnectStatus.dataset.state = state;
    if (typeof data === "string") {
      agentConnectStatus.textContent = data;
      return;
    }
    const connected = Array.isArray(data.connected) ? data.connected : [];
    const bridged = Array.isArray(data.bridged) ? data.bridged : [];
    const manual = Array.isArray(data.manual) ? data.manual : [];
    const failed = Array.isArray(data.failed) ? data.failed : [];
    const smokeJobs = Array.isArray(data.smoke?.jobs) ? data.smoke.jobs : [];
    const connectedText = connected.length
      ? connected.map(id => AGENT_MODEL_LABELS[id] || id).join("、")
      : "暂无";
    const manualText = manual.length
      ? manual.slice(0, 4).map(item => `${AGENT_MODEL_LABELS[item.agent_id] || item.agent_id}：${item.status || "需手动处理"}`).join("；")
      : "";
    const bridgedText = bridged.length
      ? bridged.slice(0, 4).map(item => `${AGENT_MODEL_LABELS[item.agent_id] || item.agent_id}：${item.via === "mcp" ? "MCP/本地桥接" : "OpenClaw 桌面桥接"}`).join("；")
      : "";
    const failedText = failed.length
      ? failed.slice(0, 3).map(item => `${AGENT_MODEL_LABELS[item.agent_id] || item.agent_id}：${item.error || item.status || "失败"}`).join("；")
      : "";
    agentConnectStatus.innerHTML = `
      <div class="agent-connect-head">
        <strong>${escapeAttr(data.message || (connected.length ? "本机 Agent 已连接" : "未连接到可调用 Agent"))}</strong>
        <span>${escapeAttr(data.duration_ms ? formatMs(data.duration_ms) : "")}</span>
      </div>
      <div class="agent-dashboard-sub">可无缝委托：${escapeAttr(connectedText)}${smokeJobs.length ? ` · 已启动 ${escapeAttr(smokeJobs.length)} 个轻量验证` : ""}</div>
      ${bridgedText ? `<div class="agent-dashboard-sub">可桥接调用：${escapeAttr(bridgedText)}</div>` : ""}
      ${manualText ? `<div class="agent-dashboard-warning">需你完成登录/授权/桥接：${escapeAttr(manualText)}</div>` : ""}
      ${failedText ? `<div class="agent-dashboard-warning">连接失败：${escapeAttr(failedText)}</div>` : ""}
      ${renderAgentBridgeDiagnostics(data)}
    `;
  }

  function renderAgentDashboard(data = {}) {
    renderAgentDelegationPermission(data);

    if (agentDashboardModels) {
      const models = data.models || [];
      agentDashboardModels.innerHTML = models.length ? models.map(item => {
        const selected = item.selected || {};
        const primarySource = (item.sources || [])[0] || {};
        const available = selected.detected_available === true;
        const launchable = !available && /launch|desktop|editor|bridge/i.test(`${selected.invoke_type || ""} ${selected.detected_notes || ""}`);
        const statusText = available ? "可调用" : launchable ? "可打开需桥接" : "未连接";
        return `
          <div class="agent-dashboard-card">
            <div class="agent-dashboard-card-head">
              <strong>${escapeAttr(AGENT_MODEL_LABELS[item.agent_id] || item.agent_id)}</strong>
              <span>${escapeAttr(statusText)}</span>
              <span>${escapeAttr(sourceLabel(selected.profile_source || primarySource.source))}</span>
            </div>
            <div class="agent-dashboard-line">${escapeAttr(selected.observed_model || "unknown")}</div>
            <div class="agent-dashboard-sub">${escapeAttr(selected.provider || "unknown")} · ${escapeAttr(selected.runtime || "")}</div>
            ${launchable ? `<div class="agent-dashboard-warning">检测到桌面/编辑器入口，但还没有后台委托桥接。小白可以打开并引导授权，不能假装已经能自动执行。</div>` : ""}
            ${!available && !launchable ? `<div class="agent-dashboard-warning">这台电脑未检测到可调用入口。需要安装/启动后重新检测，或在模型设置里手动启用。</div>` : ""}
            ${selected.detected_notes ? `<div class="agent-dashboard-warning">${escapeAttr(selected.detected_notes)}</div>` : ""}
            ${selected.model_truth_note ? `<div class="agent-dashboard-warning">${escapeAttr(selected.model_truth_note)}</div>` : ""}
            ${sourceDetailLines(item)}
          </div>
        `;
      }).join("") : `<div class="settings-hint">暂无模型信息</div>`;
    }

    if (agentDashboardJobs) {
      const jobs = data.jobs || [];
      agentDashboardJobs.innerHTML = jobs.length ? jobs.map(job => {
        const running = job.status === "running";
        const waitingApproval = job.status === "pending_approval";
        return `
          <div class="agent-job-row" data-job-id="${escapeAttr(job.job_id)}">
            <div class="agent-job-head">
              <strong>${escapeAttr(AGENT_MODEL_LABELS[job.agent_id] || job.agent_id)}</strong>
              <span class="agent-job-status ${escapeAttr(job.status)}">${escapeAttr(job.status)}</span>
              <span>${escapeAttr(formatMs(job.duration_ms))}</span>
            </div>
            <div class="agent-dashboard-sub">${escapeAttr(job.job_id)}${job.retry_of ? ` · retry of ${escapeAttr(job.retry_of)}` : ""}</div>
            ${job.reassigned_from ? `<div class="agent-dashboard-sub">改派自 ${escapeAttr(job.reassigned_from)}</div>` : ""}
            ${job.approval_request_id ? `<div class="agent-dashboard-warning">等待确认：${escapeAttr(job.approval_request_id)}</div>` : ""}
            <div class="agent-job-preview">${escapeAttr(job.error || job.preview || "等待结果")}</div>
            <div class="agent-job-actions">
              <button class="settings-save-btn agent-job-cancel" type="button" ${running || waitingApproval ? "" : "disabled"}>取消</button>
              <button class="settings-save-btn agent-job-retry" type="button">重试</button>
              <select class="settings-select agent-job-reassign-target" aria-label="改派目标">
                <option value="">改派</option>
                <option value="codex">Codex</option>
                <option value="claude-code">Claude</option>
                <option value="openclaw">OpenClaw</option>
                <option value="hermes">Hermes</option>
              </select>
            </div>
          </div>
        `;
      }).join("") : `<div class="settings-hint">暂无委托任务</div>`;
    }

    if (agentApprovalRequests) {
      const approvals = data.approvals || [];
      agentApprovalRequests.innerHTML = approvals.length ? approvals.map(item => {
        const pending = item.status === "pending";
        return `
          <div class="agent-job-row" data-approval-id="${escapeAttr(item.id)}">
            <div class="agent-job-head">
              <strong>${escapeAttr(item.action || "待确认动作")}</strong>
              <span class="agent-job-status ${escapeAttr(item.status)}">${escapeAttr(item.status)}</span>
              <span>${escapeAttr(item.risk || "medium")}</span>
            </div>
            <div class="agent-dashboard-sub">${escapeAttr(item.id)} · ${escapeAttr(item.from_agent || "xiaobai")}${item.task_id ? ` · ${escapeAttr(item.task_id)}` : ""}</div>
            ${item.reason ? `<div class="agent-job-preview">${escapeAttr(item.reason)}</div>` : ""}
            ${item.impact ? `<div class="agent-dashboard-warning">${escapeAttr(item.impact)}</div>` : ""}
            ${Array.isArray(item.alternatives) && item.alternatives.length ? `<div class="agent-route-list">${item.alternatives.slice(0, 3).map(alt => `<span>${escapeAttr(alt)}</span>`).join("")}</div>` : ""}
            <div class="agent-job-actions">
              <button class="settings-save-btn agent-approval-approve" type="button" ${pending ? "" : "disabled"}>批准</button>
              <button class="settings-save-btn agent-approval-deny" type="button" ${pending ? "" : "disabled"}>拒绝</button>
            </div>
          </div>
        `;
      }).join("") : `<div class="settings-hint">暂无待确认动作。</div>`;
    }

    if (agentDashboardStats) {
      const stats = data.stats || [];
      agentDashboardStats.innerHTML = stats.length ? stats.map(stat => `
        <div class="agent-stat-row">
          <strong>${escapeAttr(AGENT_MODEL_LABELS[stat.agent_id] || stat.agent_id)}</strong>
          <span>平均 ${escapeAttr(formatMs(stat.avg_ms))}</span>
          <span>完成 ${escapeAttr(stat.completed ?? 0)}</span>
          <span>失败 ${escapeAttr(stat.failed ?? 0)}</span>
          <span>取消 ${escapeAttr(stat.cancelled ?? 0)}</span>
        </div>
      `).join("") : `<div class="settings-hint">暂无速度画像，完成几次委托后会自动生成。</div>`;
    }

    if (agentOrchestrationMemory && data.orchestration_memory) {
      renderAgentOrchestrationMemory(data.orchestration_memory);
    }
  }

  function renderAgentOrchestrationMemory(data = {}) {
    if (!agentOrchestrationMemory) return;
    const agents = Array.isArray(data.agents) ? data.agents : [];
    const lessons = Array.isArray(data.recent_lessons) ? data.recent_lessons : [];
    if (!agents.length && !lessons.length) {
      agentOrchestrationMemory.innerHTML = `<div class="settings-hint">暂无编排记忆。等小白完成几次后台 sidecar 委托后，这里会自动生成经验画像。</div>`;
      return;
    }
    agentOrchestrationMemory.innerHTML = `
      ${agents.length ? `
        <div class="agent-memory-grid">
          ${agents.map(item => {
            const success = Number.isFinite(Number(item.success_rate)) ? `${item.success_rate}%` : "—";
            const roles = Array.isArray(item.recent_roles) ? item.recent_roles.slice(0, 3).join(" · ") : "";
            return `
              <div class="agent-memory-card">
                <div class="agent-memory-head">
                  <strong>${escapeAttr(AGENT_MODEL_LABELS[item.agent_id] || item.agent_id)}</strong>
                  <span>${escapeAttr(success)}</span>
                </div>
                <div class="agent-memory-metrics">
                  <span>${escapeAttr(item.runs ?? 0)} 次</span>
                  <span>均 ${escapeAttr(formatMs(item.avg_ms))}</span>
                  <span>${escapeAttr(item.last_status || "unknown")}</span>
                </div>
                ${roles ? `<div class="agent-memory-sub">${escapeAttr(roles)}</div>` : ""}
                ${item.last_error ? `<div class="agent-memory-warning">${escapeAttr(item.last_error)}</div>` : ""}
                ${item.last_summary ? `<div class="agent-memory-summary">${escapeAttr(item.last_summary)}</div>` : ""}
              </div>
            `;
          }).join("")}
        </div>
      ` : ""}
      ${lessons.length ? `
        <div class="agent-route-subtitle">最近经验</div>
        <div class="agent-route-list">
          ${lessons.slice(-6).reverse().map(item => `<span>${escapeAttr([item.agent_id, item.status, item.lesson].filter(Boolean).join(" · "))}</span>`).join("")}
        </div>
      ` : ""}
    `;
  }

  function renderPersonalStudio(data = {}) {
    if (!agentPersonalStudio) return;
    const studio = data.personal_studio || data.execution_plan?.personal_studio || {};
    const taskBoard = data.personal_studio_task_board || data.execution_plan?.personal_studio_task_board || {};
    const team = Array.isArray(studio.team) ? studio.team : [];
    if (!team.length) {
      agentPersonalStudio.innerHTML = `<div class="settings-hint">暂无个人工作室分工。</div>`;
      return;
    }
    const lanes = Array.isArray(taskBoard.lanes) ? taskBoard.lanes : [];
    const checks = Array.isArray(taskBoard.acceptance_checks) ? taskBoard.acceptance_checks : [];
    const capturePolicy = taskBoard.skill_capture_policy || {};
    agentPersonalStudio.innerHTML = `
      <div class="agent-dashboard-card">
        <div class="agent-dashboard-card-head">
          <strong>${escapeAttr(studio.name || "小白个人 AI 工作室")}</strong>
          <span>${escapeAttr(taskBoard.activation || studio.mode || "personal_ai_studio")}</span>
        </div>
        <div class="agent-route-why">${escapeAttr(studio.principle || "角色负责判断和验收，真实执行交给工具与 Agent。")}</div>
        ${lanes.length ? `
          <div class="agent-route-subtitle">本次任务看板</div>
          <div class="agent-route-list">
            ${lanes.map(item => `<span>${escapeAttr(item.id)} · ${escapeAttr(item.owner)} · ${(item.tools || []).map(tool => escapeAttr(tool)).join(" / ")}</span>`).join("")}
          </div>
        ` : ""}
        ${checks.length ? `
          <div class="agent-route-subtitle">验收点</div>
          <div class="agent-route-list">
            ${checks.slice(0, 4).map(text => `<span>${escapeAttr(text)}</span>`).join("")}
          </div>
        ` : ""}
        <div class="agent-route-subtitle">技能沉淀</div>
        <div class="agent-route-list">
          <span>${escapeAttr(capturePolicy.mode || "record_run_only")}</span>
          <span>${escapeAttr(capturePolicy.reason || "按任务复杂度决定，不打扰简单指令")}</span>
        </div>
        <div class="agent-route-subtitle">本次编队</div>
        <div class="agent-memory-grid">
          ${team.map(item => `
            <div class="agent-memory-card">
              <div class="agent-memory-head">
                <strong>${escapeAttr(item.name || item.id)}</strong>
                <span>${escapeAttr(item.fit_score ?? "—")}</span>
              </div>
              <div class="agent-memory-sub">执行通道：${escapeAttr((item.delegatesTo || []).join(" · ") || "xiaobai")}</div>
              <div class="agent-route-list">${(item.decides || []).slice(0, 4).map(text => `<span>${escapeAttr(text)}</span>`).join("")}</div>
            </div>
          `).join("")}
        </div>
        <div class="agent-route-subtitle">审批策略</div>
        <div class="agent-route-list">
          <span>低风险：${escapeAttr(studio.approval_policy?.low || "自动执行并记录")}</span>
          <span>中风险：${escapeAttr(studio.approval_policy?.medium || "简短确认")}</span>
          <span>高风险：${escapeAttr(studio.approval_policy?.high || "必须人工确认")}</span>
        </div>
      </div>
    `;
  }

  function renderAgentRoutePlan(data = {}) {
    if (!agentRoutePlan) return;
    renderPersonalStudio(data);
    const plan = data.execution_plan || {};
    const lead = plan.lead_agent || {};
    const sidecars = Array.isArray(plan.sidecar_agents) ? plan.sidecar_agents : [];
    const checks = plan.verification?.required_checks || data.verification_contract?.required_checks || [];
    const gates = plan.approval_gates || plan.verification?.approval_required_for || [];
    const experienceHints = Array.isArray(plan.experience_hints) ? plan.experience_hints : [];
    const memoryAgents = Array.isArray(data.orchestration_memory?.agents) ? data.orchestration_memory.agents : [];
    if (!lead.agent_id) {
      agentRoutePlan.innerHTML = `<div class="settings-hint">暂无路由预案</div>`;
      return;
    }
    agentRoutePlan.innerHTML = `
      <div class="agent-route-lead">
        <div class="agent-dashboard-card-head">
          <strong>${escapeAttr(AGENT_MODEL_LABELS[lead.agent_id] || lead.agent_id)}</strong>
          <span>${escapeAttr(lead.role || "primary")}</span>
          <span>${escapeAttr(plan.routing_confidence || "unknown")}</span>
        </div>
        <div class="agent-dashboard-line">${escapeAttr(lead.model_profile_summary?.observed_model || "unknown")}</div>
        <div class="agent-dashboard-sub">延迟 ${escapeAttr(lead.expected_latency || "unknown")} · 分数 ${escapeAttr(lead.fit_score ?? "—")}${lead.experience_adjustment ? ` · 经验 ${escapeAttr(lead.experience_adjustment > 0 ? `+${lead.experience_adjustment}` : lead.experience_adjustment)}` : ""}</div>
        ${lead.experience_reason ? `<div class="agent-route-why">${escapeAttr(lead.experience_reason)}</div>` : ""}
        <div class="agent-route-why">${escapeAttr(lead.why || "")}</div>
      </div>
      <div class="agent-route-subtitle">侧翼 Agent</div>
      ${sidecars.length ? sidecars.map(item => `
        <div class="agent-route-sidecar">
          <strong>${escapeAttr(AGENT_MODEL_LABELS[item.agent_id] || item.agent_id)}</strong>
          <span>${escapeAttr(item.role || "")}</span>
          <em>${escapeAttr(`${item.expected_latency || "unknown"}${item.experience_adjustment ? ` ${item.experience_adjustment > 0 ? "+" : ""}${item.experience_adjustment}` : ""}`)}</em>
          <div>${escapeAttr(item.when || "")}</div>
          ${item.experience_reason ? `<div>${escapeAttr(item.experience_reason)}</div>` : ""}
          ${item.async_guidance ? `<div>${escapeAttr(item.async_guidance)}</div>` : ""}
        </div>
      `).join("") : `<div class="settings-hint">当前任务不需要侧翼 Agent。</div>`}
      <div class="agent-route-subtitle">验收</div>
      <div class="agent-route-list">${checks.slice(0, 4).map(item => `<span>${escapeAttr(item)}</span>`).join("") || `<span>按任务结果做本地验证</span>`}</div>
      <div class="agent-route-subtitle">经验提示</div>
      <div class="agent-route-list">${
        experienceHints.length
          ? experienceHints.slice(0, 4).map(item => `<span>${escapeAttr(item)}</span>`).join("")
          : memoryAgents.length
            ? memoryAgents.slice(0, 4).map(item => `<span>${escapeAttr(`${AGENT_MODEL_LABELS[item.agent_id] || item.agent_id}：成功率 ${item.success_rate ?? "—"}%，平均 ${formatMs(item.avg_ms)}，最近 ${item.last_status || "unknown"}`)}</span>`).join("")
            : `<span>暂无真实编排经验，先按模型画像和任务意图路由。</span>`
      }</div>
      <div class="agent-route-subtitle">必须先问你</div>
      <div class="agent-route-list">${gates.slice(0, 4).map(item => `<span>${escapeAttr(item)}</span>`).join("")}</div>
    `;
  }

  async function loadAgentRoutePlan({ quiet = false } = {}) {
    if (!agentRoutePlan) return;
    try {
      const res = await fetch(`${API}/capability-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "把 Codex、Claude Code、OpenClaw 的技能适配到小白，让小白根据任务自动选择最佳能力",
          max_skills: 6,
        }),
      });
      const data = await res.json();
      renderAgentRoutePlan(data);
      if (!quiet) showFeedback(agentDashboardFeedback, "已刷新");
    } catch (err) {
      agentRoutePlan.innerHTML = `<div class="settings-hint">路由预案读取失败</div>`;
      if (!quiet) showFeedback(agentDashboardFeedback, err?.message || "读取失败", true);
    }
  }

  async function loadAgentDashboard({ quiet = false } = {}) {
    if (!agentDashboardModels && !agentDashboardJobs && !agentDashboardStats) return;
    try {
      const data = await fetch(`${API}/agent-delegations`).then(r => r.json());
      renderAgentDashboard(data);
      if (!quiet) showFeedback(agentDashboardFeedback, "已刷新");
    } catch {
      if (!quiet) showFeedback(agentDashboardFeedback, "读取失败", true);
    }
  }
  refreshAgentDashboard = loadAgentDashboard;

  async function refreshLocalAgentDetection({ quiet = false } = {}) {
    if (agentDetectRefreshBtn) agentDetectRefreshBtn.disabled = true;
    try {
      if (!quiet) showFeedback(agentDashboardFeedback, "正在重新检测本机 Agent...");
      const res = await fetch(`${API}/agents/refresh`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "检测失败");
      await refreshAgentControlPlane({ quiet: true });
      if (!quiet) showFeedback(agentDashboardFeedback, `检测完成：${data.available_count || 0} 个可调用`);
      return data;
    } catch (err) {
      if (!quiet) showFeedback(agentDashboardFeedback, err?.message || "检测失败", true);
      return { ok: false, error: err?.message || "检测失败" };
    } finally {
      if (agentDetectRefreshBtn) agentDetectRefreshBtn.disabled = false;
    }
  }

  async function connectLocalAgents() {
    if (!agentConnectLocalBtn) return;
    agentConnectLocalBtn.disabled = true;
    const oldText = agentConnectLocalBtn.textContent;
    agentConnectLocalBtn.textContent = "检测中";
    setAgentConnectStatus("正在检测本机 Agent 和可用桥接...", "running");
    setAgentSmokeState({
      status: "starting",
      startedAt: new Date().toISOString(),
      jobs: [],
      collected: [],
      errors: [],
    });
    try {
      await refreshLocalAgentDetection({ quiet: true });
      agentConnectLocalBtn.textContent = "连接中";
      setAgentConnectStatus("正在连接并验证可委托 Agent...", "running");
      const res = await fetch(`${API}/agent-delegations/connect-local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          include_openclaw: false,
          include_hermes: false,
          smoke_test: true,
          max_smoke_agents: 2,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        if (data.connected?.length || data.manual?.length) {
          setAgentConnectStatus(data, data.connected?.length ? "partial" : "warning");
        }
        throw new Error(data.error || data.message || "连接失败");
      }
      if (data.dashboard) renderAgentDashboard(data.dashboard);
      setAgentConnectStatus(data, data.manual?.length ? "partial" : "ok");
      const jobs = Array.isArray(data.smoke?.jobs) ? data.smoke.jobs : [];
      setAgentSmokeState({
        status: jobs.length ? "polling" : "completed",
        jobs,
        errors: Array.isArray(data.smoke?.errors) ? data.smoke.errors : [],
      });
      showFeedback(agentDashboardFeedback, data.message || "本机 Agent 已连接");
      await refreshAgentControlPlane({ quiet: true });
      if (jobs.length) {
        const smokeFastMode = /^(1|true|yes)$/i.test(String(window.__XIAOBAI_SMOKE_FAST__ || ""));
        const pollCount = smokeFastMode ? 2 : 4;
        for (let i = 0; i < pollCount; i += 1) {
          await new Promise(resolve => setTimeout(resolve, smokeFastMode ? 150 : (i < 2 ? 2500 : 5000)));
          await collectAgentSidecarResults({ quiet: true });
          await refreshAgentControlPlane({ quiet: true });
        }
        setAgentSmokeState({ status: "completed" });
      }
    } catch (err) {
      if (agentConnectStatus?.dataset.state === "running") {
        setAgentConnectStatus(err?.message || "连接失败", "error");
      }
      setAgentSmokeState({
        status: "failed",
        errors: [...agentSmokeState.errors, { error: err?.message || "连接失败" }],
      });
      showFeedback(agentDashboardFeedback, err?.message || "连接失败", true);
    } finally {
      agentConnectLocalBtn.disabled = false;
      agentConnectLocalBtn.textContent = oldText || "连接与检测";
    }
  }

  async function loadAgentOrchestrationMemory({ quiet = false } = {}) {
    if (!agentOrchestrationMemory) return;
    try {
      const data = await fetch(`${API}/agent-orchestration-memory?max=40`).then(r => r.json());
      renderAgentOrchestrationMemory(data);
      if (!quiet) showFeedback(agentDashboardFeedback, "已刷新");
    } catch {
      agentOrchestrationMemory.innerHTML = `<div class="settings-hint">编排记忆读取失败</div>`;
      if (!quiet) showFeedback(agentDashboardFeedback, "读取失败", true);
    }
  }

  async function refreshAgentControlPlane({ quiet = false } = {}) {
    await Promise.allSettled([
      loadAgentDashboard({ quiet: true }),
      loadAgentModelSettings(),
      loadAgentRoutePlan({ quiet: true }),
      loadAgentOrchestrationMemory({ quiet: true }),
    ]);
    if (!quiet) showFeedback(agentDashboardFeedback, "已刷新");
  }

  async function collectAgentSidecarResults({ quiet = true } = {}) {
    try {
      const res = await fetch(`${API}/agent-sidecar-results/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max: 6, consume: true, include_output: false }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "收集失败");
      if (Array.isArray(data.results) && data.results.length) {
        const seen = new Set(agentSmokeState.collected.map(item => item.job_id).filter(Boolean));
        const merged = [...agentSmokeState.collected];
        for (const item of data.results) {
          if (item.job_id && seen.has(item.job_id)) continue;
          merged.push(item);
          if (item.job_id) seen.add(item.job_id);
        }
        setAgentSmokeState({ collected: merged, status: "polling" });
      } else {
        setAgentSmokeState({});
      }
      if (!quiet && data.count) showFeedback(agentDashboardFeedback, `已收集 ${data.count} 条结果`);
      return data;
    } catch (err) {
      if (!quiet) showFeedback(agentDashboardFeedback, err?.message || "收集失败", true);
      return { ok: false, error: err?.message || "收集失败" };
    }
  }

  async function startAgentSmokeLoop() {
    if (!agentSmokeTestBtn) return;
    agentSmokeTestBtn.disabled = true;
    const oldText = agentSmokeTestBtn.textContent;
    agentSmokeTestBtn.textContent = "测试中";
    setAgentSmokeState({
      status: "starting",
      startedAt: new Date().toISOString(),
      jobs: [],
      collected: [],
      errors: [],
    });
    try {
      const res = await fetch(`${API}/agent-delegations/smoke-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          include_openclaw: true,
          include_hermes: false,
          working_dir: "",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || data.hint || "闭环测试启动失败");
      const jobCount = Array.isArray(data.jobs) ? data.jobs.length : 0;
      setAgentSmokeState({
        status: "polling",
        jobs: Array.isArray(data.jobs) ? data.jobs : [],
        errors: Array.isArray(data.errors) ? data.errors : [],
      });
      showFeedback(agentDashboardFeedback, jobCount ? `已启动 ${jobCount} 个测试任务` : "测试已提交");
      await refreshAgentControlPlane({ quiet: true });
      const smokeFastMode = /^(1|true|yes)$/i.test(String(window.__XIAOBAI_SMOKE_FAST__ || ""));
      const pollCount = smokeFastMode ? 2 : 8;
      for (let i = 0; i < pollCount; i += 1) {
        await new Promise(resolve => setTimeout(resolve, smokeFastMode ? 150 : (i < 3 ? 2500 : 5000)));
        await collectAgentSidecarResults({ quiet: true });
        await refreshAgentControlPlane({ quiet: true });
      }
      setAgentSmokeState({ status: "completed" });
      showFeedback(agentDashboardFeedback, "闭环测试已刷新");
    } catch (err) {
      setAgentSmokeState({
        status: "failed",
        errors: [...agentSmokeState.errors, { error: err?.message || "闭环测试失败" }],
      });
      showFeedback(agentDashboardFeedback, err?.message || "闭环测试失败", true);
    } finally {
      agentSmokeTestBtn.disabled = false;
      agentSmokeTestBtn.textContent = oldText || "闭环测试";
    }
  }

  function formatEvolutionTime(value) {
    if (!value) return "从未运行";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  }

  function renderEvolutionStatus(data = {}) {
    agentEvolutionEnabled = data.enabled === true;
    const autopilot = data.autopilot || {};
    agentEvolutionAutoApplyLowRisk = autopilot.auto_apply_low_risk !== false;
    if (agentEvolutionToggleBtn) {
      agentEvolutionToggleBtn.textContent = agentEvolutionEnabled ? "暂停自我进化" : "开启自我进化";
    }
    if (agentEvolutionAutoApplyToggleBtn) {
      agentEvolutionAutoApplyToggleBtn.textContent = agentEvolutionAutoApplyLowRisk ? "低风险自动接入：开" : "低风险自动接入：关";
    }
    if (agentEvolutionStatus) {
      const mode = agentEvolutionEnabled ? "已开启" : "已暂停";
      const interval = data.min_interval_hours || 12;
      const autoMode = autopilot.enabled ? "自动闭环已开启" : "自动闭环已暂停";
      const autoLast = formatEvolutionTime(autopilot.last_run_at);
      const autoNext = autopilot.next_run_after ? ` · 下次最早 ${formatEvolutionTime(autopilot.next_run_after)}` : "";
      const autoBlocked = autopilot.speed_guard?.blocked_reason ? ` · 当前保护：${autopilot.speed_guard.blocked_reason}` : "";
      const lastResult = autopilot.last_result || {};
      const lastLine = lastResult.status
        ? `最近闭环：${lastResult.status}${lastResult.proposal_id ? ` · ${lastResult.proposal_id}` : ""}${lastResult.duration_ms ? ` · ${lastResult.duration_ms}ms` : ""}`
        : "最近闭环：还没有运行";
      agentEvolutionStatus.innerHTML = `
        <div><strong>${escapeAttr(mode)}</strong> · 空闲间隔 ${escapeAttr(interval)} 小时 · 上次研究 ${escapeAttr(formatEvolutionTime(data.last_at))}</div>
        <div><strong>${escapeAttr(autoMode)}</strong> · 每 ${escapeAttr(autopilot.min_interval_minutes || 180)} 分钟空闲检查 · 上次闭环 ${escapeAttr(autoLast)}${escapeAttr(autoNext)}${escapeAttr(autoBlocked)}</div>
        <div class="agent-route-list">
          <span>用户消息优先</span>
          <span>任务进行中跳过</span>
          <span>${escapeAttr(agentEvolutionAutoApplyLowRisk ? "低风险自动整理方案" : "只生成待确认方案")}</span>
          <span>${escapeAttr(lastLine)}</span>
        </div>
        <div class="agent-dashboard-warning">${escapeAttr(data.safety_gate || "只做公开研究、总结、写记忆和路线建议；不会自动改代码。")}</div>
      `;
    }
  }

  function renderEvolutionProposal(data = {}) {
    if (!agentEvolutionProposal) return;
    agentEvolutionProposalReady = false;
    if (!data || data.ok === false) {
      agentEvolutionProposal.innerHTML = `<div class="settings-hint">更新提案生成失败</div>`;
      return;
    }
    agentEvolutionProposalId = data.proposal_id || data.proposalId || agentEvolutionProposalId || "";
    const changes = Array.isArray(data.changes) ? data.changes : [];
    const selected = data.selected_candidate || {};
    const slices = Array.isArray(data.implementation_slices) ? data.implementation_slices : [];
    const packageInfo = data.patch_package || {};
    const validation = Array.isArray(data.validation_plan) ? data.validation_plan : [];
    const gates = Array.isArray(data.approval_gates) ? data.approval_gates : [];
    const safety = Array.isArray(data.safety) ? data.safety : [];
    const readableSignals = selected.signals || [];
    const readableAreas = selected.areas || [];
    const benefitItems = [
      selected.repo ? `吸收 ${selected.repo} 的公开 Agent 设计信号。` : "把公开研究结果整理成小白自己的能力路线。",
      readableAreas.includes("routing") ? "让小白更会判断任务应该自己做、交给 Codex、交给桌面 Agent，还是先问用户。" : "",
      readableAreas.includes("verification") ? "把验证、预检、失败回滚做成固定步骤，减少改完才发现问题。" : "",
      readableAreas.includes("mcp_tools") ? "为后续接入更多 MCP 工具和外部能力留下统一入口。" : "",
      readableAreas.includes("secret_safety") || readableSignals.includes("credential-risk") ? "加强密钥、账号、浏览器资料和私有记忆的隔离提醒。" : "",
    ].filter(Boolean);
    const riskItems = [
      "这不是直接安装外部项目，只会吸收公开思路并生成小白自己的实现记录。",
      "批准后会修改本地核心文件；必须先备份，失败要按回滚提示处理。",
      "安装版 app.asar 不能热写核心代码，需要在源码里应用并通过新版安装包更新。",
    ];

    if (!selected.repo && !slices.length) {
      agentEvolutionProposal.innerHTML = `
        <div class="agent-update-proposal-head">
          <strong>还没有可批准的进化方案</strong>
          <span>${escapeAttr(data.mode || "proposal_only")}</span>
        </div>
        <div class="agent-dashboard-warning">${escapeAttr(data.next_action || "先运行一次公开技能深读研究。")}</div>
        <div class="agent-route-subtitle">下一步</div>
        <div class="agent-route-list"><span>点“研究并生成方案”，小白会先研究公开项目，再把可学内容整理成可批准方案。</span></div>
      `;
      return;
    }

    agentEvolutionProposalReady = Boolean(data.proposal_id && selected.repo && slices.length);

    agentEvolutionProposal.innerHTML = `
      <div class="agent-update-proposal-head">
        <strong>这次小白想学习什么</strong>
        <span>${escapeAttr(selected.repo || "公开 Agent 项目")}</span>
        <em>${escapeAttr(formatEvolutionTime(data.created_at))}</em>
      </div>
      <div class="agent-dashboard-line">${escapeAttr(selected.repo || "未选择候选")}</div>
      ${selected.url ? `<div class="agent-dashboard-sub">${escapeAttr(selected.url)}</div>` : ""}
      <div class="agent-route-subtitle">能带来的好处</div>
      <div class="agent-route-list">${benefitItems.map(item => `<span>${escapeAttr(item)}</span>`).join("")}</div>
      <div class="agent-route-subtitle">可能的坏处和边界</div>
      <div class="agent-route-list">${riskItems.map(item => `<span>${escapeAttr(item)}</span>`).join("")}</div>
      <div class="agent-route-subtitle">这次准备怎么进化</div>
      ${slices.length ? slices.map(slice => `
        <div class="agent-update-slice">
          <div class="agent-dashboard-card-head">
            <strong>${escapeAttr(slice.title || slice.id)}</strong>
            <span>${escapeAttr(slice.risk_level || "low")}</span>
          </div>
          <div class="agent-route-why">${escapeAttr(slice.patch_intent || "")}</div>
          <div class="agent-route-subtitle">目标文件</div>
          <div class="agent-route-list">${(slice.target_files || []).slice(0, 8).map(file => `<span>${escapeAttr(file)}</span>`).join("") || `<span>暂无</span>`}</div>
        </div>
      `).join("") : `<div class="settings-hint">暂无实现切片</div>`}
      <div class="agent-route-subtitle">批准后会先做什么</div>
      <div class="agent-route-list">
        <span>自动预检补丁包</span>
        <span>自动带上内部批准令牌，不需要你手输密钥</span>
        <span>通过预检才应用；不通过就只显示失败原因</span>
      </div>
      <div class="agent-route-subtitle">验证方式</div>
      <div class="agent-route-list">${validation.slice(0, 8).map(cmd => `<span>${escapeAttr(cmd)}</span>`).join("") || `<span>npm.cmd run build</span>`}</div>
      <div class="agent-route-subtitle">安全边界</div>
      <div class="agent-route-list">${safety.slice(0, 5).map(item => `<span>${escapeAttr(item)}</span>`).join("")}</div>
      <div class="agent-update-actions">
        <button class="settings-save-btn agent-evolution-approve" type="button">批准进化</button>
        <button class="settings-save-btn agent-evolution-reject" type="button">拒绝</button>
      </div>
      <div class="agent-dashboard-sub">${escapeAttr(data.next_action || "")}</div>
    `;
  }

  async function loadEvolutionStatus({ quiet = false } = {}) {
    if (!agentEvolutionStatus && !agentEvolutionToggleBtn) return;
    try {
      const data = await fetch(`${API}/evolution`).then(r => r.json());
      renderEvolutionStatus(data);
      if (!quiet) showFeedback(agentEvolutionFeedback, "已读取");
    } catch (err) {
      if (agentEvolutionStatus) agentEvolutionStatus.textContent = "自我进化状态读取失败";
      if (!quiet) showFeedback(agentEvolutionFeedback, err?.message || "读取失败", true);
    }
  }

  async function setEvolutionEnabled(enabled) {
    if (agentEvolutionToggleBtn) agentEvolutionToggleBtn.disabled = true;
    try {
      const res = await fetch(`${API}/evolution/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "保存失败");
      renderEvolutionStatus(data);
      showFeedback(agentEvolutionFeedback, enabled ? "自我进化已开启" : "自我进化已暂停");
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "保存失败", true);
    } finally {
      if (agentEvolutionToggleBtn) agentEvolutionToggleBtn.disabled = false;
    }
  }

  async function setEvolutionAutoApplyLowRisk(enabled) {
    if (agentEvolutionAutoApplyToggleBtn) agentEvolutionAutoApplyToggleBtn.disabled = true;
    try {
      const res = await fetch(`${API}/evolution/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_apply_low_risk: enabled }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "保存失败");
      renderEvolutionStatus(data);
      showFeedback(agentEvolutionFeedback, enabled ? "低风险自动接入已开启" : "低风险自动接入已关闭");
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "保存失败", true);
    } finally {
      if (agentEvolutionAutoApplyToggleBtn) agentEvolutionAutoApplyToggleBtn.disabled = false;
    }
  }

  async function runEvolutionResearchNow() {
    if (agentEvolutionRunBtn) agentEvolutionRunBtn.disabled = true;
    try {
      showFeedback(agentEvolutionFeedback, "正在研究公开功能和代码逻辑...");
      const res = await fetch(`${API}/evolution/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ write_memory: true, max_sources: 4 }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "研究失败");
      if (data.settings) renderEvolutionStatus(data.settings);
      showFeedback(agentEvolutionFeedback, "已写入进化记忆");
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "研究失败", true);
    } finally {
      if (agentEvolutionRunBtn) agentEvolutionRunBtn.disabled = false;
    }
  }

  async function runEvolutionAutopilotNow() {
    if (agentEvolutionAutopilotRunBtn) agentEvolutionAutopilotRunBtn.disabled = true;
    try {
      showFeedback(agentEvolutionFeedback, "正在空闲保护下跑自动闭环...");
      const res = await fetch(`${API}/evolution/autopilot/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true, reason: "ui_manual" }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "自动闭环失败");
      await loadEvolutionStatus({ quiet: true });
      if (data.proposal_id) {
        renderEvolutionProposal({
          ok: true,
          proposal_id: data.proposal_id,
          mode: data.status || "autopilot",
          created_at: new Date().toISOString(),
          patch_package: { staging_dir: data.package_dir || "" },
          changes: data.dry_run?.validation || [],
          validation_plan: [],
          approval_gates: data.required_approval ? [data.required_approval] : [],
          safety: ["用户消息和前台任务优先；自动闭环不会构建、发布、推送或发送外部消息。"],
          next_action: data.next_action || "",
        });
      }
      showFeedback(agentEvolutionFeedback, data.status === "low_risk_applied" ? "低风险能力已自动接入" : "自动闭环已完成，风险项等待确认");
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "自动闭环失败", true);
    } finally {
      if (agentEvolutionAutopilotRunBtn) agentEvolutionAutopilotRunBtn.disabled = false;
    }
  }

  async function runEvolutionProposalNow() {
    if (agentEvolutionProposalBtn) agentEvolutionProposalBtn.disabled = true;
    try {
      showFeedback(agentEvolutionFeedback, "正在研究公开项目并生成进化方案...");
      await fetch(`${API}/evolution/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ write_memory: true, max_sources: 4, topic: "github_skill_radar" }),
      }).catch(() => null);
      const res = await fetch(`${API}/evolution/self-update-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "让小白从公开 Agent 技能深读结果生成一个核心代码外的自我更新补丁提案，包含备份、验证和审批门",
          max_candidates: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "生成提案失败");
      renderEvolutionProposal(data);
      showFeedback(agentEvolutionFeedback, data.selected_candidate?.repo ? "已生成进化方案，请确认批准或拒绝" : "还没找到可吸收候选，请稍后再研究一次");
    } catch (err) {
      if (agentEvolutionProposal) agentEvolutionProposal.innerHTML = `<div class="settings-hint">更新提案生成失败</div>`;
      showFeedback(agentEvolutionFeedback, err?.message || "生成提案失败", true);
    } finally {
      if (agentEvolutionProposalBtn) agentEvolutionProposalBtn.disabled = false;
    }
  }

  function getCurrentEvolutionProposalId() {
    const typed = String(agentEvolutionApprovalInput?.value || "").trim();
    const fromTyped = typed.match(/^APPROVE_SELF_UPDATE:([a-zA-Z0-9_-]+)$/)?.[1];
    return fromTyped || agentEvolutionProposalId || "";
  }

  async function runEvolutionDryRunNow() {
    const proposalId = getCurrentEvolutionProposalId();
    if (!proposalId) {
      showFeedback(agentEvolutionFeedback, "请先生成更新提案", true);
      return null;
    }
    if (agentEvolutionDryRunBtn) agentEvolutionDryRunBtn.disabled = true;
    try {
      showFeedback(agentEvolutionFeedback, "正在预检补丁包...");
      const res = await fetch(`${API}/evolution/self-update-dry-run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: proposalId }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "预检失败");
      if (agentEvolutionApprovalInput && data.required_approval) {
        agentEvolutionApprovalInput.placeholder = data.required_approval;
      }
      if (agentEvolutionProposal) {
        agentEvolutionProposal.insertAdjacentHTML("afterbegin", `
          <div class="agent-update-slice">
            <div class="agent-dashboard-card-head"><strong>dry-run</strong><span>${escapeAttr(data.change_count || 0)} changes</span></div>
            <div class="agent-route-list">${(data.touched_files || []).map(file => `<span>${escapeAttr(file)}</span>`).join("")}</div>
            <div class="agent-dashboard-warning">批准口令：${escapeAttr(data.required_approval || "")}</div>
          </div>
        `);
      }
      showFeedback(agentEvolutionFeedback, "预检通过，可以输入批准口令接入");
      return data;
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "预检失败", true);
      return null;
    } finally {
      if (agentEvolutionDryRunBtn) agentEvolutionDryRunBtn.disabled = false;
    }
  }

  async function applyEvolutionPatchNow() {
    const proposalId = getCurrentEvolutionProposalId();
    const approval = `APPROVE_SELF_UPDATE:${proposalId}`;
    if (!proposalId || !agentEvolutionProposalReady) {
      showFeedback(agentEvolutionFeedback, "请先生成可批准的进化方案", true);
      return;
    }
    if (agentEvolutionApplyBtn) agentEvolutionApplyBtn.disabled = true;
    try {
      showFeedback(agentEvolutionFeedback, "正在预检、备份并接入...");
      const dryRun = await runEvolutionDryRunNow();
      if (!dryRun?.ok) throw new Error(dryRun?.error || "预检未通过");
      const res = await fetch(`${API}/evolution/self-update-apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: proposalId, approval }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "接入失败");
      if (agentEvolutionProposal) {
        agentEvolutionProposal.insertAdjacentHTML("afterbegin", `
          <div class="agent-update-slice">
            <div class="agent-dashboard-card-head"><strong>applied</strong><span>${escapeAttr(data.applied_count || 0)} files</span></div>
            <div class="agent-route-list">${(data.applied || []).map(item => `<span>${escapeAttr(item.target || "")}</span>`).join("")}</div>
            <div class="agent-dashboard-warning">备份目录：${escapeAttr(data.backup_dir || "")}</div>
            <div class="agent-dashboard-sub">${escapeAttr(data.next_action || "")}</div>
          </div>
        `);
      }
      showFeedback(agentEvolutionFeedback, "已接入补丁，请运行验证");
    } catch (err) {
      showFeedback(agentEvolutionFeedback, err?.message || "接入失败", true);
    } finally {
      if (agentEvolutionApplyBtn) agentEvolutionApplyBtn.disabled = false;
    }
  }

  function rejectEvolutionProposalNow() {
    agentEvolutionProposalReady = false;
    agentEvolutionProposalId = "";
    if (agentEvolutionProposal) {
      agentEvolutionProposal.innerHTML = `
        <div class="agent-update-proposal-head">
          <strong>已拒绝这次进化方案</strong>
          <span>不会修改小白核心代码</span>
        </div>
        <div class="settings-hint">你可以稍后重新研究并生成新的方案。</div>
      `;
    }
    showFeedback(agentEvolutionFeedback, "已拒绝");
  }

  async function postAgentDashboardAction(path, jobId, extra = {}) {
    if (!jobId) return;
    try {
      const res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || "操作失败");
      showFeedback(agentDashboardFeedback, path.includes("cancel") ? "已取消" : path.includes("reassign") ? "已改派" : "已重试");
      loadAgentDashboard({ quiet: true });
    } catch (err) {
      showFeedback(agentDashboardFeedback, err?.message || "操作失败", true);
    }
  }

  async function setAgentDelegationPermission(allowed) {
    try {
      showFeedback(agentDashboardFeedback, allowed ? "正在开启委托..." : "正在关闭委托...");
      const res = await fetch(`${API}/agent-delegations/permission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allowed,
          note: allowed
            ? "Owner approved Xiaobai local agent delegation from settings."
            : "Owner denied or disabled Xiaobai local agent delegation from settings.",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "保存失败");
      if (data.dashboard) renderAgentDashboard(data.dashboard);
      await refreshAgentControlPlane({ quiet: true });
      showFeedback(agentDashboardFeedback, allowed ? "已批准，小白可以分派低风险子任务" : "已关闭委托");
    } catch (err) {
      showFeedback(agentDashboardFeedback, err?.message || "保存失败", true);
    }
  }

  async function resolveApprovalFromUI(approvalId, decision) {
    if (!approvalId) return;
    const defaultScope = decision === "denied"
      ? "不允许执行该动作"
      : "只允许执行本次请求里描述的动作，不允许扩大到删除、提交、推送、部署、发外部消息、输入密钥或修改系统权限";
    const scope = decision === "modified"
      ? window.prompt("写清楚允许的范围和限制：", defaultScope)
      : defaultScope;
    if (scope === null) return;
    try {
      const res = await fetch(`${API}/approvals/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approvalId,
          decision,
          scope,
          owner_message: scope,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "审批失败");
      await refreshAgentControlPlane({ quiet: true });
      showFeedback(agentDashboardFeedback, decision === "denied" ? "已拒绝" : "已批准并继续");
    } catch (err) {
      showFeedback(agentDashboardFeedback, err?.message || "审批失败", true);
    }
  }

  async function loadSettings() {
    try {
      const data = await fetch(`${API}/settings`).then(r => r.json());
      const { llm, minimax, providers } = data;
      if (providers) cachedProviders = providers;
      refreshConfigSummary({ llm, minimax });
      populateProviderSelect(providers, llm.provider || "auto");
      if (providerSelect && llm.provider) providerSelect.value = llm.provider;
      applyCustomProviderUI(llm);
      if (llm.provider !== "custom") populateModelSelect(llm.models, llm.model);
      // 同步 temperature 滑块
      if (typeof llm.temperature === "number" && tempSlider) {
        tempSlider.value = String(llm.temperature);
        if (tempVal) tempVal.textContent = llm.temperature.toFixed(2);
      }
      loadAgentModelSettings();
    } catch {}
  }

  // ── 社交媒体 ──
  const SOCIAL_FIELD_MAP = {
    "social-discord-token":  "DISCORD_BOT_TOKEN",
    "social-feishu-appid":   "FEISHU_APP_ID",
    "social-feishu-secret":  "FEISHU_APP_SECRET",
    "social-feishu-token":   "FEISHU_VERIFICATION_TOKEN",
    "social-wechat-appid":   "WECHAT_OFFICIAL_APP_ID",
    "social-wechat-secret":  "WECHAT_OFFICIAL_APP_SECRET",
    "social-wechat-token":   "WECHAT_OFFICIAL_TOKEN",
    "social-wecom-botkey":   "WECOM_BOT_KEY",
    "social-wecom-token":    "WECOM_INCOMING_TOKEN",
  };

  const SOCIAL_PLATFORM_STATUS = {
    "social-status-discord": ["DISCORD_BOT_TOKEN"],
    "social-status-feishu":  ["FEISHU_APP_ID", "FEISHU_APP_SECRET", "FEISHU_VERIFICATION_TOKEN"],
    "social-status-wechat":  ["WECHAT_OFFICIAL_APP_ID", "WECHAT_OFFICIAL_APP_SECRET", "WECHAT_OFFICIAL_TOKEN"],
    "social-status-wecom":   ["WECOM_BOT_KEY", "WECOM_INCOMING_TOKEN"],
  };

  async function loadSocialSettings() {
    try {
      const { social } = await fetch(`${API}/settings/social`).then(r => r.json());
      for (const [statusId, keys] of Object.entries(SOCIAL_PLATFORM_STATUS)) {
        const el = document.getElementById(statusId);
        if (!el) continue;
        const configuredCount = keys.filter(k => social[k]?.configured).length;
        if (configuredCount === keys.length) {
          el.textContent = "● 已配置";
          el.className = "settings-platform-status ok";
        } else if (configuredCount > 0) {
          el.textContent = `● 部分配置 (${configuredCount}/${keys.length})`;
          el.className = "settings-platform-status miss";
        } else {
          el.textContent = "○ 未配置";
          el.className = "settings-platform-status miss";
        }
      }
    } catch {}
  }

  // ── 安全沙箱 ──
  const fileSandboxToggle = document.getElementById("security-file-sandbox");
  const execSandboxToggle = document.getElementById("security-exec-sandbox");
  const saveSecurityBtn   = document.getElementById("settings-save-security");
  const securityFeedback  = document.getElementById("settings-security-feedback");

  async function loadSecuritySettings() {
    try {
      const { security } = await fetch(`${API}/settings/security`).then(r => r.json());
      if (fileSandboxToggle) fileSandboxToggle.checked = security.fileSandbox !== false;
      if (execSandboxToggle) execSandboxToggle.checked = security.execSandbox !== false;
      document.querySelectorAll(".security-blocked-tool").forEach(cb => {
        cb.checked = (security.blockedTools || []).includes(cb.value);
      });
    } catch {}
  }

  if (saveSecurityBtn) {
    saveSecurityBtn.addEventListener("click", async () => {
      const blockedTools = [...document.querySelectorAll(".security-blocked-tool")]
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      const body = {
        fileSandbox: fileSandboxToggle ? fileSandboxToggle.checked : true,
        execSandbox: execSandboxToggle ? execSandboxToggle.checked : true,
        blockedTools,
      };
      saveSecurityBtn.disabled = true;
      try {
        const res = await fetch(`${API}/settings/security`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.ok) {
          showFeedback(securityFeedback, "已保存，立即生效");
        } else {
          showFeedback(securityFeedback, data.error || "保存失败", true);
        }
      } catch {
        showFeedback(securityFeedback, "请求失败", true);
      } finally {
        saveSecurityBtn.disabled = false;
      }
    });
  }

  if (saveSocialBtn) {
    saveSocialBtn.addEventListener("click", async () => {
      const updates = {};
      for (const [fieldId, envKey] of Object.entries(SOCIAL_FIELD_MAP)) {
        const val = document.getElementById(fieldId)?.value?.trim() || "";
        if (val) updates[envKey] = val;
      }
      saveSocialBtn.disabled = true;
      try {
        const res = await fetch(`${API}/settings/social`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (data.ok) {
          showFeedback(socialFeedback, "已保存");
          // 清空输入框并刷新状态指示
          Object.keys(SOCIAL_FIELD_MAP).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
          });
          loadSocialSettings();
        } else {
          showFeedback(socialFeedback, data.error || "保存失败", true);
        }
      } catch {
        showFeedback(socialFeedback, "请求失败", true);
      } finally {
        saveSocialBtn.disabled = false;
      }
    });
  }

  // ── temperature 滑块 ──
  if (tempSlider && tempVal) {
    tempSlider.addEventListener("input", () => {
      tempVal.textContent = parseFloat(tempSlider.value).toFixed(2);
    });
  }
  if (saveTempBtn) {
    saveTempBtn.addEventListener("click", async () => {
      const temperature = parseFloat(tempSlider?.value ?? "0.5");
      saveTempBtn.disabled = true;
      try {
        const res = await fetch(`${API}/settings/temperature`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ temperature }),
        });
        const data = await res.json();
        if (data.ok) {
          showFeedback(tempFeedback, `已设置 ${data.temperature.toFixed(2)}`);
        } else {
          showFeedback(tempFeedback, data.error || "保存失败", true);
        }
      } catch { showFeedback(tempFeedback, "请求失败", true); }
      finally { saveTempBtn.disabled = false; }
    });
  }

  feishuDiagnoseBtn?.addEventListener("click", async () => {
    feishuDiagnoseBtn.disabled = true;
    try {
      showFeedback(feishuDiagnoseFeedback, "正在诊断...");
      const res = await fetch(`${API}/social/feishu/diagnose`);
      const data = await res.json();
      const lines = [
        `config: ${data.config_exists ? "ok" : "missing"}`,
        `channel: ${data.channel_configured ? "ok" : "missing"}`,
        `script: ${data.read_script_exists ? "ok" : "missing"}`,
        data.chat_id ? `chat: ${data.chat_id}` : "",
        data.output ? `output: ${String(data.output).slice(-300)}` : "",
        data.error ? `error: ${data.error}` : "",
        data.hint ? `hint: ${data.hint}` : "",
      ].filter(Boolean);
      if (feishuDiagnoseResult) feishuDiagnoseResult.textContent = lines.join(" · ");
      showFeedback(feishuDiagnoseFeedback, data.ok ? "飞书读取正常" : "飞书需要修复", !data.ok);
    } catch (err) {
      if (feishuDiagnoseResult) feishuDiagnoseResult.textContent = err?.message || "诊断失败";
      showFeedback(feishuDiagnoseFeedback, err?.message || "诊断失败", true);
    } finally {
      feishuDiagnoseBtn.disabled = false;
    }
  });

  saveAgentModelsBtn?.addEventListener("click", async () => {
    saveAgentModelsBtn.disabled = true;
    try {
      const res = await fetch(`${API}/settings/agent-models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: collectAgentModelOverrides() }),
      });
      const data = await res.json();
      if (data.ok) {
        renderAgentModelSettings(data.profiles || [], data.overrides || {});
        showFeedback(agentModelsFeedback, "已保存，路由立即生效");
      } else {
        showFeedback(agentModelsFeedback, data.error || "保存失败", true);
      }
    } catch {
      showFeedback(agentModelsFeedback, "请求失败", true);
    } finally {
      saveAgentModelsBtn.disabled = false;
    }
  });

  resetAgentModelsBtn?.addEventListener("click", async () => {
    resetAgentModelsBtn.disabled = true;
    try {
      const res = await fetch(`${API}/settings/agent-models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: {} }),
      });
      const data = await res.json();
      if (data.ok) {
        renderAgentModelSettings(data.profiles || [], data.overrides || {});
        showFeedback(agentModelsFeedback, "已恢复自动探测");
      } else {
        showFeedback(agentModelsFeedback, data.error || "恢复失败", true);
      }
    } catch {
      showFeedback(agentModelsFeedback, "请求失败", true);
    } finally {
      resetAgentModelsBtn.disabled = false;
    }
  });

  agentDashboardRefreshBtn?.addEventListener("click", () => {
    collectAgentSidecarResults({ quiet: true }).finally(() => refreshAgentControlPlane());
  });
  agentConnectLocalBtn?.addEventListener("click", connectLocalAgents);
  agentDetectRefreshBtn?.addEventListener("click", () => refreshLocalAgentDetection());
  agentSmokeTestBtn?.addEventListener("click", startAgentSmokeLoop);
  agentDelegationPermission?.addEventListener("click", (event) => {
    if (event.target.closest(".agent-delegation-approve")) setAgentDelegationPermission(true);
    if (event.target.closest(".agent-delegation-deny")) setAgentDelegationPermission(false);
  });
  agentEvolutionToggleBtn?.addEventListener("click", () => setEvolutionEnabled(!agentEvolutionEnabled));
  agentEvolutionRunBtn?.addEventListener("click", runEvolutionResearchNow);
  agentEvolutionAutopilotRunBtn?.addEventListener("click", runEvolutionAutopilotNow);
  agentEvolutionAutoApplyToggleBtn?.addEventListener("click", () => setEvolutionAutoApplyLowRisk(!agentEvolutionAutoApplyLowRisk));
  agentEvolutionProposalBtn?.addEventListener("click", runEvolutionProposalNow);
  agentEvolutionDryRunBtn?.addEventListener("click", runEvolutionDryRunNow);
  agentEvolutionApplyBtn?.addEventListener("click", applyEvolutionPatchNow);
  agentEvolutionProposal?.addEventListener("click", (event) => {
    if (event.target.closest(".agent-evolution-approve")) {
      applyEvolutionPatchNow();
    } else if (event.target.closest(".agent-evolution-reject")) {
      rejectEvolutionProposalNow();
    }
  });
  agentDashboardJobs?.addEventListener("click", (event) => {
    const row = event.target?.closest?.(".agent-job-row");
    if (!row) return;
    const jobId = row.dataset.jobId;
    if (event.target.closest(".agent-job-cancel")) {
      postAgentDashboardAction("/agent-delegations/cancel", jobId);
    } else if (event.target.closest(".agent-job-retry")) {
      postAgentDashboardAction("/agent-delegations/retry", jobId);
    }
  });

  agentDashboardJobs?.addEventListener("change", (event) => {
    const select = event.target?.closest?.(".agent-job-reassign-target");
    if (!select || !select.value) return;
    const row = select.closest(".agent-job-row");
    const jobId = row?.dataset?.jobId;
    const agentId = select.value;
    select.value = "";
    postAgentDashboardAction("/agent-delegations/reassign", jobId, { agent_id: agentId });
  });

  agentApprovalRequests?.addEventListener("click", (event) => {
    const row = event.target?.closest?.(".agent-job-row");
    const approvalId = row?.dataset?.approvalId;
    if (!approvalId) return;
    if (event.target.closest(".agent-approval-approve")) resolveApprovalFromUI(approvalId, "approved");
    if (event.target.closest(".agent-approval-deny")) resolveApprovalFromUI(approvalId, "denied");
  });

  // ── 语音设置持久化 ──
  const VOICE_LANG_KEY       = "bailongma-voice-lang";
  const VOICE_AUTO_SEND_KEY  = "bailongma-voice-auto-send";
  const VOICE_AUTO_MIC_KEY   = "bailongma-voice-auto-mic";
  const VOICE_THRESHOLD_KEY  = "bailongma-voice-threshold";
  const VOICE_PROVIDER_KEY   = "bailongma-voice-provider";

  function applyVoiceProviderUI(provider) {
    const panels = { aliyun: "voice-cred-aliyun", tencent: "voice-cred-tencent", xunfei: "voice-cred-xunfei" };
    for (const [key, id] of Object.entries(panels)) {
      const el = document.getElementById(id);
      if (el) el.style.display = key === provider ? "" : "none";
    }
  }

  const voiceProviderSelect = document.getElementById("voice-provider-select");
  if (voiceProviderSelect) {
    voiceProviderSelect.addEventListener("change", () => applyVoiceProviderUI(voiceProviderSelect.value));
  }

  async function loadVoiceSettings() {
    const langSelect = document.getElementById("voice-lang-select");
    const autoSend   = document.getElementById("voice-auto-send");
    if (langSelect) langSelect.value = localStorage.getItem(VOICE_LANG_KEY) || "zh-CN";
    if (autoSend) autoSend.checked = localStorage.getItem(VOICE_AUTO_SEND_KEY) !== "false";
    const autoMic = document.getElementById("voice-auto-mic");
    if (autoMic) autoMic.checked = localStorage.getItem(VOICE_AUTO_MIC_KEY) === "true";
    const savedThresh = parseFloat(localStorage.getItem(VOICE_THRESHOLD_KEY) || "0.008");
    if (voiceThreshSlider) voiceThreshSlider.value = String(savedThresh);
    if (voiceThreshVal)    voiceThreshVal.textContent = savedThresh.toFixed(3);

    const savedProvider = localStorage.getItem(VOICE_PROVIDER_KEY) || "aliyun";
    if (voiceProviderSelect) voiceProviderSelect.value = savedProvider;
    applyVoiceProviderUI(savedProvider);
  }

  if (voiceThreshSlider && voiceThreshVal) {
    voiceThreshSlider.addEventListener("input", () => {
      voiceThreshVal.textContent = parseFloat(voiceThreshSlider.value).toFixed(3);
    });
  }


  if (saveVoiceBtn) {
    saveVoiceBtn.addEventListener("click", async () => {
      const lang      = document.getElementById("voice-lang-select")?.value || "zh-CN";
      const autoSend  = document.getElementById("voice-auto-send")?.checked ?? true;
      const autoMic   = document.getElementById("voice-auto-mic")?.checked ?? false;
      const threshold = parseFloat(voiceThreshSlider?.value ?? "0.008");
      const provider  = voiceProviderSelect?.value || "aliyun";

      localStorage.setItem(VOICE_LANG_KEY,      lang);
      localStorage.setItem(VOICE_AUTO_SEND_KEY,  String(autoSend));
      localStorage.setItem(VOICE_AUTO_MIC_KEY,   String(autoMic));
      localStorage.setItem(VOICE_THRESHOLD_KEY,  String(threshold));
      localStorage.setItem(VOICE_PROVIDER_KEY,   provider);

      window.dispatchEvent(new CustomEvent("bailongma:voice-threshold", { detail: { threshold } }));

      // 将云端 ASR 凭证发送到后端
      const body = {};
      const aliyunKey = document.getElementById("voice-aliyun-key")?.value?.trim();
      if (provider === "aliyun" && aliyunKey && !/^sk-[A-Za-z0-9_-]{20,}$/.test(aliyunKey)) {
        showFeedback(voiceFeedback, "阿里云百炼请填 sk-... DashScope API Key，不是 AccessKey ID/Secret 或模型名", true);
        return;
      }
      if (aliyunKey) body.aliyunApiKey = aliyunKey;
      const tencentSid = document.getElementById("voice-tencent-sid")?.value?.trim();
      if (tencentSid) body.tencentSecretId = tencentSid;
      const tencentSkey = document.getElementById("voice-tencent-skey")?.value?.trim();
      if (tencentSkey) body.tencentSecretKey = tencentSkey;
      const tencentAppid = document.getElementById("voice-tencent-appid")?.value?.trim();
      if (tencentAppid) body.tencentAppId = tencentAppid;
      const xunfeiAppid = document.getElementById("voice-xunfei-appid")?.value?.trim();
      if (xunfeiAppid) body.xunfeiAppId = xunfeiAppid;
      const xunfeiApikey = document.getElementById("voice-xunfei-apikey")?.value?.trim();
      if (xunfeiApikey) body.xunfeiApiKey = xunfeiApikey;

      if (Object.keys(body).length > 0) {
        try {
          saveVoiceBtn.disabled = true;
          const resp = await fetch("http://127.0.0.1:3721/settings/voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!resp.ok) throw new Error("保存失败");
          // 清空密钥输入框（避免再次保存时误传旧值）
          ["voice-aliyun-key","voice-tencent-sid","voice-tencent-skey","voice-xunfei-apikey"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
          });
          showFeedback(voiceFeedback, "已保存");
        } catch { showFeedback(voiceFeedback, "保存失败", true); }
        finally { saveVoiceBtn.disabled = false; }
      } else {
        showFeedback(voiceFeedback, "已保存");
      }
    });
  }

  // ── TTS 设置 ──
  initTTSSettings();

  // ── 记忆节点图开关 ──
  const memoryGraphToggle = document.getElementById("settings-memory-graph-toggle");
  const memoryGraphFeedback = document.getElementById("settings-memory-graph-feedback");
  if (memoryGraphToggle) {
    memoryGraphToggle.checked = localStorage.getItem(MEMORY_GRAPH_STORAGE_KEY) !== "false";
    memoryGraphToggle.addEventListener("change", () => {
      localStorage.setItem(MEMORY_GRAPH_STORAGE_KEY, String(memoryGraphToggle.checked));
      if (memoryGraphFeedback) {
        memoryGraphFeedback.textContent = "下次刷新页面后生效";
        memoryGraphFeedback.className = "settings-feedback";
        setTimeout(() => { memoryGraphFeedback.textContent = ""; }, 3000);
      }
    });
  }

  // ── 开关 ──
  function openSettings(tab = null) {
    overlay.hidden = false;
    loadSettings();
    loadVoiceSettings();
    loadAutoLaunchSettings();
    loadBackgroundSettings();
    if (tab) {
      overlay.querySelectorAll(".settings-nav-item").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === tab);
      });
      overlay.querySelectorAll(".settings-tab").forEach(t => {
        t.classList.toggle("active", t.dataset.tab === tab);
      });
      if (tab === "social") loadSocialSettings();
      if (tab === "security") loadSecuritySettings();
      if (tab === "llm") loadAgentModelSettings();
      if (tab === "agents") {
        loadAgentDashboard();
        loadAgentRoutePlan();
        loadAgentOrchestrationMemory();
        loadEvolutionStatus();
      }
    }
  }
  openSettingsPanel = openSettings;

  function closeSettings() {
    overlay.hidden = true;
    if (llmKeyInput) llmKeyInput.value = "";
    if (minimaxKeyInput) minimaxKeyInput.value = "";
  }

  settingsBtn.addEventListener("click", () => openSettings());
  closeBtn.addEventListener("click", closeSettings);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSettings(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) closeSettings(); });

  if (providerSelect) {
    providerSelect.addEventListener("change", () => {
      const provider = providerSelect.value;
      const customSection = document.getElementById("settings-custom-llm-section");
      const modelRow = document.getElementById("settings-model-row");
      if (provider === "custom") {
        if (customSection) customSection.style.display = "";
        if (modelRow) modelRow.style.display = "none";
      } else {
        if (customSection) customSection.style.display = "none";
        if (modelRow) modelRow.style.display = "";
        if (cachedProviders?.[provider]) populateModelSelect(cachedProviders[provider].models, null);
      }
    });
  }

  saveLlmBtn?.addEventListener("click", async () => {
    const provider = providerSelect?.value || "auto";
    const apiKey = llmKeyInput.value.trim();
    saveLlmBtn.disabled = true;

    // 自定义端点走独立激活流程
    if (provider === "custom") {
      const baseURL = document.getElementById("settings-custom-baseurl")?.value?.trim();
      const model   = document.getElementById("settings-custom-model")?.value?.trim();
      if (!baseURL || !model) {
        showFeedback(llmFeedback, "请填写 Base URL 和模型名称", true);
        saveLlmBtn.disabled = false;
        return;
      }
      try {
        const res = await fetch(`${API}/activate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "custom", baseURL, model, apiKey: apiKey || "none" }),
        });
        const data = await res.json();
        if (data.ok) {
          showFeedback(llmFeedback, `已连接：${data.model}`);
          llmKeyInput.value = "";
          loadSettings();
        } else {
          showFeedback(llmFeedback, data.error || "连接失败", true);
        }
      } catch { showFeedback(llmFeedback, "请求失败", true); }
      finally { saveLlmBtn.disabled = false; }
      return;
    }

    const model = modelSelect.value;
    try {
      const body = apiKey
        ? { provider, apiKey, ...(provider === "auto" ? {} : { model }) }
        : { model };
      const res = await fetch(apiKey ? `${API}/activate` : `${API}/settings/model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        showFeedback(llmFeedback, "已保存");
        llmKeyInput.value = "";
        loadSettings();
      } else {
        showFeedback(llmFeedback, data.error || "保存失败", true);
      }
    } catch { showFeedback(llmFeedback, "请求失败", true); }
    finally { saveLlmBtn.disabled = false; }
  });

  saveMinimaxBtn?.addEventListener("click", async () => {
    const apiKey = minimaxKeyInput.value.trim();
    if (!apiKey) { showFeedback(minimaxFeedback, "Key 不能为空", true); return; }
    saveMinimaxBtn.disabled = true;
    try {
      const res = await fetch(`${API}/settings/minimax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();
      if (data.ok) {
        showFeedback(minimaxFeedback, "已保存");
        minimaxKeyInput.value = "";
        loadSettings();
      } else {
        showFeedback(minimaxFeedback, data.error || "保存失败", true);
      }
    } catch { showFeedback(minimaxFeedback, "请求失败", true); }
    finally { saveMinimaxBtn.disabled = false; }
  });

  // ── 微信 ClawBot 扫码 ──
  const clawbotConnectBtn = document.getElementById("clawbot-connect-btn");
  const clawbotLogoutBtn  = document.getElementById("clawbot-logout-btn");
  const clawbotQrArea     = document.getElementById("clawbot-qr-area");
  const clawbotQrImg      = document.getElementById("clawbot-qr-img");
  const clawbotQrHint     = document.getElementById("clawbot-qr-hint");
  const clawbotFeedback   = document.getElementById("clawbot-feedback");
  const clawbotStatus     = document.getElementById("social-status-clawbot");
  let clawbotPollTimer    = null;

  function setClawbotStatus(text, ok) {
    if (!clawbotStatus) return;
    clawbotStatus.textContent = ok ? `● ${text}` : `○ ${text}`;
    clawbotStatus.className = `settings-platform-status ${ok ? "ok" : "miss"}`;
  }

  function stopClawbotPoll() {
    if (clawbotPollTimer) { clearInterval(clawbotPollTimer); clawbotPollTimer = null; }
  }

  async function pollClawbotQR() {
    try {
      const data = await fetch(`${API}/social/wechat-clawbot/qr`).then(r => r.json());
      if (data.status === "connected") {
        stopClawbotPoll();
        if (clawbotQrArea) clawbotQrArea.style.display = "none";
        setClawbotStatus("已连接", true);
        if (clawbotFeedback) showFeedback(clawbotFeedback, "微信绑定成功！");
        loadSocialSettings();
      } else if (data.status === "qr_ready" && data.qr_url) {
        if (clawbotQrImg) clawbotQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qr_url)}`;
        if (clawbotQrArea) clawbotQrArea.style.display = "block";
        if (clawbotQrHint) clawbotQrHint.textContent = "等待扫码…";
        setClawbotStatus("等待扫码", false);
      } else if (data.status === "qr_pending") {
        if (clawbotQrHint) clawbotQrHint.textContent = "正在生成二维码…";
      } else if (data.status === "error") {
        stopClawbotPoll();
        if (clawbotQrArea) clawbotQrArea.style.display = "none";
        setClawbotStatus("连接失败", false);
        if (clawbotFeedback) showFeedback(clawbotFeedback, data.error || "连接失败", true);
      }
    } catch {}
  }

  // 初始化时检查一次当前状态
  if (clawbotConnectBtn) {
    pollClawbotQR();
  }

  clawbotConnectBtn?.addEventListener("click", async () => {
    if (clawbotQrArea) clawbotQrArea.style.display = "none";
    setClawbotStatus("正在启动…", false);
    stopClawbotPoll();
    // 触发后端重启 ClawBot 连接器
    try {
      await fetch(`${API}/settings/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _clawbot_connect: "1" }),
      });
    } catch {}
    // 开始轮询 QR 状态
    await pollClawbotQR();
    clawbotPollTimer = setInterval(pollClawbotQR, 2000);
  });

  clawbotLogoutBtn?.addEventListener("click", async () => {
    stopClawbotPoll();
    if (clawbotQrArea) clawbotQrArea.style.display = "none";
    try {
      await fetch(`${API}/social/wechat-clawbot/logout`, { method: "POST" });
      setClawbotStatus("已断开", false);
      showFeedback(clawbotFeedback, "已断开微信连接");
    } catch {
      showFeedback(clawbotFeedback, "请求失败", true);
    }
  });

  // 监听 SSE 事件更新 ClawBot 状态
  window.addEventListener("bailongma:social_status", (e) => {
    const d = e.detail;
    if (d?.platform !== "wechat-clawbot") return;
    if (d.status === "connected") {
      stopClawbotPoll();
      if (clawbotQrArea) clawbotQrArea.style.display = "none";
      setClawbotStatus("已连接", true);
    } else if (d.status === "qr_ready") {
      if (!clawbotPollTimer) clawbotPollTimer = setInterval(pollClawbotQR, 2000);
      pollClawbotQR();
    } else if (d.status === "session_expired") {
      stopClawbotPoll();
      setClawbotStatus("会话过期，请重新扫码", false);
    } else if (d.status === "idle") {
      setClawbotStatus("未连接", false);
    }
  });
})();

// ── Voice panel ──
initVoicePanel({
  btnId:      "voice-btn",
  panelId:    "voice-panel",
  canvasId:   "voice-canvas",
  statusId:   "voice-status",
  transcriptId: "voice-transcript",
  getChatInput:  () => document.getElementById("msg-input"),
  getSendBtn:    () => document.getElementById("send-btn"),
  getSendMessage: (options) => chat?.send?.(options),
  getLang:       () => localStorage.getItem("bailongma-voice-lang") || "zh-CN",
  getAutoSend:   () => localStorage.getItem("bailongma-voice-auto-send") !== "false",
  getAutoMic:    () => localStorage.getItem("bailongma-voice-auto-mic") === "true",
});

// ── Hotspot mode ──
initHotspot().catch((err) => console.warn('[Hotspot] 初始化失败:', err));
document.getElementById("hotspot-btn")?.addEventListener("click", () => toggleHotspot());

// ── Media modes (video / image) ──
(function initMediaModes() {
  const videoBtn      = document.getElementById("video-btn");
  const videoExitBtn  = document.getElementById("video-exit-btn");
  const videoFeed     = document.getElementById("video-feed");
  const videoFrame    = document.getElementById("video-frame");
  const videoSurface  = document.getElementById("video-surface");
  const videoBackdrop = document.getElementById("video-backdrop");
  const videoTitle    = document.getElementById("video-title");
  const imageExitBtn  = document.getElementById("image-exit-btn");
  const imageDisplay  = document.getElementById("image-display");
  const imageSurface  = document.getElementById("image-surface");
  const imageTitle    = document.getElementById("image-title");

  let videoStream = null;
  let videoActive = false;
  let imageActive = false;
  let videoKind   = "empty";
  let currentVideoSource = "";
  let currentVideoStart = null;

  function normalizeUrl(url = "") {
    return String(url || "").trim();
  }

  function localPathToUrl(src) {
    const s = String(src || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    // Local path (file:// or absolute) → backend HTTP media endpoint，避免 file:// 跨源限制
    let resolved = s;
    if (/^file:\/\//i.test(s)) {
      resolved = decodeURIComponent(s.replace(/^file:\/\/\//i, "").replace(/^file:\/\//i, ""));
    }
    const filename = resolved.split(/[\\/]/).filter(Boolean).pop() || "";
    if (!filename) return s;
    return "/media/music/" + encodeURIComponent(filename);
  }

  function extractYoutubeId(url) {
    return normalizeUrl(url).match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/
    )?.[1] || null;
  }

  function youtubeEmbedUrl(url, { autoplay = false, start = null } = {}) {
    const id = extractYoutubeId(url);
    if (!id) return null;
    const params = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      autoplay: autoplay ? "1" : "0",
    });
    if (Number.isFinite(Number(start))) params.set("start", String(Math.max(0, Math.round(Number(start)))));
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  function extractBilibiliId(url) {
    const raw = normalizeUrl(url);
    return raw.match(/\/video\/(BV[A-Za-z0-9]+)/i)?.[1]
        || raw.match(/\b(BV[A-Za-z0-9]+)\b/i)?.[1]
        || null;
  }

  function bilibiliEmbedUrl(url, { autoplay = false, start = null } = {}) {
    const bvid = extractBilibiliId(url);
    if (!bvid) return null;
    const params = new URLSearchParams({
      bvid,
      autoplay: autoplay ? "1" : "0",
      high_quality: "1",
    });
    if (Number.isFinite(Number(start))) params.set("t", String(Math.max(0, Math.round(Number(start)))));
    return `https://player.bilibili.com/player.html?${params.toString()}`;
  }

  function iframeUrlFor(url, options) {
    return youtubeEmbedUrl(url, options) || bilibiliEmbedUrl(url, options);
  }

  // ── 历史记录 ──────────────────────────────────────────────────────────────
  function saveMediaHistory({ url, title, kind, videoId = null, platform = null }) {
    fetch(`${API}/media/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title: title || "", kind, videoId, platform }),
    }).catch(() => {});
  }

  // ── YouTube oEmbed 预验证（异步，不阻塞显示） ────────────────────────────
  async function validateYoutubeUrl(url) {
    try {
      const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembed, { signal: AbortSignal.timeout(5000) });
      return res.ok;
    } catch {
      return null; // 网络失败时不做判断，允许继续
    }
  }

  // ── 摄像头 ────────────────────────────────────────────────────────────────
  function stopCamera() {
    videoStream?.getTracks().forEach(t => t.stop());
    videoStream = null;
  }

  // ── 面板纯显示状态（不销毁内容）────────────────────────────────────────
  function setPanelVisible(visible) {
    videoActive = Boolean(visible);
    document.body.classList.toggle("video-mode", videoActive);
    videoBtn?.classList.toggle("active", videoActive);
    if (videoActive) moveVoicePanelToBody();
    else restoreVoicePanel();
    window.dispatchEvent(new CustomEvent("bailongma:video-mode", {
      detail: { active: videoActive, kind: videoKind },
    }));
  }

  // ── 暂停当前视频 ──────────────────────────────────────────────────────────
  function pauseCurrentVideo() {
    if (videoKind === "youtube") {
      postFrameCommand("pauseVideo");
    } else if (videoKind === "bilibili") {
      reloadFrameAutoplay(false);
    } else if (videoKind === "file") {
      try { videoFeed?.pause?.(); } catch {}
    }
  }

  // ── 恢复当前视频 ──────────────────────────────────────────────────────────
  function resumeCurrentVideo() {
    if (videoKind === "youtube") {
      postFrameCommand("playVideo");
    } else if (videoKind === "bilibili") {
      reloadFrameAutoplay(true);
    } else if (videoKind === "file") {
      videoFeed?.play?.().catch(() => {});
    }
  }

  // ── 清空内容（退出按钮专用）────────────────────────────────────────────
  function resetVideoSurface() {
    stopCamera();
    if (videoFeed) {
      try { videoFeed.pause(); } catch {}
      videoFeed.removeAttribute("src");
      videoFeed.srcObject = null;
      videoFeed.hidden = true;
      videoFeed.load?.();
    }
    if (videoFrame) {
      videoFrame.src = "about:blank";
      videoFrame.hidden = true;
    }
    if (videoBackdrop) videoBackdrop.style.backgroundImage = "";
    videoSurface?.classList.remove("has-media");
    videoKind = "empty";
    currentVideoSource = "";
    currentVideoStart = null;
  }

  // ── V 键 / 顶栏按钮：暂停+收起 / 继续播放+展开 ────────────────────────
  function toggleVideoPanelVisibility() {
    if (videoActive) {
      pauseCurrentVideo();
      setPanelVisible(false);
    } else {
      if (musicActive) closeMusicPanel();
      setPanelVisible(true);
      if (videoKind !== "empty") resumeCurrentVideo();
    }
  }

  // ── 退出按钮：完全关闭并销毁 ─────────────────────────────────────────
  function closeAndDestroyVideo() {
    setPanelVisible(false);
    resetVideoSurface();
  }

  // ── Agent 调用 hide/close 时：同退出按钮 ────────────────────────────────
  function setVideoModeActive(active) {
    if (!active) {
      closeAndDestroyVideo();
    } else {
      setPanelVisible(true);
    }
  }

  function setBackdrop(kind, url) {
    if (!videoBackdrop) return;
    if (kind === "youtube") {
      const id = extractYoutubeId(url);
      if (id) {
        videoBackdrop.style.backgroundImage =
          `url(https://img.youtube.com/vi/${id}/maxresdefault.jpg)`;
        return;
      }
    }
    // Bilibili / file / camera：纯色兜底（CSS 已有 #000 背景）
    videoBackdrop.style.backgroundImage = "";
  }

  async function showCamera({ title = "Camera", autoplay = true } = {}) {
    setPanelVisible(true);
    resetVideoSurface();
    if (videoTitle) videoTitle.textContent = title;
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoFeed) {
        videoFeed.hidden = false;
        videoFeed.muted = true;
        videoFeed.srcObject = videoStream;
        if (autoplay) videoFeed.play?.().catch(() => {});
      }
      videoSurface?.classList.add("has-media");
      videoKind = "camera";
    } catch (e) {
      console.warn("摄像头访问失败:", e);
    }
  }

  async function showVideo({
    url = "", title = "Video", autoplay = false,
    muted = false, volume = null, currentTime = null, camera = false,
  } = {}) {
    if (camera) { showCamera({ title, autoplay }); return; }

    const source = normalizeUrl(url);
    if (musicActive) closeMusicPanel();
    setPanelVisible(true);
    resetVideoSurface();
    currentVideoSource = source;
    currentVideoStart = Number.isFinite(Number(currentTime)) ? Math.max(0, Number(currentTime)) : null;
    if (videoTitle) videoTitle.textContent = title || "Video";

    const embedUrl = iframeUrlFor(source, { autoplay, start: currentTime });
    if (embedUrl && videoFrame) {
      videoFrame.hidden = false;
      videoFrame.src = embedUrl;
      videoSurface?.classList.add("has-media");
      videoKind = embedUrl.includes("youtube.com") ? "youtube" : "bilibili";

      setBackdrop(videoKind, source);
      saveMediaHistory({
        url: source,
        title,
        kind: videoKind,
        videoId: videoKind === "youtube" ? extractYoutubeId(source) : extractBilibiliId(source),
        platform: videoKind,
      });

      // 后台验证 YouTube 可访问性，不可用时给控制台警告
      if (videoKind === "youtube") {
        validateYoutubeUrl(source).then(ok => {
          if (ok === false) console.warn("[Media] YouTube 视频可能无法播放（区域限制/私有/已删除）:", source);
        });
      }
      return;
    }

    if (videoFeed && source) {
      videoFeed.hidden = false;
      videoFeed.src = source;
      videoFeed.muted = Boolean(muted);
      if (Number.isFinite(Number(volume))) videoFeed.volume = Math.max(0, Math.min(1, Number(volume)));
      if (Number.isFinite(Number(currentTime))) videoFeed.currentTime = Math.max(0, Number(currentTime));
      videoSurface?.classList.add("has-media");
      videoKind = "file";
      saveMediaHistory({ url: source, title, kind: "file" });
      if (autoplay) videoFeed.play?.().catch(() => {});
    }
  }

  function postFrameCommand(command, args = []) {
    if (!videoFrame?.contentWindow || videoFrame.hidden) return;
    if (videoKind === "youtube") {
      videoFrame.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args,
      }), "*");
    }
  }

  function reloadFrameAutoplay(autoplay) {
    if (!videoFrame || videoFrame.hidden || !currentVideoSource) return;
    const nextUrl = iframeUrlFor(currentVideoSource, {
      autoplay,
      start: currentVideoStart,
    });
    if (nextUrl) videoFrame.src = nextUrl;
  }

  function controlVideo({ action, volume, currentTime, autoplay } = {}) {
    const op = action || (autoplay ? "play" : null);
    if (op === "hide" || op === "close") { closeAndDestroyVideo(); return; }
    if (op === "play") resumeCurrentVideo();
    if (op === "pause") pauseCurrentVideo();
    if (Number.isFinite(Number(volume))) {
      const v = Math.max(0, Math.min(1, Number(volume)));
      if (videoFeed) { videoFeed.volume = v; videoFeed.muted = v === 0; }
      postFrameCommand("setVolume", [Math.round(v * 100)]);
    }
    if (Number.isFinite(Number(currentTime))) {
      const t = Math.max(0, Number(currentTime));
      currentVideoStart = t;
      if (videoFeed) videoFeed.currentTime = t;
      postFrameCommand("seekTo", [t, true]);
    }
  }

  function setImageModeActive(active) {
    imageActive = Boolean(active);
    document.body.classList.toggle("image-mode", imageActive);
    if (!imageActive && imageDisplay) {
      imageDisplay.removeAttribute("src");
      imageDisplay.alt = "";
      imageSurface?.classList.remove("has-media");
    }
  }

  function showImage({ url = "", title = "Image", alt = "" } = {}) {
    const source = normalizeUrl(url);
    setImageModeActive(true);
    if (imageTitle) imageTitle.textContent = title || "Image";
    if (imageDisplay && source) {
      imageDisplay.src = source;
      imageDisplay.alt = alt || title || "";
      imageSurface?.classList.add("has-media");
    }
  }

  function handleMediaCommand(payload = {}) {
    const mode   = payload.mode || payload.kind;
    const action = payload.action || "show";
    if (mode === "image") {
      if (action === "hide" || action === "close") setImageModeActive(false);
      else showImage(payload);
      return { ok: true, mode: "image", action };
    }
    if (mode === "camera") {
      if (action === "hide" || action === "close") closeAndDestroyVideo();
      else showCamera(payload);
      return { ok: true, mode: "camera", action };
    }
    if (mode === "video") {
      if (action === "show" || payload.url || payload.camera) showVideo(payload);
      else controlVideo(payload);
      return { ok: true, mode: "video", action };
    }
    if (mode === "music") {
      if (action === "show" || payload.src || payload.playlist) showMusic(payload);
      else controlMusic(payload);
      return { ok: true, mode: "music", action };
    }
    return { ok: false, error: "unknown media mode" };
  }

  // ── Music mode ────────────────────────────────────────────────────────────
  const musicBtn       = document.getElementById("music-btn");
  const musicExitBtn   = document.getElementById("music-exit-btn");
  const musicAudio     = document.getElementById("music-audio");
  const musicPlayBtn   = document.getElementById("music-play");
  const musicPrevBtn   = document.getElementById("music-prev");
  const musicNextBtn   = document.getElementById("music-next");
  const musicSeek      = document.getElementById("music-seek");
  const musicVolInput  = document.getElementById("music-vol");
  const musicTimeCur   = document.getElementById("music-time-cur");
  const musicTimeTotal = document.getElementById("music-time-total");
  const musicMetaTitle  = document.getElementById("music-meta-title");
  const musicMetaArtist = document.getElementById("music-meta-artist");
  const musicCoverEl    = document.getElementById("music-cover");
  const musicCoverTitle = document.getElementById("music-cover-title");
  const musicCoverArtist = document.getElementById("music-cover-artist");
  const musicLyricsScroll = document.getElementById("music-lyrics-scroll");
  const musicNoLyrics     = document.getElementById("music-no-lyrics");

  let musicActive  = false;
  let musicPlaying = false;
  let musicWasPlayingBeforeHide = false;
  let lrcLines     = [];
  let playlist     = [];
  let playlistIdx  = 0;
  let isSeeking    = false;

  function parseLrc(text) {
    const lines = [];
    const re = /\[(\d+):(\d{1,2}(?:\.\d+)?)\](.*)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const t = parseInt(m[1], 10) * 60 + parseFloat(m[2]);
      const txt = m[3].trim();
      if (txt) lines.push({ time: t, text: txt });
    }
    return lines.sort((a, b) => a.time - b.time);
  }

  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }

  function setMusicPanelVisible(visible) {
    musicActive = Boolean(visible);
    document.body.classList.toggle("music-mode", musicActive);
    musicBtn?.classList.toggle("active", musicActive);
    window.dispatchEvent(new CustomEvent("bailongma:music-mode", {
      detail: { active: musicActive },
    }));
  }

  function setMusicPlaying(playing) {
    musicPlaying = Boolean(playing);
    document.body.classList.toggle("music-playing", musicPlaying);
    if (musicPlayBtn) musicPlayBtn.textContent = musicPlaying ? "⏸" : "▶";
    if (musicPlaying) {
      musicAudio?.play?.().catch(() => {});
    } else {
      musicAudio?.pause?.();
    }
  }

  function loadLrc(lrcText) {
    lrcLines = lrcText ? parseLrc(lrcText) : [];
    if (musicLyricsScroll) {
      musicLyricsScroll.innerHTML = lrcLines
        .map((l, i) => `<div class="lrc-line" data-idx="${i}">${l.text}</div>`)
        .join("");
    }
    if (musicNoLyrics) musicNoLyrics.hidden = lrcLines.length > 0;
  }

  function syncLyrics(currentTime) {
    if (!lrcLines.length || !musicLyricsScroll) return;
    let active = -1;
    for (let i = 0; i < lrcLines.length; i++) {
      if (lrcLines[i].time <= currentTime + 0.3) active = i;
      else break;
    }
    if (active < 0) return;
    const lines = musicLyricsScroll.querySelectorAll(".lrc-line");
    lines.forEach((el, i) => el.classList.toggle("active", i === active));
    const activeLine = lines[active];
    if (activeLine) {
      const pane = document.getElementById("music-lyrics-pane");
      if (pane) pane.scrollTo({ top: activeLine.offsetTop - pane.clientHeight / 2 + activeLine.clientHeight / 2, behavior: "smooth" });
    }
  }

  function loadTrack(index, autoplay = true) {
    const track = playlist[index];
    if (!track || !musicAudio) return;

    musicAudio.src = localPathToUrl(track.src || "");
    musicAudio.volume = parseFloat(musicVolInput?.value ?? "0.8");

    const title  = track.title  || "未知曲目";
    const artist = track.artist || "";
    if (musicMetaTitle)  musicMetaTitle.textContent  = title;
    if (musicMetaArtist) musicMetaArtist.textContent = artist;
    if (musicCoverTitle)  musicCoverTitle.textContent  = title.slice(0, 14);
    if (musicCoverArtist) musicCoverArtist.textContent = artist;
    if (musicTimeCur)   musicTimeCur.textContent   = "0:00";
    if (musicTimeTotal) musicTimeTotal.textContent = "0:00";
    if (musicSeek)      { musicSeek.value = "0"; musicSeek.max = "100"; }

    if (track.cover && musicCoverEl) {
      musicCoverEl.style.backgroundImage = `url(${track.cover})`;
      musicCoverEl.style.background = "";
    } else if (musicCoverEl) {
      musicCoverEl.style.backgroundImage = "";
      let hash = 0;
      for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
      const hue = Math.abs(hash) % 360;
      musicCoverEl.style.background = `hsl(${hue}, 45%, 32%)`;
    }

    loadLrc(track.lrc || "");
    if (autoplay) setMusicPlaying(true);
  }

  function showMusic({
    src = "", title = "", artist = "", lrc = "", cover = "",
    autoplay = true, playlist: pl = null,
  } = {}) {
    if (videoActive) closeAndDestroyVideo();
    setMusicPanelVisible(true);
    if (pl && pl.length) {
      playlist = pl;
    } else {
      playlist = [{ src, title, artist, lrc, cover }];
    }
    playlistIdx = 0;
    loadTrack(0, autoplay);
  }

  function closeMusicPanel() {
    setMusicPlaying(false);
    setMusicPanelVisible(false);
    if (musicAudio) musicAudio.src = "";
    lrcLines = [];
    if (musicLyricsScroll) musicLyricsScroll.innerHTML = "";
    if (musicNoLyrics) musicNoLyrics.hidden = false;
  }

  function controlMusic({ action, volume, currentTime } = {}) {
    if (action === "hide" || action === "close") { closeMusicPanel(); return; }
    if (action === "play")  setMusicPlaying(true);
    if (action === "pause") setMusicPlaying(false);
    if (Number.isFinite(Number(volume))) {
      const v = Math.max(0, Math.min(1, Number(volume)));
      if (musicAudio) musicAudio.volume = v;
      if (musicVolInput) musicVolInput.value = String(v);
    }
    if (Number.isFinite(Number(currentTime)) && musicAudio) {
      musicAudio.currentTime = Math.max(0, Number(currentTime));
    }
  }

  function toggleMusicPanelVisibility() {
    if (musicActive) {
      musicWasPlayingBeforeHide = musicPlaying;
      setMusicPlaying(false);
      setMusicPanelVisible(false);
    } else if (musicAudio?.src) {
      if (videoActive) closeAndDestroyVideo();
      setMusicPanelVisible(true);
      if (musicWasPlayingBeforeHide) setMusicPlaying(true);
    }
  }

  if (musicAudio) {
    musicAudio.addEventListener("loadedmetadata", () => {
      if (musicTimeTotal) musicTimeTotal.textContent = fmtTime(musicAudio.duration);
      if (musicSeek) musicSeek.max = String(musicAudio.duration || 100);
    });
    musicAudio.addEventListener("timeupdate", () => {
      if (isSeeking) return;
      const t = musicAudio.currentTime;
      if (musicTimeCur) musicTimeCur.textContent = fmtTime(t);
      if (musicSeek && musicAudio.duration) musicSeek.value = String(t);
      syncLyrics(t);
    });
    musicAudio.addEventListener("ended", () => {
      setMusicPlaying(false);
      if (playlistIdx < playlist.length - 1) {
        playlistIdx++;
        loadTrack(playlistIdx, true);
      }
    });
  }

  musicPlayBtn?.addEventListener("click", () => setMusicPlaying(!musicPlaying));
  musicPrevBtn?.addEventListener("click", () => {
    if (playlistIdx > 0) { playlistIdx--; loadTrack(playlistIdx, musicPlaying); }
    else if (musicAudio) musicAudio.currentTime = 0;
  });
  musicNextBtn?.addEventListener("click", () => {
    if (playlistIdx < playlist.length - 1) { playlistIdx++; loadTrack(playlistIdx, musicPlaying); }
  });
  musicVolInput?.addEventListener("input", () => {
    if (musicAudio) musicAudio.volume = parseFloat(musicVolInput.value);
  });
  musicSeek?.addEventListener("mousedown", () => { isSeeking = true; });
  musicSeek?.addEventListener("input", () => {
    if (musicTimeCur) musicTimeCur.textContent = fmtTime(parseFloat(musicSeek.value));
  });
  musicSeek?.addEventListener("change", () => {
    if (musicAudio) musicAudio.currentTime = parseFloat(musicSeek.value);
    isSeeking = false;
  });
  musicExitBtn?.addEventListener("click", closeMusicPanel);
  musicBtn?.addEventListener("click", toggleMusicPanelVisibility);

  window.addEventListener("keydown", (e) => {
    if (e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA" || e.target?.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      toggleMusicPanelVisibility();
    }
  });

  window.bailongmaMedia = { handle: handleMediaCommand, showVideo, controlVideo, showImage, showCamera, showMusic, controlMusic };
  window.addEventListener("bailongma:media", (event) => handleMediaCommand(event.detail || {}));

  // 顶栏按钮：暂停+收起 / 展开+继续（不销毁）
  videoBtn?.addEventListener("click", toggleVideoPanelVisibility);
  // 退出按钮：完全关闭
  videoExitBtn?.addEventListener("click", closeAndDestroyVideo);
  imageExitBtn?.addEventListener("click", () => setImageModeActive(false));

  // V 键：同顶栏按钮逻辑
  window.addEventListener("keydown", (e) => {
    if (e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA" || e.target?.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "v" || e.key === "V") {
      e.preventDefault();
      toggleVideoPanelVisibility();
    }
    // H 键：切换热点模式
    if (e.key === "h" || e.key === "H") {
      e.preventDefault();
      toggleHotspot();
    }
  });
})();
