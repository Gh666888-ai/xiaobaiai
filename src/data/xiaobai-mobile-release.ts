import releaseManifest from "../../public/downloads/xiaobai-mobile/release-manifest.json"

type ReleaseFile = {
  name: string
  size: number
  sha256: string
}

const files = (releaseManifest.files || []) as ReleaseFile[]
const apkFile = files.find((file) => /^Xiaobai-Nexus-\d+\.\d+\.\d+\.apk$/.test(file.name))

if (!apkFile) {
  throw new Error("Xiaobai Nexus APK is missing from release-manifest.json")
}

const formatBytes = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "未知"
  const mb = value / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.ceil(value / 1024)} KB`
}

export const xiaobaiMobileRelease = {
  name: releaseManifest.name,
  version: releaseManifest.version,
  platform: releaseManifest.platform,
  platformLabel: "Android / 鸿蒙 APK",
  compatibilityLabel: "适用于安卓手机、鸿蒙手机和平板；iPhone 暂无原生安装包",
  iosWebLabel: "iOS 可用网页版或添加到主屏幕",
  packageName: releaseManifest.packageName,
  apkName: apkFile.name,
  apkUrl: `/downloads/xiaobai-mobile/${apkFile.name}`,
  apkSize: formatBytes(apkFile.size),
  apkSha256: apkFile.sha256,
  manifestUrl: "/downloads/xiaobai-mobile/release-manifest.json",
  appUrl: "/mobile-agent/",
  webAppUrl: "/mobile-agent/",
} as const
