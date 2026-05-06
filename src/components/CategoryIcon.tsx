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

type CategoryIconProps = {
  category: string
  size?: number
}

export function CategoryIcon({ category, size = 22 }: CategoryIconProps) {
  const Icon = iconMap[category] || Sparkles
  return (
    <span
      style={{
        width: Math.max(34, size + 20),
        height: Math.max(34, size + 20),
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#071416",
        background: "linear-gradient(145deg, #e8fff9, #24c7db 48%, #183b84)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: "0 0 18px rgba(36,199,219,0.34), inset 0 1px 7px rgba(255,255,255,0.75), inset 0 -8px 12px rgba(0,0,0,0.22)",
      }}
    >
      <Icon size={size} strokeWidth={2.4} />
    </span>
  )
}
