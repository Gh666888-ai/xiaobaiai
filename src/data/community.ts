// 社区帖子 · 小白AI

export interface Post {
  id: string
  author: string
  title: string
  content: string
  category: "经验分享" | "踩坑记录" | "全自动实战" | "AI分析" | "问题求助"
  tags: string[]
  likes: number
  comments: number
  publishedAt: string
  pinned?: boolean
}

export const posts: Post[] = [
  {
    id: "post-1",
    author: "小白站长",
    title: "Agent 不是万能的——我用 Agent 半年踩过的 10 个坑",
    content:
      "作为小白AI的站长，我从零开始用 Agent 到现在已经半年了。从 Dify 到 QClaw 到 OpenClaw 到 Hermes，能踩的坑我基本都踩了一遍。\n\n说实话，Agent 能力确实强，但不是没有边界。我把最常见的坑整理出来，希望能帮到刚入门的同学：\n\n❌ 坑1：知识库没配好就开始用。Agent 胡说八道80%是因为知识库质量差。上传前一定做预处理——去水印、去页眉页脚、加标题层级。\n\n❌ 坑2：提示词写得太模糊。'帮我写个报告'这种话 Agent 完全搞不懂你要什么。必须说清楚：什么报告、给谁看、多少字、什么格式、包含哪些内容。\n\n❌ 坑3：一个 Agent 想干所有事。正确做法是每个 Agent 只专注一类任务。客服的归客服，写文章的归写文章，数据分析的归数据分析。\n\n❌ 坑4：不开人工审核就直接全自动。Agent 可能生成错误回复发给客户，或者删除不该删的文件。重要操作必须加人工确认环节。\n\n❌ 坑5：用错模型。日常对话用 qwen-plus 就够了，便宜又够用。只有复杂推理才需要上 deepseek-reasoner 或者 claude。\n\n❌ 坑6：忘记配置错误重试。Agent 调用 API 偶尔会失败（网络波动、限流），不加重试机制的话整个工作流就断了。\n\n❌ 坑7：定时任务设错时区。我在 Dify 里设了早上8点执行，结果半夜2点开始跑——因为时区设的 UTC。\n\n❌ 坑8：环境变量泄露。把 API Key 直接写在配置文件里，不小心 git push 到公开仓库了。务必用 .env 文件，并且加到 .gitignore。\n\n❌ 坑9：闭门造车。很多问题社区里早就有解决方案了。遇到报错先搜 ClawHub 和 GitHub Issues，90%能找到答案。\n\n❌ 坑10：太贪心一次性铺太开。想同时做客服+内容+数据分析+自动化，结果一个都没做好。正确做法是一个场景跑通稳定了，再加下一个。",
    category: "踩坑记录",
    tags: ["Agent", "经验总结", "新手必读"],
    likes: 238,
    comments: 56,
    publishedAt: "2026-05-01",
    pinned: true,
  },
  {
    id: "post-2",
    author: "小白站长",
    title: "Agent 能做任何事！我的全自动工作台搭建实录",
    content:
      "很多人问我：Agent 到底能做什么？我的回答是：只要你能把流程说清楚，Agent 就能做。\n\n这半年来我陆陆续续搭了几十个自动化流程，挑几个最有代表性的分享：\n\n📰 全自动 AI 早报\n每天7点抓取 OpenAI、Anthropic、Google AI、36氪、机器之心的最新内容 → AI 筛选+分类+摘要 → 8点准时发到我的微信和企业微信群。我起床就能看到今天的 AI 圈发生了什么，不用刷任何网站。\n\n📊 数据自动看板\n销售数据、用户增长数据、客服工单数据每天凌晨自动汇总 → AI 分析趋势 → 生成带图表的看板 → 发到飞书群。以前团队每周花半天做数据周报，现在全自动。\n\n📧 邮件管家\nGmail和企业邮箱的新邮件自动分类：客户邮件 → AI 生成回复草稿存草稿箱；通知邮件 → 提取关键信息归档；垃圾 → 直接删除。我每天只需要花5分钟审核草稿，点发送就行。\n\n🎨 AI 动漫创作流水线\n这个话题比较大，我单独开了个帖子详细讲（见「AI 动漫能不能做？全流程 Agent 自动化分析」）。结论：能做，而且能做全套——剧本生成→分镜设计→角色设定→AI绘图→AI配音→自动剪辑。\n\n🏠 个人生活助手\n每天早上推送：今天天气+穿衣建议、日历上的日程、昨天没回复的重要微信、信用卡还款提醒。每周日生成一周消费报告和下周天气预报。\n\n关键心得：Agent 自动化不是一步到位的。先手动做一遍，搞清楚流程的每一步；然后拆成小模块，一个模块一个模块自动化；最后串联起来。\n\n有人说 Agent 只是玩具。我说：等你把上面任何一个流程真正落地了，你就知道 Agent 是什么了——它是你雇的第二个你。",
    category: "全自动实战",
    tags: ["Agent", "全自动", "工作效率"],
    likes: 512,
    comments: 89,
    publishedAt: "2026-05-02",
  },
  {
    id: "post-3",
    author: "小白站长",
    title: "AI 动漫能不能做？全流程 Agent 自动化分析",
    content:
      "最近刷到很多讨论：AI 能不能替代动漫制作？作为一个亲自跑通过流程的人，我来给个实际分析。\n\n🎬 先说结论：当前（2026年5月）可以做 80% 的流程自动化，最后20%仍需要人工。\n\n下面是全流程拆解和可行性评估：\n\n✅ 剧本生成（可全自动）\n工具：通义千问 / Claude 写中文剧本非常强\n喂给它：题材设定、角色档案、目标集数、每集时长\n它输出：分集大纲 + 每集详细剧本 + 对白\n质量：能达到网剧水平，专业剧本还需要人工润色\n\n✅ 分镜设计（可全自动）\n工具：即梦 AI + Dify 工作流\n剧本输入 → AI 分析场景 → 自动生成分镜描述 → 逐个生成分镜草图\n关键技巧：用固定 prompt 模板保持风格统一\n\n✅ 角色设计（可全自动）\n工具：Midjourney V7 / 即梦\n生成角色正视图、侧视图、表情包、服装变体\n用 Seed 参数锁定角色特征，保证同一角色在不同场景下长得一样\n\n✅ 场景绘制（可全自动）\n工具：Stable Diffusion + ControlNet\n用线稿控制构图，再用 AI 上色和渲染\n批量处理效率极高，一套场景模板可以用多次\n\n⚠️ 逐帧动画（半自动）\n这是目前最大的难点。AI 生成单张图很厉害，但连续动画帧之间的稳定性还不够\n方案：用 EbSynth 做关键帧插值 + AI 补帧\n需要人工检查和修正（约30%手动调整）\n\n✅ AI 配音（可全自动）\n工具：ElevenLabs / 海绵语音\n根据角色设定生成对应的声音\n对白输入 → 自动生成配音 → 自动对口型\n\n✅ 配乐和音效（可全自动）\n工具：Suno / Udio / Mubert\n根据场景情绪自动生成配乐\n击打声、脚步声等音效可从音效库中 AI 匹配\n\n⚠️ 后期剪辑和合成（半自动）\n工具：剪映 AI + 即梦\n自动对齐配音和画面 → 自动转场 → 自动字幕\n但节奏控制和叙事流畅性仍需人工调整（约20%手动调整）\n\n💰 成本估算（一集 12 分钟动漫）：\n• 剧本 + 分镜：0元（AI 免费工具）\n• 角色 + 场景生成：约 50-100 元（Midjourney + 云 GPU）\n• 配音 + 配乐：约 30-50 元\n• 后期剪辑：约 0-20 元\n总计：约 80-170 元/集\n对比传统动漫制作：约 5-10 万元/集\n\n🎯 我已经搭了一个 Agent 全自动流水线来做这件事，目前每天能自动生成约 30 秒的成品动画。虽然还不够快，但比一个人手画快太多了。\n\n我的预测：2026 年底 AI 动画就能做到 95% 自动化，2027 年会出现第一个全 AI 制作的商业化动漫。",
    category: "AI分析",
    tags: ["AI动漫", "全自动", "可行性分析"],
    likes: 756,
    comments: 134,
    publishedAt: "2026-05-03",
    pinned: true,
  },
  {
    id: "post-4",
    author: "小白站长",
    title: "Agent 报错不求人：20 个最常见错误的排查手册",
    content:
      "整理了群里被问最多的 20 个 Agent 报错，覆盖 Dify、Coze、QClaw、OpenClaw、Hermes 五大平台。建议收藏。\n\n🔴 Dify 类：\n1. 「知识库检索不到」→ 切混合检索 + 调低分数阈值 + 增大 Top K\n2. 「模型调用失败」→ 检查 API Key 是否到期 / 额度是否用完\n3. 「工作流节点报错」→ 检查上一个节点的输出格式是否匹配\n4. 「Webhook 无响应」→ 检查 URL 是否正确 + 防火墙是否放行\n\n🔴 Coze 类：\n5. 「插件加载失败」→ 检查网络，部分插件需要科学环境\n6. 「发布到微信失败」→ 确认微信服务号已认证 + Bot 状态为「已发布」\n7. 「知识库更新后不生效」→ 重建索引 + 清除缓存\n8. 「回复速度突然变慢」→ 检查是否被限流，免费版有 QPS 限制\n\n🔴 QClaw 类：\n9. 「微信绑定失败」→ 用微信App扫码（不是截图），确认电脑管家已安装\n10. 「技能安装失败」→ 关闭杀毒软件重试\n11. 「Gateway 掉线」→ 重启 QClaw + 检查网络\n12. 「任务执行到一半卡住」→ 任务超时，拆成多个小任务\n\n🔴 OpenClaw 类：\n13. 「npm install 失败」→ Node.js 版本不对，需 ≥ 18\n14. 「command not found」→ 关掉终端重新打开\n15. 「API Key 认证失败」→ Key 前后有空格 / Key 已过期\n16. 「微信插件连接失败」→ 重新扫码，确认是手机App扫\n\n🔴 Hermes 类：\n17. 「安装脚本下载失败」→ 用国内镜像 res1.hermesagent.org.cn\n18. 「wsl --install 报错」→ 以管理员身份运行 PowerShell\n19. 「hermes: command not found」→ 执行 source ~/.bashrc\n20. 「模型调用返回空」→ API Key 配置有误，执行 hermes doctor 诊断\n\n💡 终极解决方案：把完整报错信息复制给 ChatGPT 或 Kimi，95% 的问题AI都能帮你定位。",
    category: "经验分享",
    tags: ["报错排查", "Dify", "Coze", "OpenClaw", "Hermes"],
    likes: 423,
    comments: 67,
    publishedAt: "2026-05-02",
  },
  {
    id: "post-5",
    author: "小白站长",
    title: "我用 Agent 把公众号运营全自动化了，月省 80 小时",
    content:
      "作为一个同时运营两个技术公众号的人，我深知内容生产的痛苦。过去半年我逐步把整个流程用 Agent 自动化了。\n\n📋 之前的流程（每天2-3小时）：\n• 早上刷半小时各大技术网站找选题\n• 花1小时查资料写文章\n• 半小时找配图\n• 半小时排版发布\n\n🤖 现在的流程（每天5分钟审核）：\n• 5:30 Agent 自动抓取热点 + 推荐3个选题\n• 6:00 我路上花1分钟选择选题\n• 6:01 Agent 自动生成初稿\n• 6:05 Agent 自动生成配图\n• 6:10 Agent 自动排版 + 生成多平台版本\n• 6:15 审核 → 定时发布\n\n🛠 技术方案：\n• 选题：QClaw 定时抓取各大技术社区热榜 + 微博/知乎热搜\n• 写作：Dify 工作流 → 输入选题和我的写作风格模板 → 生成初稿\n• 配图：即梦 AI 根据文章内容自动生成封面和插图\n• 排版：Markdown → 公众号格式自动转换\n• 多平台：一键生成公众号版、知乎版、小红书版（各平台风格不同）\n\n📊 数据：\n• 每天省 2.5 小时 x 30 天 = 75 小时/月\n• 文章质量：AI 初稿 + 我润色后，读者反馈跟手写没区别\n• 阅读量：因为更新频率提高了，月阅读量反而涨了 30%\n\n💡 关键提示：\nAgent 写文章的核心不是「让AI代替你写」，而是「让AI帮你写80%，你再花20%时间润色」。你的个人风格和经验观点是AI学不来的，这部分必须亲自来。",
    category: "全自动实战",
    tags: ["公众号", "内容创作", "全自动"],
    likes: 389,
    comments: 52,
    publishedAt: "2026-04-28",
  },
  {
    id: "post-6",
    author: "小白站长",
    title: "AI 能不能炒股？Agent 全自动量化交易的可行性分析",
    content:
      "这是最近被问最多的问题。先说清楚：我不是投资顾问，以下只是技术可行性分析，不构成任何投资建议。\n\n📊 结论：技术上可行，但有重要限制。\n\n✅ 能做的：\n1. 数据采集（全自动）：Agent 抓取行情数据、财报、新闻、社交媒体情绪\n2. 技术分析（全自动）：Agent 自动计算 MACD/KDJ/RSI 等指标并生成分析报告\n3. 策略回测（全自动）：Agent 用历史数据验证交易策略的有效性\n4. 风险监控（全自动）：Agent 实时监控持仓、设置止损止盈\n5. 信号提醒（全自动）：条件触发时自动发微信/邮件通知\n\n❌ 不能做的（或者说做不好的）：\n1. 预测未来走势：AI 是概率模型，不是水晶球\n2. 应对黑天鹅：突发政策、地缘政治等不可预测事件\n3. 情感决策：AI 不会恐慌也不会贪婪，但市场会\n\n🛠 技术方案：\n• 数据源：Tushare / AkShare（国内免费金融数据接口）\n• 分析引擎：Dify + DeepSeek 做自然语言分析\n• 执行框架：QClaw 定时触发 + 结果推送\n\n⚠️ 重要警告：\n• 绝对不要让 Agent 直接执行交易！让它做分析和预警，你来决策和下单\n• Agent 的分析结果只能作为参考，不能作为投资依据\n• 股市有风险，入市需谨慎\n\n我的实际做法：Agent 每天自动跑一遍技术分析 + 新闻情绪分析，把结果汇总发到我微信。我花 10 分钟过一遍，自己决定买不买。Agent 帮我省了 90% 的研究时间，但决策权永远在我手里。",
    category: "AI分析",
    tags: ["炒股", "量化交易", "可行性"],
    likes: 634,
    comments: 112,
    publishedAt: "2026-04-25",
  },
  {
    id: "post-7",
    author: "小白站长",
    title: "从每天忙到凌晨到准时下班：一个运营的 Agent 化之路",
    content:
      "前阵子公司新来了一个运营妹子，每天加班到晚上十点。我帮她用了两周把工作逐步 Agent 化。\n\n📊 她的日常工作（之前）：\n• 早上来了先看半小时数据后台\n• 整理昨天数据做日报（1小时）\n• 发布3个社交平台的内容（1.5小时）\n• 回复用户评论和私信（2小时）\n• 整理竞品动态（1.5小时）\n• 各种临时需求和开会（占据剩余时间）\n\n🤖 两周改造后：\n• 日报：Agent 每天8:30自动生成，她只需要转发\n• 内容发布：Agent 定时发布，她只需要审核\n• 用户回复：常见问题 Agent 自动回，复杂问题转到她那里\n• 竞品监控：Agent 每天中午推送摘要\n• 节省时间：每天至少4小时\n\n💡 她的反馈：\n「以前觉得 AI 很复杂肯定学不会，没想到装个 QClaw 就能用。现在每天能准点下班了，感觉生活又属于自己了。」\n\n🎯 核心经验：\n不要想着一次性把所有工作 AI 化。从每天最耗时的那一件事开始，做好一个再加下一个。运营妹子第一周只做了日报自动化，看到效果了才继续扩展。\n\n这就是 Agent 的终极意义——不是替代人，而是把人从重复劳动里解放出来，去做只有人能做的事。",
    category: "经验分享",
    tags: ["运营", "效率提升", "真实案例"],
    likes: 891,
    comments: 156,
    publishedAt: "2026-04-20",
    pinned: true,
  },
  {
    id: "post-8",
    author: "小白站长",
    title: "QClaw vs Dify vs Coze：三种 Agent 工具到底该怎么选？",
    content:
      "每天都有新用户问：这么多 Agent 工具我到底该用哪个？这问题我回答了不下 50 遍，干脆写个帖子一劳永逸。\n\n⚡ 快速选择指南：\n• 完全零基础、不想学任何东西 → QClaw（装个软件就能用）\n• 想搭客服/知识问答 Agent → Dify（零代码，网页操作，最易学）\n• 想把 Agent 发到微信/飞书 → Coze（字节出品，发布渠道多）\n• 想要完全自由和控制 → OpenClaw（开源，本地运行，配置灵活）\n• 想要自动进化的 Agent → Hermes（能从任务中学习，越用越强）\n\n📊 详细对比：\n\n安装难度：\nQClaw ★☆☆☆☆（下载安装）\nDify ★★☆☆☆（网页注册）\nCoze ★★☆☆☆（网页注册）\nOpenClaw ★★★★☆（需要命令行）\nHermes ★★★★★（需要 WSL2 + 命令行）\n\n功能丰富度：\nOpenClaw ★★★★★（13000+技能，本地操控电脑）\nHermes ★★★★☆（自我进化，多平台，学习型）\nDify ★★★★☆（工作流+知识库+Agent，全能）\nCoze ★★★☆☆（Bot搭建+发布，整合微信生态）\nQClaw ★★★☆☆（基于 OpenClaw，功能简化）\n\n适合人群：\nQClaw → 纯小白，会装软件就行\nDify → 想做客服/知识库/工作流\nCoze → 想把 Agent 嵌入微信/飞书\nOpenClaw → 技术爱好者，想要完全控制\nHermes → 进阶用户，想要最智能的 Agent\n\n🎯 我的推荐路径：\n新手：QClaw → 体验 Agent → Dify → 搭第一个 Agent → Coze → 发布到微信\n进阶：OpenClaw → 完全自由 → Hermes → 自我进化\n\n最后说一句：工具没有绝对的好坏，适合自己的就是最好的。不要因为看到别人用 OpenClaw 就觉得 Dify 不够高级——能把 Dify 用好的人，产量并不比 OpenClaw 差。",
    category: "经验分享",
    tags: ["工具对比", "新手指南", "QClaw", "Dify"],
    likes: 567,
    comments: 98,
    publishedAt: "2026-04-18",
  },
  {
    id: "post-9",
    author: "小白站长",
    title: "用 Agent 处理表格需要装哪些技能？全场景攻略",
    content:
      "被问最多的问题：Agent 到底怎么处理 Excel/表格？需要装什么技能？统一回答。\n\n📊 处理表格的 Agent 技能清单（按场景分类）：\n\n一、Excel 自动化\n必装技能：\n• Excel智能公式 — 用自然语言生成公式和VBA宏\n• 多表格合并 — 批量合并多个Excel文件去重清洗\n• 周报月报模板 — 200+模板自动填充数据\n\n二、财务报表\n必装技能：\n• 财务报表生成 — 原始账目 → 资产负债表/利润表/现金流量表\n• 成本核算助手 — 自动计算产品成本+降本建议\n• 税务申报辅助 — 自动收集税务数据填写申报表\n\n三、销售数据\n必装技能：\n• 销售数据看板 — CRM/ERP数据 → 实时可视化看板\n• 客户数据清洗 — 批量去重+格式标准化+异常标记\n• 电商选品分析 — AI分析热销数据预测爆品\n\n四、人资行政\n必装技能：\n• 工资核算表 — 考勤+绩效+社保自动算\n• 员工考勤统计 — 打卡数据→出勤/迟到/加班/请假\n• 简历筛选器 — 批量分析简历自动评分排序\n\n五、供应链\n必装技能：\n• 采购比价表 — 多供应商报价自动比对\n• 库存管理表 — 出入库+安全库存预警+ABC分析\n• 快递单号追踪 — 批量查询物流状态更新表格\n\n六、项目管理\n必装技能：\n• 项目进度表 — 甘特图+进度报告+延期预警\n• 合同台账管理 — 提取合同关键条款+到期提醒\n• 银行流水分析 — 导入流水自动分类生成报表\n\n💡 安装顺序建议：\n① Excel智能公式（最基础）\n② 多表格合并（数据处理）\n③ 周报月报模板（日常高频）\n④ 根据你的行业选装上面的专项技能\n\n所有技能在 QClaw 技能市场搜关键词就能找到，点安装就能用。",
    category: "经验分享",
    tags: ["表格", "Excel", "技能", "自动化"],
    likes: 734,
    comments: 142,
    publishedAt: "2026-05-04",
  },
  {
    id: "post-10",
    author: "小白站长",
    title: "我让 Agent 接管了公司全部表格工作，每月省 120 小时",
    content:
      "上个月做了一个大胆的决定：把公司所有表格相关的工作全交给 Agent。结果出乎意料。\n\n🏢 公司背景：30人电商团队，每天产生大量表格工作\n\n📊 被 Agent 接管的表格清单：\n1. 日报/周报/月报 — Agent 每天从ERP抓数据自动生成\n2. 销售数据分析 — 自动对比环比同比，标注异常\n3. 库存盘点 — 每天凌晨自动核对，差异超过5%报警\n4. 供应商对账 — 自动核对采购入库和发票，标记差异\n5. 员工考勤 — 打卡数据自动汇总出勤表\n6. 快递面单 — 从Excel读取地址批量打印\n\n🛠 技术方案：\nQClaw + 上面帖子里的表格技能 + 飞书多维表格\n每天早上8点自动跑一遍所有表格任务，结果推送飞书群\n\n📈 效果：\n• 原来：2个行政 + 1个财务助理 + 1个数据分析 = 4人每天2-3小时\n• 现在：Agent 全自动处理，1人每天审核10分钟\n• 月省约120小时人力\n\n⚠️ 关键：不是说 Agent 完全替代人。数字和结论你还是需要审核——Agent 偶尔会出错。但节省90%以上的重复劳动是实打实的。\n\n💡 核心经验：不要一次性全部交给Agent。先从最简单的日报开始，跑稳了再加下一个。我们花了两周逐渐接管完所有表格。",
    category: "全自动实战",
    tags: ["表格", "自动化", "电商", "效率"],
    likes: 957,
    comments: 183,
    publishedAt: "2026-05-03",
  },
  {
    id: "post-11",
    author: "小白站长",
    title: "Agent 本地部署全攻略：从选硬件到跑通第一个模型",
    content:
      "很多人想在自己电脑上跑 Agent，但不知道能不能跑得动。整理一份硬件对照表。\n\n💻 配置分级（照着买/照着用）：\n\n入门级（8GB内存/核显）\n可跑：Qwen3 7B、Gemma 4、Phi-4\n用途：日常聊天、简单问答、文案润色\n体验：能用但别期待太快，生成速度像打字\n\n进阶级（16GB内存/6-8GB显存）\n可跑：Qwen3 14B、MiniMax M2.5 10B、DeepSeek R1 8B\n用途：编程辅助、文档分析、Agent日常任务\n体验：流畅度明显提升，日常使用够了\n\n高端级（32GB内存/12-24GB显存）\n可跑：Qwen 3.5 17B、DeepSeek V4 37B、GLM-5.1 40B\n用途：复杂编程、长文档分析、多任务并行\n体验：接近云端API的速度和质量\n\n发烧级（64GB+/多卡）\n可跑：Llama 4 Scout、Qwen3 235B\n用途：研究和重度使用\n\n🔧 安装顺序：\n① 装Ollama（ollama.com下载安装）\n② 终端：ollama run qwen3:7b（先试最小的）\n③ 装LM Studio（图形界面，方便切换模型）\n④ 装OpenClaw/Hermes（真正的Agent框架）\n⑤ 让Agent调用Ollama的本地模型\n\n💰 成本对比：\n本地方案：一次性投入（显卡约3000-8000元），之后零成本\n云端API：DeepSeek约¥1/百万token，GPT-5约$3.75/百万token\n\n如果每天用AI超过2小时，买张显卡本地跑更划算。",
    category: "经验分享",
    tags: ["本地部署", "硬件", "Ollama", "配置"],
    likes: 821,
    comments: 176,
    publishedAt: "2026-05-02",
  },
  {
    id: "post-12",
    author: "小白站长",
    title: "Agent 安全指南：5条新手必做的安全设置",
    content:
      "最近工信部发了 Agent 安全预警。整理 5 条新手必做的安全设置，花 5 分钟设置好。\n\n🔒 第1条：关掉远程访问\n默认情况下 OpenClaw 可能暴露在公网。检查：\n• 路由器管理页 → 端口转发 → 删除任何指向8642/9119端口的规则\n• 用 canyouseeme.org 检查这两个端口是否对外开放\n\n🔒 第2条：装 skill-vetter\n• 这是社区公认的必装第一技能\n• 安装任何其他技能前，先用 skill-vetter 扫描代码\n• 发现过341个恶意技能，防不胜防\n\n🔒 第3条：设 API 消费限额\n• DeepSeek控制台 → 设置日消费上限（建议¥5-10/天）\n• OpenAI → Usage limits → 设 hard limit\n• 防止Agent失控烧钱\n\n🔒 第4条：不用的端口关掉\n• 防火墙入站规则 → 删除8642和9119\n• Windows：防火墙高级设置 → 入站规则\n• Mac：系统设置 → 网络 → 防火墙\n\n🔒 第5条：定期备份配置\n• 定期备份 ~/.openclaw/ 整个目录\n• Agent 配置和技能是劳动成果，丢了重装很痛苦\n\n⚠️ 真实案例：有人 VNC 暴露公网后信用卡被盗刷。Agent 权限太大了，安全不是可选项。",
    category: "踩坑记录",
    tags: ["安全", "Agent", "必读", "新手"],
    likes: 634,
    comments: 98,
    publishedAt: "2026-05-01",
  },
  {
    id: "post-13",
    author: "小白站长",
    title: "OpenClaw 接入 DeepSeek 完整教程（本地部署+国产模型）",
    content:
      "OpenClaw 默认用 Claude/GPT，对国内用户不友好。但可以完全切换到国产免费模型。\n\n📋 前提：已安装 OpenClaw（安装教程见学习路径阶段3）\n\n🔑 第一步：获取 DeepSeek API Key（免费）\n① 打开 platform.deepseek.com → 注册\n② 控制台 → API Keys → 创建 Key → 复制\n③ 新用户送500万token\n\n⚙️ 第二步：配置 OpenClaw\n① 打开配置文件：Windows: C:\\Users\\你的用户名\\.openclaw\\config.yaml\n② 替换为以下内容：\n\nmodels:\n  default: deepseek-chat\n  providers:\n    deepseek:\n      api_key: sk-你的key\n      base_url: https://api.deepseek.com\n      models: [deepseek-chat, deepseek-reasoner]\n\n③ 保存 → 重启 OpenClaw\n\n🧪 第三步：验证\nopenclaw test deepseek-chat\n→ 看到 ✅ 即成功\n\n💰 成本：deepseek-chat约¥1/百万token，日常使用月均不到10元。比GPT便宜15倍。\n\n🔧 进阶：同时接入多个国产模型\nmodels:\n  default: deepseek-chat\n  providers:\n    deepseek:\n      api_key: sk-xxx\n      base_url: https://api.deepseek.com\n      models: [deepseek-chat, deepseek-reasoner]\n    qwen:\n      api_key: sk-xxx\n      base_url: https://dashscope.aliyuncs.com/compatible-mode/v1\n      models: [qwen-plus, qwen-max]\n    glm:\n      api_key: xxx\n      base_url: https://open.bigmodel.cn/api/paas/v4\n      models: [glm-5]\n\n设置路由自动选择最合适的模型。",
    category: "经验分享",
    tags: ["OpenClaw", "DeepSeek", "本地部署", "国产模型"],
    likes: 589,
    comments: 87,
    publishedAt: "2026-05-04",
  },
  {
    id: "post-14",
    author: "小白站长",
    title: "Hermes Agent 接入国产大模型完整指南（Windows/Mac）",
    content:
      "Hermes 官方默认用 OpenAI API，但完全可以接国产模型。\n\n📋 Windows 前置：需要 WSL2（一行命令装）\n管理员 PowerShell 输入：wsl --install → 重启 → 开始菜单打开 Ubuntu\n\n🔑 获取 API Key：\nDeepSeek：platform.deepseek.com → API Keys\n通义千问：dashscope.aliyun.com → 管理中心\n智谱GLM：open.bigmodel.cn → API Keys\n\n⚙️ Hermes 配置（安装完成后执行）：\nhermes setup → 选 custom provider\n→ Provider name: deepseek\n→ API Base URL: https://api.deepseek.com\n→ API Key: sk-你的key\n→ Model name: deepseek-chat\n\n或者直接编辑配置文件 ~/.hermes/config.yaml：\n\nmodel:\n  default: deepseek-chat\n  provider: custom\n  base_url: https://api.deepseek.com\n  api_key: sk-你的key\n\n🧪 验证：\nhermes doctor → 看到 ✅ 即成功\n\n💡 Hermes + DeepSeek 组合优势：\n• Hermes自我进化能力 + DeepSeek便宜推理 = 会学习的免费助手\n• 中文任务特别适合用通义千问+DeepSeek混搭",
    category: "经验分享",
    tags: ["Hermes", "DeepSeek", "本地部署"],
    likes: 467,
    comments: 63,
    publishedAt: "2026-05-04",
  },
  {
    id: "post-15",
    author: "小白站长",
    title: "Claude Code 替代方案：用国产模型+本地工具搭建免费AI编程环境",
    content:
      "Claude Code 很强但要付费$20/月且国内网络不友好。以下是完全免费的替代方案。\n\n💻 方案一：Continue + DeepSeek（VS Code用户）\n① 安装 Continue 插件（VS Code扩展商店搜Continue）\n② 配置 config.json：\n{\"models\":[{\"title\":\"DeepSeek\",\"provider\":\"deepseek\",\"model\":\"deepseek-chat\",\"apiKey\":\"sk-xxx\"}]}\n③ 成本：¥1/百万token，约等于免费\n\n💻 方案二：Cline + DeepSeek（最强开源替代）\n① 安装 Cline 插件\n② 设置 → API Provider → DeepSeek → 输入API Key\n③ 直接对话编程，体验接近 Claude Code\n④ 完全免费！Cline开源 + DeepSeek超低价\n\n💻 方案三：Aider + 本地模型（完全离线）\n① 装Ollama：ollama.com → 安装\n② 终端：ollama run qwen3:32b（下载模型）\n③ 终端：pip install aider-chat → aider --model ollama/qwen3:32b\n④ 完全免费+完全离线，数据不出电脑\n\n💻 方案四：Trae（字节出品，免费IDE）\n① trae.ai 下载安装\n② 内置Claude和GPT免费使用\n③ 跟Cursor差不多但完全免费\n\n📊 对比：\nClaude Code：$20/月，终端最强，国内不便\nContinue：免费，VS Code集成，需API Key\nCline：免费，功能最接近Claude Code\nAider：免费，终端使用，可本地模型\nTrae：免费，中文IDE，零配置",
    category: "经验分享",
    tags: ["Claude Code", "编程", "免费", "替代"],
    likes: 723,
    comments: 134,
    publishedAt: "2026-05-04",
  },
]
