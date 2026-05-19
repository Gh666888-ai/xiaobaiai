const STORAGE_KEY = 'xiaobai-mobile-settings-v2'
const HISTORY_KEY = 'xiaobai-mobile-chat-v2'
const SESSION_KEY = 'xiaobai-mobile-session-v1'
const APP_VERSION = '0.1.5'
const DEFAULT_CLOUD_URL = 'https://www.xiaobaiai.cn'
const DEFAULT_CHAT_MODEL = 'auto'
const CHAT_MODE_LABELS = {
  chat: '问答',
  agent: 'Xiaobai Nexus',
}
const CHAT_MODE_OPTIONS = [
  { id: 'chat', label: '问答', hint: '直接和小白聊天' },
  { id: 'agent', label: 'Xiaobai Nexus', hint: '连接自己的电脑端 Agent' },
]
const MODEL_OPTIONS = [
  { id: 'auto', label: '自动选择', hint: '按任务自动挑模型' },
  { id: 'deepseek', label: 'DeepSeek', hint: '中文、推理、代码' },
  { id: 'qwen', label: '通义千问', hint: '中文与办公任务' },
  { id: 'kimi', label: 'Kimi', hint: '长文档和资料整理' },
  { id: 'gpt', label: 'GPT', hint: '通用问答和创作' },
  { id: 'claude', label: 'Claude', hint: '长文、分析和改写' },
]
const MODEL_PROVIDER_RULES = [
  { id: 'deepseek', label: 'DeepSeek', hosts: ['deepseek.com'], models: ['deepseek'] },
  { id: 'kimi', label: 'Kimi', hosts: ['moonshot.cn', 'kimi.moonshot'], models: ['kimi'] },
  { id: 'minimax', label: 'MiniMax', hosts: ['minimax.io'], models: ['minimax', 'abab'] },
  { id: 'qwen', label: '通义千问', hosts: ['dashscope.aliyuncs.com', 'aliyuncs.com'], models: ['qwen', 'qwq'] },
  { id: 'gpt', label: 'OpenAI', hosts: ['api.openai.com'], models: ['gpt-', 'o3', 'o4', 'o1'] },
  { id: 'openrouter', label: 'OpenRouter', hosts: ['openrouter.ai'], models: [] },
  { id: 'custom', label: 'OpenAI Compatible', hosts: [], models: [] },
]
const MODEL_API_PRESETS = [
  {
    id: 'openrouter-free',
    label: 'OpenRouter 免费',
    hint: '需要 OpenRouter Key，可换任何 :free 模型',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-r1:free',
  },
  {
    id: 'deepseek-fast',
    label: 'DeepSeek V4 Flash',
    hint: '便宜、中文强、速度优先',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-v4-flash',
  },
  {
    id: 'kimi',
    label: 'Kimi',
    hint: '长文本和资料整理',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'kimi-k2.6',
  },
  {
    id: 'qwen',
    label: '通义千问',
    hint: '可用阿里云百炼/DashScope Key',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
  },
  {
    id: 'minimax',
    label: 'MiniMax',
    hint: '中文对话和创作',
    baseUrl: 'https://api.minimax.io/v1',
    model: 'MiniMax-M2.7',
  },
]
const CLOUD_POLL_MS = 15000
const ACTIVE_CLOUD_POLL_MS = 2500
const EVENT_RECONNECT_BASE_MS = 1500
const EVENT_RECONNECT_MAX_MS = 15000
const UPDATE_CHECK_MS = 6 * 60 * 60 * 1000

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

let cloudPollTimer = null
let activeCloudPollTimer = null
let eventReconnectTimer = null
let deferredRender = false

const state = {
  settings: loadSettings(),
  ui: {
    studioOpen: false,
    studioTab: 'devices',
    studioDetail: false,
    advancedOpen: false,
    settingsOpen: false,
    agentSetupOpen: false,
  },
  session: {
    ...loadSession(),
    checking: false,
    error: '',
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
    projects: [],
    images: [],
    files: [],
    apps: [],
    skills: [],
    memories: [],
    delegations: null,
    approvals: [],
    health: null,
    chatModelConfig: null,
  },
  update: {
    checking: false,
    available: false,
    webVersion: APP_VERSION,
    latestVersion: '',
    currentVersion: detectInstalledVersion(),
    apkUrl: '',
    size: 0,
    error: '',
  },
  messages: loadHistory(),
  eventSource: null,
  eventCursor: new Date().toISOString(),
  eventReconnectDelay: EVENT_RECONNECT_BASE_MS,
  sending: false,
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
    if (state.eventCursor) url.searchParams.set('since', state.eventCursor)
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
      mobileMode: saved.mobileMode === 'agent' ? 'agent' : 'chat',
      chatModel: MODEL_OPTIONS.some((item) => item.id === saved.chatModel) ? saved.chatModel : DEFAULT_CHAT_MODEL,
      modelBaseUrl: typeof saved.modelBaseUrl === 'string' ? saved.modelBaseUrl : '',
      modelApiKey: typeof saved.modelApiKey === 'string' ? saved.modelApiKey : '',
      modelName: typeof saved.modelName === 'string' ? saved.modelName : '',
      wallpaperImage: typeof saved.wallpaperImage === 'string' ? saved.wallpaperImage : '',
    }
  } catch {
    return {
      cloudUrl: DEFAULT_CLOUD_URL,
      localBaseUrl: 'http://127.0.0.1:3721',
      localToken: '',
      remoteMode: 'cloud',
      mobileMode: 'chat',
      chatModel: DEFAULT_CHAT_MODEL,
      modelBaseUrl: '',
      modelApiKey: '',
      modelName: '',
      wallpaperImage: '',
    }
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cloudUrl: state.settings.cloudUrl,
    localBaseUrl: state.settings.localBaseUrl,
    localToken: state.settings.localToken,
    remoteMode: state.settings.remoteMode,
    mobileMode: state.settings.mobileMode,
    chatModel: state.settings.chatModel,
    modelBaseUrl: state.settings.modelBaseUrl,
    modelApiKey: state.settings.modelApiKey,
    modelName: state.settings.modelName,
    wallpaperImage: state.settings.wallpaperImage,
  }))
}

function detectInstalledVersion() {
  const match = String(navigator.userAgent || '').match(/XiaobaiMobile\/([0-9]+(?:\.[0-9]+){0,3})/)
  return match?.[1] || '0.0.0'
}

function versionGreaterThan(left, right) {
  const a = String(left || '0').split('.').map((item) => Number.parseInt(item, 10) || 0)
  const b = String(right || '0').split('.').map((item) => Number.parseInt(item, 10) || 0)
  const length = Math.max(a.length, b.length)
  for (let index = 0; index < length; index += 1) {
    if ((a[index] || 0) > (b[index] || 0)) return true
    if ((a[index] || 0) < (b[index] || 0)) return false
  }
  return false
}

function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}')
    const token = String(saved.token || '').trim()
    const sessionId = String(saved.sessionId || '').trim()
    const user = saved.user || null
    return {
      authenticated: !!(token || sessionId || user),
      user,
      token,
      sessionId,
      savedAt: saved.savedAt || '',
    }
  } catch {
    return { authenticated: false, user: null, token: '', sessionId: '', savedAt: '' }
  }
}

function saveSession() {
  if (!state.session.token && !state.session.sessionId && !state.session.user) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    token: state.session.token,
    sessionId: state.session.sessionId || '',
    user: state.session.user || null,
    savedAt: new Date().toISOString(),
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

function normalizeMessageContent(content) {
  return String(content || '').replace(/\s+/g, ' ').trim()
}

function messageKey(message = {}) {
  if (message.id) return `id:${message.id}`
  if (message.taskId || message.task_id) {
    return `task:${message.taskId || message.task_id}:${message.role || ''}:${normalizeMessageContent(message.content)}`
  }
  return `${message.role || ''}:${normalizeMessageContent(message.content)}`
}

function mergeMessages(rows) {
  const merged = []
  const seen = new Set()
  for (const row of rows || []) {
    const content = String(row?.content || '').trim()
    if (!content) continue
    const item = {
      id: row.id || row.messageId || null,
      taskId: row.task_id || row.taskId || null,
      role: row.role === 'jarvis' || row.role === 'assistant' ? 'agent' : row.role === 'user' ? 'user' : 'system',
      content,
      ts: row.timestamp || row.created_at || row.ts || '',
    }
    const key = messageKey(item)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }
  return merged.slice(-80)
}

function rememberEventCursor(value) {
  const next = String(value || '').trim()
  if (next && next > String(state.eventCursor || '')) state.eventCursor = next
}

function cloudApi() {
  return new XiaobaiCloudClient(state.settings, state.session)
}

function localDebugApi() {
  return new XiaobaiLocalDebugClient(state.settings)
}

function chatMode() {
  return state.settings.mobileMode === 'agent' ? 'agent' : 'chat'
}

function normalizeModelBaseUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  return raw || ''
}

