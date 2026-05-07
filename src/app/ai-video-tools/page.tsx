import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI视频工具推荐 - AI视频生成、文生视频、图生视频、可灵、即梦和Runway",
  description:
    "小白AI整理AI视频工具推荐，覆盖 Runway、可灵、即梦视频、Sora、AI脚本、AI配音和剪辑流程，适合短视频、口播、广告素材和漫剧创作。",
  keywords: ["AI视频工具", "AI视频生成", "文生视频", "图生视频", "可灵AI教程", "即梦视频", "Runway教程", "AI短视频"],
  alternates: { canonical: "/ai-video-tools" },
  openGraph: {
    title: "AI视频工具推荐 | 小白AI",
    description: "AI视频生成、文生视频、图生视频、可灵、即梦和Runway整理。",
    url: "/ai-video-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI视频工具推荐" }],
  },
}

export default function AiVideoToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Video Tools"
      title="AI视频工具推荐：AI视频生成、文生视频、图生视频、可灵、即梦和Runway"
      description="AI视频生成适合做短片分镜、产品素材、口播背景、动态海报和创意广告，但它不是一步生成成片。稳定流程通常是脚本、分镜、关键帧、视频生成、配音、剪辑和字幕分开做。"
      primaryHref="/tools/AI%E8%A7%86%E9%A2%91"
      primaryLabel="查看AI视频工具"
      toolRefs={[
        { id: "runway", note: "Runway 适合专业创意视频、风格转换、图生视频和视频编辑工作流。" },
        { id: "kling", note: "可灵适合高真实感视频生成，人物动作和画面连贯性表现突出。" },
        { id: "jimeng-video", note: "即梦视频适合中文提示词、短视频素材、动态海报和国内用户入门。" },
        { id: "jimeng", note: "即梦绘图可先生成关键帧，再用于图生视频，提高角色和画面稳定性。" },
        { id: "copycopter", note: "CopyCopter 适合生成短视频脚本、口播文案和社媒视频结构。" },
        { id: "suno", note: "Suno 适合给短视频、漫剧和广告素材生成背景音乐与情绪氛围。" },
      ]}
      sections={[
        {
          title: "AI视频怎么做更稳",
          body: "别直接让AI生成完整大片。先做短镜头，再拼成片。",
          bullets: ["先写脚本和分镜，每个镜头只描述一个动作。", "先用AI绘图生成关键帧，再图生视频。", "最后用剪辑工具统一节奏、字幕和配乐。"],
        },
        {
          title: "文生视频和图生视频",
          body: "文生视频更快，图生视频更稳。",
          bullets: ["文生视频适合灵感测试和概念草图。", "图生视频适合控制角色、产品、场景和品牌视觉。", "商业素材优先用图生视频，减少画面漂移。"],
        },
        {
          title: "短视频创作者路线",
          body: "想做账号，不要只研究工具，要建立模板。",
          bullets: ["固定选题结构：痛点、演示、结果、行动。", "固定画面风格：角色、色调、比例和字幕位置。", "固定发布流程：脚本、生成、剪辑、封面、复盘。"],
        },
      ]}
      faq={[
        { question: "AI视频工具哪个适合新手？", answer: "国内新手可以先试即梦视频和可灵，中文提示词友好。想做更专业创意和后期控制，可以再学习 Runway。" },
        { question: "文生视频和图生视频哪个好？", answer: "文生视频速度快但随机性更强；图生视频能保持角色、产品和画面风格，更适合商业素材。" },
        { question: "AI视频能直接商用吗？", answer: "要看平台授权、素材来源、音乐版权和人物肖像。商用前必须确认工具规则，避免使用未授权品牌、人物或受保护角色。" },
      ]}
      related={[
        { href: "/tools/AI%E8%A7%86%E9%A2%91/kling", label: "可灵工具详情" },
        { href: "/tools/AI%E8%A7%86%E9%A2%91/runway", label: "Runway工具详情" },
        { href: "/ai-image-tools", label: "AI绘图工具推荐" },
        { href: "/ai-writing-tools", label: "AI脚本写作工具" },
      ]}
    />
  )
}
