import releaseManifest from "../../public/downloads/xiaobai-mobile/release-manifest.json"

type ReleaseFile = {
  name: string
  size: number
  sha256: string
}

const files = (releaseManifest.files || []) as ReleaseFile[]
const apkFile = files.find((file) => /^Xiaobai-Tianshu(?:-Native)?-\d+\.\d+\.\d+\.apk$/.test(file.name))
const webPackageName = releaseManifest.webPackageName
const webPackageSize = releaseManifest.webPackageSize
const webPackageSha256 = releaseManifest.webPackageSha256
const downloadName = apkFile?.name || webPackageName
const downloadSize = apkFile?.size || webPackageSize
const downloadSha256 = apkFile?.sha256 || webPackageSha256

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
  version: releaseManifest.version,
  downloadVersion: releaseManifest.version,
  webVersion: releaseManifest.webVersion || releaseManifest.version,
  platform: releaseManifest.platform,
  platformLabel: "Android / 鸿蒙 APK",
  compatibilityLabel: "适用于安卓手机、鸿蒙手机、折叠屏和平板；iPhone 使用网页版",
  iosWebLabel: releaseManifest.native
    ? `安卓 / 鸿蒙安装 ${releaseManifest.version} 原生 APK；旧 WebView 版可并存，避免签名冲突`
    : "安卓 / 鸿蒙可直接安装 APK；iPhone 可打开网页版或添加到主屏幕",
  packageName: releaseManifest.packageName,
  oldPackageName: releaseManifest.oldPackageName || "",
  native: Boolean(releaseManifest.native),
  migrationNote: releaseManifest.migrationNote || "",
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
