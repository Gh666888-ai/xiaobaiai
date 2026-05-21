import { MobileHotspotEarth } from './mobile-hotspot-earth.js'

let activeEarth = null
let remoteSyncTimer = null
let remoteEventSource = null
const API_STORAGE_KEY = 'xiaobai-tianshu-api-config'
const AUTH_STORAGE_KEY = 'xiaobai-tianshu-auth-session'
const CHAT_BACKGROUND_STORAGE_KEY = 'xiaobai-mobile-chat-background'
const DEFAULT_API_CONFIG = {
  endpoint: 'https://www.xiaobaiai.cn/api/mobile-chat',
  chatEndpoint: 'https://www.xiaobaiai.cn/api/mobile-chat',
  desktopEndpoint: 'https://www.xiaobaiai.cn/api/agent-remote/tasks',
  token: '',
  saved: false,
  savedAt: '',
  workspaceId: 'tianshu-main',
  source: 'xiaobai-website',
}
const savedAuthSession = loadSavedAuthSession()
const savedApiConfig = loadSavedApiConfig(savedAuthSession)
const savedChatBackground = loadSavedChatBackground()

const state = {
  version: '0.1.14',
  apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Tianshu-0.1.14.apk',
  page: 'chat',
  workspace: 'chat',
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
  connectionHealth: {
    checking: false,
    checkedAt: '',
    chat: savedApiConfig.saved ? 'idle' : 'offline',
    remote: savedApiConfig.saved ? 'idle' : 'offline',
    devices: savedApiConfig.saved ? 'idle' : 'offline',
    message: savedApiConfig.saved ? '已保存连接，等待体检。' : '还没有保存 API 连接。',
  },
  messages: [],
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
}

applyViewportInsets()
window.visualViewport?.addEventListener('resize', applyViewportInsets)
window.addEventListener('orientationchange', () => setTimeout(applyViewportInsets, 160))

function render() {
  disposeActiveEarth()
  applyViewportInsets()
  ensureWebsiteAccountConnection({ quiet: true, skipHealth: true })
  const shellMode = state.page === 'settings' ? 'settings' : state.workspace
  const backgroundMode = state.chatBackground.mode || 'glass'
  document.querySelector('#app').innerHTML = `
    <main class="chat-shell mode-${shellMode} bg-${backgroundMode}" aria-label="天枢中心"${renderShellStyle()}>
      ${renderTopbarV2()}
      ${state.page === 'settings' ? renderSettingsPage() : renderChatPage()}
      ${renderSidebar()}
      ${state.activeCard ? renderFloatingCard() : ''}
    </main>
  `
  bindEvents()
  mountActiveCard()
  reconcileRemoteSync()
}

function renderShellStyle() {
  if (state.workspace === 'tianshu' && state.page !== 'settings') return ''
  const mode = state.chatBackground.mode
  if (mode !== 'custom' || !state.chatBackground.customImage) return ''
  return ` style="--chat-bg-image: url(&quot;${escapeHtml(state.chatBackground.customImage)}&quot;)"`
}

function renderTopbarV2() {
  if (state.page === 'settings') {
    return `
      <header class="chat-topbar">
        <button class="round-button" type="button" data-action="back-chat" aria-label="返回对话">${backIcon()}</button>
        <div class="title-lockup">
          <strong>设置</strong>
          <span><i class="${state.connected ? 'ok' : ''}"></i>电脑 API 与天枢同步</span>
        </div>
        <span class="topbar-spacer" aria-hidden="true"></span>
      </header>
    `
  }

  return `
    <header class="chat-topbar">
      <button class="round-button" type="button" data-action="sidebar" aria-label="打开菜单">${menuIcon()}</button>
      <div class="title-lockup">
        <strong>普通对话</strong>
        <span><i class="${state.connected ? 'ok' : ''}"></i>${state.connected ? 'API 问答 · 已保存' : 'API 问答 · 待连接'}</span>
      </div>
      <span class="topbar-spacer" aria-hidden="true"></span>
    </header>
  `
}

