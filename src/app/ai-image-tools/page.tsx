import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI绘图工具推荐 - AI画图软件、Midjourney、即梦、DALL·E和提示词教程",
  description:
    "小白AI整理AI绘图工具推荐，覆盖 Midjourney、即梦、DALL·E、通义万相、Canva AI、Stable Diffusion 等AI画图软件，并提供提示词和商用注意事项。",
  keywords: ["AI绘图工具", "AI画图软件", "AI绘画工具", "Midjourney教程", "即梦AI教程", "AI绘图提示词", "AI生成图片"],
  alternates: { canonical: "/ai-image-tools" },
  openGraph: {
    title: "AI绘图工具推荐 | 小白AI",
    description: "AI画图软件、Midjourney、即梦、DALL·E和提示词入门整理。",
    url: "/ai-image-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI绘图工具推荐" }],
  },
}

export default function AiImageToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Image Tools"
      title="AI绘图工具推荐：AI画图软件、Midjourney、即梦、DALL·E和提示词教程"
      description="AI绘图不是只输入一句话等结果。想稳定出好图，要选对工具、写清楚主体和风格、控制比例和参考图，并知道哪些场景适合免费工具，哪些场景需要专业模型。"
      primaryHref="/tools/AI%E7%BB%98%E5%9B%BE"
      primaryLabel="查看AI绘图工具"
      toolRefs={[
        { id: "midjourney", note: "Midjourney 适合高质量海报、插画、概念图和风格化视觉，画面质感强。" },
        { id: "jimeng", note: "即梦适合中文新手，提示词理解好，有免费额度，适合头像、海报和短视频素材。" },
        { id: "dalle", note: "DALL·E 适合和 ChatGPT 联动做图像生成、修改和文字内容较多的图片。" },
        { id: "wanxiang", note: "通义万相适合国内用户做中文提示词图片生成、风格迁移和电商视觉草图。" },
        { id: "canva-ai", note: "Canva AI 适合非设计师做海报、社媒配图、封面和模板化设计。" },
        { id: "invokeai", note: "InvokeAI 适合想学习 Stable Diffusion 工作流、本地绘图和批量生成的进阶用户。" },
      ]}
      sections={[
        {
          title: "新手怎么选AI绘图工具",
          body: "先按用途选，不要按热度选。",
          bullets: ["想快速出中文海报：先试即梦或通义万相。", "想要艺术质感：优先 Midjourney。", "想做模板、封面和社媒图：Canva AI 更省时间。"],
        },
        {
          title: "提示词公式",
          body: "提示词不需要玄学，先把画面要素写完整。",
          bullets: ["主体：画什么人、物或场景。", "动作和构图：在做什么、镜头角度、远近景。", "风格和光线：写实、插画、赛博、柔光、电影感。"],
        },
        {
          title: "商用前注意",
          body: "AI绘图用于商业素材时，版权和平台规则一定要确认。",
          bullets: ["检查工具的商用授权、付费规则和水印限制。", "不要直接仿冒真实品牌、艺人或受保护角色。", "重要成图保留提示词、生成记录和修改过程。"],
        },
      ]}
      faq={[
        { question: "AI绘图工具哪个适合新手？", answer: "中文新手建议先试即梦、通义万相或 Canva AI。它们注册和提示词门槛较低，适合先做头像、封面、海报和素材草图。" },
        { question: "Midjourney和即梦怎么选？", answer: "追求画面质感和艺术风格优先 Midjourney；想要中文操作、免费额度和国内访问便利，优先即梦。" },
        { question: "AI绘图提示词怎么写？", answer: "按主体、场景、动作、构图、风格、光线、比例来写。不要只写一个关键词，尽量描述最终画面。" },
      ]}
      related={[
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/midjourney", label: "Midjourney工具详情" },
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/jimeng", label: "即梦AI工具详情" },
        { href: "/free-ai-tools", label: "免费AI工具推荐" },
        { href: "/ai-video-tools", label: "AI视频工具推荐" },
      ]}
    />
  )
}
