const savedApiConfig = (() => {
  try {
    return JSON.parse(localStorage.getItem("xiaobai-tianshu-api-config") || "{}");
  } catch {
    return {};
  }
})();

const authSession = (() => {
  try {
    return JSON.parse(localStorage.getItem("xiaobai-tianshu-auth-session") || "{}");
  } catch {
    return {};
  }
})();

const normalizeApiBase = (value) => {
  if (!value || typeof value !== "string") return "";
  return value
    .replace(/\/api\/agent-remote\/tasks\/?$/i, "")
    .replace(/\/api\/mobile-chat\/?$/i, "")
    .replace(/\/$/, "");
};

export const REMOTE_TOKEN = authSession.token || savedApiConfig.token || "";
export const REMOTE_MODE = Boolean(REMOTE_TOKEN && /\/api\/agent-remote\/tasks\/?$/i.test(savedApiConfig.desktopEndpoint || ""));

export const API = normalizeApiBase(savedApiConfig.desktopEndpoint || savedApiConfig.endpoint)
  || (/^https?:$/.test(window.location?.protocol || "") ? window.location.origin : "http://localhost:3721");

export function apiUrl(path) {
  if (REMOTE_MODE) {
    return `${API}/api/agent-remote${path}`;
  }
  return `${API}${path}`;
}

export function apiHeaders(extra = {}) {
  return REMOTE_TOKEN ? { ...extra, Authorization: `Bearer ${REMOTE_TOKEN}` } : extra;
}

export function eventUrl(path) {
  const url = apiUrl(path);
  if (!REMOTE_TOKEN) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}token=${encodeURIComponent(REMOTE_TOKEN)}`;
}
