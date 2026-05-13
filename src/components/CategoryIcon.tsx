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
  AI数字人: Video,
  AI电商: Briefcase,
  AI客服: Bot,
  AI知识库: BrainCircuit,
  AI会议: FileAudio,
  AI财务: BarChart3,
  AI法律: Briefcase,
  AI安全: Sparkles,
  AI低代码: Code2,
  AI浏览器: Search,
  MCP工具: Workflow,
  向量数据库: BrainCircuit,
  AI翻译: PenLine,
  AI求职: Briefcase,
  AI科研: GraduationCap,
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
  AI数字人: { bg: "linear-gradient(145deg,#f4fbff,#7ad7ff 46%,#6e4acb)", color: "#081228", glow: "rgba(122,215,255,0.34)" },
  AI电商: { bg: "linear-gradient(145deg,#f6fff8,#65e7a0 46%,#14807c)", color: "#061c11", glow: "rgba(101,231,160,0.32)" },
  AI客服: { bg: "linear-gradient(145deg,#fff7f1,#ffa46e 46%,#b84d63)", color: "#2a0d04", glow: "rgba(255,164,110,0.34)" },
  AI知识库: { bg: "linear-gradient(145deg,#f4fbff,#78c9ff 46%,#255d96)", color: "#071725", glow: "rgba(120,201,255,0.32)" },
  AI会议: { bg: "linear-gradient(145deg,#fbf8ff,#c498ff 46%,#5152b9)", color: "#180c29", glow: "rgba(196,152,255,0.34)" },
  AI财务: { bg: "linear-gradient(145deg,#f4fff8,#7ce4ad 46%,#27735f)", color: "#071b11", glow: "rgba(124,228,173,0.32)" },
  AI法律: { bg: "linear-gradient(145deg,#f8fbff,#9cbcff 46%,#4b5fa9)", color: "#0a1226", glow: "rgba(156,188,255,0.32)" },
  AI安全: { bg: "linear-gradient(145deg,#fff7f7,#ff9090 46%,#94466b)", color: "#2c0808", glow: "rgba(255,144,144,0.34)" },
  AI低代码: { bg: "linear-gradient(145deg,#f5fff9,#8be7c2 46%,#337c8c)", color: "#071d16", glow: "rgba(139,231,194,0.32)" },
  AI浏览器: { bg: "linear-gradient(145deg,#f3fbff,#7fcfff 46%,#315fbe)", color: "#071626", glow: "rgba(127,207,255,0.32)" },
  MCP工具: { bg: "linear-gradient(145deg,#f5fffd,#68eadb 46%,#2d6f95)", color: "#061d1b", glow: "rgba(104,234,219,0.34)" },
  向量数据库: { bg: "linear-gradient(145deg,#f8f7ff,#b7a2ff 46%,#6041a8)", color: "#140b2b", glow: "rgba(183,162,255,0.34)" },
  AI翻译: { bg: "linear-gradient(145deg,#fffdf5,#f6d96c 46%,#7b7f2c)", color: "#201905", glow: "rgba(246,217,108,0.28)" },
  AI求职: { bg: "linear-gradient(145deg,#f7fbff,#8ec5ff 46%,#3f709f)", color: "#071827", glow: "rgba(142,197,255,0.32)" },
  AI科研: { bg: "linear-gradient(145deg,#f7fff9,#9fe3a5 46%,#4b7a7f)", color: "#091c10", glow: "rgba(159,227,165,0.3)" },
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
