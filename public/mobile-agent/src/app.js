const STORAGE_KEY = 'xiaobai-mobile-settings-v2'
const HISTORY_KEY = 'xiaobai-mobile-chat-v2'
const DEFAULT_CLOUD_URL = 'https://www.xiaobaiai.cn'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const state = {
  settings: loadSettings(),
  ui: {
    studioOpen: false,
    studioTab: 'devices',
    advancedOpen: false,
  },
  session: {
    authenticated: false,
    checking: false,
    error: '',
    user: null,
    token: '',
  },
  memberLogin: {
    account: '',
    password: '',
    busy: false,
    error: '',
  },
  remote: {
    checking: false,
    error: '',
    devices: [],
    selectedDeviceId: '',
    tasks: [],
    skills: [],
    memories: [],
    delegations: null,
  },
  messages: loadHistory(),
  eventSource: null,
  composing: '',
  listening: false,
  recognition: null,
}

class XiaobaiCloudClient {
  constructor(settings, session) {
    this.baseUrl = normalizeBaseUrl(settings.cloudUrl || DEFAULT_CLOUD_URL)
    this.token = String(session.token || '').trim()
  }

  headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...extra,
    }
  }

  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: this.headers({ 'Content-Type': undefined }),
      credentials: 'include',
    })
    return parseResponse(response)
  }

  async post(path, body = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      credentials: 'include',
      body: JSON.stringify(body),
    })
    return parseResponse(response)
  }

  eventUrl() {
    const url = new URL(`${this.baseUrl}/api/agent-remote/events`)
    if (this.token) url.searchParams.set('token', this.token)
    if (state.remote.selectedDeviceId) url.searchParams.set('deviceId', state.remote.selectedDeviceId)
    return url.toString()
  }
}

class XiaobaiLocalDebugClient {
  constructor(settings) {
    this.baseUrl = normalizeBaseUrl(settings.localBaseUrl || 'http://127.0.0.1:3721')
    this.token = String(settings.localToken || '').trim()
  }

  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    })
    return parseResponse(response)
  }

  async post(path, body = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    return parseResponse(response)
  }
}

function normalizeBaseUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  return raw || DEFAULT_CLOUD_URL
}

async function parseResponse(response) {
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { ok: false, error: text || response.statusText }
  }
  if (!response.ok) {
    throw new Error(data?.error || response.statusText || `HTTP ${response.status}`)
  }
  return data
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      cloudUrl: saved.cloudUrl || DEFAULT_CLOUD_URL,
      localBaseUrl: saved.localBaseUrl || 'http://127.0.0.1:3721',
      localToken: saved.localToken || '',
      remoteMode: saved.remoteMode || 'cloud',
    }
  } catch {
    return {
      cloudUrl: DEFAULT_CLOUD_URL,
      localBaseUrl: 'http://127.0.0.1:3721',
      localToken: '',
      remoteMode: 'cloud',
    }
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cloudUrl: state.settings.cloudUrl,
    localBaseUrl: state.settings.localBaseUrl,
    localToken: state.settings.localToken,
    remoteMode: state.settings.remoteMode,
  }))
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return Array.isArray(saved) ? saved.slice(-80) : []
  } catch {
    return []
  }
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.messages.slice(-80)))
}

function cloudApi() {
  return new XiaobaiCloudClient(state.settings, state.session)
}

function localDebugApi() {
  return new XiaobaiLocalDebugClient(state.settings)
}

