const savedApiConfig = (() => {
  try {
    return JSON.parse(localStorage.getItem("xiaobai-tianshu-api-config") || "{}");
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

export const API = normalizeApiBase(savedApiConfig.desktopEndpoint || savedApiConfig.endpoint)
  || (/^https?:$/.test(window.location?.protocol || "") ? window.location.origin : "http://localhost:3721");

export function apiUrl(path) {
  return `${API}${path}`;
}