function detectModelProvider(baseUrl = state.settings.modelBaseUrl, modelName = state.settings.modelName) {
  const host = String(baseUrl || '').toLowerCase()
  const model = String(modelName || '').toLowerCase()
  return MODEL_PROVIDER_RULES.find((rule) => (
    rule.hosts.some((item) => host.includes(item))
    || rule.models.some((item) => model.includes(item))
  )) || MODEL_PROVIDER_RULES[MODEL_PROVIDER_RULES.length - 1]
}

function modelConfig() {
  const provider = detectModelProvider()
  const baseUrl = normalizeModelBaseUrl(state.settings.modelBaseUrl)
  const apiKey = String(state.settings.modelApiKey || '').trim()
  const model = String(state.settings.modelName || '').trim()
  return {
    configured: !!(baseUrl && apiKey && model),
    provider: provider.id,
    providerLabel: provider.label,
    baseUrl,
    apiKey,
    model,
  }
}

function modelConfigForRequest() {
  const config = modelConfig()
  if (!config.configured) return null
  return {
    provider: config.provider,
    providerLabel: config.providerLabel,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    model: config.model,
  }
}

function modelPreferenceForTask() {
  const config = modelConfig()
  if (config.configured) {
    return {
      source: 'mobile-model-api',
      provider: config.provider,
      providerLabel: config.providerLabel,
      baseUrl: config.baseUrl,
      model: config.model,
    }
  }
  return state.settings.chatModel || DEFAULT_CHAT_MODEL
}

function selectedModel() {
  const config = modelConfig()
  if (config.configured) {
    return {
      id: 'custom',
      label: config.providerLabel,
      hint: config.model,
    }
  }
  return MODEL_OPTIONS.find((item) => item.id === state.settings.chatModel) || MODEL_OPTIONS[0]
}

function canSendInCurrentMode() {
  return chatMode() === 'chat' || state.session.authenticated
}

function modeStatusText() {
  if (chatMode() === 'chat') return selectedModel().label
  return statusText()
}

function icon(name) {
  const icons = {
    add: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" stroke="currentColor" stroke-width="2"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12 20 5l-5 15-3-6-8-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12a7 7 0 0 0-12-5M5 12a7 7 0 0 0 12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    laptop: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 6h14v10H5V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 19h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h14v14H5V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8 16 3-3 2 2 2-3 3 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2.2"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2.2"/><path d="M5 21a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h6l2 2h8v9H4V7Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h4v14H5V5Zm5 2h4v12h-4V7Zm5-2h4v14h-4V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    apps: '<svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="2.2"/><circle cx="17" cy="7" r="2" stroke="currentColor" stroke-width="2.2"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="2.2"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="2.2"/></svg>',
    agent: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 17a7 7 0 1 1 10 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M8 17h8M10 20h4M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" fill="currentColor"/><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z" fill="currentColor"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 13v-2M10 17V7M14 20V4M18 16V8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  }
  return icons[name] || ''
}