function icon(name) {
  const icons = {
    add: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" stroke="currentColor" stroke-width="2"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12 20 5l-5 15-3-6-8-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12a7 7 0 0 0-12-5M5 12a7 7 0 0 0 12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    laptop: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 6h14v10H5V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 19h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  }
  return icons[name] || ''
}

function sessionClass() {
  if (state.session.authenticated && selectedDevice()?.online) return 'online'
  if (state.session.authenticated) return 'warn'
  if (state.session.checking) return 'warn'
  return 'offline'
}

function statusText() {
  if (state.session.checking || state.remote.checking) return '同步中'
  if (!state.session.authenticated) return '未登录'
  const device = selectedDevice()
  if (!device) return '未绑定电脑'
  return device.online ? '电脑在线' : '电脑离线'
}

function selectedDevice() {
  return state.remote.devices.find((device) => String(device.id) === String(state.remote.selectedDeviceId))
    || state.remote.devices[0]
    || null
}

function appTemplate() {
  return `
    <main class="phone-app">
      <header class="app-topbar">
        <button class="round-button" data-action="new-chat" aria-label="新任务">${icon('add')}</button>
        <div class="title-stack">
          <h1>小白 Agent</h1>
          <button class="inline-status ${sessionClass()}" data-action="open-studio-devices">
            <span class="status-dot"></span>
            <span>${statusText()} · ${escapeHtml(userLabel())}</span>
          </button>
        </div>
        <button class="round-button" data-action="toggle-studio" aria-label="工作室">${icon('menu')}</button>
      </header>

      ${renderAccountGate()}

      <section class="chat-surface ${state.session.authenticated ? '' : 'locked'}">
        <div class="message-list" id="messageList">
          ${state.messages.length ? state.messages.map(renderMessage).join('') : renderEmptyChat()}
        </div>
      </section>

      ${renderComposer()}
      ${state.ui.studioOpen ? renderStudioSheet() : ''}
    </main>
  `
}

function userLabel() {
  if (!state.session.authenticated) return '登录网站账号'
  return state.session.user?.email || state.session.user?.name || state.session.user?.id || '会员已登录'
}

function renderAccountGate() {
  if (state.session.authenticated) {
    return `
      <section class="sync-strip">
        <span>${escapeHtml(remoteSummary())}</span>
        <button class="text-button" data-action="sync-cloud">${icon('sync')}同步</button>
      </section>
    `
  }

  return `
    <section class="setup-panel account-gate">
      <div class="setup-head">
        <div>
          <h2>登录小白网站账号</h2>
          <p>离开家也能操作电脑上的小白 Agent。手机只需要登录网站账号，家里电脑端小白保持在线即可。</p>
        </div>
      </div>
      <div class="field-grid">
        <label class="field">
          <span>账号</span>
          <input id="memberAccount" value="${escapeAttr(state.memberLogin.account)}" placeholder="手机号或邮箱" autocomplete="username" />
        </label>
        <label class="field">
          <span>密码</span>
          <input id="memberPassword" value="${escapeAttr(state.memberLogin.password)}" placeholder="登录后不保存在手机端" type="password" autocomplete="current-password" />
        </label>
      </div>
      <button class="primary-button full" data-action="cloud-login" ${state.memberLogin.busy ? 'disabled' : ''}>${state.memberLogin.busy ? '登录中' : '登录并连接我的电脑小白'}</button>
      ${state.memberLogin.error ? `<div class="notice error">${escapeHtml(state.memberLogin.error)}</div>` : ''}
      ${state.session.error ? `<div class="notice error">${escapeHtml(state.session.error)}</div>` : ''}
      <button class="text-button advanced-toggle" data-action="toggle-advanced">开发调试：局域网直连</button>
      ${state.ui.advancedOpen ? renderAdvancedLocalPanel() : ''}
    </section>
  `
}

function renderAdvancedLocalPanel() {
  return `
    <div class="advanced-panel">
      <p>普通用户不需要填写这里。它只用于研发阶段同一网络内调试电脑端 API。</p>
      <label class="field">
        <span>本机调试地址</span>
        <input id="localBaseUrl" value="${escapeAttr(state.settings.localBaseUrl)}" placeholder="http://127.0.0.1:3721" inputmode="url" />
      </label>
      <label class="field">
        <span>本机调试 Token</span>
        <input id="localToken" value="${escapeAttr(state.settings.localToken)}" placeholder="没配置就留空" autocomplete="off" />
      </label>
      <button class="secondary-button" data-action="local-debug-connect">测试本机连接</button>
    </div>
  `
}

function remoteSummary() {
  const device = selectedDevice()
  if (!device) return '还没有绑定电脑端小白'
  const stateText = device.online ? '在线' : '离线'
  return `${device.name || '我的电脑小白'} · ${stateText} · ${state.remote.tasks.length} 个任务`
}

function renderEmptyChat() {
  return `
    <div class="empty-chat">
      <div class="empty-mark">小</div>
      <h2>今天让小白做什么？</h2>
      <p>手机发任务，家里电脑端小白执行。复杂任务会拆解、分派给合适 Agent，并把结果同步回来。</p>
    </div>
  `
}

function renderComposer() {
  const disabled = !state.session.authenticated
  return `
    <form class="composer" data-action="composer">
      <button class="tool-button ${state.listening ? 'active' : ''}" type="button" data-action="voice" aria-label="语音输入" ${disabled ? 'disabled' : ''}>${icon('mic')}</button>
      <textarea id="composerText" placeholder="${disabled ? '先登录网站账号' : '发任务给家里电脑上的小白'}" rows="1" ${disabled ? 'disabled' : ''}>${escapeHtml(state.composing)}</textarea>
      <button class="send-button" type="button" data-action="send" aria-label="发送" ${disabled ? 'disabled' : ''}>${icon('send')}</button>
    </form>
  `
}

function renderMessage(message) {
  const role = message.role || 'system'
  return `<div class="message ${escapeAttr(role)}">${escapeHtml(message.content || '')}</div>`
}

function renderStudioSheet() {
  return `
    <section class="studio-backdrop" data-action="close-studio">
      <div class="studio-sheet" role="dialog" aria-label="小白工作室" data-sheet>
        <div class="studio-head">
          <div>
            <h2>小白工作室</h2>
            <p>远程电脑、任务、Agent、技能和记忆都放这里，主界面只保留对话。</p>
          </div>
          <button class="icon-only" data-action="close-studio" aria-label="关闭工作室">${icon('close')}</button>
        </div>
        <div class="studio-tabs">
          ${studioTab('devices', '电脑')}
          ${studioTab('tasks', '任务')}
          ${studioTab('agents', 'Agent')}
          ${studioTab('skills', '技能')}
          ${studioTab('memories', '记忆')}
        </div>
        <div class="studio-content">
          ${renderStudioContent()}
        </div>
      </div>
    </section>
  `
}

function studioTab(id, label) {
  return `<button class="studio-tab ${state.ui.studioTab === id ? 'active' : ''}" data-studio-tab="${id}">${label}</button>`
}

function renderStudioContent() {
  if (state.ui.studioTab === 'tasks') return renderTaskBoard()
  if (state.ui.studioTab === 'agents') return renderDelegations()
  if (state.ui.studioTab === 'skills') return renderSkills()
  if (state.ui.studioTab === 'memories') return renderMemories()
  return renderDevices()
}

function renderDevices() {
  return `
    <div class="panel-head">
      <h3>我的电脑小白</h3>
      <button class="text-button" data-action="sync-cloud">刷新</button>
    </div>
    ${(state.remote.devices || []).length ? `
      <div class="list">
        ${state.remote.devices.map((device) => {
          const active = String(device.id) === String(selectedDevice()?.id)
          return `
            <button class="device-row ${active ? 'active' : ''}" data-device-id="${escapeAttr(device.id)}">
              <span class="device-icon">${icon('laptop')}</span>
              <span>
                <strong>${escapeHtml(device.name || '我的电脑小白')}</strong>
                <small>${escapeHtml(device.online ? '在线，可以远程执行任务' : '离线，等电脑端小白上线后执行')}</small>
              </span>
              <em>${device.online ? '在线' : '离线'}</em>
            </button>
          `
        }).join('')}
      </div>
    ` : '<div class="empty">还没有绑定电脑端小白。电脑端用同一个网站账号登录后，会自动出现在这里。</div>'}
  `
}

function renderTaskBoard() {
  return `
    <div class="panel-head">
      <h3>远程任务</h3>
      <button class="text-button" data-action="sync-cloud">刷新</button>
    </div>
    ${(state.remote.tasks || []).length ? `
      <div class="list">
        ${state.remote.tasks.map((task) => `
          <div class="list-row">
            <div class="row-top">
              <div class="row-title">${escapeHtml(task.title || task.task || task.id || '未命名任务')}</div>
              ${statusTag(task.status)}
            </div>
            <div class="row-note">${escapeHtml(formatTaskNote(task))}</div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="empty">还没有远程任务。手机发送任务后，云端会把它交给在线的电脑端小白。</div>'}
  `
}

function renderDelegations() {
  const jobs = state.remote.delegations?.jobs || []
  const models = state.remote.delegations?.models || []
  return `
    <div class="panel-head">
      <h3>本机 Agent 编队</h3>
      <button class="text-button" data-action="sync-cloud">刷新</button>
    </div>
    ${models.length ? `<div class="list">${models.map(renderAgentModel).join('')}</div>` : '<div class="empty">电脑端在线后，这里会显示 Codex、Claude Code、Hermes、OpenClaw 等可用状态。</div>'}
    <div class="panel-head second">
      <h3>最近委托</h3>
    </div>
    ${jobs.length ? `<div class="list">${jobs.slice(0, 8).map(renderJob).join('')}</div>` : '<div class="empty">复杂任务被电脑端小白分派后，会在这里显示委托进度。</div>'}
  `
}

function renderAgentModel(item) {
  const selected = item.selected || {}
  const available = !!selected.detected_available
  return `
    <div class="list-row">
      <div class="row-top">
        <div class="row-title">${escapeHtml(item.agent_id || 'agent')}</div>
        <span class="tag ${available ? 'ok' : 'bad'}">${available ? '可调用' : '不可用'}</span>
      </div>
      <div class="row-note">${escapeHtml(selected.observed_model || selected.detected_notes || selected.runtime || '未检测到模型')}</div>
    </div>
  `
}

function renderJob(job) {
  return `
    <div class="list-row">
      <div class="row-top">
        <div class="row-title">${escapeHtml(job.agent_id || job.job_id || '委托任务')}</div>
        ${statusTag(job.status)}
      </div>
      <div class="row-note">${escapeHtml(job.preview || job.error || job.job_id || '')}</div>
    </div>
  `
}

function renderSkills() {
  return `
    <div class="panel-head">
      <h3>我的技能库</h3>
      <button class="text-button" data-action="sync-cloud">刷新</button>
    </div>
    ${(state.remote.skills || []).length ? `
      <div class="list">
        ${state.remote.skills.map((skill) => `
          <div class="list-row">
            <div class="row-top">
              <div class="row-title">${escapeHtml(skill.title || skill.skill_id || '未命名技能')}</div>
              <span class="tag">${escapeHtml(skill.category || 'skill')}</span>
            </div>
            <div class="row-note">${escapeHtml(skill.description || '可复用任务流程')}</div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="empty">只有完整、复杂、可重复的任务流程，才会沉淀成技能资产。</div>'}
  `
}

function renderMemories() {
  return `
    <div class="panel-head">
      <h3>记忆资产</h3>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    ${(state.remote.memories || []).length ? `
      <div class="list">
        ${state.remote.memories.slice(0, 20).map((memory) => `
          <div class="list-row">
            <div class="row-top">
              <div class="row-title">${escapeHtml(memory.type || memory.mem_id || '记忆')}</div>
              <span class="tag">${escapeHtml(memory.created_at ? String(memory.created_at).slice(0, 10) : 'memory')}</span>
            </div>
            <div class="row-note">${escapeHtml(memory.content || memory.detail || '')}</div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="empty">电脑端小白同步后，这里会显示偏好、资料和任务经验。</div>'}
  `
}

function statusTag(status) {
  const value = String(status || 'unknown')
  const cls = /complete|success|ok|done/i.test(value) ? 'ok' : /fail|error|timeout|blocked|offline/i.test(value) ? 'bad' : 'warn'
  return `<span class="tag ${cls}">${escapeHtml(value)}</span>`
}

function formatTaskNote(task) {
  const parts = []
  if (task.device_name) parts.push(task.device_name)
  if (task.model_used || task.provider_used) parts.push([task.provider_used, task.model_used].filter(Boolean).join('/'))
  if (task.created_at || task.started_at) parts.push(task.created_at || task.started_at)
  return parts.join(' · ') || task.id || ''
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('\n', ' ')
}

function render() {
  document.querySelector('#app').innerHTML = appTemplate()
  bindEvents()
  scrollMessagesToBottom()
}

function bindEvents() {
  document.querySelector('[data-action="new-chat"]')?.addEventListener('click', startNewTaskView)
  document.querySelector('[data-action="toggle-studio"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    render()
  })
  document.querySelector('[data-action="open-studio-devices"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    state.ui.studioTab = 'devices'
    render()
  })
  document.querySelectorAll('[data-action="close-studio"]').forEach((node) => {
    node.addEventListener('click', closeStudio)
  })
  document.querySelector('[data-sheet]')?.addEventListener('click', (event) => {
    event.stopPropagation()
  })
  document.querySelectorAll('[data-studio-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.ui.studioTab = button.dataset.studioTab
      render()
    })
  })
  document.querySelectorAll('[data-device-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.remote.selectedDeviceId = button.dataset.deviceId
      openEventStream()
      render()
    })
  })

  document.querySelector('[data-action="cloud-login"]')?.addEventListener('click', loginCloudMember)
  document.querySelector('[data-action="sync-cloud"]')?.addEventListener('click', syncCloudAssets)
  document.querySelector('[data-action="toggle-advanced"]')?.addEventListener('click', () => {
    state.ui.advancedOpen = !state.ui.advancedOpen
    render()
  })
  document.querySelector('[data-action="local-debug-connect"]')?.addEventListener('click', testLocalDebugConnection)
  document.querySelector('[data-action="send"]')?.addEventListener('click', sendCurrentMessage)
  document.querySelector('[data-action="voice"]')?.addEventListener('click', toggleVoiceInput)

  document.querySelector('#memberAccount')?.addEventListener('input', (event) => {
    state.memberLogin.account = event.target.value
  })
  document.querySelector('#memberPassword')?.addEventListener('input', (event) => {
    state.memberLogin.password = event.target.value
  })
  document.querySelector('#localBaseUrl')?.addEventListener('input', (event) => {
    state.settings.localBaseUrl = event.target.value
    saveSettings()
  })
  document.querySelector('#localToken')?.addEventListener('input', (event) => {
    state.settings.localToken = event.target.value
    saveSettings()
  })

  const textarea = document.querySelector('#composerText')
  textarea?.addEventListener('input', (event) => {
    state.composing = event.target.value
    resizeComposer(textarea)
  })
  textarea?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendCurrentMessage()
    }
  })
  if (textarea) resizeComposer(textarea)
}

