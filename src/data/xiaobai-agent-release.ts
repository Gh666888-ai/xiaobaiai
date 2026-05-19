import releaseManifest from "../../public/downloads/xiaobai-agent/release-manifest.json"

type ReleaseFile = {
  name: string
  size: number
  sha256: string
}

const files = (releaseManifest.files || []) as ReleaseFile[]
const installerFile = files.find((file) => /^Xiaobai-Setup-\d+\.\d+\.\d+\.exe$/.test(file.name))

if (!installerFile) {
  throw new Error("Xiaobai Agent installer is missing from release-manifest.json")
}

const formatBytes = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "未知"
  const mb = value / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

export const xiaobaiAgentRelease = {
  displayName: "小白天枢",
  version: releaseManifest.version,
  installerName: installerFile.name,
  installerUrl: `/downloads/xiaobai-agent/${installerFile.name}`,
  installerSize: formatBytes(installerFile.size),
  installerSha256: installerFile.sha256,
  manifestUrl: "/downloads/xiaobai-agent/release-manifest.json",
  latestUrl: "/downloads/xiaobai-agent/latest.yml",
} as const
