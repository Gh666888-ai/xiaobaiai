import type { Metadata } from "next"
import { AppsClient } from "./AppsClient"

export const metadata: Metadata = {
  title: "小白应用工坊 - 站内生成AI小应用",
  description: "小白AI应用工坊，根据行业和目标生成网站首屏、报名表、报价计算器、商品页和点击得分小游戏。",
  keywords: ["AI应用生成", "AI做APP", "AI建站", "H5小应用", "小白应用工坊"],
  alternates: { canonical: "/apps" },
}

export default function AppsPage() {
  return <AppsClient />
}