function closeStudio() {
  state.ui.studioOpen = false
  render()
}

function startNewTaskView() {
  state.messages = []
  state.composing = ''
  saveHistory()
  addSystemMessage('已开启新的手机任务视图；这不会删除电脑端聊天记录。')
}

function resizeComposer(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
}

async function loginCloudMember() {
  const account = state.memberLogin.account.trim()
  const password = state.memberLogin.password
  if (!account || !password) {
    state.memberLogin.error = '请输入网站会员账号和密码。'
    render()
    return
  }

  state.memberLogin.busy = true
  state.memberLogin.error = ''
  state.session.error = ''
  render()

  try {
    const result = await cloudApi().post('/api/agent-remote/login', { account, password })
    state.session.authenticated = true
    state.session.user = result.user || { email: account }
    state.session.token = result.token || result.sessionToken || ''
    state.memberLogin.password = ''
    addSystemMessage('网站会员登录成功，正在查找你的电脑端小白。')
    await syncCloudAssets()
    openEventStream()
  } catch (error) {
    state.memberLogin.error = normalizeCloudLoginError(error)
  } finally {
    state.memberLogin.busy = false
    render()
  }
}

function normalizeCloudLoginError(error) {
  const message = error?.message || '登录失败'
  if (/404|not found/i.test(message)) {
    return '云端远程 Agent 接口还没有部署。手机 App 形态已改对，下一步要在网站和电脑端补远程中转。'
  }
  return message
}

