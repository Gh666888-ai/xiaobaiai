import type { Metadata } from "next"
import LoginClient from "./LoginClient"

export const metadata: Metadata = {
  title: "登录",
  description: "登录小白AI，参与社区投稿、收藏工具和同步学习进度。",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginClient />
}
