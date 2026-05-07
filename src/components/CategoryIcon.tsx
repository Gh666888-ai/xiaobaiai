import { BarChart3, Bot, BrainCircuit, Briefcase, Code2, FileAudio, GraduationCap, Image, Megaphone, Palette, PenLine, Search, Sparkles, Video, Workflow } from "lucide-react"

const iconMap: Record<string, any> = {
  对话AI: Bot,
  AI绘图: Image,
  AI视频: Video,
  AI写作: PenLine,
  AI编程: Code2,
  AI办公: Briefcase,
  AI搜索: Search,
  Agent平台: Workflow,
  模型平台: BrainCircuit,
  AI音频: FileAudio,
  AI设计: Palette,
  AI营销: Megaphone,
  AI数据: BarChart3,
  AI学习: GraduationCap,
  AI效率: Sparkles,
}

const paletteMap: Record<string, { bg: string; color: string; glow: string }> = {
  对话AI: { bg: "linear-gradient(145deg,#f4feff,#36d5ee 48%,#164a9c)", color: "#06232a", glow: "rgba(54,213,238,0.36)" },
  AI绘图: { bg: "linear-gradient(145deg,#fff7fb,#ff8bc7 46%,#7434d1)", color: "#25051c", glow: "rgba(255,139,199,0.34)" },
  AI视频: { bg: "linear-gradient(145deg,#fff9ef,#ffbf54 46%,#c04358)", color: "#2f1403", glow: "rgba(255,191,84,0.34)" },
  AI写作: { bg: "linear-gradient(145deg,#f9fff6,#9be66f 46%,#247a54)", color: "#10210a", glow: "rgba(155,230,111,0.32)" },
  AI编程: { bg: "linear-gradient(145deg,#eff8ff,#70c7ff 46%,#3946c6)", color: "#081529", glow: "rgba(112,199,255,0.34)" },
  AI办公: { bg: "linear-gradient(145deg,#fffefa,#f4d277 46%,#87601d)", color: "#241903", glow: "rgba(244,210,119,0.32)" },
  AI搜索: { bg: "linear-gradient(145deg,#f5fbff,#8acbff 46%,#1d668c)", color: "#071722", glow: "rgba(138,203,255,0.32)" },
  Agent平台: { bg: "linear-gradient(145deg,#f0fffb,#63ead5 46%,#1b6f73)", color: "#06201e", glow: "rgba(99,234,213,0.36)" },
  模型平台: { bg: "linear-gradient(145deg,#fbf7ff,#bd9bff 46%,#5632a8)", color: "#170a2b", glow: "rgba(189,155,255,0.36)" },
  AI音频: { bg: "linear-gradient(145deg,#fff5ff,#e58cff 46%,#7240a8)", color: "#23072c", glow: "rgba(229,140,255,0.34)" },
  AI设计: { bg: "linear-gradient(145deg,#fff8f2,#ff9f7e 46%,#ad3e67)", color: "#2a0d06", glow: "rgba(255,159,126,0.34)" },
  AI营销: { bg: "linear-gradient(145deg,#fff9f0,#ffc75f 46%,#b94b32)", color: "#2b1304", glow: "rgba(255,199,95,0.34)" },
  AI数据: { bg: "linear-gradient(145deg,#f5fff8,#73dfa5 46%,#247c89)", color: "#061e13", glow: "rgba(115,223,165,0.32)" },
  AI学习: { bg: "linear-gradient(145deg,#f7fbff,#91c7ff 46%,#5365d6)", color: "#071326", glow: "rgba(145,199,255,0.34)" },
  AI效率: { bg: "linear-gradient(145deg,#fbfff2,#d7f76f 46%,#44833a)", color: "#142006", glow: "rgba(215,247,111,0.32)" },
}

type CategoryIconProps = {
  category: string
  size?: number
}

export function CategoryIcon({ category, size = 22 }: CategoryIconProps) {
  const Icon = iconMap[category] || Sparkles
  const palette = paletteMap[category] || paletteMap["对话AI"]
  return (
    <span
      style={{
        width: Math.max(34, size + 20),
        height: Math.max(34, size + 20),
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: palette.color,
        background: palette.bg,
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: `0 0 18px ${palette.glow}, inset 0 1px 7px rgba(255,255,255,0.75), inset 0 -8px 12px rgba(0,0,0,0.22)`,
      }}
    >
      <Icon size={size} strokeWidth={2.4} />
    </span>
  )
}