async function syncCloudAssets() {
  if (!state.session.authenticated) return
  state.remote.checking = true
  state.remote.error = ''
  render()

  try {
    const [devices, tasks, skills, memories, delegations, conversations] = await Promise.all([
      cloudApi().get('/api/agent-remote/devices').catch(() => ({ devices: [] })),
      cloudApi().get('/api/agent-remote/tasks?limit=20').catch(() => ({ tasks: [] })),
      cloudApi().get('/api/agent-remote/skills?limit=20').catch(() => ({ skills: [] })),
      cloudApi().get('/api/agent-remote/memories?limit=20').catch(() => ({ memories: [] })),
      cloudApi().get('/api/agent-remote/delegations?output=1').catch(() => null),
      cloudApi().get('/api/agent-remote/conversations?limit=80').catch(() => ({ messages: [] })),
    ])

    state.remote.devices = devices.devices || devices.items || []
    if (!state.remote.selectedDeviceId && state.remote.devices[0]) state.remote.selectedDeviceId = state.remote.devices[0].id
    state.remote.tasks = tasks.tasks || tasks.items || []
    state.remote.skills = skills.skills || skills.items || []
    state.remote.memories = memories.memories || memories.items || []
    state.remote.delegations = delegations
    syncConversationMessages(conversations.messages || conversations.items || [])
  } catch (error) {
    state.remote.error = error.message
    addSystemMessage(`同步失败：${error.message}`)
  } finally {
    state.remote.checking = false
    render()
  }
}

