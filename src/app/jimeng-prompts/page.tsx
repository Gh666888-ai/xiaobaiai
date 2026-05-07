import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "即梦AI绘图提示词怎么写 - 即梦文生图、图生图、海报头像和短视频素材教程",
  description:
    "小白AI整理即梦AI绘图提示词教程，覆盖主体、动作、场景、风格、光线、比例、参考图、海报头像、电商主图和短视频素材提示词写法。",
  keywords: ["即梦AI提示词", "即梦AI绘图", "即梦文生图", "即梦图生图", "AI绘图提示词", "即梦海报提示词", "即梦AI教程"],
  alternates: { canonical: "/jimeng-prompts" },
  openGraph: {
    title: "即梦AI绘图提示词怎么写 | 小白AI",
    description: "即梦文生图、图生图、海报头像和短视频素材提示词教程。",
    url: "/jimeng-prompts",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 即梦AI提示词教程" }],
  },
}

export default function JimengPromptsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Jimeng Prompts"
      title="即梦AI绘图提示词怎么写：文生图、图生图、海报头像和短视频素材"
      description="即梦适合中文新手做 AI 绘图和视频素材，但想稳定出图，提示词不能只写一个关键词。这个教程用主体、动作、场景、风格、光线和比例六个维度，帮你写出更容易成功的中文提示词。"
      primaryHref="/tools/AI%E7%BB%98%E5%9B%BE/jimeng"
      primaryLabel="查看即梦工具详情"
      toolRefs={[
        { id: "jimeng", note: "即梦适合中文提示词绘图、头像、海报、封面、电商主图和短视频素材。" },
        { id: "jimeng-video", note: "即梦视频适合把静态关键帧继续生成动态视频素材。" },
        { id: "midjourney", note: "Midjourney 适合更高质感的艺术图、概念图和风格化视觉。" },
        { id: "dalle", note: "DALL·E 适合和 ChatGPT 联动生成、修改和解释图片需求。" },
        { id: "wanxiang", note: "通义万相适合中文绘图、风格迁移和国内用户补充使用。" },
        { id: "canva-ai", note: "Canva AI 适合把生成图片继续做成海报、封面和社媒模板。" },
      ]}
      sections={[
        {
          title: "提示词基础公式",
          body: "把画面说完整，比堆高级词更重要。",
          bullets: ["主体：一个什么样的人、物、产品或场景。", "动作和构图：正在做什么，近景、远景、俯视还是正面。", "风格和光线：写实摄影、插画、赛博、柔光、电影感。"],
        },
        {
          title: "常用场景写法",
          body: "不同用途的提示词重点不同。",
          bullets: ["头像：强调人物特征、表情、背景、光线和比例。", "海报：强调标题留白、主体位置、商业感和色彩。", "电商主图：强调产品清晰、背景简洁、真实质感。"],
        },
        {
          title: "出图不满意怎么办",
          body: "不要每次完全重写，先定位问题。",
          bullets: ["主体不对：增加具体特征和参考图。", "画面太乱：减少元素，强调简洁背景和单一主体。", "风格不稳：固定风格关键词、比例和参考图。"],
        },
      ]}
      faq={[
        { question: "即梦AI提示词怎么写？", answer: "按主体、动作、场景、风格、光线、比例来写。例如：一位年轻老师，站在明亮教室里，微笑讲课，写实摄影风格，柔和自然光，横版16:9。" },
        { question: "即梦适合做头像吗？", answer: "适合。写清楚人物年龄、发型、表情、服装、背景、光线和头像比例，效果会比只写“生成头像”稳定很多。" },
        { question: "即梦和Midjourney怎么选？", answer: "中文新手和国内访问优先即梦；追求更强艺术质感、概念图和风格化作品，可以学习 Midjourney。" },
      ]}
      related={[
        { href: "/ai-image-tools", label: "AI绘图工具推荐" },
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/jimeng", label: "即梦工具详情" },
        { href: "/ai-video-tools", label: "AI视频工具推荐" },
        { href: "/free-ai-tools", label: "免费AI工具推荐" },
      ]}
    />
  )
}
