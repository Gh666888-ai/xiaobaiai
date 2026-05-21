import { MobileHotspotEarth } from './mobile-hotspot-earth.js'

let activeEarth = null
const API_STORAGE_KEY = 'xiaobai-tianshu-api-config'
const CHAT_BACKGROUND_STORAGE_KEY = 'xiaobai-mobile-chat-background'
const savedApiConfig = loadSavedApiConfig()
const savedChatBackground = loadSavedChatBackground()

const state = {
  version: '0.1.14',
  apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Tianshu-0.1.13.apk',
  page: 'chat',
  workspace: 'chat',
  sidebarOpen: false,
  summonOpen: false,
  activeCard: null,
  connected: savedApiConfig.saved,
  api: savedApiConfig,
  chatBackground: savedChatBackground,
  messages: [],
  tasks: [
    { title: '安装说明检查', status: '执行中', progress: 68 },
    { title: '短视频选题整理', status: '待确认', progress: 35 },
  ],
  devices: [
    { name: '天枢终端 01', meta: '天枢中心在线', online: true },
    { name: '备用终端', meta: '离线', online: false },
  ],
  skills: ['写作整理', '代码检查', '网页操作', '文件发送'],
  memories: ['项目边界', '发布规则', '常用偏好'],
}

function render() {
  disposeActiveEarth()
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
        <article>
          <span>执行中</span>
          <strong>安装说明检查</strong>
          <div class="progress"><i style="width:68%"></i></div>
        </article>
        <article>
          <span>待确认</span>
          <strong>短视频选题整理</strong>
          <button type="button">查看确认项</button>
        </article>
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
  return `
    <section class="setting-section">
      <div class="section-title">
        <h2>天枢中心</h2>
        <span class="status-chip ${state.connected ? 'online' : ''}">${state.connected ? '已连接' : '未连接'}</span>
      </div>
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
          <span>访问令牌</span>
          <input name="token" value="${escapeHtml(state.api.token)}" placeholder="连接后自动保存在本机" autocomplete="off" />
        </label>
        <div class="api-actions">
          <button type="submit">${state.connected ? '更新连接' : '连接并保存'}</button>
          <button type="button" data-action="clear-api">清除</button>
        </div>
        ${state.api.saved ? `<small>已保存 · ${escapeHtml(state.api.savedAt || '本机')}</small>` : '<small>连接成功后会自动保存 API 配置</small>'}
      </form>
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
              <span>${task.status}</span>
              <h3>${task.title}</h3>
            </div>
            <div class="progress"><i style="width:${task.progress}%"></i></div>
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
  document.querySelectorAll('[data-action="sidebar"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sidebarOpen = true
      render()
    })
  })

  document.querySelectorAll('[data-action="close-sidebar"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sidebarOpen = false
      render()
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
    })
  })

  document.querySelector('[data-action="back-chat"]')?.addEventListener('click', () => {
    state.page = 'chat'
    render()
  })

  document.querySelectorAll('[data-action="enter-tianshu"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.workspace = 'tianshu'
      state.page = 'chat'
      state.sidebarOpen = false
      render()
    })
  })

  document.querySelectorAll('[data-action="open-chat"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.workspace = 'chat'
      state.page = 'chat'
      state.sidebarOpen = false
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
    const token = form.elements.token.value.trim()
    saveApiConnection(endpoint, token, desktopEndpoint, workspaceId)
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
  const assistantMessage = {
    role: 'assistant',
    text: state.connected ? (state.workspace === 'tianshu' ? '已发送到电脑端天枢，等待任务回执。' : '正在调用已保存 API 回答。') : '还没有保存 API，我先把这条内容留在本机。',
    time: currentTime(),
  }
  state.messages.push(assistantMessage)
  if (state.workspace === 'tianshu') {
    state.tasks.unshift({
      title: text,
      status: state.connected ? '已发送' : '草稿',
      progress: state.connected ? 18 : 0,
    })
  }
  render()

  if (!state.connected) return

  try {
    const result = state.workspace === 'tianshu'
      ? await sendDesktopTask(text)
      : await askKnowledgeApi(text)
    assistantMessage.text = result || assistantMessage.text
  } catch {
    assistantMessage.text = state.workspace === 'tianshu'
      ? '电脑端任务 API 暂时没有返回，我已保留这条任务。'
      : '普通问答 API 暂时没有返回，请检查设置里的 API 地址或令牌。'
  }
  assistantMessage.time = currentTime()
  render()
}

async function askKnowledgeApi(message) {
  const response = await fetch(state.api.chatEndpoint || state.api.endpoint, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({
      message,
      mode: 'knowledge-chat',
      source: 'mobile',
      workspaceId: state.api.workspaceId,
    }),
  })
  return extractApiText(await response.json())
}

async function sendDesktopTask(task) {
  const response = await fetch(state.api.desktopEndpoint, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({
      task,
      mode: 'tianshu-task',
      source: 'mobile',
      workspaceId: state.api.workspaceId,
    }),
  })
  const data = await response.json()
  return extractApiText(data) || '电脑端天枢已接收任务。'
}

function apiHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (state.api.token) headers.Authorization = `Bearer ${state.api.token}`
  return headers
}

function extractApiText(data) {
  if (!data || typeof data !== 'object') return ''
  return data.answer || data.reply || data.message || data.text || data.result || ''
}

function openCard(card) {
  state.activeCard = ['news', 'weather', 'task', 'file'].includes(card) ? card : 'news'
  state.summonOpen = false
  render()
}

function defaultApiConfig() {
  return {
    endpoint: 'https://www.xiaobaiai.cn/api/mobile-chat',
    chatEndpoint: 'https://www.xiaobaiai.cn/api/mobile-chat',
    desktopEndpoint: 'https://www.xiaobaiai.cn/api/agent-remote/tasks',
    token: '',
    saved: false,
    savedAt: '',
    workspaceId: 'tianshu-main',
  }
}

function loadSavedApiConfig() {
  const fallback = defaultApiConfig()
  try {
    const raw = localStorage.getItem(API_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    const endpoint = typeof parsed.chatEndpoint === 'string' && parsed.chatEndpoint ? parsed.chatEndpoint : (typeof parsed.endpoint === 'string' && parsed.endpoint ? parsed.endpoint : fallback.endpoint)
    return {
      endpoint,
      chatEndpoint: endpoint,
      desktopEndpoint: typeof parsed.desktopEndpoint === 'string' && parsed.desktopEndpoint ? parsed.desktopEndpoint : fallback.desktopEndpoint,
      token: typeof parsed.token === 'string' ? parsed.token : '',
      saved: true,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
      workspaceId: typeof parsed.workspaceId === 'string' && parsed.workspaceId ? parsed.workspaceId : fallback.workspaceId,
    }
  } catch {
    return fallback
  }
}

function saveApiConnection(endpoint, token, desktopEndpoint, workspaceId) {
  const next = {
    endpoint: endpoint || defaultApiConfig().endpoint,
    chatEndpoint: endpoint || defaultApiConfig().chatEndpoint,
    desktopEndpoint: desktopEndpoint || defaultApiConfig().desktopEndpoint,
    token,
    saved: true,
    savedAt: currentTime(),
    workspaceId: workspaceId || defaultApiConfig().workspaceId,
  }
  try {
    localStorage.setItem(API_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Local storage can fail in strict privacy modes; keep the session usable.
  }
  state.api = next
  state.connected = true
  render()
}

function clearApiConnection() {
  try {
    localStorage.removeItem(API_STORAGE_KEY)
  } catch {}
  state.api = defaultApiConfig()
  state.connected = false
  render()
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