function appIcon() {
  return '<img class="app-inline-icon" src="./icons/icon-192.png" alt="Xiaobai Nexus" />'
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

function syncDiagnosis() {
  if (!state.session.authenticated) return '先登录小白网站账号。'
  if (state.remote.error) return `同步异常：${state.remote.error}`
  if (state.remote.health?.counts && state.remote.health.counts.devices === 0) {
    return '云端中继已连接，但没有电脑端设备记录。请确认电脑端小白已更新、已登录同一账号，并等待 15 秒自动注册。'
  }
  if (!state.remote.devices.length) {
    return '没有发现电脑端小白。请确认电脑端已更新到 2.1.147 以上、用同一个网站账号登录，并保持 Xiaobai Nexus 正在运行。'
  }
  const device = selectedDevice()
  if (!device?.online) return '电脑端小白已绑定但当前离线，打开电脑端小白后会自动恢复同步。'
  return '电脑端小白在线，手机发送的任务会进入云端中继并由电脑端拉取执行。'
}

function selectedDevice() {
  return state.remote.devices.find((device) => String(device.id) === String(state.remote.selectedDeviceId))
    || state.remote.devices[0]
    || null
}

function deviceName(device) {
  return device?.name || device?.device_name || '我的电脑小白'
}

function appTemplate() {
  const wallpaper = state.settings.wallpaperImage
    ? ` style="--wallpaper-image: url('${cssUrl(state.settings.wallpaperImage)}')"`
    : ''
  return `
    <main class="phone-app ${state.settings.wallpaperImage ? 'has-wallpaper' : ''}"${wallpaper}>
      ${state.ui.agentSetupOpen ? renderAgentSetupPage() : renderMainChatPage()}
      ${state.ui.studioOpen ? renderStudioSheet() : ''}
    </main>
  `
}

function renderMainChatPage() {
  return `
    <header class="app-topbar">
      <button class="round-button" data-action="toggle-studio" aria-label="打开菜单">${icon('menu')}</button>
      <button class="plus-pill" data-action="toggle-settings">${icon('sparkle')}<span>${selectedModel().label}</span></button>
      <button class="round-button ghost-top app-icon-button" data-action="open-studio-agent" aria-label="Xiaobai Nexus">${appIcon()}</button>
    </header>

    ${renderUpdateBanner()}
    ${state.ui.settingsOpen ? renderPersonalizationPanel() : ''}

    <section class="chat-surface">
      <div class="message-list" id="messageList">
        ${state.messages.length ? state.messages.map(renderMessage).join('') : ''}
      </div>
    </section>

    ${renderComposer()}
  `
}

function renderUpdateBanner() {
  if (!state.update.available) return ''
  return `
    <section class="update-banner">
      <div>
        <strong>发现手机 APP 新版 ${escapeHtml(state.update.latestVersion)}</strong>
        <span>当前 ${escapeHtml(state.update.currentVersion === '0.0.0' ? '旧版' : state.update.currentVersion)}。更新后可修复原生壳层、键盘、状态栏等问题。</span>
      </div>
      <button class="primary-button slim" data-action="download-update">立即更新</button>
    </section>
  `
}

function renderModeRail() {
  return `
    <section class="mode-rail" aria-label="小白模式">
      <div class="mode-switch">
        ${CHAT_MODE_OPTIONS.map((item) => `
          <button class="${chatMode() === item.id ? 'active' : ''}" data-mode="${escapeAttr(item.id)}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.hint)}</span>
          </button>
        `).join('')}
      </div>
      <button class="round-button settings-button" data-action="toggle-settings" aria-label="模型和背景">${icon('image')}</button>
    </section>
  `
}

function renderPersonalizationPanel() {
  const config = modelConfig()
  return `
    <section class="personal-panel">
      <label class="field">
        <span>回答模型</span>
        <select id="chatModel">
          ${MODEL_OPTIONS.map((item) => `
            <option value="${escapeAttr(item.id)}" ${selectedModel().id === item.id ? 'selected' : ''}>
              ${escapeHtml(item.label)} - ${escapeHtml(item.hint)}
            </option>
          `).join('')}
        </select>
      </label>
      <div class="model-api-panel">
        <div class="panel-head compact">
          <h3>自己的模型 API</h3>
          <span class="tag ${config.configured ? 'ok' : 'warn'}">${escapeHtml(config.configured ? `${config.providerLabel} · ${config.model}` : '未配置')}</span>
        </div>
        <div class="preset-grid">
          ${MODEL_API_PRESETS.map((preset) => `
            <button class="preset-chip" data-model-preset="${escapeAttr(preset.id)}">
              <strong>${escapeHtml(preset.label)}</strong>
              <span>${escapeHtml(preset.hint)}</span>
            </button>
          `).join('')}
        </div>
        <div class="field-grid">
          <label class="field">
            <span>Base URL</span>
            <input id="modelBaseUrl" value="${escapeAttr(state.settings.modelBaseUrl)}" placeholder="https://api.deepseek.com 或 https://api.openai.com/v1" inputmode="url" autocomplete="off" />
          </label>
          <label class="field">
            <span>API Key</span>
            <input id="modelApiKey" value="${escapeAttr(state.settings.modelApiKey)}" placeholder="sk-..." type="password" autocomplete="off" />
          </label>
          <label class="field">
            <span>模型名</span>
            <input id="modelName" value="${escapeAttr(state.settings.modelName)}" placeholder="deepseek-v4-flash / kimi-k2.6 / gpt-4.1-mini" autocomplete="off" />
          </label>
        </div>
        <p class="model-detect-note">不填写时默认使用小白提供的 DeepSeek 免费问答入口；连接电脑端 Agent 后会自动把电脑端的低成本问答 API 保存到手机本地，电脑不在线也能继续普通问答；手动填写时会优先走你自己的模型 API。</p>
        <div class="model-actions">
          <button class="secondary-button slim" data-action="test-model-api">测试模型</button>
          <button class="ghost-button slim" data-action="clear-model-api">清空模型 API</button>
        </div>
      </div>
      <div class="wallpaper-actions">
        <label class="secondary-button wallpaper-picker">
          ${icon('image')}换背景照片
          <input id="wallpaperInput" type="file" accept="image/*" />
        </label>
        <button class="ghost-button" data-action="clear-wallpaper">恢复默认</button>
      </div>
    </section>
  `
}

function renderAgentSetupPage() {
  const connected = state.session.authenticated && !!selectedDevice()
  const device = selectedDevice()
  return `
    <section class="agent-setup-page">
      <header class="agent-setup-top">
        <button class="round-button back-button" data-action="close-agent-setup" aria-label="返回">${icon('back')}</button>
        <h1>Xiaobai Nexus</h1>
      </header>

      <div class="agent-hero">
        <div class="agent-cloud-mark">${appIcon()}</div>
        <h2>设置 Xiaobai Nexus</h2>
        <p>一个帮助你调用电脑、理解任务并完成复杂工作的 AI 智能体。</p>
      </div>

      <div class="setup-steps">
        <div class="setup-step">
          <span>${icon('laptop')}</span>
          <p>Xiaobai Nexus 会利用你的台式电脑算力、文件和本地工具来完成复杂工作。</p>
        </div>
        <div class="setup-step">
          <span>${icon('user')}</span>
          <p>用同一个小白账号登录手机和桌面端，手机就能找到自己的电脑端 Agent。</p>
        </div>
        <div class="setup-step">
          <span>${icon('sync')}</span>
          <p>按照桌面端提示完成连接，之后任务、进度、结果和确认请求会同步到手机。</p>
        </div>
      </div>

      ${connected ? `
        <div class="agent-connected-card">
          <strong>${escapeHtml(deviceName(device))}</strong>
          <span>${device?.online ? '已在线，可以远程执行任务。' : '已绑定，打开桌面端小白后会恢复在线。'}</span>
        </div>
      ` : renderAgentSetupLogin()}

      ${renderConnectedControls(connected)}

      <div class="agent-setup-actions">
        <button class="secondary-button full" data-action="send-download-link">把下载链接发到我的邮箱</button>
        <button class="primary-button full" data-action="agent-desktop-ready">我已在桌面端登录</button>
      </div>
    </section>
  `
}

function renderConnectedControls(connected) {
  return `
    <div class="nexus-control-panel">
      <h3>连接后可以控制</h3>
      <div class="nexus-control-grid">
        <button data-action="toggle-settings">
          ${icon('image')}
          <span>更换手机背景</span>
        </button>
        <button data-control-command="OPEN_HOTSPOT_PANEL" ${connected ? '' : 'disabled'}>
          ${icon('wave')}
          <span>唤出电脑热点界面</span>
        </button>
        <button data-control-command="OPEN_NETWORK_SETTINGS" ${connected ? '' : 'disabled'}>
          ${icon('laptop')}
          <span>打开电脑网络设置</span>
        </button>
        <button data-control-command="CHECK_AGENT_STATUS" ${connected ? '' : 'disabled'}>
          ${icon('sync')}
          <span>检查桌面端状态</span>
        </button>
      </div>
      <p>涉及电脑系统界面的动作会先发给桌面端小白，由电脑端按权限和确认规则执行。</p>
    </div>
  `
}

function renderAgentSetupLogin() {
  if (state.session.authenticated) {
    return `
      <div class="agent-waiting-card">
        <strong>还没发现桌面端小白</strong>
        <span>${escapeHtml(syncDiagnosis())}</span>
      </div>
    `
  }
  return `
    <div class="agent-login-card">
      <label class="field">
        <span>小白账号</span>
        <input id="memberAccount" value="${escapeAttr(state.memberLogin.account)}" placeholder="手机号或邮箱" autocomplete="username" />
      </label>
      <label class="field">
        <span>密码</span>
        <input id="memberPassword" value="${escapeAttr(state.memberLogin.password)}" placeholder="登录后不保存在手机端" type="password" autocomplete="current-password" />
      </label>
      <button class="primary-button full" data-action="cloud-login" ${state.memberLogin.busy ? 'disabled' : ''}>${state.memberLogin.busy ? '登录中' : '登录并查找桌面端'}</button>
      ${state.memberLogin.error ? `<div class="notice error">${escapeHtml(state.memberLogin.error)}</div>` : ''}
      ${state.session.error ? `<div class="notice error">${escapeHtml(state.session.error)}</div>` : ''}
    </div>
  `
}

function renderWorkbench() {
  const device = selectedDevice()
  const approval = latestPendingApproval()
  const activeTask = latestActiveTask()
  return `
    <section class="workbench-panel ${device?.online ? 'online' : 'waiting'}">
      <div class="device-status-card">
        <img class="brand-mark" src="./icons/icon-192.png" alt="小白 AI" />
        <div>
          <span class="eyeless-label">${device?.online ? '电脑端在线' : '等待电脑端连接'}</span>
          <strong>${escapeHtml(deviceName(device))}</strong>
          <p>${escapeHtml(syncDiagnosis())}</p>
        </div>
      </div>
      ${approval ? renderApprovalCard(approval) : activeTask ? renderCurrentTask(activeTask) : renderIdleTaskCard()}
    </section>
  `
}

function latestPendingApproval() {
  return (state.remote.approvals || []).find((item) => String(item.status || '') === 'pending') || null
}

function latestActiveTask() {
  return (state.remote.tasks || []).find((task) => !/complete|success|done|failed|error/i.test(String(task.status || '')))
    || (state.remote.tasks || [])[0]
    || null
}

function renderCurrentTask(task) {
  const status = String(task.status || 'pending')
  const isDone = /complete|success|done/i.test(status)
  const isFailed = /fail|error|timeout|aborted/i.test(status)
  const isRunning = /running|claimed|processing/i.test(status)
  const result = task.error || task.result || ''
  return `
    <div class="current-task-card">
      <div class="row-top">
        <div>
          <span class="eyeless-label">当前任务</span>
          <h2>${escapeHtml(task.content || task.title || task.task || '远程任务')}</h2>
        </div>
        ${statusTag(status)}
      </div>
      <div class="task-timeline-mini">
        ${renderStepDot('接收任务', true)}
        ${renderStepDot('拆解目标', isRunning || isDone || isFailed)}
        ${renderStepDot('电脑执行', isRunning || isDone || isFailed)}
        ${renderStepDot('同步结果', isDone || isFailed)}
      </div>
      ${result ? `<p class="task-result-preview">${escapeHtml(result)}</p>` : `<p>${isRunning ? '电脑端小白正在执行，手机会自动同步结果。' : '任务已经进入云端队列，电脑端在线后会自动接收。'}</p>`}
      <button class="secondary-button slim" data-action="open-studio-tasks">查看执行过程</button>
    </div>
  `
}

function renderApprovalCard(approval) {
  return `
    <div class="approval-card">
      <span class="eyeless-label">等待你确认</span>
      <h2>${escapeHtml(approval.action || '电脑端小白需要确认')}</h2>
      <p>${escapeHtml(approval.reason || approval.impact || '这个步骤可能影响文件、账号、发布或系统设置，需要你在手机上批准后继续。')}</p>
      ${approval.impact ? `<div class="approval-impact">${escapeHtml(approval.impact)}</div>` : ''}
      <div class="approval-actions">
        <button class="primary-button" data-approval-id="${escapeAttr(approval.id)}" data-approval-decision="approved">批准继续</button>
        <button class="secondary-button" data-approval-id="${escapeAttr(approval.id)}" data-approval-decision="denied">拒绝</button>
      </div>
    </div>
  `
}

function renderStepDot(label, done) {
  return `<span class="${done ? 'done' : ''}"><i></i>${escapeHtml(label)}</span>`
}

function renderIdleTaskCard() {
  return `
    <div class="current-task-card idle">
      <span class="eyeless-label">Xiaobai Nexus 模式</span>
      <h2>把任务交给自己的 Agent</h2>
      <p>像 ChatGPT 里进入工作模式一样，手机负责下达目标，你自己的电脑端小白负责执行、调用本机能力并同步结果。</p>
      <div class="quick-intents">
        <button data-quick-task="继续上次未完成的任务">继续上次任务</button>
        <button data-quick-task="检查我的 Xiaobai Nexus 连接和同步状态">检查连接</button>
        <button data-action="open-studio-skills">技能库</button>
      </div>
    </div>
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
      <section class="diagnostic-card ${state.remote.devices.length ? 'ok' : 'warn'}">
        <strong>${state.remote.devices.length ? '同步状态' : '还没连上电脑端'}</strong>
        <span>${escapeHtml(syncDiagnosis())}</span>
      </section>
    `
  }

  return `
    <section class="setup-panel account-gate">
      <div class="setup-head">
        <div>
          <h2>连接我的 Xiaobai Nexus</h2>
          <p>问答模式不用登录；进入 Xiaobai Nexus 模式时，登录同一个小白账号，就能找到自己的电脑端 Agent。</p>
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
      <button class="primary-button full" data-action="cloud-login" ${state.memberLogin.busy ? 'disabled' : ''}>${state.memberLogin.busy ? '登录中' : '登录并连接我的 Xiaobai Nexus'}</button>
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
  return `${deviceName(device)} · ${stateText} · ${state.remote.tasks.length} 个任务`
}

function renderEmptyChat() {
  return `
    <div class="empty-chat">
      <img class="empty-logo" src="./icons/icon-192.png" alt="小白 AI" />
      <h2>${chatMode() === 'agent' ? '让 Xiaobai Nexus 做什么？' : '今天想问小白什么？'}</h2>
      <p>${chatMode() === 'agent'
        ? '进入 Xiaobai Nexus 模式后，手机发目标，自己的电脑端小白负责拆解、执行和同步结果。'
        : '这里先是一个可问答的手机 App。需要电脑执行时，再切到 Xiaobai Nexus 模式。'}</p>
    </div>
  `
}

function renderComposer() {
  const disabled = !canSendInCurrentMode()
  const placeholder = chatMode() === 'agent'
    ? (disabled ? '先连接我的 Xiaobai Nexus' : '发任务给我的 Xiaobai Nexus')
    : '问问小白'
  return `
    <form class="composer" data-action="composer">
      <button class="tool-button" type="button" data-action="toggle-settings" aria-label="添加">${icon('add')}</button>
      <textarea id="composerText" placeholder="${escapeAttr(placeholder)}" rows="1" ${disabled ? 'disabled' : ''}>${escapeHtml(state.composing)}</textarea>
      <button class="tool-button ${state.listening ? 'active' : ''}" type="button" data-action="voice" aria-label="语音输入" ${disabled ? 'disabled' : ''}>${icon('mic')}</button>
      <button class="send-button" type="button" data-action="send" aria-label="发送" ${disabled ? 'disabled' : ''}>${icon('wave')}</button>
    </form>
  `
}

function renderMessage(message) {
  const role = message.role || 'system'
  return `<div class="message ${escapeAttr(role)}">${escapeHtml(message.content || '')}</div>`
}

function renderStudioSheet() {
  if (state.ui.studioDetail) return renderStudioDetailSheet()
  return `
    <section class="studio-backdrop" data-action="close-studio">
      <aside class="studio-sheet" role="dialog" aria-label="小白菜单" data-sheet>
        <div class="drawer-head">
          <h2>小白</h2>
          <div class="drawer-head-actions">
            <button class="icon-only" data-action="search-history" aria-label="搜索">${icon('search')}</button>
            <button class="icon-only" data-action="toggle-settings" aria-label="账号和设置">${icon('user')}</button>
          </div>
        </div>

        <nav class="drawer-nav">
          <button data-studio-tab="projects">${icon('folder')}<span>项目</span></button>
          <button data-studio-tab="images">${icon('image')}<span>图片</span></button>
          <button data-action="open-agent-setup">${appIcon()}<span>Xiaobai Nexus</span></button>
          <button data-studio-tab="files">${icon('library')}<span>文件库</span></button>
          <button data-studio-tab="apps">${icon('apps')}<span>应用</span></button>
        </nav>

        <div class="recent-block">
          <h3>最近</h3>
          ${renderRecentList()}
        </div>

        <div class="studio-content drawer-detail">
          ${renderStudioContent()}
        </div>

        <button class="drawer-chat-button" data-action="close-studio">${icon('send')}聊天</button>
      </aside>
    </section>
  `
}

function renderStudioDetailSheet() {
  const title = studioTabTitle(state.ui.studioTab)
  return `
    <section class="studio-backdrop" data-action="close-studio">
      <aside class="studio-sheet detail-mode" role="dialog" aria-label="${escapeAttr(title)}" data-sheet>
        <div class="drawer-detail-head">
          <button class="icon-only" data-action="back-studio-menu" aria-label="返回菜单">${icon('back')}</button>
          <h2>${escapeHtml(title)}</h2>
          <button class="icon-only" data-action="sync-cloud" aria-label="同步">${icon('sync')}</button>
        </div>
        <div class="studio-content active-detail">
          ${renderStudioContent()}
        </div>
        <button class="drawer-chat-button" data-action="close-studio">${icon('send')}聊天</button>
      </aside>
    </section>
  `
}

function studioTabTitle(tab) {
  const titles = {
    devices: '我的电脑',
    projects: '项目',
    images: '图片',
    files: '文件库',
    apps: '应用',
    tasks: '最近任务',
    agents: '能力',
    skills: '技能库',
    memories: '记忆',
  }
  return titles[tab] || '小白'
}

function renderRecentList() {
  const tasks = (state.remote.tasks || []).slice(0, 3)
  if (!tasks.length) return '<button class="recent-item" data-action="new-chat">新的小白对话</button>'
  return tasks.map((task) => `
    <button class="recent-item" data-action="open-studio-tasks">
      ${escapeHtml(task.content || task.title || task.task || '小白任务')}
    </button>
  `).join('')
}

function studioTab(id, label) {
  return `<button class="studio-tab ${state.ui.studioTab === id ? 'active' : ''}" data-studio-tab="${id}">${label}</button>`
}

function renderStudioContent() {
  if (state.ui.studioTab === 'projects') return renderProjectsView()
  if (state.ui.studioTab === 'images') return renderImagesView()
  if (state.ui.studioTab === 'files') return renderFilesView()
  if (state.ui.studioTab === 'apps') return renderAppsView()
  if (state.ui.studioTab === 'tasks') return renderTaskBoard()
  if (state.ui.studioTab === 'agents') return renderDelegations()
  if (state.ui.studioTab === 'skills') return renderSkills()
  if (state.ui.studioTab === 'memories') return renderMemories()
  return renderDevices()
}

function renderProjectsView() {
  const rows = state.remote.projects || []
  return `
    <div class="panel-head rich">
      <div>
        <h3>项目工作区</h3>
        <p>把同一个目标里的聊天、桌面任务、文件、说明和结果放在一起，手机和电脑继续同一件事。</p>
      </div>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    <div class="collection-actions">
      <button class="secondary-button slim" data-action="create-project">${icon('folder')}新建项目</button>
      <button class="ghost-button slim" data-action="open-studio-tasks">查看任务</button>
    </div>
    ${rows.length ? `
      <div class="project-list">
        ${rows.slice(0, 16).map((item) => renderProjectCard(item)).join('')}
      </div>
    ` : renderFunctionalEmpty(
      '还没有同步项目',
      '电脑端创建项目、保存任务结果，或从当前聊天新建项目后，会在这里显示项目里的聊天、文件和执行状态。',
      'create-project',
      '从当前聊天创建'
    )}
  `
}

function renderProjectCard(item) {
  const payload = item.payload || item.meta || {}
  const chatCount = countValue(item.chat_count, item.chats, payload.chats)
  const fileCount = countValue(item.file_count, item.files, payload.files)
  const taskCount = countValue(item.task_count, item.tasks, payload.tasks)
  return `
    <button class="project-card" data-project-id="${escapeAttr(item.id || item.project_id || '')}">
      <div class="project-main">
        <span class="project-icon">${icon('folder')}</span>
        <span>
          <strong>${escapeHtml(item.title || item.name || payload.title || '未命名项目')}</strong>
          <small>${escapeHtml(item.summary || item.description || payload.instructions || '同步的项目上下文')}</small>
        </span>
      </div>
      <div class="project-stats">
        <em>${chatCount} 聊天</em>
        <em>${fileCount} 文件</em>
        <em>${taskCount} 任务</em>
      </div>
    </button>
  `
}

function renderImagesView() {
  const rows = state.remote.images || []
  return `
    <div class="panel-head rich">
      <div>
        <h3>图片</h3>
        <p>保存生成图、截图、上传照片和可继续编辑的视觉资产，后续聊天或 Agent 任务都能复用。</p>
      </div>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    <div class="collection-actions">
      <button class="secondary-button slim" data-action="pick-image">${icon('image')}上传图片</button>
      <button class="ghost-button slim" data-action="generate-image">生成图片</button>
    </div>
    ${rows.length ? `
      <div class="asset-grid">
        ${rows.slice(0, 18).map((item) => renderImageCard(item)).join('')}
      </div>
    ` : renderFunctionalEmpty(
      '还没有图片资产',
      '手机上传的照片、电脑端截图、生成图和编辑后的图片会同步到这里，点进聊天时可以继续使用。',
      'pick-image',
      '上传第一张'
    )}
  `
}

function renderImageCard(item) {
  const payload = item.payload || item.meta || {}
  const url = item.url || item.thumbnail_url || item.thumbnail || payload.url || payload.thumbnail || payload.imageUrl || ''
  const label = item.title || item.name || item.filename || payload.prompt || '图片资产'
  return `
    <button class="image-card" data-asset-id="${escapeAttr(item.id || item.asset_id || '')}">
      ${url ? `<img src="${escapeAttr(url)}" alt="${escapeAttr(label)}" loading="lazy" />` : `<span class="image-placeholder">${icon('image')}</span>`}
      <span>${escapeHtml(label)}</span>
    </button>
  `
}

function renderFilesView() {
  const rows = state.remote.files || []
  return `
    <div class="panel-head rich">
      <div>
        <h3>文件库</h3>
        <p>集中保存上传资料、桌面端产出的报告、代码包和聊天里生成的文件，方便再次加入对话。</p>
      </div>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    <div class="collection-actions">
      <button class="secondary-button slim" data-action="upload-file">${icon('library')}上传文件</button>
      <button class="ghost-button slim" data-action="sync-cloud">同步桌面结果</button>
    </div>
    ${rows.length ? `
      <div class="file-list">
        ${rows.slice(0, 20).map((item) => renderFileRow(item)).join('')}
      </div>
    ` : renderFunctionalEmpty(
      '文件库还是空的',
      '上传的文档、表格、图片、电脑端任务输出和安装包结果都会进入这里，之后可以直接加回聊天。',
      'upload-file',
      '上传文件'
    )}
  `
}

function renderFileRow(item) {
  const payload = item.payload || item.meta || {}
  const name = item.filename || item.name || item.title || payload.filename || payload.name || '未命名文件'
  const type = item.mime_type || item.type || payload.type || fileTypeFromName(name)
  const note = item.path || item.url || item.summary || payload.source || payload.path || item.created_at || ''
  return `
    <button class="file-row" data-file-id="${escapeAttr(item.id || item.file_id || '')}">
      <span class="file-icon">${icon('library')}</span>
      <span>
        <strong>${escapeHtml(name)}</strong>
        <small>${escapeHtml(note)}</small>
      </span>
      <em>${escapeHtml(formatFileMeta(type, item.size || payload.size))}</em>
    </button>
  `
}

function renderAppsView() {
  const rows = state.remote.apps || []
  return `
    <div class="panel-head rich">
      <div>
        <h3>应用</h3>
        <p>把电脑端小白可调用的桌面能力、网站数据源、工具和连接器同步到手机，聊天时按需调用。</p>
      </div>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    <div class="collection-actions">
      <button class="secondary-button slim" data-action="connect-apps">${icon('apps')}连接应用</button>
      <button class="ghost-button slim" data-action="open-agent-setup">Nexus 设置</button>
    </div>
    ${rows.length ? `
      <div class="app-list">
        ${rows.slice(0, 20).map((item) => renderAppRow(item)).join('')}
      </div>
    ` : renderFunctionalEmpty(
      '还没有可用应用',
      '连接 Xiaobai Nexus 后，电脑端工具、热点面板、文件搜索、浏览器和你自己的 Agent 能力会显示在这里。',
      'connect-apps',
      '连接桌面应用'
    )}
  `
}

function renderAppRow(item) {
  const payload = item.payload || item.meta || {}
  const name = item.appName || item.name || item.title || payload.name || '应用'
  const status = item.status || payload.status || (item.connected ? 'connected' : 'available')
  return `
    <button class="app-row" data-app-id="${escapeAttr(item.id || item.app_id || '')}">
      <span class="app-row-icon">${icon('apps')}</span>
      <span>
        <strong>${escapeHtml(name)}</strong>
        <small>${escapeHtml(item.description || item.summary || payload.description || '可在聊天或 Agent 任务中调用')}</small>
      </span>
      ${statusTag(status)}
    </button>
  `
}

function renderFunctionalEmpty(title, body, action, actionLabel) {
  return `
    <div class="empty functional-empty">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}${state.session.authenticated ? '' : ' 登录 Xiaobai Nexus 后会自动同步。'}</span>
      <button class="secondary-button slim" data-action="${escapeAttr(action)}">${escapeHtml(actionLabel)}</button>
    </div>
  `
}

function countValue(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value.length
    const number = Number(value)
    if (Number.isFinite(number) && number >= 0) return number
  }
  return 0
}

function fileTypeFromName(name) {
  const match = String(name || '').match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toUpperCase() : 'FILE'
}

function formatFileMeta(type, size) {
  const normalizedType = String(type || 'FILE').split('/').pop().toUpperCase()
  const number = Number(size || 0)
  if (!Number.isFinite(number) || number <= 0) return normalizedType
  if (number >= 1024 * 1024) return `${normalizedType} ${(number / 1024 / 1024).toFixed(1)}MB`
  if (number >= 1024) return `${normalizedType} ${Math.round(number / 1024)}KB`
  return `${normalizedType} ${number}B`
}

function renderSyncedCollection(title, rows, emptyText) {
  return `
    <div class="panel-head">
      <h3>${escapeHtml(title)}</h3>
      <button class="text-button" data-action="sync-cloud">同步</button>
    </div>
    ${(rows || []).length ? `
      <div class="list">
        ${(rows || []).slice(0, 12).map((item) => `
          <div class="list-row">
            <div class="row-top">
              <div class="row-title">${escapeHtml(item.title || item.name || item.filename || item.appName || item.id || title)}</div>
              ${item.status ? statusTag(item.status) : ''}
            </div>
            <div class="row-note">${escapeHtml(item.summary || item.description || item.path || item.updated_at || item.created_at || '')}</div>
          </div>
        `).join('')}
      </div>
    ` : `<div class="empty">${escapeHtml(emptyText)}${state.session.authenticated ? '' : ' 登录 Xiaobai Nexus 后会自动同步。'}</div>`}
  `
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
                <strong>${escapeHtml(deviceName(device))}</strong>
                <small>${escapeHtml(device.online ? '在线，可以远程执行任务' : '离线，等电脑端小白上线后执行')}</small>
              </span>
              <em>${device.online ? '在线' : '离线'}</em>
            </button>
          `
        }).join('')}
      </div>
    ` : `<div class="empty">${escapeHtml(syncDiagnosis())}</div>`}
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
  const approvals = state.remote.approvals || []
  return `
    <div class="panel-head">
      <h3>Xiaobai Nexus 能力</h3>
      <button class="text-button" data-action="sync-cloud">刷新</button>
    </div>
    ${approvals.length ? `<div class="list approval-list">${approvals.slice(0, 6).map(renderApprovalRow).join('')}</div>` : ''}
    ${models.length ? `<div class="list">${models.map(renderAgentModel).join('')}</div>` : '<div class="empty">电脑端在线后，这里会显示你自己的 Agent 能力、桌面执行器、本地工具和可用模型状态。</div>'}
    <div class="panel-head second">
      <h3>最近委托</h3>
    </div>
    ${jobs.length ? `<div class="list">${jobs.slice(0, 8).map(renderJob).join('')}</div>` : '<div class="empty">复杂任务被电脑端小白分派后，会在这里显示委托进度。</div>'}
  `
}

function renderApprovalRow(approval) {
  return `
    <div class="list-row">
      <div class="row-top">
        <div class="row-title">${escapeHtml(approval.action || approval.id || '确认请求')}</div>
        ${statusTag(approval.status || 'pending')}
      </div>
      <div class="row-note">${escapeHtml(approval.reason || approval.impact || approval.from_agent || '')}</div>
      ${String(approval.status || '') === 'pending' ? `
        <div class="mini-actions">
          <button class="primary-button slim" data-approval-id="${escapeAttr(approval.id)}" data-approval-decision="approved">批准</button>
          <button class="secondary-button slim" data-approval-id="${escapeAttr(approval.id)}" data-approval-decision="denied">拒绝</button>
        </div>
      ` : ''}
    </div>
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
  return `<span class="tag ${cls}">${escapeHtml(statusLabel(value))}</span>`
}