function syncConversationMessages(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return
  state.messages = rows.map((row) => ({
    role: row.role === 'jarvis' || row.role === 'assistant' ? 'agent' : row.role === 'user' ? 'user' : 'system',
    content: row.content || '',
    ts: row.timestamp || row.created_at || '',
  })).filter((message) => message.content).slice(-80)
  saveHistory()
}

async function testLocalDebugConnection() {
  try {
    const status = await localDebugApi().get('/activation-status')
    addSystemMessage(`本机调试连接成功：${status.model || '电脑端小白在线'}`)
  } catch (error) {
    addSystemMessage(`本机调试连接失败：${error.message}`)
  }
}

function openEventStream() {
  closeEventStream()
  if (!state.session.authenticated) return
  const source = new EventSource(cloudApi().eventUrl(), { withCredentials: true })
  state.eventSource = source
  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data)
      handleRemoteEvent(payload)
    } catch {
      addSystemMessage(event.data)
    }
  }
  source.onerror = () => {
    closeEventStream()
  }
}

function closeEventStream() {
  if (state.eventSource) state.eventSource.close()
  state.eventSource = null
}

function handleRemoteEvent(payload) {
  const type = payload.type
  const data = payload.data || {}
  if (type === 'response' && data.content) {
    addMessage('agent', data.content)
  } else if (type === 'task_updated' || type === 'delegation_updated') {
    syncCloudAssets().catch(() => {})
  } else if (type === 'device_status') {
    syncCloudAssets().catch(() => {})
  }
}

