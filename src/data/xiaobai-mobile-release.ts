import releaseManifest from "../../public/downloads/xiaobai-mobile/release-manifest.json"

type ReleaseFile = {
  name: string
  size: number
  sha256: string
}

const files = (releaseManifest.files || []) as ReleaseFile[]
const apkFile = files.find((file) => /^Xiaobai-Tianshu-\d+\.\d+\.\d+\.apk$/.test(file.name))
const webPackageName = releaseManifest.webPackageName
const webPackageSize = releaseManifest.webPackageSize
const webPackageSha256 = releaseManifest.webPackageSha256
const webVersion = releaseManifest.webVersion || releaseManifest.version
const downloadName = webPackageName || apkFile?.name
const downloadSize = webPackageName ? webPackageSize : apkFile?.size
const downloadSha256 = webPackageName ? webPackageSha256 : apkFile?.sha256

if (!downloadName) {
  throw new Error("Xiaobai Tianshu mobile package is missing from release-manifest.json")
}

const formatBytes = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "未知"
  const mb = value / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.ceil(value / 1024)} KB`
}

export const xiaobaiMobileRelease = {
  name: releaseManifest.name,
  version: webVersion,
  downloadVersion: webVersion,
  platform: releaseManifest.platform,
  platformLabel: "手机端 Web 包 / Android、鸿蒙、iOS 可用",
  compatibilityLabel: "适用于安卓手机、鸿蒙手机、iPhone、折叠屏和平板",
  iosWebLabel: "手机可直接打开网页版，也可下载更新包部署到手机端入口",
  packageName: releaseManifest.packageName,
  apkName: apkFile?.name || "",
  apkUrl: apkFile ? `/downloads/xiaobai-mobile/${apkFile.name}` : "",
  apkSize: formatBytes(apkFile?.size || 0),
  apkSha256: apkFile?.sha256 || "",
  webPackageName,
  webPackageUrl: webPackageName ? `/downloads/xiaobai-mobile/${webPackageName}` : "",
  webPackageSize: formatBytes(webPackageSize),
  webPackageSha256,
  downloadName,
  downloadUrl: `/downloads/xiaobai-mobile/${downloadName}`,
  downloadSize: formatBytes(downloadSize || 0),
  downloadSha256: downloadSha256 || "",
  manifestUrl: "/downloads/xiaobai-mobile/release-manifest.json",
  appUrl: "/mobile-agent/index.html",
  webAppUrl: "/mobile-agent/index.html",
} as const