function statusLabel(status) {
  const value = String(status || 'unknown')
  const labels = {
    pending: '等待电脑',
    running: '执行中',
    completed: '已完成',
    success: '已完成',
    failed: '失败',
    error: '异常',
    aborted: '已中断',
    pending_confirmation: '待确认',
    approved: '已批准',
    denied: '已拒绝',
  }
  return labels[value] || value
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

function cssUrl(value) {
  return String(value || '').replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

function render(options = {}) {
  const { scrollToBottom = false, preserveScroll = !scrollToBottom } = options
  const scrollY = window.scrollY
  document.querySelector('#app').innerHTML = appTemplate()
  bindEvents()
  if (scrollToBottom) {
    scrollMessagesToBottom()
  } else if (preserveScroll) {
    restoreScroll(scrollY)
  }
}

function renderBackground() {
  if (isComposerActive()) {
    deferredRender = true
    return
  }
  renderWithoutJump()
}

function renderWhenIdle() {
  if (isComposerActive()) {
    deferredRender = true
    return
  }
  render({ scrollToBottom: shouldFollowMessages() })
}

function renderWithoutJump() {
  render({ preserveScroll: true })
}

function isComposerActive() {
  return document.activeElement?.id === 'composerText'
}

function flushDeferredRender() {
  if (!deferredRender) return
  deferredRender = false
  renderWithoutJump()
}

function bindEvents() {
  document.querySelector('[data-action="new-chat"]')?.addEventListener('click', startNewTaskView)
  document.querySelector('[data-action="toggle-studio"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    state.ui.studioDetail = false
    if (state.session.authenticated) syncCloudAssets().catch(() => {})
    render()
  })
  document.querySelector('[data-action="toggle-settings"]')?.addEventListener('click', () => {
    state.ui.settingsOpen = !state.ui.settingsOpen
    state.ui.studioOpen = false
    render()
  })
  document.querySelectorAll('[data-action="open-agent-setup"], [data-action="open-studio-agent"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.ui.agentSetupOpen = true
      state.ui.studioOpen = false
      state.settings.mobileMode = 'agent'
      saveSettings()
      render()
    })
  })
  document.querySelector('[data-action="close-agent-setup"]')?.addEventListener('click', () => {
    state.ui.agentSetupOpen = false
    render()
  })
  document.querySelector('[data-action="agent-desktop-ready"]')?.addEventListener('click', () => {
    if (!state.session.authenticated) {
      addSystemMessage('先登录同一个小白账号，再检查桌面端连接。')
      return
    }
    syncCloudAssets().catch(() => {})
  })
  document.querySelector('[data-action="send-download-link"]')?.addEventListener('click', () => {
    addSystemMessage('下载链接发送入口已经放好；下一步需要云端补邮箱发送接口。')
  })
  document.querySelectorAll('[data-control-command]').forEach((button) => {
    button.addEventListener('click', () => {
      sendControlCommand(button.dataset.controlCommand)
    })
  })
  document.querySelector('[data-action="search-history"]')?.addEventListener('click', () => {
    addSystemMessage('搜索入口已经放好；下一步接入会话、项目和文件库搜索。')
  })
  document.querySelector('[data-action="create-project"]')?.addEventListener('click', startProjectDraft)
  document.querySelector('[data-action="pick-image"]')?.addEventListener('click', startImageUploadFlow)
  document.querySelector('[data-action="generate-image"]')?.addEventListener('click', startImageGenerationFlow)
  document.querySelector('[data-action="upload-file"]')?.addEventListener('click', startFileUploadFlow)
  document.querySelector('[data-action="connect-apps"]')?.addEventListener('click', startAppConnectionFlow)
  document.querySelectorAll('[data-project-id], [data-asset-id], [data-file-id], [data-app-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.querySelector('strong')?.textContent || button.querySelector('span:last-child')?.textContent || '这个项目'
      addSystemMessage(`已选中「${title.trim()}」。下一步会把它加入当前聊天上下文，并同步到电脑端 Xiaobai Nexus。`)
      closeStudio()
    })
  })
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.settings.mobileMode = button.dataset.mode === 'agent' ? 'agent' : 'chat'
      saveSettings()
      render()
    })
  })
  document.querySelector('[data-action="open-studio-devices"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    state.ui.studioTab = 'devices'
    state.ui.studioDetail = true
    render()
  })
  document.querySelector('[data-action="open-studio-tasks"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    state.ui.studioTab = 'tasks'
    state.ui.studioDetail = true
    render()
  })
  document.querySelector('[data-action="open-studio-skills"]')?.addEventListener('click', () => {
    state.ui.studioOpen = true
    state.ui.studioTab = 'skills'
    state.ui.studioDetail = true
    render()
  })
  document.querySelectorAll('[data-quick-task]').forEach((button) => {
    button.addEventListener('click', () => {
      state.composing = button.dataset.quickTask || ''
      render()
    })
  })
  document.querySelectorAll('[data-action="close-studio"]').forEach((node) => {
    node.addEventListener('click', closeStudio)
  })
  document.querySelector('[data-action="back-studio-menu"]')?.addEventListener('click', () => {
    state.ui.studioDetail = false
    render()
  })
  document.querySelector('[data-sheet]')?.addEventListener('click', (event) => {
    event.stopPropagation()
  })
  document.querySelectorAll('[data-studio-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.ui.studioTab = button.dataset.studioTab
      state.ui.studioDetail = true
      if (state.session.authenticated) syncCloudAssets().catch(() => {})
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
  document.querySelectorAll('[data-approval-id][data-approval-decision]').forEach((button) => {
    button.addEventListener('click', () => {
      sendApprovalDecision(button.dataset.approvalId, button.dataset.approvalDecision)
    })
  })

  document.querySelector('[data-action="cloud-login"]')?.addEventListener('click', loginCloudMember)
  document.querySelector('[data-action="sync-cloud"]')?.addEventListener('click', syncCloudAssets)
  document.querySelector('[data-action="toggle-advanced"]')?.addEventListener('click', () => {
    state.ui.advancedOpen = !state.ui.advancedOpen
    render()
  })
  document.querySelector('[data-action="local-debug-connect"]')?.addEventListener('click', testLocalDebugConnection)
  document.querySelector('[data-action="download-update"]')?.addEventListener('click', downloadMobileUpdate)
  document.querySelector('[data-action="send"]')?.addEventListener('click', sendCurrentMessage)
  document.querySelector('[data-action="voice"]')?.addEventListener('click', toggleVoiceInput)
  document.querySelectorAll('[data-model-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = MODEL_API_PRESETS.find((item) => item.id === button.dataset.modelPreset)
      if (!preset) return
      state.settings.modelBaseUrl = preset.baseUrl
      state.settings.modelName = preset.model
      saveSettings()
      render()
    })
  })

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
  document.querySelector('#chatModel')?.addEventListener('change', (event) => {
    state.settings.chatModel = MODEL_OPTIONS.some((item) => item.id === event.target.value) ? event.target.value : DEFAULT_CHAT_MODEL
    saveSettings()
    render()
  })
  document.querySelector('#modelBaseUrl')?.addEventListener('input', (event) => {
    state.settings.modelBaseUrl = event.target.value
    saveSettings()
    renderBackground()
  })
  document.querySelector('#modelApiKey')?.addEventListener('input', (event) => {
    state.settings.modelApiKey = event.target.value
    saveSettings()
    renderBackground()
  })
  document.querySelector('#modelName')?.addEventListener('input', (event) => {
    state.settings.modelName = event.target.value
    saveSettings()
    renderBackground()
  })
  document.querySelector('[data-action="clear-model-api"]')?.addEventListener('click', () => {
    state.settings.modelBaseUrl = ''
    state.settings.modelApiKey = ''
    state.settings.modelName = ''
    saveSettings()
    render()
  })
  document.querySelector('[data-action="test-model-api"]')?.addEventListener('click', testModelApi)
  document.querySelector('#wallpaperInput')?.addEventListener('change', setWallpaperFromInput)
  document.querySelector('[data-action="clear-wallpaper"]')?.addEventListener('click', () => {
    state.settings.wallpaperImage = ''
    saveSettings()
    render()
  })

  const textarea = document.querySelector('#composerText')
  textarea?.addEventListener('input', (event) => {
    state.composing = event.target.value
    resizeComposer(textarea)
  })
  textarea?.addEventListener('blur', flushDeferredRender)
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
  state.ui.studioOpen = false
  state.ui.agentSetupOpen = false
  saveHistory()
  render({ scrollToBottom: true })
}