async function sendCurrentMessage() {
  const content = state.composing.trim()
  if (!content || !state.session.authenticated) return
  state.composing = ''
  addMessage('user', content)

  try {
    const device = selectedDevice()
    await cloudApi().post('/api/agent-remote/tasks', {
      deviceId: device?.id || state.remote.selectedDeviceId || null,
      channel: 'MOBILE_APP',
      content,
    })
  } catch (error) {
    addSystemMessage(`发送失败：${error.message}`)
  }
}

function addMessage(role, content) {
  state.messages.push({ role, content, ts: new Date().toISOString() })
  state.messages = state.messages.slice(-80)
  saveHistory()
  render()
}

function addSystemMessage(content) {
  addMessage('system', content)
}

function toggleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    addSystemMessage('当前浏览器不支持语音识别，可以使用系统键盘的语音输入。')
    return
  }
  if (state.recognition && state.listening) {
    state.recognition.stop()
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = true
  recognition.continuous = false
  recognition.onstart = () => {
    state.listening = true
    render()
  }
  recognition.onresult = (event) => {
    let text = ''
    for (const result of event.results) text += result[0]?.transcript || ''
    state.composing = text.trim()
    render()
  }
  recognition.onerror = (event) => {
    addSystemMessage(`语音识别失败：${event.error || 'unknown'}`)
  }
  recognition.onend = () => {
    state.listening = false
    render()
  }
  state.recognition = recognition
  recognition.start()
}

function scrollMessagesToBottom() {
  if (!state.messages.length) {
    window.scrollTo({ top: 0 })
    return
  }
  const list = document.querySelector('#messageList')
  if (list) list.scrollIntoView({ block: 'end' })
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', window.location.href)).catch(() => {})
  })
}

render()