function renderTopbar() {
  if (state.page === 'settings') {
    return `
      <header class="chat-topbar">
        <button class="round-button" type="button" data-action="back-chat" aria-label="返回对话">${backIcon()}</button>
        <div class="title-lockup">
          <strong>设置</strong>
          <span><i class="${state.connected ? 'ok' : ''}"></i>天枢中心</span>
        </div>
        <span class="topbar-spacer" aria-hidden="true"></span>
      </header>
    `
  }

  return `
    <header class="chat-topbar">
      <button class="round-button" type="button" data-action="sidebar" aria-label="打开侧边栏">${menuIcon()}</button>
      <div class="title-lockup">
        <strong>天枢中心</strong>
        <span><i class="${state.connected ? 'ok' : ''}"></i>${state.connected ? '随身控制台 · 已连接' : '随身控制台 · 未连接'}</span>
      </div>
      <span class="topbar-spacer" aria-hidden="true"></span>
    </header>
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

  if (state.workspace === 'tianshu') {
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
    </section>
  `
}

function renderDesktopBrainSurface() {
  return `
    <section class="cognitive-surface desktop-brain-surface" aria-label="天枢电脑端界面">
      <button class="desktop-brain-menu" type="button" data-action="sidebar" aria-label="打开菜单">${menuIcon()}</button>
      <iframe class="desktop-brain-frame" src="./desktop-brain.html" title="小白天枢电脑端界面"></iframe>
    </section>
  `
}

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
  return `
    <article class="bubble ${message.role}">
      <p>${escapeHtml(message.text)}</p>
      <time>${message.time}</time>
    </article>
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
      <button class="summon-button" type="button" data-action="toggle-summon" aria-label="发送文件或照片">${plusIcon()}</button>
      <input name="prompt" placeholder="向小白提问知识..." autocomplete="off" />
      <input class="attachment-input" data-attachment-input="file" type="file" />
      <input class="attachment-input" data-attachment-input="photo" type="file" accept="image/*" />
      <input class="attachment-input" data-attachment-input="camera" type="file" accept="image/*" capture="environment" />
      <button class="send-button" type="submit" aria-label="发送">${sendIcon()}</button>
    </form>
  `
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
  const chatActive = state.workspace === 'chat'
  const tianshuActive = state.workspace === 'tianshu'
  return `
    <aside class="app-sidebar ${state.sidebarOpen ? 'open' : ''}" aria-label="侧边栏">
      <button class="sidebar-scrim" type="button" data-action="close-sidebar" aria-label="关闭"></button>
      <div class="sidebar-panel">
        <header class="sidebar-head">
          <div>
            <strong>小白 Agent</strong>
            <span>天枢中心 · 随身控制台</span>
          </div>
          <button class="icon-button" type="button" data-action="close-sidebar" aria-label="关闭">${closeIcon()}</button>
        </header>
        <button class="new-chat-action" type="button" data-action="new-chat">${plusIcon()}<span>新对话</span></button>
        <section class="sidebar-body">
          <div class="conversation-list">
            <section class="history-group" aria-label="普通对话历史">
              <div class="history-title">普通对话</div>
              <button type="button" class="conversation-row ${chatActive ? 'active' : ''}" data-action="open-chat">${chatIcon()}<span>知识问答</span></button>
              <button type="button" class="conversation-row" data-action="open-chat">${fileIcon()}<span>图片与文件咨询</span></button>
            </section>
            <section class="history-group" aria-label="天枢对话历史">
              <div class="history-title">天枢对话</div>
              <button type="button" class="conversation-row ${tianshuActive ? 'active' : ''}" data-action="enter-tianshu">${tianshuIcon()}<span>随身控制台</span></button>
              <button type="button" class="conversation-row" data-action="enter-tianshu">${boxIcon()}<span>安装说明检查</span></button>
              <button type="button" class="conversation-row" data-action="enter-tianshu">${sparkIcon()}<span>短视频选题整理</span></button>
            </section>
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
          <input name="endpoint" value="${escapeHtml(state.api.chatEndpoint || state.api.endpoint)}" placeholder="https://www.xiaobaiai.cn/api/mobile-chat" autocomplete="url" />
        </label>
        <label>
          <span>电脑任务 API</span>
          <input name="desktopEndpoint" value="${escapeHtml(state.api.desktopEndpoint)}" placeholder="https://www.xiaobaiai.cn/api/agent-remote/tasks" autocomplete="url" />
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
        ${state.devices.map((device) => `
          <article class="device-row">
            <i class="${device.online ? 'online' : ''}"></i>
            <div>
              <strong>${device.name}</strong>
              <small>${device.meta}</small>
            </div>
            <button type="button">${device.online ? '使用中' : '唤醒'}</button>
          </article>
        `).join('')}
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
        ${state.tasks.map((task) => `
          <article class="task-card">
            <div>
              <span>${escapeHtml(task.status || '等待中')}</span>
              <h3>${escapeHtml(task.title || '远程任务')}</h3>
            </div>
            <div class="progress"><i style="width:${clampProgress(task.progress)}%"></i></div>
            ${task.result || task.error ? `<small>${escapeHtml(task.error || task.result)}</small>` : ''}
          </article>
        `).join('')}
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

function bindEvents() {
  ensureWebsiteAccountConnection({ quiet: true })
  refreshAuthSessionIfNeeded().catch(() => {})

  document.querySelectorAll('[data-action="sidebar"]').forEach((button) => {
    button.addEventListener('click', () => {
      setSidebarOpen(true)
    })
  })

  document.querySelectorAll('[data-action="close-sidebar"]').forEach((button) => {
    button.addEventListener('click', () => {
      setSidebarOpen(false)
    })
  })

  document.querySelectorAll('[data-action="new-chat"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.messages = []
      state.page = 'chat'
      state.sidebarOpen = false
      render()
    })
  })

  document.querySelectorAll('[data-action="open-settings"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.page = 'settings'
      state.sidebarOpen = false
      render()
      if (state.connected && !state.connectionHealth.checkedAt && !state.connectionHealth.checking) {
        runConnectionHealthCheck().catch(() => {})
      }
    })
  })

  document.querySelector('[data-action="back-chat"]')?.addEventListener('click', () => {
    state.page = 'chat'
    render()
  })

  document.querySelectorAll('[data-action="enter-tianshu"]').forEach((button) => {
    button.addEventListener('click', () => {
      const alreadyThere = state.workspace === 'tianshu' && state.page === 'chat'
      state.workspace = 'tianshu'
      state.page = 'chat'
      state.sidebarOpen = false
      if (alreadyThere) {
        setSidebarOpen(false)
        return
      }
      render()
    })
  })

  document.querySelectorAll('[data-action="open-chat"]').forEach((button) => {
    button.addEventListener('click', () => {
      const alreadyThere = state.workspace === 'chat' && state.page === 'chat'
      state.workspace = 'chat'
      state.page = 'chat'
      state.sidebarOpen = false
      if (alreadyThere) {
        setSidebarOpen(false)
        return
      }
      render()
    })
  })

  document.querySelector('[data-action="toggle-summon"]')?.addEventListener('click', () => {
    state.summonOpen = !state.summonOpen
    render()
  })

  document.querySelectorAll('[data-card]').forEach((button) => {
    button.addEventListener('click', () => {
      openCard(button.dataset.card)
    })
  })

  document.querySelectorAll('[data-attachment]').forEach((button) => {
    button.addEventListener('click', () => {
      const kind = button.dataset.attachment
      document.querySelector(`[data-attachment-input="${kind}"]`)?.click()
    })
  })

  document.querySelectorAll('[data-attachment-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) return
      const kind = input.dataset.attachmentInput
      const actionLabel = kind === 'camera' ? '拍照' : kind === 'photo' ? '照片' : '文件'
      state.messages.push({
        role: 'user',
        text: `已选择${actionLabel}：${file.name}`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      })
      state.summonOpen = false
      input.value = ''
      render()
    })
  })

  document.querySelectorAll('[data-action="close-card"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCard = null
      render()
    })
  })

  document.querySelector('[data-composer]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = event.currentTarget.elements.prompt
    submitPromptV2(input.value)
    input.value = ''
  })

  document.querySelector('[data-api-form]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const endpoint = form.elements.endpoint.value.trim()
    const desktopEndpoint = form.elements.desktopEndpoint.value.trim()
    const workspaceId = form.elements.workspaceId.value.trim()
    const token = state.auth?.token || form.elements.token.value.trim()
    saveApiConnection(endpoint, token, desktopEndpoint, workspaceId)
  })

  document.querySelector('[data-auth-form]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.currentTarget
    loginWithWebsiteAccount(form.elements.email.value.trim(), form.elements.password.value).catch((error) => {
      state.authBusy = false
      state.authError = error?.message || '登录失败，请稍后再试。'
      render()
    })
  })

  document.querySelector('[data-action="logout-account"]')?.addEventListener('click', () => {
    clearAuthSession()
  })

  document.querySelector('[data-action="clear-api"]')?.addEventListener('click', () => {
    clearApiConnection()
  })

  document.querySelectorAll('[data-background-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      saveChatBackground({ mode: button.dataset.backgroundPreset })
    })
  })

  document.querySelector('[data-action="pick-background"]')?.addEventListener('click', () => {
    document.querySelector('[data-background-file]')?.click()
  })

  document.querySelector('[data-background-file]')?.addEventListener('change', (event) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      saveChatBackground({ mode: 'custom', customImage: reader.result })
    }
    reader.readAsDataURL(file)
  })
}

function submitPrompt(rawText) {
  const text = rawText.trim()
  if (!text) return
  state.messages.push({ role: 'user', text, time: currentTime() })
  state.messages.push({
    role: 'assistant',
    text: state.connected ? '收到，已同步到天枢中心。' : '收到，已先保存为草稿。',
    time: currentTime(),
  })
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
  state.messages.push({ role: 'user', text, time: currentTime() })
  const taskEntry = state.workspace === 'tianshu'
    ? createLocalTask(text, state.connected ? '正在下发' : '草稿', state.connected ? 8 : 0)
    : null
  const assistantMessage = {
    role: 'assistant',
    text: state.connected ? (state.workspace === 'tianshu' ? '正在下发到电脑端天枢，等待任务回执。' : '正在调用已保存 API 回答。') : '还没有保存 API，我先把这条内容留在本机。',
    time: currentTime(),
  }
  state.messages.push(assistantMessage)
  render()

  if (!state.connected) return

  try {
    const result = state.workspace === 'tianshu'
      ? await sendDesktopTask(text, taskEntry)
      : await askKnowledgeApi(text)
    assistantMessage.text = result || assistantMessage.text
  } catch (error) {
    if (taskEntry) {
      Object.assign(taskEntry, {
        status: '下发失败',
        progress: 100,
        error: error?.message || '任务下发失败',
      })
    }
    assistantMessage.text = state.workspace === 'tianshu'
      ? `电脑端任务 API 暂时没有接收：${error?.message || '请检查设置里的远程连接。'}`
      : `普通问答 API 暂时没有返回：${error?.message || '请检查设置里的 API 地址或令牌。'}`
  }
  assistantMessage.time = currentTime()
  render()
}

async function askKnowledgeApi(message) {
  const response = await fetch(defaultApiConfig().chatEndpoint, {
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
  const response = await fetch(defaultApiConfig().desktopEndpoint, {
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
        const payload = parseEventData(event)
        ;(payload?.tasks || []).forEach(updateTaskFromRemote)
        render()
      })
      remoteEventSource.addEventListener('response', (event) => {
        const payload = parseEventData(event)
        if (payload?.content) upsertAssistantRemoteMessage(payload)
      })
      remoteEventSource.addEventListener('remote_error', () => {
        updateConnectionHealth({ remote: 'warn', message: '远程事件流暂时不可用，已切换为轮询。' })
      })
      remoteEventSource.onerror = () => {
        stopRemoteEventSource()
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
    const chat = await fetch(state.api.chatEndpoint || state.api.endpoint, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ content: '连接体检', source: 'mobile-healthcheck', workspaceId: state.api.workspaceId }),
    })
    next.chat = chat.ok ? 'ok' : 'error'
  } catch {
    next.chat = 'error'
  }

  try {
    const remote = await fetch(apiUrlWithToken(remoteHealthEndpoint()), { headers: apiHeaders() })
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
  const response = await fetch(apiUrlWithToken(url), { headers: apiHeaders() })
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
    state.messages.push({
      role: 'assistant',
      text: next.error || next.result || `${next.title}：${next.status}`,
      time: currentTime(),
    })
  }
}

function upsertAssistantRemoteMessage(message) {
  const text = String(message.content || '').trim()
  if (!text) return
  const key = `${message.task_id || ''}:${text}`
  if (state.messages.some((item) => item.remoteKey === key)) return
  state.messages.push({
    role: message.role === 'system' ? 'assistant' : 'assistant',
    text,
    time: currentTime(),
    remoteKey: key,
  })
  render()
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
    // Local storage can fail in strict privacy modes; keep the session usable.
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
  saveApiConnection('', next.token, '', '', { authSession: next })
}

function clearAuthSession() {
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
    || document.referrer.startsWith('android-app://')
    || androidWebView
  const statusTop = standalone ? Math.max(visualTop, 32) : visualTop
  root.style.setProperty('--mobile-status-top', `${Math.round(statusTop)}px`)
}

async function loginWithWebsiteAccount(email, password) {
  if (!email || !password) throw new Error('请输入小白AI网站账号和密码。')
  state.authBusy = true
  state.authError = ''
  render()
  const response = await fetch('https://www.xiaobaiai.cn/api/auth', {
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
    const response = await fetch('https://www.xiaobaiai.cn/api/auth', {
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

render()
