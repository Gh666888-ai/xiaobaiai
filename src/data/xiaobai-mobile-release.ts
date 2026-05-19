import releaseManifest from "../../public/downloads/xiaobai-mobile/release-manifest.json"

type ReleaseFile = {
  name: string
  size: number
  sha256: string
}

const files = (releaseManifest.files || []) as ReleaseFile[]
const apkFile = files.find((file) => /^Xiaobai-Agent-Mobile-\d+\.\d+\.\d+\.apk$/.test(file.name))

if (!apkFile) {
  throw new Error("Xiaobai mobile APK is missing from release-manifest.json")
}

const formatBytes = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "未知"
  const kb = value / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export const xiaobaiMobileRelease = {
  version: releaseManifest.version,
  packageName: releaseManifest.packageName,
  apkName: apkFile.name,
  apkUrl: `/downloads/xiaobai-mobile/${apkFile.name}`,
  apkSize: formatBytes(apkFile.size),
  apkSha256: apkFile.sha256,
  manifestUrl: "/downloads/xiaobai-mobile/release-manifest.json",
  webAppUrl: "/mobile-agent/",
} as const
