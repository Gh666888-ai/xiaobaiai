import type { Section } from "@/data/learning-path"

export type LearningSectionCheck = {
  simpleGoal: string
  demo: string
  action: string
  proofLabel: string
  proofItems: string[]
  placeholder: string
  minLength: number
  requiredChecks: number
  screenshotRequired: boolean
  screenshotHint?: string
  nextHref: string
  nextText: string
}

const stageDefaults: Record<number, Omit<LearningSectionCheck, "simpleGoal">> = {
  0: {
    demo: "看懂一个概念，不要求背术语。",
    action: "打开任意 AI 对话工具，用自己的话问一个和本章有关的问题。",
    proofLabel: "留下你问 AI 的问题，或用一句话解释这个概念。",
    proofItems: ["我能用自己的话解释这一章", "我问过 AI 一个真实问题", "我知道这个概念不能直接等于具体工具"],
    placeholder: "例如：Agent 不是模型，它更像能调用工具办事的 AI 助手。",
    minLength: 0,
    requiredChecks: 1,
    screenshotRequired: false,
    nextHref: "/learn#learn-start",
    nextText: "去做第一个小任务",
  },
  1: {
    demo: "照着示例操作一次，不要求自己设计复杂提示词。",
    action: "打开本章提到的工具，复制一个提示词或上传一份无敏感资料试一次。",
    proofLabel: "留下工具名和这次得到的结果。",
    proofItems: ["我打开过工具页面", "我复制或改写过一个提示词", "我得到了一段可检查的结果"],
    placeholder: "例如：我用 Kimi 上传课程资料，得到 5 条摘要和 3 个行动项。",
    minLength: 16,
    requiredChecks: 1,
    screenshotRequired: false,
    nextHref: "/learn#learn-start",
    nextText: "用它完成一个任务",
  },
  2: {
    demo: "先看安装/配置路径，再判断自己是否需要马上安装。",
    action: "选一个 Agent 或平台，写清它适合做什么、不适合做什么。",
    proofLabel: "留下你的选择理由和一个测试动作。",
    proofItems: ["我能区分 Agent、模型和平台", "我知道是否需要安装或注册", "我写下了一个最小测试动作"],
    placeholder: "例如：我先选 Dify，不选本地 OpenClaw，因为我现在只想搭一个知识库问答。",
    minLength: 0,
    requiredChecks: 1,
    screenshotRequired: true,
    screenshotHint: "上传你打开的 Agent/平台页面、配置页或候选 Skill 记录截图。",
    nextHref: "/missions/agent-skill-first-install",
    nextText: "给 Agent 找一个 Skill",
  },
  3: {
    demo: "先确认电脑配置和数据敏感度，再决定本地还是云端。",
    action: "写一张本地部署判断卡：电脑配置、模型用途、是否需要隐私保护。",
    proofLabel: "留下你的配置判断和推荐工具。",
    proofItems: ["我确认了电脑内存或显卡情况", "我知道本地模型适合什么场景", "我没有把本地部署当成必须项"],
    placeholder: "例如：16GB 内存，先试 Ollama + Qwen 小模型；隐私资料优先本地，复杂任务仍用 API。",
    minLength: 0,
    requiredChecks: 1,
    screenshotRequired: true,
    screenshotHint: "上传电脑配置、Ollama/LM Studio 页面或本地模型测试结果截图。",
    nextHref: "/tools/Agent%E5%B9%B3%E5%8F%B0/openclaw",
    nextText: "看一个本地/Agent工具",
  },
  4: {
    demo: "把自动化看成流程图，不是一句话全自动。",
    action: "画出 4 步流程：触发、处理、人工检查、输出。",
    proofLabel: "留下你的流程节点和人工审核点。",
    proofItems: ["流程里有触发条件", "流程里有人工确认点", "流程能先半自动跑通"],
    placeholder: "例如：每天 9 点手工粘贴 3 条资讯 -> AI 摘要 -> 我检查事实 -> 发到群里。",
    minLength: 0,
    requiredChecks: 1,
    screenshotRequired: true,
    screenshotHint: "上传流程图、n8n/Agent 节点、测试结果或人工审核点截图。",
    nextHref: "/missions/n8n-ai-news-automation",
    nextText: "跑一个半自动流程",
  },
}

function goalFromSection(section: Section) {
  const title = section.title.replace(/[（(].*?[）)]/g, "").trim()
  if (title.length <= 18) return `看懂并做一次：${title}`
  return `看懂并做一次：${title.slice(0, 18)}...`
}

export function getLearningSectionCheck(stageId: number, section: Section): LearningSectionCheck {
  const base = stageDefaults[stageId] || stageDefaults[0]
  const text = `${section.title}\n${section.content}\n${section.tips || ""}`

  if (/PPT|Gamma/i.test(text)) {
    return {
      ...base,
      simpleGoal: "用 AI 生成或改出一页 PPT 内容",
      action: "打开 Gamma、WPS AI、Canva 或任意 PPT 工具，生成一页标题和 3 个要点。",
      proofLabel: "留下 PPT 主题、工具名和一页标题。",
      proofItems: ["我打开了一个 PPT 工具", "我生成或改写了一页内容", "我知道哪里需要人工检查"],
      placeholder: "例如：工具 Gamma；主题 AI 招聘流程；第 1 页标题：AI 让简历初筛从人工阅读变成规则筛选。",
      minLength: 0,
      requiredChecks: stageId <= 1 ? 1 : 1,
      screenshotRequired: stageId >= 2,
      screenshotHint: "上传 PPT 工具页面、生成结果或导出文件截图。",
      nextHref: "/missions/ai-ppt-first-deck",
      nextText: "做完整 PPT 任务",
    }
  }

  if (/上传|文件|文档|PDF|Word|资料|Kimi/i.test(text)) {
    return {
      ...base,
      simpleGoal: "让 AI 处理一份资料并输出行动项",
      action: "上传或粘贴一段无敏感资料，让 AI 输出摘要、风险和下一步。",
      proofLabel: "留下资料类型和 AI 给你的 1 条行动项。",
      proofItems: ["资料已脱敏", "AI 输出了摘要或表格", "我挑出了一条能执行的行动"],
      placeholder: "例如：资料是会议记录；行动项：周五前整理客户反馈表，按高频问题分 3 类。",
      minLength: 0,
      requiredChecks: stageId <= 1 ? 1 : 1,
      screenshotRequired: stageId >= 2,
      screenshotHint: "上传 AI 资料分析结果、摘要表或行动清单截图。",
      nextHref: "/missions/kimi-k26-long-doc",
      nextText: "做长文档任务",
    }
  }

  if (/Skill|技能|插件|OpenClaw|QClaw/i.test(text)) {
    return {
      ...base,
      simpleGoal: "找到一个能给 Agent 加能力的 Skill",
      action: "先写目标能力，再找 2 个候选 Skill，只做安全检查，不急着安装。",
      proofLabel: "留下目标能力、候选 Skill 和安全判断。",
      proofItems: ["我写清了目标能力", "我记录了候选 Skill", "我检查了权限和 API Key 风险"],
      placeholder: "例如：目标是总结网页；候选 tavily-search、summarize；先收藏，不给账号密码。",
      minLength: 0,
      requiredChecks: 1,
      screenshotRequired: true,
      screenshotHint: "上传候选 Skill、权限说明或安全检查记录截图。",
      nextHref: "/missions/agent-skill-first-install",
      nextText: "做 Skill 入门任务",
    }
  }

  return {
    ...base,
    simpleGoal: goalFromSection(section),
  }
}
