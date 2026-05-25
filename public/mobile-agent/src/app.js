import { MobileHotspotEarth } from './mobile-hotspot-earth.js';
// ─── 常量 ────────────────────────────────────────────────
const LS_AUTH = 'xiaobai-tianshu-auth-session';
const LS_API = 'xiaobai-tianshu-api-config';
const LS_THREADS = 'xiaobai-mobile-chat-threads';
const LS_BG = 'xiaobai-mobile-chat-background';
const API_BASE = 'https://www.xiaobaiai.cn/api';
const API_AUTH = `${API_BASE}/auth`;
const API_CHAT = `${API_BASE}/mobile-chat`;
const API_DESKTOP = `${API_BASE}/agent-remote/tasks`;
const WS_WORKSPACE = 'tianshu-main';
// ─── 图标库 (Inline SVG) ──────────────────────────────────
const I = {
menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
tianshu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
photo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
task: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
weather: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
news: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14H8"/><path d="M18 18H8"/><path d="M18 10H8"/></svg>`,
spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
arrowDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
warningCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};
// ─── 状态 ────────────────────────────────────────────────
const state = {
tab: 'chat',              // 'chat' | 'tianshu' | 'settings'
connected: false,
sidebarOpen: false,
activeCard: null,         // 'weather' | 'hotspot' | 'task' | 'file'
summonOpen: false,
messages: [],
tianshuMessages: [],
tasks: [],
devices: [],
auth: null,
api: {},
chatBackground: { mode: 'glass' },  // 'glass' | 'galaxy' | 'custom'
errorBanner: null,
confirmDialog: null,
online: navigator.onLine !== false,
chatThreads: { chat: [], tianshu: [] },
activeThreadIds: { chat: '', tianshu: '' },
connectionHealth: { chat: 'offline', remote: 'offline', devices: 'offline', message: '等待连接体检。' },
authError: '',
apkUrl: null,
};
// ─── 工具函数 ─────────────────────────────────────────────
function $el(selector) {
return document.querySelector(selector);
}
function $els(selector) {
return Array.from(document.querySelectorAll(selector));
}
function esc(str) {
if (str == null) return '';
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}
function time() {
return new Intl.DateTimeFormat('zh-CN', {
hour: '2-digit',
minute: '2-digit',
hour12: false,
}).format(new Date());
}
function currentTime() {
return time();
}
function haptic(n = 10) {
try {
navigator.vibrate?.(n);
} catch (_) {}
}
function wait(ms) {
return new Promise((r) => setTimeout(r, ms));
}
async function fetchWithRetry(url, opts = {}, { timeout = 18000, retries = 1 } = {}) {
let last;
for (let i = 0; i <= retries; i++) {
const ctrl = new AbortController();
const timer = setTimeout(() => ctrl.abort(), timeout);
try {
const resp = await fetch(url, { ...opts, signal: ctrl.signal });
clearTimeout(timer);
return resp;
} catch (e) {
last = e;
clearTimeout(timer);
if (i < retries) await wait(400 * (i + 1));
}
}
if (last?.name === 'AbortError') throw new Error('请求超时');
throw last || new Error('网络失败');
}
function confirmThen(msg, cb) {
state.confirmDialog = { message: msg, cb };
render();
}
function scheduleScroll() {
requestAnimationFrame(() => {
const conv = $el('.conversation');
if (!conv || state.sidebarOpen || state.activeCard) return;
const remain = conv.scrollHeight - conv.scrollTop - conv.clientHeight;
if (remain > 180) return;
conv.scrollTo({ top: conv.scrollHeight, behavior: 'smooth' });
});
}
function persist(key, value) {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch (_) {}
}
function loadPersisted(key, fallback = null) {
try {
const raw = localStorage.getItem(key);
return raw ? JSON.parse(raw) : fallback;
} catch (_) {
return fallback;
}
}
// ─── 网络请求 ─────────────────────────────────────────────
async function apiRequest(endpoint, body, method = 'POST') {
const resp = await fetchWithRetry(endpoint, {
method,
headers: {
'Content-Type': 'application/json',
...(state.api.token ? { Authorization: `Bearer ${state.api.token}` } : {}),
},
body: JSON.stringify(body),
});
if (!resp.ok) {
const data = await resp.json().catch(() => ({}));
throw new Error(data.error || data.message || `请求失败 (${resp.status})`);
}
return resp.json().catch(() => ({}));
}
// ─── 认证 ────────────────────────────────────────────────
async function login(email, password) {
if (!email || !password) return;
state.authError = '';
render();
try {
const data = await apiRequest(API_AUTH, { mode: 'login', email, password });
if (!data.session?.access_token && !data.token) throw new Error('登录失败，未返回令牌');
saveAuth(data);
} catch (err) {
state.authError = err.message;
render();
}
}
function saveAuth(data) {
const session = data.session || {};
state.auth = {
token: session.access_token || data.token || '',
refreshToken: session.refresh_token || data.refreshToken || '',
expiresAt: Number(session.expires_at || data.expiresAt || 0),
savedAt: currentTime(),
user: data.user || null,
};
state.connected = Boolean(state.auth.token);
if (state.auth.token) {
saveApiConnection({ token: state.auth.token });
runConnectionHealth();
}
persist(LS_AUTH, state.auth);
render();
}
function logoutAccount() {
state.auth = null;
state.connected = false;
state.api = {};
state.chatThreads = { chat: [], tianshu: [] };
state.messages = [];
state.tianshuMessages = [];
persist(LS_AUTH, null);
persist(LS_API, null);
persist(LS_THREADS, null);
render();
}
// ─── API 连接配置 ─────────────────────────────────────────
function saveApiConnection(config) {
state.api = {
endpoint: config.endpoint || state.api.endpoint || API_CHAT,
chatEndpoint: config.chatEndpoint || config.endpoint || state.api.chatEndpoint || API_CHAT,
desktopEndpoint: config.desktopEndpoint || state.api.desktopEndpoint || API_DESKTOP,
token: config.token || state.api.token || '',
saved: true,
savedAt: currentTime(),
workspaceId: config.workspaceId || state.api.workspaceId || WS_WORKSPACE,
};
state.connected = Boolean(state.api.token);
persist(LS_API, state.api);
render();
}
function clearApi() {
state.api = {};
state.connected = false;
state.connectionHealth = { chat: 'offline', remote: 'offline', devices: 'offline', message: '已清除连接。' };
persist(LS_API, null);
render();
}
// ─── 连接体检 ─────────────────────────────────────────────
async function runConnectionHealth() {
if (!state.connected) return;
const h = { chat: 'offline', remote: 'offline', devices: 'offline', message: '检测中...' };
state.connectionHealth = h;
render();
const checks = [];
// Check chat API
checks.push(
fetchWithRetry(state.api.chatEndpoint, {
method: 'POST',
headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.api.token}` },
body: JSON.stringify({ messages: [{ role: 'user', text: 'test' }] }),
}, { timeout: 8000 })
.then(() => { h.chat = 'ok'; h.message = '问答 API 正常'; })
.catch(() => { h.chat = 'error'; h.message = '问答 API 异常'; })
);
// Check desktop API
checks.push(
fetchWithRetry(state.api.desktopEndpoint, {
method: 'GET',
headers: { Authorization: `Bearer ${state.api.token}` },
}, { timeout: 6000 })
.then(() => { h.remote = 'ok'; })
.catch(() => { h.remote = 'error'; })
);
await Promise.allSettled(checks);
// Check device count
if (state.devices.length) {
h.devices = state.devices.some((d) => d.online) ? 'ok' : 'warn';
}
state.connectionHealth = h;
render();
}
// ─── 背景保存 ─────────────────────────────────────────────
function saveBackground(mode, customImage) {
state.chatBackground = { mode, customImage: customImage || state.chatBackground?.customImage || '' };
persist(LS_BG, state.chatBackground);
render();
}
// ─── 消息处理 ─────────────────────────────────────────────
function submitPrompt(text) {
const mode = state.tab === 'tianshu' ? 'tianshu' : 'chat';
haptic(12);
appendMessage({ role: 'user', text, time: currentTime() }, mode);
if (!state.connected) {
appendMessage({ role: 'assistant', text: '还没有保存 API，已先保存为草稿。', time: currentTime() }, mode);
render();
return;
}
appendMessage({ role: 'assistant', text: mode === 'tianshu' ? '正在下发到电脑端天枢...' : '正在调用 API 回答...', time: currentTime(), typing: true }, mode);
render();
if (mode === 'tianshu') {
handleTianshuMessage(text);
} else {
handleChatMessage(text);
}
}
async function handleChatMessage(text) {
try {
const data = await apiRequest(state.api.chatEndpoint, {
messages: state.messages.slice(-40).map((m) => ({ role: m.role, text: m.text })),
workspaceId: state.api.workspaceId,
});
const reply = data.choices?.[0]?.message || data.message || {};
updateLastMessage({ role: 'assistant', text: reply.text || reply.content || '收到回复', time: currentTime() });
} catch (err) {
updateLastMessage({ role: 'assistant', text: `错误: ${err.message}`, time: currentTime() });
}
}
async function handleTianshuMessage(text) {
try {
const data = await apiRequest(state.api.desktopEndpoint, {
task: text,
workspaceId: state.api.workspaceId,
source: 'mobile',
});
const reply = data.reply || data.message || data.result || '任务已下发';
updateLastMessage({ role: 'assistant', text: reply, time: currentTime() });
if (data.tasks) {
state.tasks = [...state.tasks, ...data.tasks].slice(-20);
}
} catch (err) {
updateLastMessage({ role: 'assistant', text: `错误: ${err.message}`, time: currentTime() });
}
}
function updateLastMessage(msg) {
const target = state.tab === 'tianshu' ? state.tianshuMessages : state.messages;
const last = target[target.length - 1];
if (last?.typing) {
Object.assign(last, msg, { typing: false });
} else {
target.push(msg);
}
render();
}
function appendMessage(msg, mode = 'chat') {
const key = mode === 'tianshu' ? 'tianshu' : 'chat';
if (!state.chatThreads[key].length) createThread(key);
const thread = state.chatThreads[key][0];
thread.messages = thread.messages || [];
thread.messages.push(msg);
thread.messages = thread.messages.slice(-80);
if (key === 'chat') state.messages = thread.messages;
else state.tianshuMessages = thread.messages;
persist(LS_THREADS, state.chatThreads);
}
function createThread(mode = 'chat') {
const key = mode === 'tianshu' ? 'tianshu' : 'chat';
const thread = {
id: `${key}-${Date.now()}`,
title: key === 'tianshu' ? '天枢对话' : '普通对话',
createdAt: Date.now(),
updatedAt: Date.now(),
messages: [],
};
state.chatThreads[key].unshift(thread);
state.chatThreads[key] = state.chatThreads[key].slice(0, 20);
state.activeThreadIds[key] = thread.id;
persist(LS_THREADS, state.chatThreads);
}
// ─── 远程同步 ─────────────────────────────────────────────
let pollTimer = null;
function startRemotePolling() {
stopRemotePolling();
pollTimer = setInterval(async () => {
if (!state.connected) return;
try {
const data = await fetchWithRetry(state.api.desktopEndpoint, {
method: 'GET',
headers: { Authorization: `Bearer ${state.api.token}` },
}, { timeout: 6000 });
const json = await data.json().catch(() => ({}));
if (json.tasks) {
state.tasks = json.tasks;
}
if (json.devices) {
state.devices = json.devices;
}
} catch (_) {}
}, 12000);
}
function stopRemotePolling() {
if (pollTimer) {
clearInterval(pollTimer);
pollTimer = null;
}
}
function reconcileRemote() {
if (state.connected) startRemotePolling();
else stopRemotePolling();
}
// ─── 卡片 ────────────────────────────────────────────────
function openCard(name) {
state.activeCard = name;
state.summonOpen = false;
render();
}
function closeCard() {
state.activeCard = null;
disposeEarth();
render();
}
// ─── Earth (Hotspot) ─────────────────────────────────────
let earth = null;
function mountCard() {
if (state.activeCard !== 'news') return;
const canvas = $el('#mobile-hotspot-earth');
if (!canvas) return;
earth = new MobileHotspotEarth(canvas);
earth.init().catch(() => {
canvas.closest('.hotspot-earth-shell')?.classList.add('earth-fallback');
});
}
function disposeEarth() {
if (!earth) return;
earth.dispose();
earth = null;
}
// ─── 主渲染 ──────────────────────────────────────────────
function render() {
disposeEarth();
applySafeArea();
const app = $el('#app');
if (!app) return;
app.innerHTML = `
${renderErrorBanner()}
${renderOfflineBanner()}
${renderConfirmDialog()}
<main class="chat-shell mode-${state.tab === 'settings' ? 'settings' : state.tab}" aria-label="天枢中心">
${renderTopbar()}
${state.tab === 'settings' ? renderSettingsPage() : renderChatPage()}
</main>
${renderSidebar()}
${state.activeCard ? renderFloatingCard() : ''}
`;
bindEvents();
mountCard();
if (state.tab !== 'settings') reconcileRemote();
scheduleScroll();
}
// ─── 安全区 ──────────────────────────────────────────────
function applySafeArea() {
const top = window.visualViewport?.offsetTop || 0;
const ua = navigator.userAgent || '';
const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches
|| window.navigator.standalone
|| document.referrer.startsWith('android-app://')
|| /wv|Version\/[\d.]+.*Chrome\/[\d.]+.*Mobile Safari/i.test(ua);
document.documentElement.style.setProperty('--status-bar', `${standalone ? Math.max(top, 32) : top}px`);
}
// ─── 顶部栏 ──────────────────────────────────────────────
function renderTopbar() {
if (state.tab === 'settings') return '';
return `
<header class="chat-topbar">
<button class="topbar-icon-btn" data-action="sidebar" aria-label="菜单">${I.menu}</button>
<span class="topbar-title">${state.tab === 'tianshu' ? '天枢' : '小白'}</span>
<button class="topbar-icon-btn" data-action="new-chat" aria-label="新对话">${I.plus}</button>
</header>
`;
}
// ─── 对话页 ──────────────────────────────────────────────
function renderChatPage() {
if (!state.auth?.token) {
return `<section class="conversation" aria-label="登录">${renderAuthGate()}</section>`;
}
if (state.tab === 'tianshu') {
return `<section class="conversation">${renderTianshuDashboard()}</section>`;
}
return `
<section class="conversation" aria-label="对话">
${state.messages.length ? renderMessageStream() : renderWelcome()}
</section>
${renderComposer()}
`;
}
// ─── 消息流 ──────────────────────────────────────────────
function renderMessageStream() {
return `<div class="message-stream">${state.messages.map(renderMessage).join('')}</div>`;
}
function renderMessage(m) {
const isTyping = Boolean(m.typing);
return `
<article class="bubble ${esc(m.role)}${isTyping ? ' typing' : ''}">
<p>${isTyping
? `<span class="typing-label">${esc(m.text)}</span><span class="typing-dots"><i></i><i></i><i></i></span>`
: esc(m.text)}</p>
<time>${esc(m.time || '')}</time>
</article>
`;
}
// ─── 欢迎页 ──────────────────────────────────────────────
function renderWelcome() {
return `
<div class="welcome">
<div class="agent-graph">
<span class="graph-ring ring-a"></span>
<span class="graph-ring ring-b"></span>
<span class="graph-line line-a"></span>
<span class="graph-line line-b"></span>
<span class="graph-line line-c"></span>
<span class="graph-node node-a"></span>
<span class="graph-node node-b"></span>
<span class="graph-node node-c"></span>
<span class="graph-node node-d"></span>
<img class="graph-logo xiaobai-agent-logo" src="./assets/image2/xiaobai-mascot.png" alt="小白" />
</div>
<p class="welcome-hint">向小白发送消息，开始对话</p>
</div>
`;
}
// ─── 天枢控制台 ──────────────────────────────────────────
function renderTianshuDashboard() {
const online = state.devices.filter((d) => d.online);
return `
<div class="tianshu-dashboard">
<div class="tianshu-status-card">
<div class="tianshu-status-row">
<span class="tianshu-status-dot ${online.length ? 'online' : ''}"></span>
<div class="tianshu-status-info">
<strong>${online.length ? `天枢在线 · ${esc(online[0].name)}` : '等待连接'}</strong>
<small>${online.length ? '可发送任务到电脑端 AI' : '请在电脑端小白中开启远程同步'}</small>
</div>
</div>
<div class="tianshu-stats">
<span>任务 ${state.tasks.length}</span>
<span>设备 ${online.length}/${state.devices.length}</span>
</div>
</div>
${state.tianshuMessages.length
? `<div class="tianshu-message-dock">${state.tianshuMessages.slice(-4).map(renderMessage).join('')}</div>`
: `<div class="tianshu-empty">
<p>在下方输入框发送任务到电脑端 AI</p>
<span>例如：检查安装说明、整理短视频选题、分析项目文件</span>
</div>`
}
${renderComposer()}
</div>
`;
}
// ─── 登录页 ──────────────────────────────────────────────
function renderAuthGate() {
return `
<div class="auth-gate">
<div class="agent-graph">
<span class="graph-ring ring-a"></span>
<span class="graph-ring ring-b"></span>
<span class="graph-line line-a"></span>
<span class="graph-line line-b"></span>
<span class="graph-line line-c"></span>
<span class="graph-node node-a"></span>
<span class="graph-node node-b"></span>
<span class="graph-node node-c"></span>
<span class="graph-node node-d"></span>
<img class="graph-logo xiaobai-agent-logo" src="./assets/image2/xiaobai-mascot.png" alt="小白" />
</div>
<div class="auth-header">
<h1 class="auth-app-title">小白天枢</h1>
<p class="auth-app-subtitle">随身控制台</p>
</div>
<form class="auth-gate-form" data-auth-form>
<label class="auth-label">
<span class="auth-label-text">网站账号</span>
<input class="auth-input" name="email" type="email" placeholder="输入邮箱" autocomplete="email" />
</label>
<label class="auth-label">
<span class="auth-label-text">密码</span>
<input class="auth-input" name="password" type="password" placeholder="输入密码" autocomplete="current-password" />
</label>
<button type="submit" class="auth-submit-btn">登录并连接</button>
<button type="button" class="auth-skip-btn" data-action="skip-login">跳过，先看看</button>
<p class="auth-footer-hint">${state.authError ? esc(state.authError) : '设备和任务将与电脑端保持同步'}</p>
</form>
</div>
`;
}
// ─── 输入框 ──────────────────────────────────────────────
function renderComposer() {
if (state.tab === 'settings') return '';
const ph = state.tab === 'tianshu' ? '向电脑端 AI 发送指令...' : '向小白发送消息...';
return `
${state.summonOpen ? renderSummonPanel() : ''}
<form class="chat-composer" data-composer>
<button class="summon-btn" type="button" data-action="toggle-summon" aria-label="添加">${I.plus}</button>
<input name="prompt" placeholder="${ph}" autocomplete="off" enterkeyhint="send" />
<input class="attachment-input" data-attachment-input="file" type="file" />
<input class="attachment-input" data-attachment-input="photo" type="file" accept="image/*" />
<input class="attachment-input" data-attachment-input="camera" type="file" accept="image/*" capture="environment" />
<button class="send-btn" type="submit" aria-label="发送">${I.send}</button>
</form>
`;
}
// ─── 召唤面板 ─────────────────────────────────────────────
function renderSummonPanel() {
return `
<section class="summon-panel attachment-panel" aria-label="附件">
<button type="button" data-attachment="file">${I.file}<span>文件</span></button>
<button type="button" data-attachment="photo">${I.photo}<span>照片</span></button>
<button type="button" data-attachment="camera">${I.camera}<span>拍照</span></button>
<button type="button" data-action="toggle-summon" data-card="task">${I.task}<span>任务</span></button>
<button type="button" data-action="toggle-summon" data-card="weather">${I.weather}<span>天气</span></button>
<button type="button" data-action="toggle-summon" data-card="news">${I.news}<span>热点</span></button>
</section>
`;
}
// ─── 侧边栏 ──────────────────────────────────────────────
function renderSidebar() {
const allThreads = [...(state.chatThreads?.chat || []), ...(state.chatThreads?.tianshu || [])];
return `
<aside class="app-sidebar ${state.sidebarOpen ? 'open' : ''}" aria-label="侧边栏">
<div class="sidebar-scrim" data-action="close-sidebar"></div>
<div class="sidebar-panel">
<button class="sidebar-new-chat" data-action="new-chat">${I.plus}<span>新对话</span></button>
<nav class="sidebar-nav">
<button class="sidebar-nav-item ${state.tab === 'chat' ? 'active' : ''}" data-action="open-chat">${I.chat}<span>对话</span></button>
<button class="sidebar-nav-item ${state.tab === 'tianshu' ? 'active' : ''}" data-action="enter-tianshu">${I.tianshu}<span>天枢</span></button>
</nav>
<div class="sidebar-threads">
${allThreads.length ? allThreads.slice(0, 12).map((t) => `
<button class="sidebar-thread" data-action="open-chat"><span>${esc(t.title || '对话')}</span></button>
`).join('') : '<p class="sidebar-empty">暂无对话</p>'}
</div>
<div class="sidebar-bottom">
<button class="sidebar-bottom-btn" data-action="open-settings">${I.settings}<span>设置</span></button>
</div>
</div>
</aside>
`;
}
// ─── 浮动卡片 ─────────────────────────────────────────────
function renderFloatingCard() {
return `
<section class="floating-card-layer open" aria-label="卡片">
<div class="floating-card-scrim" data-action="close-card"></div>
<article class="floating-card">
<button class="floating-close-btn" data-action="close-card" aria-label="关闭">${I.close}</button>
${renderActiveCard()}
</article>
</section>
`;
}
function renderActiveCard() {
if (state.activeCard === 'weather') return renderWeatherCard();
if (state.activeCard === 'task') return renderTaskCard();
if (state.activeCard === 'file') return renderFileCard();
if (state.activeCard === 'news') return renderNewsCard();
return renderWeatherCard();
}
// ─── 天气卡片 ─────────────────────────────────────────────
function renderWeatherCard() {
return `
<div class="floating-card-content">
<div class="card-header">
<span>WEATHER</span>
<strong>天气</strong>
</div>
<div class="weather-main">
<b>上海</b>
<strong>26°C</strong>
<span>多云 · 体感舒适</span>
</div>
<div class="weather-grid">
<div class="weather-grid-item"><b>多云</b><span>体感舒适</span></div>
<div class="weather-grid-item"><b>东南风</b><span>2 级</span></div>
<div class="weather-grid-item"><b>湿度</b><span>64%</span></div>
</div>
</div>
`;
}
// ─── 任务卡片 ─────────────────────────────────────────────
function renderTaskCard() {
return `
<div class="floating-card-content">
<div class="card-header">
<span>TASK</span>
<strong>任务</strong>
</div>
<div class="task-module-list">
${state.tasks.length
? state.tasks.slice(0, 5).map((t) => `
<div class="task-module-item">
<span>${esc(t.status || '等待中')}</span>
<strong>${esc(t.title || '任务')}</strong>
<div class="progress-bar"><i style="width:${t.progress || 0}%"></i></div>
</div>
`).join('')
: '<p class="empty-hint">暂无任务</p>'
}
</div>
</div>
`;
}
// ─── 文件卡片 ─────────────────────────────────────────────
function renderFileCard() {
return `
<div class="floating-card-content">
<div class="card-header">
<span>FILE</span>
<strong>文件发送</strong>
</div>
<div class="drop-zone">${I.file}<strong>选择文件或拖入这里</strong><span>发送到天枢终端</span></div>
<button class="drop-zone-btn" type="button" data-attachment="file">${I.file}<span>选择文件</span></button>
</div>
`;
}
// ─── 热点卡片 ─────────────────────────────────────────────
function renderNewsCard() {
const now = new Date();
return `
<div class="floating-card-content">
<div class="hotspot-header">
<div class="hotspot-brand">
<span>GHTS v2.7.1</span>
<strong>全球热点追踪</strong>
</div>
<div class="hotspot-clock">
<span>${now.toLocaleTimeString('zh-CN', { hour12: false })}</span>
<div class="hotspot-live"><i></i>LIVE</div>
</div>
</div>
<div class="hotspot-status-strip">
<div class="hotspot-status-item"><i></i><span>卫星链路</span><b>ONLINE</b></div>
<div class="hotspot-status-item"><i></i><span>数据源</span><b>STABLE</b></div>
<div class="hotspot-status-item"><i></i><span>AI 分析</span><b>RUNNING</b></div>
</div>
<div class="hotspot-earth-shell">
<span class="hotspot-earth-label">GLOBAL HEATMAP</span>
<canvas id="mobile-hotspot-earth"></canvas>
<span class="hotspot-earth-hint">拖动旋转</span>
</div>
<div class="hotspot-stats">
<div class="hotspot-stat-item"><span>预警</span><strong>7</strong><em>+15m</em></div>
<div class="hotspot-stat-item"><span>高关注</span><strong>23</strong><em>+8.4%</em></div>
<div class="hotspot-stat-item"><span>数据源</span><strong>2.37M</strong><em>stream</em></div>
<div class="hotspot-stat-item"><span>置信度</span><strong>87%</strong><em>stable</em></div>
</div>
<div class="hotspot-feed-grid">
<div class="hotspot-feed-card">
<div class="hotspot-feed-header"><i class="dot-douyin"></i><span>抖音</span><b>热榜</b></div>
<div class="hotspot-feed-item"><em>01</em>AI 办公流继续升温<strong>98</strong></div>
<div class="hotspot-feed-item"><em>02</em>手机 Agent 入口加速<strong>86</strong></div>
</div>
<div class="hotspot-feed-card">
<div class="hotspot-feed-header"><i class="dot-xhs"></i><span>小红书</span><b>趋势</b></div>
<div class="hotspot-feed-item"><em>01</em>个人自动化工具<strong>91</strong></div>
<div class="hotspot-feed-item"><em>02</em>远程控制台体验<strong>79</strong></div>
</div>
</div>
</div>
`;
}
// ─── 设置页 ──────────────────────────────────────────────
function renderSettingsPage() {
return `
<section class="settings-page">
<div class="settings-header">
<button class="topbar-icon-btn" data-action="back-chat" aria-label="返回">${I.back}</button>
<h1 class="settings-title">设置</h1>
</div>
<div class="settings-body">
${renderAccountCard()}
${renderConnectionSection()}
${renderBackgroundSection()}
${renderTaskSection()}
${renderDeviceSection()}
${renderAboutSection()}
</div>
</section>
`;
}
function renderAccountCard() {
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">网站账号</span>
<span class="setting-card-badge ${state.auth?.token ? 'on' : 'off'}">${state.auth?.token ? '已登录' : '未登录'}</span>
</div>
${state.auth?.token ? `
<div class="account-info-row">
<span class="account-label">账号</span>
<span class="account-value">${esc(state.auth.user?.email || '')}</span>
</div>
` : ''}
${state.connected ? `
<div class="account-info-row">
<span class="account-label">API 状态</span>
<span class="account-value" style="color:var(--accent)">已连接</span>
</div>
` : ''}
${state.auth?.token ? `
<button class="auth-submit-btn" style="margin-top:8px;background:rgba(255,100,100,0.1);color:#ff6464" data-action="logout-account">退出登录</button>
` : ''}
</div>
`;
}
function renderConnectionSection() {
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">天枢中心</span>
<span class="setting-card-badge ${state.connected ? 'on' : 'off'}">${state.connected ? '已连接' : '未连接'}</span>
</div>
<form class="api-form" data-api-form>
<label><span>普通对话 API</span><input name="endpoint" value="${esc(state.api.chatEndpoint || state.api.endpoint || '')}" placeholder="https://..." autocomplete="url" /></label>
<label><span>远程任务 API</span><input name="desktopEndpoint" value="${esc(state.api.desktopEndpoint || '')}" placeholder="https://..." autocomplete="url" /></label>
<label><span>工作区 ID</span><input name="workspaceId" value="${esc(state.api.workspaceId || WS_WORKSPACE)}" placeholder="${WS_WORKSPACE}" /></label>
<label><span>令牌</span><input name="token" value="${esc(state.api.token || '')}" placeholder="登录后自动填充" readonly /></label>
<div class="api-actions">
<button type="submit" class="primary">保存连接</button>
<button type="button" class="secondary" data-action="clear-api">清除</button>
</div>
<small>先登录小白AI网站账号，手机会自动读取同账号电脑端 API。</small>
</form>
${renderConnectionHealth()}
${renderDeviceList()}
</div>
`;
}
function renderConnectionHealth() {
const h = state.connectionHealth || {};
const chipClass = (status) => {
if (status === 'ok') return 'ok';
if (status === 'warn') return 'warn';
if (status === 'error') return 'error';
return '';
};
return `
<div class="connection-health">
<div class="health-chips">
<span class="health-chip ${chipClass(h.chat)}"><i></i>问答 ${h.chat === 'ok' ? '正常' : h.chat === 'warn' ? '待确认' : h.chat === 'error' ? '异常' : '未连接'}</span>
<span class="health-chip ${chipClass(h.remote)}"><i></i>远程 ${h.remote === 'ok' ? '正常' : h.remote === 'warn' ? '待确认' : h.remote === 'error' ? '异常' : '未连接'}</span>
<span class="health-chip ${chipClass(h.devices)}"><i></i>设备 ${h.devices === 'ok' ? '正常' : h.devices === 'warn' ? '待确认' : h.devices === 'error' ? '异常' : '未连接'}</span>
</div>
<small>${esc(h.message || '等待连接体检。')}</small>
</div>
`;
}
function renderBackgroundSection() {
const mode = state.chatBackground?.mode || 'glass';
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">普通对话背景</span>
<span class="setting-card-badge ${mode !== 'glass' ? 'on' : 'off'}">${mode === 'custom' ? '自选图片' : mode === 'galaxy' ? '桌面银河' : '玻璃'}</span>
</div>
<div class="bg-options">
<button class="${mode === 'glass' ? 'active' : ''}" data-bg="glass">玻璃</button>
<button class="${mode === 'galaxy' ? 'active' : ''}" data-bg="galaxy">银河</button>
<button class="${mode === 'custom' ? 'active' : ''}" data-bg="custom" data-action="pick-bg">自选</button>
</div>
<input class="attachment-input" data-bg-file type="file" accept="image/*" />
</div>
`;
}
function renderTaskSection() {
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">任务</span>
<span>${state.tasks.length} 个</span>
</div>
<div class="task-list">
${state.tasks.length
? state.tasks.map((t) => `
<div class="task-item">
<div class="task-item-header">
<span class="task-status">${esc(t.status || '等待中')}</span>
<span class="task-title">${esc(t.title || '任务')}</span>
</div>
<div class="progress-bar"><i style="width:${t.progress || 0}%"></i></div>
${t.result ? `<p class="task-result">${esc(t.result)}</p>` : ''}
</div>
`).join('')
: '<p class="empty-hint">暂无任务。在对话或天枢模式中发送消息，任务会自动出现在这里。</p>'
}
</div>
</div>
`;
}
function renderDeviceSection() {
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">已连接设备</span>
<span>${state.devices.filter(d => d.online).length}/${state.devices.length}</span>
</div>
${renderDeviceList()}
</div>
`;
}
function renderDeviceList() {
if (!state.devices.length) {
return '<p class="empty-hint">未发现已连接的天枢终端。</p>';
}
return `
<div class="device-list">
${state.devices.map((d) => `
<div class="device-item">
<span class="device-dot ${d.online ? 'online' : ''}"></span>
<div class="device-info">
<strong class="device-name">${esc(d.name)}</strong>
<small class="device-meta">${esc(d.meta || '')}</small>
</div>
<button class="device-action-btn" type="button" data-action="${d.online ? 'use-device' : 'wake-device'}">${d.online ? '使用中' : '唤醒'}</button>
</div>
`).join('')}
</div>
`;
}
function renderAboutSection() {
return `
<div class="setting-card">
<div class="setting-card-header">
<span class="setting-card-title">关于</span>
<span>v0.2.3</span>
</div>
<a class="download-link" href="${state.apkUrl || '#'}">下载 Android 测试包</a>
</div>
`;
}
// ─── 错误/离线/确认对话框 ────────────────────────────────
function renderErrorBanner() {
if (!state.errorBanner) return '';
return `
<div class="error-banner" role="alert">
<span>⚠</span>
<p>${esc(state.errorBanner.message || '')}</p>
<button onclick="window.__dismissBanner()" aria-label="关闭">${I.close}</button>
${state.errorBanner.isFatal ? '<button class="error-reload-btn" onclick="location.reload()">刷新页面</button>' : ''}
</div>
`;
}
function renderOfflineBanner() {
if (state.online !== false) return '';
return `
<div class="offline-banner" role="alert">
<span>!</span>
<p>当前处于离线状态</p>
</div>
`;
}
function renderConfirmDialog() {
if (!state.confirmDialog) return '';
return `
<div class="confirm-overlay" role="alertdialog">
<div class="confirm-dialog">
<p>${esc(state.confirmDialog.message || '')}</p>
<div class="confirm-actions">
<button class="confirm-cancel-btn" onclick="window.__dismissConfirm()">取消</button>
<button class="confirm-ok-btn" onclick="window.__executeConfirm()">确定</button>
</div>
</div>
</div>
`;
}
// ─── 事件绑定 ─────────────────────────────────────────────
function bindEvents() {
const app = $el('#app');
if (!app) return;
// Click delegation for [data-action], [data-card], [data-attachment], [data-bg]
app.addEventListener('click', (e) => {
const t = e.target.closest('[data-action], [data-card], [data-attachment], [data-bg]');
if (!t) return;
const { action, card, attachment, bg } = t.dataset;
if (attachment) {
// Trigger file input
const input = app.querySelector(`[data-attachment-input="${attachment}"]`);
if (input) input.click();
return;
}
if (bg) {
saveBackground(bg);
return;
}
if (card) {
openCard(card);
return;
}
// Actions
switch (action) {
case 'sidebar':
state.sidebarOpen = true;
render();
break;
case 'close-sidebar':
state.sidebarOpen = false;
render();
break;
case 'toggle-summon':
state.summonOpen = !state.summonOpen;
render();
break;
case 'close-card':
closeCard();
break;
case 'open-settings':
state.tab = 'settings';
state.sidebarOpen = false;
render();
break;
case 'back-chat':
state.tab = 'chat';
render();
break;
case 'open-chat':
state.tab = 'chat';
state.sidebarOpen = false;
render();
break;
case 'enter-tianshu':
state.tab = 'tianshu';
state.sidebarOpen = false;
render();
break;
case 'new-chat':
createThread(state.tab);
state.tab = 'chat';
state.sidebarOpen = false;
render();
break;
case 'skip-login':
state.auth = { token: 'demo', user: { email: 'demo@xiaobai.ai' } };
state.connected = true;
state.devices = [{ name: 'MacBook Pro', online: true, meta: '天枢 v3.0' }];
render();
break;
case 'logout-account':
confirmThen('确定退出登录？', logoutAccount);
break;
case 'clear-api':
confirmThen('确定清除连接？', clearApi);
break;
case 'pick-bg':
const bgInput = app.querySelector('[data-bg-file]');
if (bgInput) bgInput.click();
break;
case 'use-device':
case 'wake-device':
haptic(10);
break;
default:
break;
}
});
// Form submissions
app.addEventListener('submit', (e) => {
e.preventDefault();
const composer = e.target.closest('[data-composer]');
if (composer) {
const input = composer.elements.prompt;
if (!input.value.trim()) return;
submitPrompt(input.value.trim());
input.value = '';
return;
}
const apiForm = e.target.closest('[data-api-form]');
if (apiForm) {
saveApiConnection({
endpoint: apiForm.elements.endpoint?.value?.trim() || '',
chatEndpoint: apiForm.elements.endpoint?.value?.trim() || '',
desktopEndpoint: apiForm.elements.desktopEndpoint?.value?.trim() || '',
workspaceId: apiForm.elements.workspaceId?.value?.trim() || WS_WORKSPACE,
token: state.auth?.token || apiForm.elements.token?.value?.trim() || '',
});
return;
}
const authForm = e.target.closest('[data-auth-form]');
if (authForm) {
login(
authForm.elements.email?.value?.trim() || '',
authForm.elements.password?.value || '',
);
return;
}
});
// File input changes
app.addEventListener('change', (e) => {
const bgFile = e.target.closest('[data-bg-file]');
if (bgFile && bgFile.files?.[0]) {
const reader = new FileReader();
reader.onload = () => saveBackground('custom', reader.result);
reader.readAsDataURL(bgFile.files[0]);
}
});
}
// ─── 手势 ────────────────────────────────────────────────
function installSwipeGestures() {
let startX = 0;
const app = $el('#app');
if (!app) return;
app.addEventListener('touchstart', (e) => {
startX = e.touches?.[0]?.clientX || 0;
}, { passive: true });
app.addEventListener('touchend', (e) => {
const dx = (e.changedTouches?.[0]?.clientX || 0) - startX;
if (state.sidebarOpen && dx < -60) {
state.sidebarOpen = false;
render();
haptic(6);
}
if (state.activeCard && Math.abs(dx) > 40) {
state.activeCard = null;
disposeEarth();
render();
haptic(6);
}
});
}
// ─── 离线检测 ─────────────────────────────────────────────
function installOfflineDetection() {
window.addEventListener('online', () => {
state.online = true;
render();
});
window.addEventListener('offline', () => {
state.online = false;
render();
});
}
// ─── 错误边界 ─────────────────────────────────────────────
function installErrorBoundary() {
const recent = [];
window.addEventListener('error', (e) => {
if (e.target?.tagName === 'IMG' || e.target?.tagName === 'SCRIPT') return;
recent.push({ msg: e.message, t: Date.now() });
if (recent.length > 5) recent.shift();
const crash = recent.filter((r) => Date.now() - r.t < 4000).length >= 3;
state.errorBanner = { message: e.message, isFatal: crash, id: Date.now() };
render();
if (crash) recent.length = 0;
});
window.addEventListener('unhandledrejection', (e) => {
state.errorBanner = { message: e.reason?.message || String(e.reason), isFatal: false, id: Date.now() };
render();
});
}
// ─── Service Worker ───────────────────────────────────────
function registerServiceWorker() {
if (!('serviceWorker' in navigator)) return;
window.addEventListener('load', () => {
navigator.serviceWorker.register('./sw.js').catch(() => {});
}, { once: true });
}
// ─── 全局回调 ─────────────────────────────────────────────
window.__dismissBanner = () => {
state.errorBanner = null;
render();
};
window.__dismissConfirm = () => {
state.confirmDialog = null;
render();
};
window.__executeConfirm = () => {
const d = state.confirmDialog;
state.confirmDialog = null;
d.cb?.();
render();
};
// ─── 初始化 ─────────────────────────────────────────────
function init() {
// Restore persisted state
try {
const savedApi = loadPersisted(LS_API);
if (savedApi) {
state.api = savedApi;
state.connected = Boolean(savedApi.token);
}
const savedAuth = loadPersisted(LS_AUTH);
if (savedAuth) {
state.auth = savedAuth;
if (savedAuth.token) {
state.connected = true;
runConnectionHealth();
}
}
const savedBg = loadPersisted(LS_BG);
if (savedBg) state.chatBackground = savedBg;
const savedThreads = loadPersisted(LS_THREADS);
if (savedThreads) {
if (savedThreads.chat) {
state.chatThreads.chat = savedThreads.chat || [];
state.messages = state.chatThreads.chat[0]?.messages || [];
state.activeThreadIds.chat = state.chatThreads.chat[0]?.id || '';
}
if (savedThreads.tianshu) {
state.chatThreads.tianshu = savedThreads.tianshu || [];
state.tianshuMessages = state.chatThreads.tianshu[0]?.messages || [];
state.activeThreadIds.tianshu = state.chatThreads.tianshu[0]?.id || '';
}
}
} catch (_) {}
applySafeArea();
installSwipeGestures();
installOfflineDetection();
installErrorBoundary();
registerServiceWorker();
render();
window.visualViewport?.addEventListener('resize', applySafeArea);
window.addEventListener('orientationchange', () => setTimeout(applySafeArea, 160));
}
// Boot
init();