function startProjectDraft() {
  state.composing = state.composing || '把当前聊天整理成一个新项目，包含目标、已有资料、下一步任务和需要同步到电脑端的文件。'
  state.ui.studioOpen = false
  render({ scrollToBottom: true })
}

function startImageUploadFlow() {
  state.ui.studioOpen = false
  state.ui.settingsOpen = true
  addSystemMessage('图片入口已打开：可以先用“换背景照片”选择本机图片；后续上传到文件库和图片库时会同步到电脑端。')
  render({ scrollToBottom: true })
}

function startImageGenerationFlow() {
  state.composing = '帮我生成一张图片：'
  state.ui.studioOpen = false
  render({ scrollToBottom: true })
}

function startFileUploadFlow() {
  state.ui.studioOpen = false
  addSystemMessage('文件上传入口已经接好到文件库页面；云端文件上传接口部署后，这里会直接选择文件并同步到电脑端。')
  render({ scrollToBottom: true })
}

function startAppConnectionFlow() {
  state.ui.studioOpen = false
  state.ui.agentSetupOpen = true
  addSystemMessage('应用连接会先进入 Xiaobai Nexus 设置，连接桌面端后会同步电脑上的热点面板、浏览器、文件搜索和你的 Agent 能力。')
  render({ scrollToBottom: true })
}

