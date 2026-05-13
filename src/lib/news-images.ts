type NewsImageItem = {
  id?: string
  title?: string
  category?: string
  source?: string
  image?: string
}

export function generatedNewsCoverUrl(item: NewsImageItem) {
  const params = new URLSearchParams()
  if (item.id) params.set("id", item.id)
  params.set("title", String(item.title || "AI 资讯"))
  if (item.category) params.set("category", String(item.category))
  if (item.source) params.set("source", String(item.source))
  return `/api/news-cover?${params.toString()}`
}

export function isLikelyLogoImage(url = "") {
  const lower = String(url).toLowerCase()
  if (!lower) return false
  return /favicon|logo|icon|avatar|simpleicons|google\.com\/s2\/favicons|cdn\.simpleicons\.org/.test(lower)
}

export function isGeneratedNewsCover(url = "") {
  return String(url).startsWith("/api/news-cover")
}

export function newsImageSources(item: NewsImageItem) {
  const image = String(item.image || "")
  if (image && !isLikelyLogoImage(image)) return [image, generatedNewsCoverUrl(item)]
  return [generatedNewsCoverUrl(item)]
}
