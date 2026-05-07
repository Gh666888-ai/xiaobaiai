import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI绘图工具推荐 - ChatGPT Image、Nano Banana、Midjourney、即梦和FLUX",
  description:
    "小白AI整理2026主流AI绘图工具推荐，覆盖 ChatGPT Image、Gemini Nano Banana、Midjourney、即梦、FLUX、Ideogram、Adobe Firefly、Canva AI 等AI画图和改图工具。",
  keywords: ["AI绘图工具", "AI画图软件", "AI绘画工具", "Midjourney教程", "即梦AI教程", "AI绘图提示词", "AI生成图片"],
  alternates: { canonical: "/ai-image-tools" },
  openGraph: {
    title: "AI绘图工具推荐 | 小白AI",
    description: "AI画图软件、ChatGPT Image、Nano Banana、Midjourney、即梦和FLUX整理。",
    url: "/ai-image-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI绘图工具推荐" }],
  },
}

export default function AiImageToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Image Tools"
      title="AI绘图工具推荐：ChatGPT Image、Nano Banana、Midjourney、即梦和FLUX"
      description="AI绘图现在不只是文生图，更重要的是多轮改图、参考图一致性、商品图、海报和短视频关键帧。想稳定出好图，要按“生成、改图、设计、商用、本地工作流”来选工具。"
      primaryHref="/tools/AI%E7%BB%98%E5%9B%BE"
      primaryLabel="查看AI绘图工具"
      toolRefs={[
        { id: "gpt-image", note: "ChatGPT Image 适合边聊边生成、边改图，适合封面、配图、商品图草案和多轮视觉创意。" },
        { id: "nano-banana", note: "Nano Banana 适合参考图改图、角色一致性、商品图和需要多轮精修的图片任务。" },
        { id: "midjourney", note: "Midjourney 仍适合高质量海报、插画、角色和概念视觉，画面质感强。" },
        { id: "jimeng", note: "即梦适合国内中文新手，提示词理解好，适合头像、海报、短视频素材和关键帧。" },
        { id: "flux", note: "FLUX 适合写实视觉、开源模型生态、本地/云端工作流和进阶批量生成。" },
        { id: "ideogram", note: "Ideogram 适合带文字的海报、Logo、标题图和需要准确文字渲染的设计。" },
        { id: "adobe-firefly", note: "Adobe Firefly 适合设计师在 Photoshop/Adobe 生态里做生成式填充和商用视觉。" },
        { id: "canva-ai", note: "Canva AI 适合非设计师做海报、社媒配图、封面和模板化设计。" },
      ]}
      sections={[
        {
          title: "新手怎么选AI绘图工具",
          body: "先按用途选，不要按热度选。",
          bullets: ["想边聊边生成和改图：ChatGPT Image。", "想做参考图改图和角色一致性：Nano Banana。", "想要艺术质感和风格化：Midjourney。", "想做中文海报和短视频关键帧：即梦。", "想做本地/开源工作流：FLUX。"],
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
        { question: "AI绘图工具哪个适合新手？", answer: "新手先试 ChatGPT Image、Nano Banana、即梦或 Canva AI。它们更适合多轮修改、中文表达和日常素材，不需要一开始就研究复杂参数。" },
        { question: "Midjourney、ChatGPT Image和Nano Banana怎么选？", answer: "追求艺术质感优先 Midjourney；想边聊边改图优先 ChatGPT Image；想做参考图改图、角色一致性和商品图优先 Nano Banana。" },
        { question: "AI绘图提示词怎么写？", answer: "按主体、场景、动作、构图、风格、光线、比例来写。不要只写一个关键词，尽量描述最终画面。" },
      ]}
      related={[
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/gpt-image", label: "ChatGPT Image工具详情" },
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/nano-banana", label: "Nano Banana工具详情" },
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/midjourney", label: "Midjourney工具详情" },
        { href: "/tools/AI%E7%BB%98%E5%9B%BE/jimeng", label: "即梦AI工具详情" },
        { href: "/free-ai-tools", label: "免费AI工具推荐" },
        { href: "/ai-video-tools", label: "AI视频工具推荐" },
      ]}
    />
  )
}