function resizeComposer(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
}

function setWallpaperFromInput(event) {
  const file = event.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    state.settings.wallpaperImage = String(reader.result || '')
    saveSettings()
    render()
  }
  reader.readAsDataURL(file)
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
    state.session.token = result.token || result.sessionToken || result.accessToken || ''
    state.session.sessionId = result.sessionId || result.sid || ''
    saveSession()
    state.memberLogin.password = ''
    addSystemMessage('网站会员登录成功，正在查找你的电脑端小白。')
    await syncCloudAssets()
    openEventStream()
    startCloudPoll()
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

function saveDesktopChatModelToPhone(config) {
  if (!config || typeof config !== 'object') return false
  const baseUrl = normalizeModelBaseUrl(config.baseUrl || config.base_url || '')
  const apiKey = String(config.apiKey || config.api_key || '').trim()
  const model = String(config.model || config.modelName || '').trim()
  if (!baseUrl || !apiKey || !model) return false
  const previous = `${state.settings.modelBaseUrl}|${state.settings.modelName}`
  state.settings.modelBaseUrl = baseUrl
  state.settings.modelApiKey = apiKey
  state.settings.modelName = model
  saveSettings()
  const next = `${baseUrl}|${model}`
  if (next !== previous) {
    const label = config.providerLabel || config.label || model
    addSystemMessage(`已从电脑端 Agent 保存问答 API：${label}。之后电脑不在线，普通问答也会继续使用这套用户自己的 API。`)
  }
  return true
}

