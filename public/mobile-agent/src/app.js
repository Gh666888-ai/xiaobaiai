import { MobileHotspotEarth } from './mobile-hotspot-earth.js'
let activeEarth = null
let remoteSyncTimer = null
let remoteEventSource = null
let remoteEventFailures = 0
const API_STORAGE_KEY = 'xiaobai-tianshu-api-config'
const AUTH_STORAGE_KEY = 'xiaobai-tianshu-auth-session'
const CHAT_BACKGROUND_STORAGE_KEY = 'xiaobai-mobile-chat-background'
const CHAT_THREADS_STORAGE_KEY = 'xiaobai-mobile-chat-threads'
const ACTIVE_CHAT_THREAD_STORAGE_KEY = 'xiaobai-mobile-active-chat-thread'
const TELEMETRY_KEY = 'xiaobai-mobile-telemetry'
const TELEMETRY_MAX = 200
const NETWORK_TIMEOUT_MS = 18000
const NETWORK_RETRY_LIMIT = 1
const DEFAULT_API_CONFIG = {
endpoint: 'https:
chatEndpoint: 'https:
desktopEndpoint: 'https:
token: '',
saved: false,
savedAt: '',
workspaceId: 'tianshu-main',
source: 'xiaobai-website',
}
const savedAuthSession = loadSavedAuthSession()
const savedApiConfig = loadSavedApiConfig(savedAuthSession)
const savedChatBackground = loadSavedChatBackground()
const savedChatHistory = loadSavedChatHistory(savedAuthSession)
const state = {
version: '0.2.1',
apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Tianshu-Native-0.2.2.apk',
tab: 'chat',
sidebarOpen: false,
summonOpen: false,
activeCard: null,
connected: savedApiConfig.saved,
api: savedApiConfig,
auth: savedAuthSession,
authMode: 'login',
authBusy: false,
authError: '',
chatBackground: savedChatBackground,
chatHistoryAccountKey: savedChatHistory.accountKey,
chatThreads: savedChatHistory.threads,
activeThreadIds: savedChatHistory.activeThreadIds,
connectionHealth: {
checking: false,
checkedAt: '',
chat: savedApiConfig.saved ? 'idle' : 'offline',
remote: savedApiConfig.saved ? 'idle' : 'offline',
devices: savedApiConfig.saved ? 'idle' : 'offline',
message: savedApiConfig.saved ? '已保存连接，等待体检。' : '还没有保存 API 连接。',
},
messages: getThreadMessages(savedChatHistory.threads.chat, savedChatHistory.activeThreadIds.chat),
tianshuMessages: getThreadMessages(savedChatHistory.threads.tianshu, savedChatHistory.activeThreadIds.tianshu),
tasks: [
{ id: 'sample-install-check', title: '安装说明检查', status: '执行中', progress: 68, result: '等待电脑端同步真实结果。' },
{ id: 'sample-short-video', title: '短视频选题整理', status: '待确认', progress: 35, result: '' },
],
devices: [
{ name: '天枢终端 01', meta: savedApiConfig.saved ? '等待远程体检' : '未连接', online: false },
{ name: '备用终端', meta: '离线', online: false },
],
skills: ['写作整理', '代码检查', '网页操作', '文件发送'],
memories: ['项目边界', '发布规则', '常用偏好'],
errorBanner: null,
online: navigator.onLine !== false,
confirmDialog: null,
}
applyViewportInsets()
registerServiceWorker()
installErrorBoundary()
installOfflineDetection()
track('app_start', { online: state.online, connected: state.connected })
window.visualViewport?.addEventListener('resize', applyViewportInsets)
window.addEventListener('orientationchange', () => setTimeout(applyViewportInsets, 160))
installSwipeGestures()
let swipeStartX = 0
function installSwipeGestures() {
const shell = document.querySelector('#app')
if (!shell) return
shell.addEventListener('touchstart', (event) => {
swipeStartX = event.touches?.[0]?.clientX || 0
}, { passive: true })
shell.addEventListener('touchend', (event) => {
const endX = event.changedTouches?.[0]?.clientX || 0
const dx = endX - swipeStartX
if (state.sidebarOpen && dx < -60) { setSidebarOpen(false); haptic(6) }
if (state.activeCard && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs((event.changedTouches?.[0]?.clientY || 0) - (swipeStartX))) {
state.activeCard = null; haptic(6); render()
}
})
}
function render() {
disposeActiveEarth()
applyViewportInsets()
ensureChatHistoryScope()
ensureWebsiteAccountConnection({ quiet: true, skipHealth: true })
const shellMode = state.tab === 'settings' ? 'settings' : state.tab
const backgroundMode = state.chatBackground.mode || 'glass'
document.querySelector('#app').innerHTML = `
${renderOfflineBanner()}
${renderErrorBanner()}
${renderConfirmDialog()}
<main class="chat-shell mode-${shellMode} bg-${backgroundMode}" aria-label="天枢中心"${renderShellStyle()}>
${renderTopbar()}
${state.tab === 'settings' ? renderSettingsPage() : renderChatPage()}
${renderSidebar()}
${state.activeCard ? renderFloatingCard() : ''}
</main>
`
bindEvents()
mountActiveCard()
reconcileRemoteSync()
scheduleConversationScroll()
}
function scheduleConversationScroll() {
requestAnimationFrame(() => {
const surface = document.querySelector('.conversation')
if (!surface || state.sidebarOpen || state.activeCard) return
const remaining = surface.scrollHeight - surface.scrollTop - surface.clientHeight
if (remaining > 180) return
surface.scrollTo({ top: surface.scrollHeight, behavior: 'smooth' })
})
}
function registerServiceWorker() {
if (!('serviceWorker' in navigator)) return
window.addEventListener('load', () => {
navigator.serviceWorker.register('./sw.js').catch(() => {})
}, { once: true })
}
function installErrorBoundary() {
const MAX_RECENT = 5
const recentErrors = []
function showBanner(message, isFatal) {
state.errorBanner = { message, isFatal, id: Date.now() }
render()
announceToScreenReader(isFatal ? '应用遇到严重错误，请尝试刷新页面' : `错误：${message}`)
if (!isFatal) setTimeout(() => dismissBanner(), 6000)
}
function dismissBanner() {
state.errorBanner = null
render()
}
window.addEventListener('error', (event) => {
if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
console.warn('Resource load error:', event.target.src || event.target.href)
return
}
recentErrors.push({ message: event.message, time: Date.now() })
if (recentErrors.length > MAX_RECENT) recentErrors.shift()
const crashed = recentErrors.filter((e) => Date.now() - e.time < 4000).length >= 3
showBanner(event.message || '未知错误', crashed)
if (crashed) recentErrors.length = 0
})
window.addEventListener('unhandledrejection', (event) => {
const message = event.reason?.message || String(event.reason || '未处理的异步错误')
track('error_unhandled', { message })
showBanner(message, false)
})
window.__dismissErrorBanner = dismissBanner
}
function installOfflineDetection() {
window.addEventListener('online', () => {
state.online = true
render()
announceToScreenReader('网络已恢复')
})
window.addEventListener('offline', () => {
state.online = false
render()
announceToScreenReader('网络已断开，部分功能可能不可用')
})
}
function renderOfflineBanner() {
if (state.online) return ''
return `
<div class="offline-banner" role="alert">
<span>!</span>
<p>当前处于离线状态，部分功能不可用</p>
</div>
`
}
function renderErrorBanner() {
if (!state.errorBanner) return ''
const isFatal = state.errorBanner.isFatal
return `
<div class="error-banner ${isFatal ? 'fatal' : ''}" role="alert">
<span>${isFatal ? '⚠' : '!'}</span>
<p>${escapeHtml(state.errorBanner.message)}</p>
<button type="button" onclick="window.__dismissErrorBanner()" aria-label="关闭">${closeIcon()}</button>
${isFatal ? '<button type="button" class="error-reload" onclick="location.reload()">刷新页面</button>' : ''}
</div>
`
}
function renderShellStyle() {
if (state.tab === 'tianshu' && state.tab !== 'settings') return ''
const mode = state.chatBackground.mode
if (mode !== 'custom' || !state.chatBackground.customImage) return ''
return ` style="--chat-bg-image: url(&quot;${escapeHtml(state.chatBackground.customImage)}&quot;)"`
}
function renderTopbar() {
const titles = { chat: '对话', tianshu: '天枢', settings: '设置' }
const subtitles = {
chat: state.connected ? 'API 已连接' : '待连接',
tianshu: state.connected ? '远程控制台' : '未连接',
settings: '连接与偏好',
}
const inSettings = state.tab === 'settings'
return `
<header class="chat-topbar">
<button class="round-button" type="button" data-action="${inSettings ? 'back-chat' : 'sidebar'}" aria-label="${inSettings ? '返回对话' : '菜单'}">${inSettings ? backIcon() : menuIcon()}</button>
<div class="title-lockup">
<strong>${titles[state.tab] || '天枢'}</strong>
<span><i class="${state.connected ? 'ok' : ''}"></i>${subtitles[state.tab] || ''}</span>
</div>
<span class="topbar-spacer" aria-hidden="true"></span>
</header>
`
}
function renderComposer() {
if (state.tab === 'settings') return ''
return `
${state.summonOpen ? renderSummonPanel() : ''}
<form class="chat-composer" data-composer>
<button class="summon-button" type="button" data-action="toggle-summon" aria-label="附件">${plusIcon()}</button>
<input name="prompt" placeholder="向小白提问知识..." autocomplete="off" enterkeyhint="send" />
<input class="attachment-input" data-attachment-input="file" type="file" />
<input class="attachment-input" data-attachment-input="photo" type="file" accept="image/*" />
<input class="attachment-input" data-attachment-input="camera" type="file" accept="image/*" capture="environment" />
<button class="voice-button" type="button" data-action="start-voice" aria-label="语音输入">${micIcon()}</button>
<button class="send-button" type="submit" aria-label="发送">${sendIcon()}</button>
</form>
`
}
function renderChatPage() {
if (!state.auth?.token) {
return `
<section class="conversation" aria-label="登录小白AI账号">
${renderAuthGate()}
</section>
`
}
if (state.tab === 'tianshu') {
return `
<section class="conversation" aria-label="天枢电脑端界面">
${renderDesktopBrainSurface()}
</section>
`
}
return `
<section class="conversation" aria-label="对话">
<div class="phone-conversation">
${renderConversation()}
</div>
</section>
${renderComposer()}
`
}
function renderAuthGate() {
return `
<section class="auth-gate">
<div class="agent-graph auth-graph" aria-hidden="true">
<span class="graph-ring ring-a"></span>
<span class="graph-ring ring-b"></span>
<span class="graph-line line-a"></span>
<span class="graph-line line-b"></span>
<span class="graph-line line-c"></span>
<span class="graph-node node-a"></span>
<span class="graph-node node-b"></span>
<span class="graph-node node-c"></span>
<span class="graph-node node-d"></span>
<span class="graph-node node-e"></span>
<img class="graph-logo xiaobai-agent-logo" src="./icons/xiaobai-ai-agent.png" alt="" />
</div>
<form class="account-login-form auth-gate-form" data-auth-form>
<label>
<span>小白AI网站账号</span>
<input name="email" type="email" placeholder="邮箱账号" autocomplete="email" />
</label>
<label>
<span>密码</span>
<input name="password" type="password" placeholder="网站账号密码" autocomplete="current-password" />
</label>
<div class="api-actions">
<button type="submit">${state.authBusy ? '登录中' : '登录并同步电脑端 API'}</button>
</div>
<small>${state.authError ? escapeHtml(state.authError) : '登录后会自动保存账号令牌，并读取同账号电脑端小白同步的 API、设备和任务。'}</small>
</form>
</section>
`
}
function renderConversation() {
if (!state.messages.length) return renderWelcome()
return `<div class="message-stream">${state.messages.map(renderMessage).join('')}</div>`
}
function renderTianshuConversation() {
if (!state.tianshuMessages.length) return ''
return `<div class="tianshu-message-dock">${state.tianshuMessages.slice(-4).map(renderMessage).join('')}</div>`
}
function renderWelcome() {
return `
<section class="welcome">
<div class="agent-graph" aria-hidden="true">
<span class="graph-ring ring-a"></span>
<span class="graph-ring ring-b"></span>
<span class="graph-line line-a"></span>
<span class="graph-line line-b"></span>
<span class="graph-line line-c"></span>
<span class="graph-node node-a"></span>
<span class="graph-node node-b"></span>
<span class="graph-node node-c"></span>
<span class="graph-node node-d"></span>
<span class="graph-node node-e"></span>
<img class="graph-logo xiaobai-agent-logo" src="./icons/xiaobai-ai-agent.png" alt="" />
</div>
<div class="welcome-hint">
<p>向小白提问知识，或切换到<strong>天枢模式</strong>远程指挥电脑上的 AI 干活</p>
<span>${state.connected ? 'API 已连接' : '登录网站账号后解锁完整功能'}</span>
</div>
</section>
`
}
function renderDesktopBrainSurface() {
const activeDevices = state.devices.filter((d) => d.online)
return `
<section class="conversation" aria-label="天枢控制台">
<div class="tianshu-dashboard">
<div class="tianshu-status-card">
<div class="tianshu-status-row">
<span class="tianshu-status-dot ${activeDevices.length ? 'online' : ''}"></span>
<div>
<strong>${activeDevices.length ? `天枢终端在线 · ${activeDevices[0].name}` : '等待电脑端连接'}</strong>
<small>${activeDevices.length ? '可发送任务到电脑端 AI' : '请在电脑端小白中开启远程同步'}</small>
</div>
</div>
<div class="tianshu-mini-stats">
<span>任务 ${state.tasks.length}</span>
<span>设备 ${activeDevices.length}/${state.devices.length}</span>
</div>
</div>
${state.tianshuMessages.length ? `
<div class="tianshu-conversation">
${state.tianshuMessages.slice(-6).map(renderMessage).join('')}
</div>
` : `
<div class="tianshu-empty">
<p>在下方输入框发送任务到电脑端 AI</p>
<span>例如：检查安装说明、整理短视频选题、分析项目文件</span>
</div>
`}
${renderComposer()}
</div>
</section>
`
}
function renderTianshuConversation() { return '' }
function renderCognitiveSurface() {
return `
<section class="cognitive-surface" aria-label="天枢认知控制台">
<aside id="panel-l1-mobile" class="cognitive-panel cognitive-left panel">
<header class="cognitive-brand panel-identity">
<button type="button" data-action="open-chat" aria-label="返回普通对话">${backIcon()}</button>
<i class="brand-mark"></i>
<div>
<span>COGNITIVE SURFACE</span>
<strong>小白天枢</strong>
</div>
<button type="button" data-action="new-chat" aria-label="新对话">${sparkIcon()}</button>
<button type="button" data-action="sidebar" aria-label="对话列表">${menuIcon()}</button>
<button type="button" data-action="open-settings" aria-label="设置">${settingsIcon()}</button>
</header>
<div class="processor-head">
<strong>用户消息处理器</strong>
<span>LIVE</span>
</div>
<div class="processor-orb" aria-hidden="true">
${Array.from({ length: 22 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}
</div>
<div class="cognitive-mini-stats">
<span><i></i>限制 1</span>
<span><i></i>记忆 65</span>
<span><i></i>知识 0</span>
<span><i></i>奏读 0</span>
</div>
<div class="cognitive-panel-footer">
<button type="button" data-action="new-chat">重置节点图</button>
<button type="button">GRAPH TUNING</button>
</div>
</aside>
<div class="cognitive-stage" aria-hidden="true">
<div class="cognitive-starfield"></div>
<div class="cognitive-network">
${renderCognitiveNetwork()}
</div>
</div>
<aside class="cognitive-panel cognitive-right">
<div class="cognitive-status-grid">
<p><span>状态</span><strong><i></i>${state.connected ? '已连接' : '未连接'}</strong></p>
<p><span>节点</span><strong>65</strong></p>
<p><span>连线</span><strong>77</strong></p>
<p><span>TOK/S</span><strong>--</strong></p>
</div>
<section class="tick-module">
<div>
<strong>自主行动机制 · Tick</strong>
<span>小白 · 思考 · 工具</span>
</div>
<button type="button">流式传输</button>
</section>
<div class="desktop-card-buttons" aria-label="快速卡片">
<button type="button" data-card="news">${newspaperIcon()}<span>热点</span></button>
<button type="button" data-card="weather">${cloudIcon()}<span>天气</span></button>
<button type="button" data-card="task">${boxIcon()}<span>任务</span></button>
<button type="button" data-card="file">${fileIcon()}<span>文件</span></button>
</div>
<div class="desktop-task-list">
${state.tasks.slice(0, 3).map((task) => `
<article>
<span>${task.status}</span>
<strong>${task.title}</strong>
<div class="progress"><i style="width:${task.progress}%"></i></div>
</article>
`).join('')}
</div>
</aside>
</section>
`
}
function renderCognitiveNetwork() {
const nodes = [
[12, 33, 8], [18, 55, 14], [22, 23, 10], [26, 72, 11], [31, 47, 9], [36, 18, 13],
[39, 62, 12], [43, 37, 9], [47, 79, 11], [50, 50, 20], [54, 24, 12], [57, 68, 10],
[61, 42, 14], [65, 83, 11], [69, 31, 9], [72, 56, 13], [76, 18, 12], [79, 72, 10],
[83, 40, 17], [88, 60, 12], [34, 86, 10], [58, 12, 8], [15, 78, 9], [91, 28, 8],
]
const links = [
[12, 33, 38, 18], [18, 55, 43, 37], [26, 72, 50, 50], [36, 18, 61, 42],
[39, 62, 72, 56], [47, 79, 65, 83], [50, 50, 83, 40], [54, 24, 76, 18],
[61, 42, 88, 60], [22, 23, 31, 47], [34, 86, 57, 68], [58, 12, 69, 31],
]
const linkMarkup = links.map(([x1, y1, x2, y2]) => {
const length = Math.hypot(x2 - x1, y2 - y1).toFixed(1)
const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
return `<span class="cognitive-link" style="--x1:${x1};--y1:${y1};--len:${length};--angle:${angle.toFixed(1)}deg"></span>`
}).join('')
return `
${linkMarkup}
${nodes.map(([x, y, size], index) => `<span class="cognitive-node ${index === 9 ? 'core' : ''}" style="--x:${x};--y:${y};--s:${size}px"></span>`).join('')}
`
}
function renderMessage(message) {
const isTyping = Boolean(message.typing)
return `
<article class="bubble ${message.role}${isTyping ? ' typing' : ''}">
<p>${isTyping ? renderTypingDots(escapeHtml(message.text)) : escapeHtml(message.text)}</p>
<time>${message.time}</time>
</article>
`
}
function renderTypingDots(label) {
return `
<span class="typing-label">${label}</span>
<span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>
`
}
function renderFloatingCard() {
return `
<section class="floating-card-layer" aria-label="召唤卡片">
<button class="floating-card-scrim" type="button" data-action="close-card" aria-label="关闭卡片"></button>
<article class="floating-card ${state.activeCard}">
<button class="floating-close" type="button" data-action="close-card" aria-label="关闭">${closeIcon()}</button>
${renderActiveCard()}
</article>
</section>
`
}
function renderActiveCard() {
if (state.activeCard === 'weather') return renderWeatherCard()
if (state.activeCard === 'task') return renderTaskCard()
if (state.activeCard === 'file') return renderFileCard()
return renderNewsCard()
}
function renderNewsCard() {
return `
<section class="summoned-card news-card mobile-hotspot-panel">
<div class="hotspot-scanline" aria-hidden="true"></div>
<div class="mobile-hotspot-header">
<div class="hotspot-title-block">
<div class="hotspot-brand-row">
<span>GHTS v2.7.1</span>
<i></i>
<b>SYSTEM ONLINE</b>
</div>
<strong>GLOBAL HOTSPOT</strong>
<em>TRACKING SYSTEM · 全球热点事件追踪系统</em>
</div>
<div class="hotspot-clock">
<span>00:24:19</span>
<b><i></i>LIVE</b>
</div>
</div>
<div class="hotspot-status-strip" aria-label="热点系统状态">
<p><i></i><span>卫星链路</span><b>ONLINE</b></p>
<p><i></i><span>数据源</span><b>STABLE</b></p>
<p><i></i><span>AI 分析</span><b>RUNNING</b></p>
</div>
<div class="hotspot-earth-shell">
<div class="hotspot-earth-label">GLOBAL HEATMAP</div>
<canvas id="mobile-hotspot-earth" aria-label="实时旋转地球"></canvas>
<div class="hotspot-earth-hint">拖动旋转</div>
</div>
<div class="hotspot-stats">
<p class="warn"><span>预警</span><strong>7</strong><em>+15m</em></p>
<p class="hot"><span>高关注</span><strong>23</strong><em>+8.4%</em></p>
<p class="data"><span>数据源</span><strong>2.37M</strong><em>stream</em></p>
<p class="ai"><span>置信度</span><strong>87%</strong><em>stable</em></p>
</div>
<div class="hotspot-feed-grid">
<section class="hotspot-feed-card">
<header><i class="dot-douyin"></i><span>抖音</span><b>热榜</b></header>
<p><em>01</em><span>AI 办公流继续升温</span><strong>98</strong></p>
<p><em>02</em><span>手机 Agent 入口加速</span><strong>86</strong></p>
</section>
<section class="hotspot-feed-card">
<header><i class="dot-xhs"></i><span>小红书</span><b>趋势</b></header>
<p><em>01</em><span>个人自动化工具</span><strong>91</strong></p>
<p><em>02</em><span>远程控制台体验</span><strong>79</strong></p>
</section>
</div>
<div class="hotspot-region-panel">
<div class="region-title">REGION RANKING</div>
<p><span>亚太地区</span><i style="width:78%"></i><b>78%</b></p>
<p><span>北美地区</span><i style="width:62%"></i><b>62%</b></p>
<p><span>欧洲地区</span><i style="width:48%"></i><b>48%</b></p>
</div>
<div class="hotspot-ticker" aria-hidden="true">
<div>
<span>00:24:19</span> GLOBAL SIGNAL ONLINE
<i></i><span>00:24:23</span> APAC HEAT INDEX +12.6%
<i></i><span>00:24:28</span> AGENT MOBILE ENTRY RISING
<i></i><span>00:24:31</span> SOURCE STREAM STABLE
</div>
</div>
</section>
`
}
function mountActiveCard() {
if (state.activeCard !== 'news') return
const canvas = document.querySelector('#mobile-hotspot-earth')
if (!canvas) return
activeEarth = new MobileHotspotEarth(canvas)
activeEarth.init().catch(() => {
canvas.closest('.hotspot-earth-shell')?.classList.add('earth-fallback')
})
}
function disposeActiveEarth() {
if (!activeEarth) return
activeEarth.dispose()
activeEarth = null
}
function setSidebarOpen(open) {
state.sidebarOpen = Boolean(open)
document.querySelector('.app-sidebar')?.classList.toggle('open', state.sidebarOpen)
}
function navigateTo(dest) {
if (dest === 'settings') { state.tab = 'settings'; state.sidebarOpen = false; render(); return }
state.tab = dest === 'tianshu' ? 'tianshu' : 'chat'
state.sidebarOpen = false; state.summonOpen = false
render()
}
function renderWeatherCard() {
return `
<section class="summoned-card weather-card">
<div class="card-head">
<span>WEATHER MODULE</span>
<strong>天气卡片</strong>
</div>
<div class="weather-main">
<b>上海</b>
<strong>26°C</strong>
<span>多云 · 体感舒适</span>
</div>
<div class="weather-grid">
<p><b>多云</b><span>体感舒适</span></p>
<p><b>东南风</b><span>2 级</span></p>
<p><b>湿度</b><span>64%</span></p>
</div>
</section>
`
}
function renderTaskCard() {
return `
<section class="summoned-card task-module">
<div class="card-head">
<span>TASK MODULE</span>
<strong>任务卡片</strong>
</div>
<div class="task-module-list">
${state.tasks.slice(0, 3).map((task) => `
<article class="${task.error ? 'task-error' : ''}">
<span>${escapeHtml(task.status || '等待中')}</span>
<strong>${escapeHtml(task.title || '远程任务')}</strong>
<div class="progress"><i style="width:${clampProgress(task.progress)}%"></i></div>
${task.result || task.error ? `<small>${escapeHtml(task.error || task.result)}</small>` : ''}
</article>
`).join('')}
</div>
</section>
`
}
function renderFileCard() {
return `
<section class="summoned-card file-module">
<div class="card-head">
<span>FILE TRANSFER</span>
<strong>文件发送</strong>
</div>
<div class="drop-zone">
${fileIcon()}
<strong>选择文件或拖入这里</strong>
<span>发送到天枢终端 01</span>
</div>
<button class="module-primary" type="button">选择文件</button>
</section>
`
}
function renderComposer() {
return `
${state.summonOpen ? renderSummonPanel() : ''}
<form class="chat-composer" data-composer>
<button class="summon-button" type="button" data-action="toggle-summon" aria-label="附件">${plusIcon()}</button>
<input name="prompt" placeholder="向小白提问知识..." autocomplete="off" enterkeyhint="send" />
<input class="attachment-input" data-attachment-input="file" type="file" />
<input class="attachment-input" data-attachment-input="photo" type="file" accept="image/*" />
<input class="attachment-input" data-attachment-input="camera" type="file" accept="image/*" capture="environment" />
<button class="voice-button" type="button" data-action="start-voice" aria-label="语音输入">${micIcon()}</button>
<button class="send-button" type="submit" aria-label="发送">${sendIcon()}</button>
</form>
`
}
function micIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>'
}
function startVoiceInput() {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition
if (!SR) { announceToScreenReader('浏览器不支持语音'); return }
haptic(10)
const rec = new SR()
rec.lang = 'zh-CN'
rec.interimResults = false
rec.onresult = (e) => {
const t = e.results?.[0]?.[0]?.transcript?.trim()
if (!t) return
const inp = document.querySelector('[data-composer] [name="prompt"]')
if (inp) { inp.value = t; inp.focus(); haptic(8) }
}
rec.onerror = () => announceToScreenReader('语音识别失败')
rec.start()
}
function renderSummonPanel() {
return `
<section class="summon-panel attachment-panel" aria-label="发送附件">
<button type="button" data-attachment="file">${fileIcon()}<span>发送文件</span></button>
<button type="button" data-attachment="photo">${imageIcon()}<span>发送照片</span></button>
<button type="button" data-attachment="camera">${cameraIcon()}<span>拍照</span></button>
</section>
`
}
function renderSidebar() {
const modes = [
{ key: 'chat', icon: chatIcon(), label: '对话' },
{ key: 'tianshu', icon: tianshuIcon(), label: '天枢' },
]
return `
<aside class="app-sidebar ${state.sidebarOpen ? 'open' : ''}" aria-label="侧边栏">
<button class="sidebar-scrim" type="button" data-action="close-sidebar" aria-label="关闭"></button>
<div class="sidebar-panel">
<header class="sidebar-head">
<strong>小白 Agent</strong>
<button class="icon-button" type="button" data-action="close-sidebar" aria-label="关闭">${closeIcon()}</button>
</header>
<nav class="sidebar-modes" aria-label="切换模式">
${modes.map((m) => `
<button type="button" class="sidebar-mode-btn ${state.tab === m.key ? 'active' : ''}" data-action="${m.key === 'chat' ? 'open-chat' : 'enter-tianshu'}">
${m.icon}<span>${m.label}</span>
</button>
`).join('')}
</nav>
<button class="new-chat-action" type="button" data-action="new-chat">${plusIcon()}<span>新对话</span></button>
<section class="sidebar-body">
<div class="conversation-list">
<div class="history-title">对话历史</div>
${(state.chatThreads[state.tab] || []).slice(0, 8).map((thread) => `
<button type="button" class="conversation-row" data-action="open-chat">
${chatIcon()}<span>${escapeHtml(thread.title || '对话')}</span>
</button>
`).join('')}
</div>
</section>
<button class="sidebar-settings" type="button" data-action="open-settings">${settingsIcon()}<span>设置</span></button>
</div>
</aside>
`
}
function renderSettingsPage() {
return `
<section class="settings-page" aria-label="设置">
<div class="settings-hero">
<strong>天枢中心</strong>
<span>${state.connected ? '随身控制台已连接' : '未连接'}</span>
</div>
<div class="settings-page-body">
${renderBackgroundSection()}
${renderConnectionSection()}
${renderTasksSection()}
${renderSkillsSection()}
${renderMemorySection()}
${renderAboutSection()}
</div>
</section>
`
}
function renderBackgroundSection() {
const current = state.chatBackground.mode || 'glass'
return `
<section class="setting-section background-section">
<div class="section-title">
<h2>普通对话背景</h2>
<span class="status-chip ${current !== 'glass' ? 'online' : ''}">${current === 'custom' ? '自选图片' : current === 'galaxy' ? '桌面银河' : '玻璃'}</span>
</div>
<div class="background-options" aria-label="普通对话背景">
<button class="${current === 'glass' ? 'active' : ''}" type="button" data-background-preset="glass"><span>玻璃</span></button>
<button class="${current === 'galaxy' ? 'active' : ''}" type="button" data-background-preset="galaxy"><span>桌面银河</span></button>
<button class="${current === 'custom' ? 'active' : ''}" type="button" data-action="pick-background"><span>自选图片</span></button>
</div>
<input class="attachment-input" data-background-file type="file" accept="image/*" />
</section>
`
}
function renderConnectionSection() {
const loggedIn = Boolean(state.auth?.token)
const accountLabel = state.auth?.user?.email || state.auth?.user?.name || ''
return `
<section class="setting-section">
<div class="section-title">
<h2>天枢中心</h2>
<span class="status-chip ${state.connected ? 'online' : ''}">${loggedIn ? '网站账号已登录' : '未登录'}</span>
</div>
${loggedIn ? `
<div class="account-session-card">
<div>
<span>小白AI 网站账号</span>
<strong>${escapeHtml(accountLabel || '已登录')}</strong>
<small>${state.connected ? '已自动保存账号令牌，正在使用同账号电脑端 API。' : '账号已保存，等待连接体检。'}</small>
</div>
<button type="button" data-action="logout-account">退出</button>
</div>
` : renderLoginForm()}
<form class="api-connect-form" data-api-form>
<label>
<span>普通对话 API</span>
<input name="endpoint" value="${escapeHtml(state.api.chatEndpoint || state.api.endpoint)}" placeholder="https:
</label>
<label>
<span>电脑任务 API</span>
<input name="desktopEndpoint" value="${escapeHtml(state.api.desktopEndpoint)}" placeholder="https:
</label>
<label>
<span>共享工作区</span>
<input name="workspaceId" value="${escapeHtml(state.api.workspaceId)}" placeholder="tianshu-main" autocomplete="off" />
</label>
<label>
<span>网站账号令牌</span>
<input name="token" value="${escapeHtml(state.api.token)}" placeholder="登录网站账号后自动保存" autocomplete="off" readonly />
</label>
<div class="api-actions">
<button type="submit">${state.connected ? '更新连接' : '连接并保存'}</button>
<button type="button" data-action="clear-api">清除</button>
</div>
${state.api.saved ? `<small>已保存 · ${escapeHtml(state.api.savedAt || '本机')}</small>` : '<small>先登录小白AI网站账号，手机会自动读取同账号电脑端 API。</small>'}
</form>
${renderConnectionHealth()}
<div class="device-list">
${state.devices.length ? state.devices.map((device) => `
<article class="device-row">
<i class="${device.online ? 'online' : ''}"></i>
<div>
<strong>${device.name}</strong>
<small>${device.meta}</small>
</div>
<button type="button">${device.online ? '使用中' : '唤醒'}</button>
</article>
`).join('') : '<p class="empty-hint">未发现已连接的天枢终端。请在电脑端小白中开启远程同步。</p>'}
</div>
</section>
`
}
function renderLoginForm() {
return `
<form class="account-login-form" data-auth-form>
<label>
<span>网站账号邮箱</span>
<input name="email" type="email" placeholder="输入小白AI网站账号" autocomplete="email" />
</label>
<label>
<span>密码</span>
<input name="password" type="password" placeholder="输入网站账号密码" autocomplete="current-password" />
</label>
<div class="api-actions">
<button type="submit">${state.authBusy ? '登录中' : '登录并同步电脑端 API'}</button>
</div>
<small>${state.authError ? escapeHtml(state.authError) : '登录后会保存网站 access token，并自动体检普通问答、远程中继和电脑在线状态。'}</small>
</form>
`
}
function renderConnectionHealth() {
const health = state.connectionHealth
return `
<div class="connection-health" aria-label="连接体检">
<div class="health-row">
${renderHealthChip('问答', health.chat)}
${renderHealthChip('远程', health.remote)}
${renderHealthChip('电脑', health.devices)}
</div>
<small>${escapeHtml(health.message || '等待连接体检。')}${health.checkedAt ? ` · ${escapeHtml(health.checkedAt)}` : ''}</small>
</div>
`
}
function renderHealthChip(label, status) {
const normalized = ['ok', 'warn', 'error', 'checking', 'idle', 'offline'].includes(status) ? status : 'idle'
const text = {
ok: '正常',
warn: '待确认',
error: '异常',
checking: '检测中',
idle: '未检测',
offline: '未连接',
}[normalized]
return `<span class="health-chip ${normalized}"><i></i>${label}${text}</span>`
}
function renderTasksSection() {
return `
<section class="setting-section">
<div class="section-title">
<h2>任务</h2>
<span>${state.tasks.length} 个</span>
</div>
<div class="task-stack">
${state.tasks.length ? state.tasks.map((task) => `
<article class="task-card">
<div>
<span>${escapeHtml(task.status || '等待中')}</span>
<h3>${escapeHtml(task.title || '远程任务')}</h3>
</div>
<div class="progress"><i style="width:${clampProgress(task.progress)}%"></i></div>
${task.result || task.error ? `<small>${escapeHtml(task.error || task.result)}</small>` : ''}
</article>
`).join('') : '<p class="empty-hint">暂无任务。在对话或天枢模式中发送消息，任务会自动出现在这里。</p>'}
</div>
</section>
`
}
function renderSkillsSection() {
return `
<section class="setting-section">
<div class="section-title">
<h2>技能</h2>
<span>${state.skills.length} 个</span>
</div>
<div class="chip-grid">
${state.skills.map((skill) => `<button type="button">${boxIcon()}<span>${skill}</span></button>`).join('')}
</div>
</section>
`
}
function renderMemorySection() {
return `
<section class="setting-section">
<div class="section-title">
<h2>记忆</h2>
<span>72%</span>
</div>
<div class="memory-meter"><i style="width:72%"></i></div>
<div class="memory-list">
${state.memories.map((item) => `<p>${item}</p>`).join('')}
</div>
</section>
`
}
function renderAboutSection() {
return `
<section class="setting-section compact">
<div class="section-title">
<h2>关于</h2>
<span>v${state.version}</span>
</div>
<a class="download-link" href="${state.apkUrl}">下载 Android 测试包</a>
</section>
`
}
let shellDelegationBound = false
function bindEvents() {
ensureWebsiteAccountConnection({ quiet: true })
refreshAuthSessionIfNeeded().catch(() => {})
if (!shellDelegationBound) {
shellDelegationBound = true
const shell = document.querySelector('#app')
if (!shell) return
shell.addEventListener('click', (event) => {
const target = event.target.closest('[data-action], [data-card], [data-attachment]')
if (!target) return
const action = target.dataset.action
const card = target.dataset.card
const attachKind = target.dataset.attachment
if (target.dataset.tab) { navigateTo(target.dataset.tab); return }
if (action === 'sidebar') { setSidebarOpen(true); return }
if (action === 'close-sidebar') { setSidebarOpen(false); return }
if (action === 'new-chat') {
createChatThread(state.tab)
state.tab = 'chat'; state.sidebarOpen = false; render(); return
}
if (action === 'open-settings') { navigateTo('settings'); return }
if (action === 'back-chat') { navigateTo('chat'); return }
if (action === 'enter-tianshu') { navigateTo('tianshu'); return }
if (action === 'open-chat') { navigateTo('chat'); return }
if (action === 'toggle-summon') { state.summonOpen = !state.summonOpen; render(); return }
if (action === 'start-voice') { startVoiceInput(); return }
if (action === 'close-card') { state.activeCard = null; render(); return }
if (action === 'logout-account') { confirmThen('退出登录后需要重新输入账号密码。确定退出？', clearAuthSession); return }
if (action === 'clear-api') { confirmThen('清除后需重新登录网站账号并保存连接。确定清除？', clearApiConnection); return }
if (action === 'pick-background') { shell.querySelector('[data-background-file]')?.click(); return }
if (card) { openCard(card); return }
if (attachKind) { shell.querySelector(`[data-attachment-input="${attachKind}"]`)?.click(); return }
})
shell.addEventListener('click', (event) => {
const btn = event.target.closest('[data-background-preset]')
if (!btn) return
saveChatBackground({ mode: btn.dataset.backgroundPreset })
})
shell.addEventListener('submit', (event) => {
const composer = event.target.closest('[data-composer]')
if (composer) {
event.preventDefault()
const input = composer.elements.prompt
submitPromptV2(input.value)
input.value = ''
return
}
const apiForm = event.target.closest('[data-api-form]')
if (apiForm) {
event.preventDefault()
const f = apiForm
saveApiConnection(f.elements.endpoint.value.trim(), state.auth?.token || f.elements.token.value.trim(), f.elements.desktopEndpoint.value.trim(), f.elements.workspaceId.value.trim())
return
}
const authForm = event.target.closest('[data-auth-form]')
if (authForm) {
event.preventDefault()
const f = authForm
loginWithWebsiteAccount(f.elements.email.value.trim(), f.elements.password.value).catch((error) => {
state.authBusy = false; state.authError = error?.message || '登录失败，请稍后再试。'; render()
})
return
}
})
shell.addEventListener('change', (event) => {
const input = event.target.closest('[data-attachment-input]')
if (input) {
const file = input.files?.[0]
if (!file) return
const kind = input.dataset.attachmentInput
const label = kind === 'camera' ? '拍照' : kind === 'photo' ? '照片' : '文件'
appendMessage({ role: 'user', text: `已选择${label}：${file.name}`, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }, { mode: 'chat' })
state.summonOpen = false; input.value = ''; render(); return
}
const bgFile = event.target.closest('[data-background-file]')
if (bgFile && bgFile.files?.[0]) {
const reader = new FileReader()
reader.onload = () => {
if (typeof reader.result !== 'string') return
saveChatBackground({ mode: 'custom', customImage: reader.result })
}
reader.readAsDataURL(bgFile.files[0])
}
})
}
}
function submitPrompt(rawText) {
const text = rawText.trim()
if (!text) return
appendMessage({ role: 'user', text, time: currentTime() }, { mode: 'chat' })
appendMessage({
role: 'assistant',
text: state.connected ? '收到，已同步到天枢中心。' : '收到，已先保存为草稿。',
time: currentTime(),
}, { mode: 'chat' })
state.tasks.unshift({
title: text,
status: state.connected ? '已发送' : '草稿',
progress: state.connected ? 18 : 0,
})
render()
}
async function submitPromptV2(rawText) {
const text = rawText.trim()
if (!text) return
const mode = state.tab === 'tianshu' ? 'tianshu' : 'chat'
haptic(12)
track('message_send', { mode, connected: state.connected })
appendMessage({ role: 'user', text, time: currentTime() }, { mode })
const taskEntry = mode === 'tianshu'
? createLocalTask(text, state.connected ? '正在下发' : '草稿', state.connected ? 8 : 0)
: null
const assistantMessage = {
role: 'assistant',
text: state.connected ? (state.tab === 'tianshu' ? '正在下发到电脑端天枢，等待任务回执。' : '正在调用已保存 API 回答。') : '还没有保存 API，我先把这条内容留在本机。',
time: currentTime(),
typing: state.connected,
}
appendMessage(assistantMessage, { mode })
render()
if (!state.connected) return
try {
const result = mode === 'tianshu'
? await sendDesktopTask(text, taskEntry)
: await askKnowledgeApi(text)
assistantMessage.text = result || assistantMessage.text
assistantMessage.typing = false
track('message_response', { mode, ok: true })
} catch (error) {
if (taskEntry) {
Object.assign(taskEntry, {
status: '下发失败',
progress: 100,
error: error?.message || '任务下发失败',
})
}
assistantMessage.text = mode === 'tianshu'
? `电脑端任务 API 暂时没有接收：${error?.message || '请检查设置里的远程连接。'}`
: `普通问答 API 暂时没有返回：${error?.message || '请检查设置里的 API 地址或令牌。'}`
assistantMessage.typing = false
haptic([30, 50, 30])
track('message_error', { mode, error: error?.message || 'unknown' })
announceToScreenReader('消息发送失败')
}
assistantMessage.time = currentTime()
saveChatHistory()
render()
if (!assistantMessage.typing) announceToScreenReader('收到回复')
}
async function askKnowledgeApi(message) {
const response = await fetchWithRetry(defaultApiConfig().chatEndpoint, {
method: 'POST',
headers: apiHeaders(),
body: JSON.stringify({
content: message,
message,
mode: 'knowledge-chat',
source: 'mobile',
workspaceId: state.api.workspaceId,
modelConfig: { useDesktopModel: true },
}),
})
const data = await readApiJson(response)
return extractApiText(data) || '模型已响应，但没有返回文本内容。'
}
async function sendDesktopTask(task, taskEntry = null) {
const response = await fetchWithRetry(defaultApiConfig().desktopEndpoint, {
method: 'POST',
headers: apiHeaders(),
body: JSON.stringify({
content: task,
task,
channel: 'MOBILE_APP',
mode: 'tianshu-task',
source: 'mobile',
workspaceId: state.api.workspaceId,
}),
})
const data = await readApiJson(response)
const remoteTask = data.task || data
const remoteId = remoteTask?.id || data.taskId || data.id || ''
if (taskEntry) {
Object.assign(taskEntry, {
remoteId,
status: remoteId ? '等待电脑接收' : '已下发',
progress: remoteId ? 18 : 12,
result: remoteId ? `任务编号 ${remoteId}` : '',
error: '',
})
}
pollRemoteTasks({ quiet: true }).catch(() => {})
return extractApiText(data) || (remoteId ? `电脑端天枢已接收任务，编号 ${remoteId}。` : '电脑端天枢已接收任务。')
}
async function readApiJson(response) {
const data = await response.json().catch(() => ({}))
if (!response.ok) {
throw new Error(extractApiError(data) || `HTTP ${response.status}`)
}
return data
}
async function fetchWithRetry(url, options = {}, { timeout = NETWORK_TIMEOUT_MS, retries = NETWORK_RETRY_LIMIT } = {}) {
let lastError
for (let attempt = 0; attempt <= retries; attempt += 1) {
const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), timeout)
try {
const response = await fetch(url, { ...options, signal: controller.signal })
if (response.ok || response.status < 500 || attempt >= retries) return response
lastError = new Error(`HTTP ${response.status}`)
} catch (error) {
lastError = error
if (attempt >= retries) break
} finally {
clearTimeout(timer)
}
await wait(450 * (attempt + 1))
}
if (lastError?.name === 'AbortError') throw new Error('请求超时，请检查网络或稍后重试。')
throw lastError || new Error('网络请求失败。')
}
function wait(ms) {
return new Promise((resolve) => setTimeout(resolve, ms))
}
function apiHeaders() {
const headers = { 'Content-Type': 'application/json' }
if (state.api.token) headers.Authorization = `Bearer ${state.api.token}`
return headers
}
function extractApiError(data) {
if (!data || typeof data !== 'object') return ''
return data.error || data.message || data.detail || data.reason || ''
}
function extractApiText(data) {
if (!data || typeof data !== 'object') return ''
return data.answer || data.reply || data.message || data.text || data.result || ''
}
function createLocalTask(title, status, progress) {
const task = {
id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
remoteId: '',
title,
status,
progress,
result: '',
error: '',
}
state.tasks.unshift(task)
return task
}
function reconcileRemoteSync() {
if (!state.connected) {
stopRemoteSync()
return
}
if (!remoteSyncTimer) {
remoteSyncTimer = setInterval(() => {
pollRemoteTasks({ quiet: true }).catch(() => {})
}, 8000)
}
if (!remoteEventSource && state.api.token && typeof EventSource !== 'undefined') {
const eventsUrl = apiUrlWithToken(remoteEventsEndpoint())
try {
remoteEventSource = new EventSource(eventsUrl)
remoteEventSource.addEventListener('task_updated', (event) => {
remoteEventFailures = 0
const payload = parseEventData(event)
;(payload?.tasks || []).forEach(updateTaskFromRemote)
render()
})
remoteEventSource.addEventListener('response', (event) => {
remoteEventFailures = 0
const payload = parseEventData(event)
if (payload?.content) upsertAssistantRemoteMessage(payload)
})
remoteEventSource.addEventListener('remote_error', () => {
updateConnectionHealth({ remote: 'warn', message: '远程事件流暂时不可用，已切换为轮询。' })
})
remoteEventSource.onerror = () => {
remoteEventFailures += 1
updateConnectionHealth({ remote: 'warn', message: remoteEventFailures >= 3 ? '远程事件流已降级为轮询。' : '远程事件流正在自动重连。' })
if (remoteEventFailures >= 3) stopRemoteEventSource()
}
} catch {
stopRemoteEventSource()
}
}
}
function stopRemoteSync() {
if (remoteSyncTimer) {
clearInterval(remoteSyncTimer)
remoteSyncTimer = null
}
stopRemoteEventSource()
}
function stopRemoteEventSource() {
if (!remoteEventSource) return
try {
remoteEventSource.close()
} catch {}
remoteEventSource = null
remoteEventFailures = 0
}
function parseEventData(event) {
try {
return JSON.parse(event.data || '{}')?.data || JSON.parse(event.data || '{}')
} catch {
return null
}
}
async function runConnectionHealthCheck({ quiet = false } = {}) {
if (!state.connected) return
state.connectionHealth = {
...state.connectionHealth,
checking: true,
chat: 'checking',
remote: 'checking',
devices: 'checking',
message: '正在检查问答、远程中继和电脑在线状态。',
}
if (!quiet) render()
const next = {
checking: false,
checkedAt: currentTime(),
chat: 'warn',
remote: 'warn',
devices: 'warn',
message: '',
}
try {
const chat = await fetchWithRetry(state.api.chatEndpoint || state.api.endpoint, {
method: 'POST',
headers: apiHeaders(),
body: JSON.stringify({ content: '连接体检', source: 'mobile-healthcheck', workspaceId: state.api.workspaceId }),
})
next.chat = chat.ok ? 'ok' : 'error'
} catch {
next.chat = 'error'
}
try {
const remote = await fetchWithRetry(apiUrlWithToken(remoteHealthEndpoint()), { headers: apiHeaders() })
const data = await remote.json().catch(() => ({}))
next.remote = remote.ok && data?.ok !== false ? 'ok' : 'error'
} catch {
next.remote = 'error'
}
try {
const data = await fetchRemoteJson(remoteDevicesEndpoint())
const devices = Array.isArray(data.devices) ? data.devices : []
state.devices = devices.length
? devices.map((device, index) => ({
name: device.device_name || device.deviceName || `天枢终端 ${index + 1}`,
meta: device.online ? '天枢中心在线' : '离线',
online: !!device.online,
}))
: [{ name: '天枢终端 01', meta: '未发现在线电脑', online: false }]
next.devices = state.devices.some((device) => device.online) ? 'ok' : 'warn'
} catch {
state.devices = [{ name: '天枢终端 01', meta: '设备读取失败', online: false }]
next.devices = 'error'
}
next.message = summarizeHealth(next)
state.connectionHealth = next
if (!quiet) render()
}
function summarizeHealth(health) {
if (health.chat === 'ok' && health.remote === 'ok' && health.devices === 'ok') return '问答、远程中继和电脑在线状态正常。'
if (health.chat === 'error') return '普通问答 API 暂不可用，请检查 Base URL、Key 或模型名。'
if (health.remote === 'error') return '远程中继暂不可用，请检查登录令牌或 Supabase 远程表。'
if (health.devices !== 'ok') return '远程中继可用，但暂未发现在线电脑端小白。'
return '连接已保存，部分能力仍需确认。'
}
function updateConnectionHealth(patch) {
state.connectionHealth = {
...state.connectionHealth,
...patch,
checkedAt: patch.checkedAt || currentTime(),
}
}
async function pollRemoteTasks({ quiet = false } = {}) {
if (!state.connected) return
const data = await fetchRemoteJson(remoteTasksEndpoint())
;(data.tasks || []).forEach(updateTaskFromRemote)
if (!quiet) render()
}
async function fetchRemoteJson(url) {
const response = await fetchWithRetry(apiUrlWithToken(url), { headers: apiHeaders() })
return readApiJson(response)
}
function updateTaskFromRemote(remoteTask) {
if (!remoteTask?.id) return
const remoteId = String(remoteTask.id)
const existing = state.tasks.find((task) => task.remoteId === remoteId)
|| state.tasks.find((task) => task.title === remoteTask.content)
const next = existing || {
id: `remote-${remoteId}`,
remoteId,
title: remoteTask.content || '远程任务',
status: '等待中',
progress: 0,
result: '',
error: '',
}
next.remoteId = remoteId
next.title = remoteTask.content || next.title
next.status = remoteStatusLabel(remoteTask.status)
next.progress = remoteStatusProgress(remoteTask.status)
next.result = remoteTask.result || next.result || ''
next.error = remoteTask.error || ''
if (!existing) state.tasks.unshift(next)
if (['completed', 'failed', 'aborted'].includes(String(remoteTask.status || '')) && !next.notified) {
next.notified = true
appendMessage({
role: 'assistant',
text: next.error || next.result || `${next.title}：${next.status}`,
time: currentTime(),
remoteKey: `task:${remoteId}`,
}, { mode: 'tianshu' })
}
}
function upsertAssistantRemoteMessage(message) {
const text = String(message.content || '').trim()
if (!text) return
const key = `${message.task_id || ''}:${text}`
if (state.tianshuMessages.some((item) => item.remoteKey === key)) return
appendMessage({
role: message.role === 'system' ? 'assistant' : 'assistant',
text,
time: currentTime(),
remoteKey: key,
}, { mode: 'tianshu' })
if (state.tab === 'tianshu') render()
}
function remoteStatusLabel(status) {
const normalized = String(status || '').toLowerCase()
if (normalized === 'pending') return '等待电脑接收'
if (normalized === 'running') return '执行中'
if (normalized === 'completed') return '已完成'
if (normalized === 'failed') return '失败'
if (normalized === 'aborted') return '已取消'
return '等待中'
}
function remoteStatusProgress(status) {
const normalized = String(status || '').toLowerCase()
if (normalized === 'pending') return 18
if (normalized === 'running') return 62
if (normalized === 'completed') return 100
if (normalized === 'failed' || normalized === 'aborted') return 100
return 10
}
function clampProgress(value) {
const progress = Number(value)
if (!Number.isFinite(progress)) return 0
return Math.max(0, Math.min(100, progress))
}
function remoteBaseEndpoint() {
const endpoint = state.api.desktopEndpoint || defaultApiConfig().desktopEndpoint
return endpoint.replace(/\/tasks\/?$/i, '').replace(/\/+$/, '')
}
function remoteTasksEndpoint() {
return `${remoteBaseEndpoint()}/tasks`
}
function remoteHealthEndpoint() {
return `${remoteBaseEndpoint()}/health`
}
function remoteDevicesEndpoint() {
return `${remoteBaseEndpoint()}/devices`
}
function remoteEventsEndpoint() {
return `${remoteBaseEndpoint()}/events`
}
function apiUrlWithToken(url) {
if (!state.api.token) return url
const separator = url.includes('?') ? '&' : '?'
return `${url}${separator}token=${encodeURIComponent(state.api.token)}`
}
function openCard(card) {
state.activeCard = ['news', 'weather', 'task', 'file'].includes(card) ? card : 'news'
state.summonOpen = false
render()
}
function currentAccountKey(authSession = state.auth) {
const user = authSession?.user || {}
const identity = user.id || user.email || authSession?.token?.slice(0, 16) || 'guest'
return String(identity).trim().toLowerCase() || 'guest'
}
function normalizeChatMode(mode) {
return mode === 'tianshu' ? 'tianshu' : 'chat'
}
function createEmptyThread(mode) {
return {
id: `${normalizeChatMode(mode)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
title: mode === 'tianshu' ? '天枢对话' : '普通对话',
createdAt: Date.now(),
updatedAt: Date.now(),
messages: [],
}
}
function getThreadMessages(threads, activeThreadId) {
const thread = Array.isArray(threads) ? threads.find((item) => item.id === activeThreadId) : null
return Array.isArray(thread?.messages) ? thread.messages : []
}
function loadSavedChatHistory(authSession = state?.auth) {
const accountKey = currentAccountKey(authSession)
const fallback = {
accountKey,
threads: { chat: [createEmptyThread('chat')], tianshu: [createEmptyThread('tianshu')] },
activeThreadIds: { chat: '', tianshu: '' },
}
fallback.activeThreadIds.chat = fallback.threads.chat[0].id
fallback.activeThreadIds.tianshu = fallback.threads.tianshu[0].id
try {
const raw = localStorage.getItem(CHAT_THREADS_STORAGE_KEY)
const activeRaw = localStorage.getItem(ACTIVE_CHAT_THREAD_STORAGE_KEY)
const parsed = raw ? JSON.parse(raw) : {}
const activeParsed = activeRaw ? JSON.parse(activeRaw) : {}
const scoped = parsed?.[accountKey] || {}
const activeScoped = activeParsed?.[accountKey] || {}
const chat = normalizeThreads(scoped.chat, 'chat')
const tianshu = normalizeThreads(scoped.tianshu, 'tianshu')
const activeThreadIds = {
chat: chat.some((thread) => thread.id === activeScoped.chat) ? activeScoped.chat : chat[0].id,
tianshu: tianshu.some((thread) => thread.id === activeScoped.tianshu) ? activeScoped.tianshu : tianshu[0].id,
}
return { accountKey, threads: { chat, tianshu }, activeThreadIds }
} catch {
return fallback
}
}
function normalizeThreads(value, mode) {
const threads = Array.isArray(value)
? value.map((thread) => ({
id: typeof thread?.id === 'string' && thread.id ? thread.id : `${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
title: typeof thread?.title === 'string' && thread.title ? thread.title : (mode === 'tianshu' ? '天枢对话' : '普通对话'),
createdAt: Number(thread?.createdAt || Date.now()),
updatedAt: Number(thread?.updatedAt || Date.now()),
messages: Array.isArray(thread?.messages)
? thread.messages.filter((message) => message && typeof message.text === 'string').slice(-80)
: [],
}))
: []
return threads.length ? threads.slice(0, 20) : [createEmptyThread(mode)]
}
function ensureChatHistoryScope() {
const accountKey = currentAccountKey()
if (state.chatHistoryAccountKey === accountKey) return
const next = loadSavedChatHistory(state.auth)
state.chatHistoryAccountKey = next.accountKey
state.chatThreads = next.threads
state.activeThreadIds = next.activeThreadIds
state.messages = getThreadMessages(next.threads.chat, next.activeThreadIds.chat)
state.tianshuMessages = getThreadMessages(next.threads.tianshu, next.activeThreadIds.tianshu)
}
function activeThread(mode = state.tab) {
const normalized = normalizeChatMode(mode)
const threads = state.chatThreads[normalized]
let thread = threads.find((item) => item.id === state.activeThreadIds[normalized])
if (!thread) {
thread = createEmptyThread(normalized)
threads.unshift(thread)
state.activeThreadIds[normalized] = thread.id
}
return thread
}
function syncVisibleMessages(mode = state.tab) {
const normalized = normalizeChatMode(mode)
if (normalized === 'chat') state.messages = activeThread('chat').messages
else state.tianshuMessages = activeThread('tianshu').messages
}
function appendMessage(message, { mode = state.tab, persist = true } = {}) {
const normalized = normalizeChatMode(mode)
ensureChatHistoryScope()
const thread = activeThread(normalized)
message.role = message.role === 'user' ? 'user' : 'assistant'
message.text = String(message.text || '')
message.time = message.time || currentTime()
message.remoteKey = message.remoteKey || ''
thread.messages.push(message)
thread.messages = thread.messages.slice(-80)
thread.updatedAt = Date.now()
if (thread.title === '普通对话' || thread.title === '天枢对话') {
const firstUser = thread.messages.find((item) => item.role === 'user' && item.text)
if (firstUser) thread.title = firstUser.text.slice(0, 18)
}
syncVisibleMessages(normalized)
if (persist) saveChatHistory()
return thread.messages[thread.messages.length - 1]
}
function createChatThread(mode = state.tab) {
const normalized = normalizeChatMode(mode)
const thread = createEmptyThread(normalized)
state.chatThreads[normalized].unshift(thread)
state.chatThreads[normalized] = state.chatThreads[normalized].slice(0, 20)
state.activeThreadIds[normalized] = thread.id
syncVisibleMessages(normalized)
saveChatHistory()
return thread
}
function saveChatHistory() {
ensureChatHistoryScope()
try {
const raw = localStorage.getItem(CHAT_THREADS_STORAGE_KEY)
const parsed = raw ? JSON.parse(raw) : {}
parsed[state.chatHistoryAccountKey] = state.chatThreads
localStorage.setItem(CHAT_THREADS_STORAGE_KEY, JSON.stringify(parsed))
const activeRaw = localStorage.getItem(ACTIVE_CHAT_THREAD_STORAGE_KEY)
const activeParsed = activeRaw ? JSON.parse(activeRaw) : {}
activeParsed[state.chatHistoryAccountKey] = state.activeThreadIds
localStorage.setItem(ACTIVE_CHAT_THREAD_STORAGE_KEY, JSON.stringify(activeParsed))
} catch {}
}
function defaultApiConfig() {
return { ...DEFAULT_API_CONFIG }
}
function loadSavedApiConfig(authSession = null) {
const fallback = defaultApiConfig()
const authToken = authSession?.token || ''
try {
const raw = localStorage.getItem(API_STORAGE_KEY)
if (!raw) return authToken ? { ...fallback, token: authToken, saved: true, savedAt: authSession.savedAt || currentTime() } : fallback
const parsed = JSON.parse(raw)
if (authToken) {
return {
...fallback,
token: authToken,
saved: true,
savedAt: authSession.savedAt || (typeof parsed.savedAt === 'string' ? parsed.savedAt : ''),
workspaceId: typeof parsed.workspaceId === 'string' && parsed.workspaceId ? parsed.workspaceId : fallback.workspaceId,
}
}
const endpoint = typeof parsed.chatEndpoint === 'string' && parsed.chatEndpoint ? parsed.chatEndpoint : (typeof parsed.endpoint === 'string' && parsed.endpoint ? parsed.endpoint : fallback.endpoint)
return {
endpoint,
chatEndpoint: endpoint,
desktopEndpoint: typeof parsed.desktopEndpoint === 'string' && parsed.desktopEndpoint ? parsed.desktopEndpoint : fallback.desktopEndpoint,
token: typeof parsed.token === 'string' ? parsed.token : '',
saved: true,
savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
workspaceId: typeof parsed.workspaceId === 'string' && parsed.workspaceId ? parsed.workspaceId : fallback.workspaceId,
source: typeof parsed.source === 'string' ? parsed.source : 'custom',
}
} catch {
return authToken ? { ...fallback, token: authToken, saved: true, savedAt: authSession.savedAt || currentTime() } : fallback
}
}
function saveApiConnection(endpoint, token, desktopEndpoint, workspaceId, options = {}) {
const authSession = options.authSession || state.auth
const sessionToken = token || authSession?.token || ''
const websiteSession = Boolean(authSession?.token)
const defaults = defaultApiConfig()
const next = {
endpoint: websiteSession ? defaults.endpoint : (endpoint || defaults.endpoint),
chatEndpoint: websiteSession ? defaults.chatEndpoint : (endpoint || defaults.chatEndpoint),
desktopEndpoint: websiteSession ? defaults.desktopEndpoint : (desktopEndpoint || defaults.desktopEndpoint),
token: sessionToken,
saved: true,
savedAt: currentTime(),
workspaceId: workspaceId || defaults.workspaceId,
source: websiteSession ? 'xiaobai-website' : 'custom',
}
try {
localStorage.setItem(API_STORAGE_KEY, JSON.stringify(next))
} catch {
}
state.api = next
state.connected = Boolean(sessionToken)
state.connectionHealth = {
checking: false,
checkedAt: '',
chat: 'idle',
remote: 'idle',
devices: 'idle',
message: sessionToken ? '已保存网站账号，正在读取同账号电脑端 API。' : '请先登录网站账号。',
}
stopRemoteSync()
if (!options.quiet) render()
if (!options.skipHealth) {
runConnectionHealthCheck().catch((error) => {
updateConnectionHealth({ chat: 'error', remote: 'warn', devices: 'warn', message: error?.message || '连接体检失败。' })
render()
})
}
}
function clearApiConnection() {
try {
localStorage.removeItem(API_STORAGE_KEY)
} catch {}
state.api = defaultApiConfig()
state.connected = false
state.connectionHealth = {
checking: false,
checkedAt: '',
chat: 'offline',
remote: 'offline',
devices: 'offline',
message: '还没有保存 API 连接。',
}
state.devices = [{ name: '天枢终端 01', meta: '未连接', online: false }]
stopRemoteSync()
render()
}
function ensureWebsiteAccountConnection(options = {}) {
if (!state.auth?.token) return false
const defaults = defaultApiConfig()
const expected = {
...defaults,
token: state.auth.token,
saved: true,
savedAt: state.api.savedAt || state.auth.savedAt || currentTime(),
workspaceId: state.api.workspaceId || defaults.workspaceId,
}
const needsMigration = !state.connected
|| state.api.token !== state.auth.token
|| state.api.chatEndpoint !== defaults.chatEndpoint
|| state.api.endpoint !== defaults.endpoint
|| state.api.desktopEndpoint !== defaults.desktopEndpoint
|| state.api.source !== defaults.source
if (!needsMigration) return false
saveApiConnection(expected.endpoint, expected.token, expected.desktopEndpoint, expected.workspaceId, {
authSession: state.auth,
quiet: options.quiet !== false,
skipHealth: options.skipHealth === true,
})
return true
}
function loadSavedAuthSession() {
try {
const raw = localStorage.getItem(AUTH_STORAGE_KEY)
if (!raw) return defaultAuthSession()
const parsed = JSON.parse(raw)
return {
token: typeof parsed.token === 'string' ? parsed.token : '',
refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : '',
expiresAt: Number(parsed.expiresAt || 0),
savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
user: parsed.user && typeof parsed.user === 'object' ? {
id: String(parsed.user.id || ''),
email: String(parsed.user.email || ''),
name: String(parsed.user.name || ''),
} : null,
}
} catch {
return defaultAuthSession()
}
}
function defaultAuthSession() {
return {
token: '',
refreshToken: '',
expiresAt: 0,
savedAt: '',
user: null,
}
}
function saveAuthSession(data) {
const session = data.session || {}
const next = {
token: session.access_token || data.token || '',
refreshToken: session.refresh_token || data.refreshToken || '',
expiresAt: Number(session.expires_at || data.expiresAt || 0),
savedAt: currentTime(),
user: data.user || null,
}
if (!next.token) throw new Error('登录成功但没有拿到访问令牌。')
try {
localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
} catch {}
state.auth = next
state.authError = ''
track('login_success', { email: next.user?.email || '' })
saveApiConnection('', next.token, '', '', { authSession: next })
}
function clearAuthSession() {
track('logout')
try {
localStorage.removeItem(AUTH_STORAGE_KEY)
} catch {}
state.auth = defaultAuthSession()
state.authError = ''
clearApiConnection()
}
function applyViewportInsets() {
const root = document.documentElement
const visualTop = window.visualViewport?.offsetTop || 0
const userAgent = navigator.userAgent || ''
const androidWebView = /\bwv\b|Version\/[\d.]+.*Chrome\/[\d.]+.*Mobile Safari/i.test(userAgent)
const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches
|| window.navigator.standalone
|| document.referrer.startsWith('android-app:
|| androidWebView
const statusTop = standalone ? Math.max(visualTop, 32) : visualTop
root.style.setProperty('--mobile-status-top', `${Math.round(statusTop)}px`)
}
async function loginWithWebsiteAccount(email, password) {
if (!email || !password) throw new Error('请输入小白AI网站账号和密码。')
state.authBusy = true
state.authError = ''
render()
const response = await fetchWithRetry('https:
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ mode: 'login', email, password }),
})
const data = await readApiJson(response)
state.authBusy = false
saveAuthSession(data)
}
async function refreshAuthSessionIfNeeded() {
if (!state.auth?.refreshToken || state.authBusy) return
const expiresAtMs = Number(state.auth.expiresAt || 0) * 1000
if (!expiresAtMs || expiresAtMs - Date.now() > 10 * 60 * 1000) return
state.authBusy = true
try {
const response = await fetchWithRetry('https:
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ mode: 'refresh', refresh_token: state.auth.refreshToken }),
})
const data = await readApiJson(response)
saveAuthSession(data)
} finally {
state.authBusy = false
}
}
function defaultChatBackground() {
return {
mode: 'glass',
customImage: '',
}
}
function loadSavedChatBackground() {
const fallback = defaultChatBackground()
try {
const raw = localStorage.getItem(CHAT_BACKGROUND_STORAGE_KEY)
if (!raw) return fallback
const parsed = JSON.parse(raw)
const mode = ['glass', 'galaxy', 'custom'].includes(parsed?.mode) ? parsed.mode : fallback.mode
return {
mode,
customImage: typeof parsed?.customImage === 'string' ? parsed.customImage : '',
}
} catch {
return fallback
}
}
function saveChatBackground(nextBackground) {
const next = {
mode: ['glass', 'galaxy', 'custom'].includes(nextBackground.mode) ? nextBackground.mode : 'glass',
customImage: nextBackground.customImage || (nextBackground.mode === 'custom' ? state.chatBackground.customImage : ''),
}
try {
localStorage.setItem(CHAT_BACKGROUND_STORAGE_KEY, JSON.stringify(next))
} catch {}
state.chatBackground = next
render()
}
function currentTime() {
return new Intl.DateTimeFormat('zh-CN', {
hour: '2-digit',
minute: '2-digit',
hour12: false,
}).format(new Date())
}
function escapeHtml(value) {
return value
.replaceAll('&', '&amp;')
.replaceAll('<', '&lt;')
.replaceAll('>', '&gt;')
.replaceAll('"', '&quot;')
.replaceAll("'", '&#039;')
}
function menuIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
}
function chatIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/><path d="M8 10h8M8 14h5"/></svg>'
}
function tianshuIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18"/><path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z"/><path d="M7.5 9.5 12 12l4.5-2.5M7.5 14.5 12 12l4.5 2.5"/></svg>'
}
function backIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'
}
function plusIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
}
function settingsIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 0 1-2.97 2.97l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21.3a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 0 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.66-1.1H2.1a2.1 2.1 0 0 1 0-4.2h.06A1.8 1.8 0 0 0 3.8 8a1.8 1.8 0 0 0-.36-1.98l-.04-.04A2.1 2.1 0 1 1 6.37 3l.04.04a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.1-1.66V1.7a2.1 2.1 0 0 1 4.2 0v.06a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 1 1 2.97 2.97l-.04.04A1.8 1.8 0 0 0 19.4 8a1.8 1.8 0 0 0 1.66 1.1h.06a2.1 2.1 0 0 1 0 4.2h-.06A1.8 1.8 0 0 0 19.4 15Z"/></svg>'
}
function sparkIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 9.8 9.6 3 12l6.8 2.4L12 21l2.2-6.6L21 12l-6.8-2.4L12 3Z"/></svg>'
}
function closeIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
}
function newspaperIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H19a2 2 0 0 0 2-2V6H6.5A2.5 2.5 0 0 0 4 8.5v11Z"/><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H21"/><path d="M8 11h8M8 15h6"/></svg>'
}
function cloudIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H8a5 5 0 1 1 1.1-9.88A6 6 0 0 1 21 11.5 3.75 3.75 0 0 1 17.5 19Z"/></svg>'
}
function fileIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>'
}
function imageIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 15 3-3 3 3 2-2 3 3"/><circle cx="8.5" cy="9.5" r="1.5"/></svg>'
}
function cameraIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/></svg>'
}
function sendIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-8.4 18-3.1-7.7L3 10.2 21 3Z"/><path d="m9.5 13.3 4.7-4.7"/></svg>'
}
function boxIcon() {
return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>'
}
function haptic(ms = 10) {
try { navigator.vibrate?.(ms) } catch {}
}
function track(event, props = {}) {
try {
const raw = localStorage.getItem(TELEMETRY_KEY)
const events = raw ? JSON.parse(raw) : []
events.push({
event,
...props,
ts: Date.now(),
session: sessionId(),
version: state.version,
})
if (events.length > TELEMETRY_MAX) events.splice(0, events.length - TELEMETRY_MAX)
localStorage.setItem(TELEMETRY_KEY, JSON.stringify(events))
} catch {}
}
let _sessionId = null
function sessionId() {
if (!_sessionId) _sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
return _sessionId
}
function announceToScreenReader(message) {
const el = document.getElementById('aria-live')
if (!el) return
el.textContent = ''
requestAnimationFrame(() => { el.textContent = message })
}
function confirmThen(message, onConfirm) {
state.confirmDialog = { message, onConfirm, id: Date.now() }
render()
}
function dismissConfirm() {
state.confirmDialog = null
render()
}
function renderConfirmDialog() {
if (!state.confirmDialog) return ''
return `
<div class="confirm-overlay" role="alertdialog" aria-label="确认操作">
<div class="confirm-dialog">
<p>${escapeHtml(state.confirmDialog.message)}</p>
<div class="confirm-actions">
<button type="button" class="confirm-cancel" onclick="window.__dismissConfirm()">取消</button>
<button type="button" class="confirm-ok" onclick="window.__executeConfirm()">确定</button>
</div>
</div>
</div>
`
}
window.__dismissConfirm = dismissConfirm
window.__executeConfirm = () => {
const dialog = state.confirmDialog
if (!dialog) return
state.confirmDialog = null
dialog.onConfirm()
render()
}
render()