import type { Metadata } from "next"
import WorkflowsClient from "./WorkflowsClient"

export const metadata: Metadata = {
  title: "AI 工作流搭建器",
  description: "用模板和步骤编排快速搭建 AI 自动化工作流，生成可执行方案、工具组合、审核点和上线清单。",
  alternates: { canonical: "/workflows" },
}

export default function WorkflowsPage() {
  return <WorkflowsClient />
}