async function syncCloudAssets() {
  if (!state.session.authenticated) return
  state.remote.checking = true
  state.remote.error = ''
  renderBackground()

  try {
    const [devices, tasks, skills, memories, delegations, approvals, conversations, health, projects, images, files, apps, chatModel] = await Promise.all([
      cloudApi().get('/api/agent-remote/devices').catch(() => ({ devices: [] })),
      cloudApi().get('/api/agent-remote/tasks?limit=20').catch(() => ({ tasks: [] })),
      cloudApi().get('/api/agent-remote/skills?limit=20').catch(() => ({ skills: [] })),
      cloudApi().get('/api/agent-remote/memories?limit=20').catch(() => ({ memories: [] })),
      cloudApi().get('/api/agent-remote/delegations?output=1').catch(() => null),
      cloudApi().get('/api/agent-remote/approvals?limit=20').catch(() => ({ approvals: [] })),
      cloudApi().get('/api/agent-remote/conversations?limit=80').catch(() => ({ messages: [] })),
      cloudApi().get('/api/agent-remote/health').catch(() => null),
      cloudApi().get('/api/agent-remote/projects?limit=20').catch(() => ({ projects: [] })),
      cloudApi().get('/api/agent-remote/images?limit=20').catch(() => ({ images: [] })),
      cloudApi().get('/api/agent-remote/files?limit=20').catch(() => ({ files: [] })),
      cloudApi().get('/api/agent-remote/apps?limit=20').catch(() => ({ apps: [] })),
      cloudApi().get('/api/agent-remote/chat-model').catch(() => ({ chatModel: null })),
    ])

    state.remote.devices = devices.devices || devices.items || []
    if (!state.remote.selectedDeviceId && state.remote.devices[0]) state.remote.selectedDeviceId = state.remote.devices[0].id
    state.remote.tasks = tasks.tasks || tasks.items || []
    state.remote.projects = projects.projects || projects.items || []
    state.remote.images = images.images || images.items || []
    state.remote.files = files.files || files.items || []
    state.remote.apps = apps.apps || apps.items || []
    state.remote.skills = skills.skills || skills.items || []
    state.remote.memories = memories.memories || memories.items || []
    state.remote.delegations = delegations
    state.remote.approvals = approvals.approvals || approvals.items || []
    state.remote.health = health
    state.remote.chatModelConfig = chatModel.chatModel || chatModel.model || null
    saveDesktopChatModelToPhone(state.remote.chatModelConfig)
    syncConversationMessages(conversations.messages || conversations.items || [])
    scheduleActiveCloudPoll()
  } catch (error) {
    state.remote.error = error.message
    addSystemMessage(`同步失败：${error.message}`)
  } finally {
    state.remote.checking = false
    renderBackground()
  }
}

async function syncCloudFast() {
  if (!state.session.authenticated || state.remote.checking) return
  state.remote.checking = true
  try {
    const [tasks, conversations] = await Promise.all([
      cloudApi().get('/api/agent-remote/tasks?limit=20').catch(() => ({ tasks: [] })),
      cloudApi().get('/api/agent-remote/conversations?limit=80').catch(() => ({ messages: [] })),
    ])
    state.remote.tasks = tasks.tasks || tasks.items || state.remote.tasks || []
    syncConversationMessages(conversations.messages || conversations.items || [])
  } catch (error) {
    state.remote.error = error.message
  } finally {
    state.remote.checking = false
    renderBackground()
    scheduleActiveCloudPoll()
  }
}

