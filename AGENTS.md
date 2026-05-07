# 小白AI Agent 工作入口

本项目是“小白AI”，一个面向 AI 新手的工具导航、学习路线、实战任务、社区复盘和站内 AI 助手网站。进入本仓库工作前，先读取下面两份项目记忆：

- `docs/xiaobai-product-memory.md`
- `docs/xiaobai-ops.md`

## 协作原则

- 不要把小白AI做成单纯的工具目录。核心方向是“用户想做成一件事，小白带他从 0 到 1 做出一个可交付环节”。
- Agent、模型、平台、工作流工具必须分清：
  - Codex、Claude Code、Hermes 属于工程 Agent / 编程 Agent。
  - DeepSeek V4、Kimi K2.6 属于模型或模型 API 后端，不要写成 Agent。
  - Dify、Coze、FastGPT 属于应用搭建、知识库、Agent 平台。
  - n8n 属于工作流自动化。
- 内容优先级高于页面堆砌。不要为了“看起来很多”填假内容、空内容、过时工具。
- 实战任务、用户进度、复盘模板、社区沉淀、资讯解读，是小白AI的护城河。
- 改动后尽量运行 `npm.cmd run build` 验证。只改脚本时至少运行 `node --check <script>`。
- 生产部署不要使用 `git add -A` 自动提交，避免把日志、价格文件、临时文件混进内容提交。

## 常用本地路径

- 本地仓库：`E:\ai导航网站`
- 生产路径：`/var/www/xiaobaiai`
- PM2 应用名：`xiaobaiai`

## 新对话恢复方式

如果这是一个新对话，用户只要说“继续小白AI，先读项目记忆”，请优先读取：

1. `AGENTS.md`
2. `docs/xiaobai-product-memory.md`
3. `docs/xiaobai-ops.md`

读完后再继续编码、排查或产品设计。
