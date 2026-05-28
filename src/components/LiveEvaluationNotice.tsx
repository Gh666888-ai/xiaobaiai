import Link from "next/link"
import { Activity, BarChart3, RefreshCw, ShieldCheck } from "lucide-react"

type LiveEvaluationNoticeProps = {
  scope?: "home" | "tools" | "agents" | "models"
  compact?: boolean
}

const scopeCopy = {
  home: {
    title: "工具、Agent、模型能力评分会持续评测更新",
    body: "小白不是只收录名字。我们会跟踪真实可用性、上手难度、价格变化、中文体验、任务完成能力和新版本变化，把更适合新手的放到前面。",
  },
  tools: {
    title: "工具评分会持续更新",
    body: "工具会按上手难度、免费额度、中文体验、真实产出质量、行业适配和稳定性重新评测，不把广告当推荐。",
  },
  agents: {
    title: "Agent 评分会持续更新",
    body: "Agent 会按安装难度、接模型能力、执行任务能力、权限安全、记忆结构、Skill 生态和新手可控性重新评测。",
  },
  models: {
    title: "模型能力和价格会持续更新",
    body: "模型会按推理、编程、长文、速度、价格、上下文、国内可用性和 Agent 接入效果重新评测。价格会跟随公开信息滚动校准。",
  },
}

export function LiveEvaluationNotice({ scope = "home", compact = false }: LiveEvaluationNoticeProps) {
  const copy = scopeCopy[scope]
  const lightSurface = !compact && (scope === "agents" || scope === "tools" || scope === "models")
  const palette = lightSurface
    ? {
        title: "#17202a",
        body: "#536170",
        accent: "#256d85",
        support: "#1f8a70",
        chipText: "#256d85",
        chipBg: "rgba(37,109,133,0.1)",
        chipBorder: "rgba(37,109,133,0.18)",
        iconBg: "rgba(37,109,133,0.12)",
        shadow: "0 16px 44px rgba(15,23,42,0.07)",
      }
    : {
        title: "#fff",
        body: "#d7d0b6",
        accent: "#e8c96a",
        support: "#8fd8cc",
        chipText: "#f0e5b9",
        chipBg: "rgba(0,0,0,0.26)",
        chipBorder: "rgba(255,255,255,0.1)",
        iconBg: "rgba(0,0,0,0.28)",
        shadow: "0 18px 60px rgba(0,0,0,0.22)",
      }
  const chips = scope === "agents"
    ? ["安装难度", "接模型能力", "任务执行", "权限安全"]
    : scope === "models"
      ? ["推理能力", "编程能力", "价格", "上下文"]
      : scope === "tools"
        ? ["上手难度", "真实可用", "中文体验", "行业适配"]
        : ["工具", "Agent", "模型", "Skill"]

  return (
    <section
      style={{
        border: "1px solid rgba(232,201,106,0.34)",
        background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(61,165,99,0.055))",
        borderRadius: 12,
        padding: compact ? "13px 15px" : "18px 20px",
        margin: compact ? "16px auto 0" : "0 0 22px",
        maxWidth: compact ? 760 : undefined,
        boxShadow: palette.shadow,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: compact ? 34 : 40,
            height: compact ? 34 : 40,
            borderRadius: 10,
            border: "1px solid rgba(232,201,106,0.38)",
            background: palette.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Activity size={compact ? 17 : 19} style={{ color: palette.accent }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 }}>
            <span style={{ color: palette.accent, fontSize: compact ? 11 : 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <RefreshCw size={compact ? 12 : 13} /> 持续评测
            </span>
            <span style={{ color: palette.support, fontSize: compact ? 11 : 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ShieldCheck size={compact ? 12 : 13} /> 非广告排名
            </span>
          </div>
          <h2 style={{ color: palette.title, fontSize: compact ? 17 : 21, fontWeight: 950, lineHeight: 1.35, marginBottom: 7 }}>{copy.title}</h2>
          <p style={{ color: palette.body, fontSize: compact ? 12 : 14, lineHeight: 1.8, marginBottom: compact ? 10 : 13 }}>
            {copy.body}
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
            {chips.map((chip) => (
              <span key={chip} style={{ border: `1px solid ${palette.chipBorder}`, background: palette.chipBg, color: palette.chipText, borderRadius: 999, padding: "5px 9px", fontSize: 11, fontWeight: 900 }}>
                {chip}
              </span>
            ))}
            {scope === "home" ? (
              <Link href="/models" style={{ color: palette.accent, fontSize: 12, fontWeight: 950, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <BarChart3 size={13} /> 看模型评分
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