async function checkMobileUpdate() {
  if (state.update.checking) return
  state.update.checking = true
  state.update.error = ''

  try {
    const baseUrl = normalizeBaseUrl(state.settings.cloudUrl || DEFAULT_CLOUD_URL)
    const response = await fetch(`${baseUrl}/downloads/xiaobai-mobile/release-manifest.json`, {
      cache: 'no-store',
      credentials: 'omit',
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const manifest = await response.json()
    const latestVersion = String(manifest.version || '').trim()
    const file = Array.isArray(manifest.files) ? manifest.files[0] : null
    const currentVersion = detectInstalledVersion()

    state.update.currentVersion = currentVersion
    state.update.latestVersion = latestVersion
    state.update.size = Number(file?.size || 0)
    state.update.apkUrl = file?.name ? `${baseUrl}/downloads/xiaobai-mobile/${file.name}` : ''
    state.update.available = !!state.update.apkUrl
      && versionGreaterThan(latestVersion, currentVersion)
  } catch (error) {
    state.update.error = error.message || 'update check failed'
  } finally {
    state.update.checking = false
    renderBackground()
  }
}

function downloadMobileUpdate() {
  if (!state.update.apkUrl) return
  window.location.href = state.update.apkUrl
}

function syncConversationMessages(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return
  state.messages = mergeMessages(rows)
  rememberEventCursor(rows[rows.length - 1]?.created_at || rows[rows.length - 1]?.timestamp)
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
  if (eventReconnectTimer) {
    clearTimeout(eventReconnectTimer)
    eventReconnectTimer = null
  }
  const source = new EventSource(cloudApi().eventUrl(), { withCredentials: true })
  state.eventSource = source
  const receive = (event) => {
    try {
      const payload = JSON.parse(event.data)
      handleRemoteEvent(payload)
    } catch {
      addSystemMessage(event.data)
    }
  }
  source.onopen = () => {
    state.eventReconnectDelay = EVENT_RECONNECT_BASE_MS
  }
  source.onmessage = receive
  source.addEventListener('connected', receive)
  source.addEventListener('task_updated', receive)
  source.addEventListener('response', receive)
  source.addEventListener('conversation_updated', receive)
  source.addEventListener('remote_error', receive)
  source.onerror = () => {
    closeEventStream()
    scheduleEventReconnect()
  }
}

function closeEventStream() {
  if (state.eventSource) state.eventSource.close()
  state.eventSource = null
}

function scheduleEventReconnect() {
  if (!state.session.authenticated || eventReconnectTimer) return
  const delay = Math.min(state.eventReconnectDelay || EVENT_RECONNECT_BASE_MS, EVENT_RECONNECT_MAX_MS)
  eventReconnectTimer = setTimeout(() => {
    eventReconnectTimer = null
    state.eventReconnectDelay = Math.min(delay * 1.8, EVENT_RECONNECT_MAX_MS)
    openEventStream()
  }, delay)
}

function handleRemoteEvent(payload) {
  const type = payload.type
  const data = payload.data || {}
  if (type === 'connected') return
  rememberEventCursor(payload.ts || data.updated_at || data.created_at)
  if (type === 'response' && data.content) {
    addMessage(data.role === 'system' ? 'system' : 'agent', data.content, {
      id: data.id ? `remote:${data.id}` : '',
      taskId: data.task_id || '',
    })
  } else if (type === 'task_updated' || type === 'delegation_updated') {
    if (Array.isArray(data.tasks) && data.tasks.length) {
      const byId = new Map((state.remote.tasks || []).map((task) => [String(task.id), task]))
      data.tasks.forEach((task) => byId.set(String(task.id), { ...(byId.get(String(task.id)) || {}), ...task }))
      state.remote.tasks = [...byId.values()].sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
      renderBackground()
      scheduleActiveCloudPoll()
    } else {
      syncCloudFast().catch(() => {})
    }
  } else if (type === 'device_status') {
    syncCloudAssets().catch(() => {})
  } else if (type === 'conversation_updated') {
    syncCloudFast().catch(() => {})
  } else if (type === 'remote_error') {
    state.remote.error = data.message || '远程同步异常'
  }
}

async function sendCurrentMessage() {
  const content = state.composing.trim()
  if (!content || !canSendInCurrentMode() || state.sending) return
  state.sending = true
  state.composing = ''
  addMessage('user', content, { forceRender: true })

  try {
    if (chatMode() === 'chat') {
      await sendMobileChatMessage(content)
      return
    }
    const device = selectedDevice()
    await cloudApi().post('/api/agent-remote/tasks', {
      deviceId: device?.id || state.remote.selectedDeviceId || null,
      channel: 'MOBILE_APP',
      content,
      modelPreference: modelPreferenceForTask(),
    })
    await syncCloudFast()
    scheduleActiveCloudPoll(true)
  } catch (error) {
    addSystemMessage(`发送失败：${error.message}`)
  } finally {
    state.sending = false
  }
}

async function sendMobileChatMessage(content) {
  try {
    const config = modelConfig()
    const result = await cloudApi().post('/api/mobile-chat', {
      content,
      model: config.configured ? config.model : state.settings.chatModel || DEFAULT_CHAT_MODEL,
      modelConfig: modelConfigForRequest(),
      mode: 'chat',
    })
    const answer = result.answer || result.content || result.message
    addMessage('agent', answer || '小白已经收到，但云端没有返回回答内容。', {
      id: result.id || result.messageId || null,
    })
  } catch (error) {
    const message = /404|not found/i.test(error?.message || '')
      ? '手机问答入口已经准备好，但云端 /api/mobile-chat 还没有接上。下一步需要把小白网站账号、模型路由和回答流式接口补齐。'
      : `问答失败：${error.message}`
    addSystemMessage(message)
  }
}

async function testModelApi() {
  const config = modelConfig()
  if (!config.configured) {
    addSystemMessage('当前会使用小白默认 DeepSeek 免费问答入口。想换成自己的模型时，再填写 Base URL、API Key 和模型名。')
    return
  }
  addSystemMessage(`正在测试 ${config.providerLabel} / ${config.model}...`)
  try {
    const result = await cloudApi().post('/api/mobile-chat', {
      content: '请用一句中文回复：模型连接成功。',
      model: config.model,
      modelConfig: modelConfigForRequest(),
      mode: 'test',
    })
    addSystemMessage(result.answer || result.content || result.message || '模型连接成功。')
  } catch (error) {
    addSystemMessage(`模型测试失败：${error.message}`)
  }
}

async function sendControlCommand(command) {
  const normalized = String(command || '').trim()
  if (!normalized || !state.session.authenticated) {
    addSystemMessage('先连接 Xiaobai Nexus 和桌面端小白，再使用电脑控制。')
    return
  }
  const labels = {
    OPEN_HOTSPOT_PANEL: '唤出电脑热点界面',
    OPEN_NETWORK_SETTINGS: '打开电脑网络设置',
    CHECK_AGENT_STATUS: '检查桌面端状态',
  }
  const label = labels[normalized] || '执行电脑控制'
  addSystemMessage(`已请求桌面端小白：${label}。涉及系统界面时，电脑端会按权限规则确认后执行。`)
  try {
    const device = selectedDevice()
    await cloudApi().post('/api/agent-remote/tasks', {
      deviceId: device?.id || state.remote.selectedDeviceId || null,
      channel: 'MOBILE_CONTROL',
      content: `XIAOBAI_NEXUS_CONTROL:${JSON.stringify({
        command: normalized,
        label,
        source: 'Xiaobai Nexus',
        requestedAt: new Date().toISOString(),
      })}`,
      modelPreference: modelPreferenceForTask(),
    })
    await syncCloudFast()
    scheduleActiveCloudPoll(true)
  } catch (error) {
    addSystemMessage(`电脑控制发送失败：${error.message}`)
  }
}

async function sendApprovalDecision(approvalId, decision) {
  const id = String(approvalId || '').trim()
  const normalized = decision === 'denied' ? 'denied' : 'approved'
  if (!id || !state.session.authenticated) return
  const label = normalized === 'approved' ? '批准' : '拒绝'
  addSystemMessage(`已${label}确认请求，正在通知电脑端小白。`)
  try {
    const payload = {
      type: 'approval_decision',
      id,
      decision: normalized,
      decidedAt: new Date().toISOString(),
    }
    const device = selectedDevice()
    await cloudApi().post('/api/agent-remote/tasks', {
      deviceId: device?.id || state.remote.selectedDeviceId || null,
      channel: 'MOBILE_APPROVAL',
      content: `XIAOBAI_REMOTE_APPROVAL_DECISION:${JSON.stringify(payload)}`,
    })
    state.remote.approvals = state.remote.approvals.map((item) =>
      String(item.id) === id ? { ...item, status: normalized, decision: normalized } : item
    )
    await syncCloudAssets()
  } catch (error) {
    addSystemMessage(`确认发送失败：${error.message}`)
  }
}

function addMessage(role, content, options = {}) {
  const message = {
    id: options.id || null,
    taskId: options.taskId || null,
    role,
    content,
    ts: new Date().toISOString(),
  }
  const key = messageKey(message)
  const duplicate = state.messages.some((item) => messageKey(item) === key)
    || state.messages.slice(-6).some((item) => item.role === role && normalizeMessageContent(item.content) === normalizeMessageContent(content))
  if (duplicate) return
  state.messages.push(message)
  state.messages = state.messages.slice(-80)
  saveHistory()
  if (options.forceRender || role === 'user') render({ scrollToBottom: true })
  else renderWhenIdle()
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
  const list = document.querySelector('#messageList')
  if (list) list.scrollIntoView({ block: 'end' })
}

function shouldFollowMessages() {
  if (isComposerActive()) return false
  const page = document.documentElement
  const distance = page.scrollHeight - (window.scrollY + window.innerHeight)
  return distance < 180
}

function restoreScroll(scrollY) {
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
  })
}

function startCloudPoll() {
  if (cloudPollTimer || !state.session.authenticated) return
  cloudPollTimer = setInterval(() => {
    if (!state.remote.checking) syncCloudAssets().catch(() => {})
  }, CLOUD_POLL_MS)
}

function hasActiveRemoteTask() {
  return (state.remote.tasks || []).some((task) => !/complete|success|done|failed|error|aborted/i.test(String(task.status || '')))
}

function scheduleActiveCloudPoll(force = false) {
  if (!state.session.authenticated) return
  if (!force && !hasActiveRemoteTask()) {
    if (activeCloudPollTimer) clearTimeout(activeCloudPollTimer)
    activeCloudPollTimer = null
    return
  }
  if (activeCloudPollTimer) return
  activeCloudPollTimer = setTimeout(() => {
    activeCloudPollTimer = null
    syncCloudFast().catch(() => {})
  }, force ? 400 : ACTIVE_CLOUD_POLL_MS)
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', window.location.href)).catch(() => {})
  })
}

render()
checkMobileUpdate().catch(() => {})
setInterval(() => {
  checkMobileUpdate().catch(() => {})
}, UPDATE_CHECK_MS)
if (state.session.authenticated) {
  startCloudPoll()
  syncCloudAssets().then(openEventStream).catch(() => {})
}
