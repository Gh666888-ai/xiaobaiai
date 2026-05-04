// 学习路径 · 小白AI · 4 大板块
export interface Stage {
  id: number; title: string; subtitle: string
  whoIsThisFor: string; timeEstimate: string; icon: string; color: string
  sections: Section[]
}
export interface Section {
  title: string; content: string; tools: string[]; tips?: string
}

export const stages: Stage[] = [
  // ===== 板块1：了解AI和Agent =====
  {id:0,title:"了解 AI 和 Agent",subtitle:"零基础认识人工智能，搞懂Agent到底是什么",
    whoIsThisFor:"完全没接触过AI，不知道AI能做什么的人",timeEstimate:"约 1 小时",icon:"◈",color:"#3DA563",sections:[
    {title:"AI 到底是什么？用人话讲",
      content:"AI = 一个读过很多书、可以跟你聊天、帮你干活的电脑程序。\n\n现在的 AI 能做：写文案、翻译、做PPT、画图、写代码、分析数据、搜索信息...几乎什么都能帮。\n\n你只需要学会怎么跟它「说话」——后面会教。\n\nAI 不是万能的，它会犯错（叫「幻觉」），所以当成一个很能干但需要你检查的实习生就行。",
      tools:[],tips:"最好的理解方式：打开 Kimi（kimi.moonshot.cn），输入「你好」，感受一下。"},
    {title:"Agent 是什么？跟普通AI聊天有什么区别？",
      content:"普通AI：你问它答，像打电话咨询。\nAgent：你有事交代它，它自己去办完，像请了个助理。\n\n举个实际的例子：\n普通AI → 你问「今天天气怎么样」，它回复你。\nAgent → 你设好规则，它每天早上自动查天气，根据天气告诉你穿什么，下雨提醒你带伞——你什么都不用做。\n\nAgent = AI大脑 + 能操作电脑/网络 + 能定时自动执行。\n\n2026年 Agent 生态全景：\n\n🦞 OpenClaw（龙虾）—— 开源Agent之王，GitHub 29万星，2026最火。完全自由，13000+技能市场，12+通讯平台。\n\n🔮 Hermes —— 自我进化最强。能从任务中自动学习生成技能，越用越聪明。16+平台消息网关。\n\n💻 Claude Code —— 功能最强的编程Agent（但需付费$20/月，国内网络不太友好）。\n\n🏢 QClaw（腾讯）—— OpenClaw的套壳版。优点是安装简单（下载安装包→微信扫码→搞定），缺点是做了一些限制（不能自由接入模型、部分功能被阉割）。\n\n其他国内套壳：ArkClaw、AutoClaw、QClaw等，底层都是OpenClaw但各自加了限制。\n\n🎯 核心观点：套壳Agent方便但有限制，真正的开源Agent（OpenClaw/Hermes）装上技能后能力无限——能做任何事。这个学习路径会从QClaw入门，再引导你使用真正的开源Agent。",
      tools:[],tips:"套壳 = 别人帮你配好了但限制了你的自由度。开源 = 完全自由但需要你自己配置。先套壳入门，再开源进阶。"},
    {title:"AI 工具生态全景：一张图看懂",
      content:"现在市面上的AI工具分这几大类：\n\n💬 对话AI：ChatGPT / Kimi / DeepSeek / 豆包 / 通义千问\n   → 聊天、问答、写作、翻译、代码，最基础的入门工具\n\n🤖 Agent平台：QClaw / Dify / Coze / OpenClaw / Hermes\n   → 搭建自动化的智能助手，能做客服、日报、监控\n\n🧠 模型平台：HuggingFace / Ollama / 硅基流动\n   → 下载和运行开源模型，本地免费使用\n\n🎨 创作工具：Midjourney / 即梦 / Suno / Sora\n   → AI绘图、视频、音乐\n\n这个学习路径会从对话AI开始，一步步带你到Agent和本地部署。",
      tools:[],tips:"不要被术语吓到。你不需要学所有的，跟着路径一步步走就够了。"},
  ]},

  // ===== 板块2：初步应用现成的AI工具 =====
  {id:1,title:"初步应用AI工具",subtitle:"从零开始用现成的AI，不需要安装任何东西",
    whoIsThisFor:"会用电脑上网但没用过AI工具的人",timeEstimate:"约 2 小时",icon:"◉",color:"#3B82C4",sections:[
    {title:"第一次使用 AI：注册 Kimi（截图级教程）",
      content:"我们选 Kimi，因为完全免费、中文理解最好、不需要翻墙。\n\n📋 注册步骤（鼠标点哪里都写清楚了）：\n\n① 打开浏览器，在地址栏输入：kimi.moonshot.cn 然后按回车\n② 页面打开后，看右上角 → 点击「登录 / 注册」按钮（蓝色文字）\n③ 弹出一个框 → 选「手机号登录」→ 输入你的手机号\n④ 点击「获取验证码」→ 手机会收到6位数字短信 → 输入验证码\n⑤ 点击「登录」→ 完成！\n\n现在你看到一个对话框了——这就是跟AI聊天的地方。\n\n💡 界面说明：左边是历史对话列表，中间大块是聊天区，最下面长条是输入框。右下角有个📎图标可以上传文件。",
      tools:["kimi"],tips:"同样方法可以注册 DeepSeek（chat.deepseek.com），完全一样。建议两个都注册，换着用。"},
    {title:"第一次跟 AI 对话：从简单问题开始",
      content:"在对话框里输入以下内容试试（直接复制粘贴）：\n\n① 「你好，我是AI新手，请用3句话告诉我你能帮我做什么」\n② 「帮我写一个请假的微信消息，理由是要去医院体检」\n③ 「推荐3部适合周末看的电影，要2024年以后的」\n④ 「用200字以内解释什么是人工智能」\n\n你会发现 AI 对不同类型的问题回答风格完全不同——这就是它的智能。\n\n⚠️ 常见错误：别只说「帮我写周报」——要说清楚：本周做了什么、给谁看、多少字、什么语气。信息给得越具体，AI 写得越好。",
      tools:["kimi"],tips:"别怕问'蠢问题'——AI不会不耐烦。把它当做一个知识渊博但不太了解你情况的朋友。"},
    {title:"上传文件让AI分析（PDF/Word/PPT都能读）",
      content:"这是 AI 在办公场景中最实用的功能。\n\n操作步骤（一步一步来）：\n① 在对话框右下角找到📎图标 → 点击\n② 电脑会弹出文件选择窗口 → 选一个你电脑上的文档\n③ 等待上传完成（大的文件可能需要几秒）\n④ 在对话框输入你想让AI做的事，比如：\n   「请用3个要点总结这个文档的核心内容」\n   「找出这个合同中对我不利的条款」\n   「把这篇文章改写成小红书风格的笔记」\n⑤ 按回车发送\n\nKimi 一次可以上传最多200万字的文件（大约3本《三体》），支持 PDF/Word/PPT/Excel/TXT。",
      tools:["kimi"],tips:"长文档分析是Kimi的强项。如果有很长的合同、论文或会议记录，扔给Kimi让它梳理。"},
    {title:"用 AI 做PPT：Gamma 完全教程（英文界面怎么办）",
      content:"Gamma 是目前最好的AI PPT工具。界面是英文的，但完全可以用中文操作。\n\n① 打开浏览器，输入 gamma.app → 回车\n② 看右上角 → 点击「Sign up free」（注册）\n③ 可以用Google账号登录，或者输入邮箱注册\n④ 登录后，点中间的大按钮「Create new」→ 选「Generate」\n⑤ 看弹出的输入框 → 用中文输入你要做的PPT主题\n   例如：「2026年人工智能发展趋势分析报告，10页」\n⑥ 点「Generate outline」→ AI会先生成大纲给你确认\n⑦ 大纲没问题就点「Continue」→ 等10-20秒\n⑧ 一套完整的PPT就生成了！可以在线编辑修改\n⑨ 点右上角「Export」→ 选「PDF」或「PowerPoint」下载\n\n💰 免费版每月400积分，大约能做4-5套PPT。\n\n💡 如果英文看不懂：用浏览器自带的翻译功能（Chrome 右键 → 翻译成中文）。",
      tools:["gamma"],tips:"Gamma 免费版完全够用。先选好配色和模板风格，AI生成后只需要微调内容。"},
    {title:"用 AI 画图：即梦 + 中文提示词技巧",
      content:"即梦是字节出品的AI绘图工具，中文提示词理解好、免费额度多。\n\n① 打开 jimeng.jianying.com → 用抖音/头条账号登录\n② 在输入框输入你想画的内容，比如：\n   「一只戴墨镜的橘猫坐在咖啡馆窗边，阳光透过玻璃照进来，温馨氛围，摄影风格」\n③ 选择画面比例：横版16:9（做PPT用） / 方版1:1（做头像） / 竖版9:16（做手机壁纸）\n④ 点「生成」→ 等10秒左右\n⑤ 每天有免费画画额度\n\n📝 提示词公式（记住这个）：主体 + 动作 + 场景 + 风格 + 光线\n好的例子：「一个穿白大褂的女医生，站在明亮的实验室里，手里拿着试管，俯视角度，写实摄影风格，柔和的自然光」",
      tools:["jimeng"],tips:"刚开始画不好很正常。去小红书搜'AI绘画提示词'，复制别人的好提示词做起点。"},
  ]},

  // ===== 板块3：安装主流的Agent =====
  {id:2,title:"安装主流Agent",subtitle:"在电脑上安装Agent，让它帮你自动干活",
    whoIsThisFor:"会用AI工具，想让AI自动执行任务的人",timeEstimate:"约 3 小时",icon:"◆",color:"#E8833A",sections:[
    {title:"QClaw 安装教程（腾讯出品，最简单，零英文）",
      content:"QClaw 是腾讯电脑管家出品的本地AI助手，基于OpenClaw。全程中文、不需要命令行。\n\n📥 安装步骤（跟安装微信一样简单）：\n\n① 打开浏览器，输入 qclaw.qq.com → 回车\n② 看到一个大大的「下载Windows版」按钮 → 点击\n③ 下载完成后，在浏览器底部或下载文件夹找到安装包 → 双击打开\n④ 一路点「下一步」→「我同意」→「安装」→「完成」\n   （跟装任何软件一模一样，没有任何要选要填的）\n⑤ 桌面会出现一个红色龙虾图标 → 双击打开\n⑥ 软件打开后，看左下角 → 有个手机小图标 → 点击\n⑦ 会弹出一个二维码 → 用微信扫码\n⑧ 手机微信点「确认」→ 绑定成功\n⑨ 微信里会出现一个叫「龙虾」的联系人\n\n✅ 安装完成！现在你可以：\n• 在电脑上直接跟 QClaw 对话框聊天\n• 在手机上通过微信给「龙虾」发指令\n\n💡 试试给QClaw发这个：「帮我整理桌面上散落的文件，按类型分到不同文件夹」",
      tools:["qclaw"],tips:"QClaw内置了Kimi、GLM-5、DeepSeek等模型，全部免费不需要自己配API Key。整个安装过程零英文。"},
    {title:"QClaw 技能市场：5000+技能一键安装",
      content:"技能（Skill）就是别人写好、你点一下就能用的自动化流程。\n\n🔧 安装技能的步骤：\n① 在 QClaw 界面左侧 → 找到「技能」图标（一个方块拼图的样子）→ 点击\n② 会列出所有可用技能，顶上有搜索框\n③ 搜索你想要的功能，比如输入「日报」\n④ 看到「日报生成器」→ 点击\n⑤ 点「安装」按钮\n⑥ 装好后，直接在对话框说「执行日报生成」就行\n\n🔥 推荐新手必装的5个技能：\n• 日报生成器 —— 自动汇总工作生成日报\n• 文档翻译 —— 一键翻译PDF/Word\n• 新闻摘要 —— 抓取指定网站新闻并总结\n• 文件分类 —— 自动整理下载文件夹\n• 周报助手 —— 从日历和邮件提取工作生成周报",
      tools:["qclaw"],tips:"技能市场就像手机App Store，装好就能用。每装完一个技能，先在对话框发一条简单指令测试一下。"},
    {title:"QClaw 全自动工作流实战",
      content:"现在做一个真正全自动的任务——每天早上推送AI新闻。\n\n① 对 QClaw 说（复制这段话）：\n   「每天早上8点，帮我抓取 OpenAI、Anthropic、Google AI 博客的最新文章，总结出5条最重要的新闻，每条一句话概括，发到我微信上」\n\n② QClaw 会回复确认，问你是否要定时执行 → 回答「是」\n③ 它还会问你要不要先试运行一次 → 回答「是」\n④ 几分钟后微信应该收到一条测试新闻\n\n🎉 恭喜！你有了第一个全自动工作流！\n\n💡 更多自动化例子（直接复制给QClaw）：\n• 「每天下午5点，检查我的邮件，把需要回复的列出来发微信」\n• 「每周五下午，生成这一周的Git提交记录汇总」\n• 「监控某个网站，价格变化超过10%立刻通知我」\n\n核心公式：定时触发 → 抓数据 → AI处理 → 发到你微信。",
      tools:["qclaw"],tips:"第一次试运行一定要做！如果微信收不到消息，检查微信是否绑定了、网络是否正常。"},
    {title:"套壳 vs 开源：为什么要学真正的开源Agent？",
      content:"现在市面上有很多AI Agent，但分两类：\n\n🏢 套壳Agent（如QClaw、ArkClaw）：\n优点：安装简单（双击安装包→扫码→搞定），内置模型，零配置\n缺点：不能自由接入其他模型、不能改底层配置、部分功能被阉割\n适合：纯小白入门，体验Agent是什么感觉\n\n🦞 开源Agent（OpenClaw、Hermes）：\n优点：完全自由——接入任何模型、写任何技能、改任何配置\n缺点：需要自己安装配置（跟着教程15分钟也能搞定）\n适合：想要真正掌控AI的人\n\n💡 类比：套壳=租房子（家具配好但不能装修），开源=买毛坯房（一开始空但你想怎么装就怎么装）。\n\n🎯 这个路径的设计思路：先用QClaw体验Agent的能力 → 再用开源Agent获得完全自由 → 学会后你能做的事是套壳Agent望尘莫及的。",
      tools:[],tips:"套壳Agent帮你省了前15分钟的安装，但限制了你后面15年的可能性。学会开源Agent，等于打开了Agent世界的全部大门。"},
    {title:"开源Agent必学技能清单（装完立刻装这些）",
      content:"装好OpenClaw或Hermes后，按这个顺序装技能：\n\n🛡️ 第一：skill-vetter（安全审计）\n→ 安装前检查技能代码是否安全，防止恶意代码\n→ 社区共识：永远第一个装\n\n🔍 第二：tavily-search / felo-search（联网搜索）\n→ 让Agent能上网搜索最新信息\n→ felo-search 原生支持中文\n\n🧠 第三：self-improving-agent（自我进化）\n→ 让Agent记住错误、跨对话学习\n→ 越用越聪明\n\n🌐 第四：Agent Browser（浏览器操作）\n→ 让Agent能自动操作网页：填表、点击、截图\n→ 所有网页操作的基石\n\n📝 第五：summarize（内容总结）\n→ PDF、网页、YouTube、图片一键总结\n→ 信息降噪神器\n\n💻 第六（按需）：github（管理代码）/ gog（Google全家桶）/ Telegram（手机操控）\n\n🔗 第七（进阶）：free-ride（免费模型接入）/ proactive-agent（主动规划）\n\n⚠️ 不要一口气全装。先装前3个，跑顺了再加。技能太多会撑爆Agent的上下文窗口。",
      tools:["openclaw"],tips:"安装顺序很重要！安全技能永远第一。前5个技能装完，你的Agent能力已经超过99%的套壳Agent了。"},
    {title:"开源 Agent 接入微信/飞书/QQ 教程",
      content:"装好开源Agent后，最实用的就是把Agent接入日常聊天工具——在微信里直接给Agent发指令，它自动执行。\n\n📱 OpenClaw 接入微信：\n① 终端输入：openclaw plugin install wechat\n② 按提示用手机微信扫码登录\n③ 配置触发器（可选）：收到消息包含特定关键词时自动回复\n④ 测试：在微信给「龙虾」发「帮我查今天天气」\n\n📱 接入飞书：\n① 终端输入：openclaw plugin install feishu\n② 飞书开放平台创建应用 → 获取 App ID 和 Secret\n③ 配置到 OpenClaw 的飞书插件中\n④ 飞书群里 @机器人 发指令即可\n\n📱 接入 QQ：\n① 终端输入：openclaw plugin install qq\n② QQ 扫码登录\n\n📱 Hermes 接入微信：\n① hermes gateway setup → 选 WeChat → 扫码\n② 支持微信个人号和公众号两种模式\n\n⚠️ 注意：微信Web版协议不稳定，建议用企业微信或用QClaw中转。QClaw本身就是接了微信的OpenClaw套壳版，你可以用QClaw的微信通道来操控底层的OpenClaw。",
      tools:[],tips:"微信接入最麻烦，经常掉线。稳妥方案：用QClaw的微信通道（稳定）→ QClaw转发指令给OpenClaw（自由）。两全其美。"},
    {title:"Dify 安装教程（网页版，零安装）",
      content:"Dify 是一个在浏览器里用的Agent平台，不需要下载安装任何东西。\n\n① 打开浏览器，输入 cloud.dify.ai → 回车\n② 看右上角 → 点「Get Started」\n③ 可以用Google账号或者邮箱注册（QQ邮箱可以用）\n④ 注册完会自动跳转到工作台\n\n📌 界面说明（记一下位置）：\n• 左侧竖条是导航栏：工作室 / 知识库 / 工具 / 插件\n• 中间大块是内容区\n• 右上是你的头像和设置\n\n⑤ 点击「工作室」→「创建应用」→ 选「聊天助手」\n⑥ 给Agent起个名字，比如「我的文档助手」\n⑦ 在中间的大框里写提示词，告诉Agent要做什么\n   复制这段：\n   「你是一个专业的文档助手。用户会向你提问，请基于用户上传的文档来回答。如果文档中找不到答案，请诚实地说'文档中未提及此内容'。」\n⑧ 右边面板可以测试效果 → 输入问题试试\n⑨ 满意后点右上角「发布」\n\n✅ 完成了！你有了一个基于文档回答问题的Agent。",
      tools:["dify"],tips:"Dify免费版支持10个应用和50MB知识库。界面大部分是中文，偶尔有英文单词但都很简单。"},
    {title:"Dify 知识库配置 + 常见问题",
      content:"知识库就是Agent的「记忆」——你上传的公司文档、产品手册、FAQ等。\n\n📚 上传知识库步骤：\n① Dify左侧 → 点「知识库」→「创建知识库」\n② 起个名字 → 点「创建」\n③ 点「上传文件」→ 选你电脑上的文档\n④ 上传完 → 点「保存并处理」\n⑤ 等1-2分钟处理完成\n\n⚙️ 关键设置（按这个配，效果好）：\n• 索引模式 → 选「高质量」\n• 分段最大长度 → 500 字符\n• 检索策略 → 选「混合检索」\n• Top K → 5\n• 分数阈值 → 0.5\n\n⑥ 回到Agent设置 → 在「上下文」里勾选刚创建的知识库\n\n⚠️ 常见问题：\n• 上传的文档查不到内容 → 可能是扫描件PDF（图片格式），AI读不了，需要OCR转文字\n• Agent乱回答 → 提示词里加「如果知识库中没有相关信息就说不知道」\n• 文档太大传不上去 → 拆成几个小文件分别上传",
      tools:["dify"],tips:"知识库质量决定Agent水平。花15分钟做好预处理和参数配置，比写3小时提示词更有效。"},
  ]},

  // ===== 板块4：部署模型 + 本地部署模型 =====
  {id:3,title:"部署模型 + 本地部署",subtitle:"在自己电脑上跑AI模型，数据不出门、完全免费",
    whoIsThisFor:"想在自己电脑上用AI、不依赖网络、不花API费用的人",timeEstimate:"约 4 小时",icon:"◆",color:"#C8944A",sections:[
    {title:"本地部署入门：你能在电脑上跑什么模型？",
      content:"本地部署 = 把AI模型下载到你电脑上运行，不需要联网、数据不出电脑、完全免费。\n\n⚠️ 先搞清楚你的电脑配置：\n• 右键「此电脑」→「属性」→ 看「内存」是多少 GB\n• 如果有独立显卡（NVIDIA），右键桌面 → NVIDIA控制面板 → 看显存\n\n📊 按配置选模型（对照你的电脑）：\n\n💻 8GB 内存 / 无独显（老电脑/轻薄本）：\n→ 可跑 Qwen3 7B、Gemma 4、Phi-4（日常对话够用）\n→ 推荐工具：Ollama（最省资源）\n\n💻 16GB 内存 / 6-8GB 显存（主流配置）：\n→ 可跑 Qwen3 14B、DeepSeek R1 8B、MiniMax M2.5 10B\n→ 推荐工具：Ollama + LM Studio\n\n💻 32GB+ 内存 / 12-24GB 显存（高配）：\n→ 可跑 Qwen 3.5 17B、DeepSeek V4 37B、GLM-5.1 40B\n→ 推荐工具：Ollama + TextGen WebUI\n\n💻 服务器 / 多卡（发烧友）：\n→ 可跑 Llama 4 Scout、DeepSeek R1 70B、Qwen3 235B\n→ 推荐工具：vLLM + Ollama",
      tools:["ollama"],tips:"不确定配置的话，先从 Qwen3 7B 开始试。下载快、运行快，聊聊天、写写文案够用了。"},
    {title:"Ollama 安装教程（最简单，一句话跑模型）",
      content:"Ollama 是目前最简单的本地AI运行工具，支持 Windows/Mac/Linux。\n\n📥 安装（全程中文支持）：\n\n① 打开浏览器，输入 ollama.com → 回车\n② 看到大大的「Download」按钮 → 点击（自动识别你的系统）\n③ 如果是Windows，点「Download for Windows」\n④ 下载完 → 双击安装文件 → 一路「下一步」→「安装」\n   （纯英文安装界面但只需要点 Next → Install → Finish）\n⑤ 安装完成后，桌面不会有图标 —— 用命令行\n\n🚀 运行第一个模型：\n⑥ 按键盘 Win 键 → 输入 cmd → 回车（打开命令提示符）\n⑦ 输入这个命令，回车：\n    ollama run qwen3:7b\n⑧ 第一次会自动下载（约4-5GB，等几分钟）\n⑨ 下载完出现 >>> 符号 → 直接输入中文问题 → 回车\n\n💡 试试跟它对话：输入「你好，用中文介绍一下你自己」→ 回车\n\n🎉 你现在在自己电脑上跑AI了！不需要联网！\n\n📋 常用命令（复制粘贴即可）：\n• ollama list → 查看已下载的模型\n• ollama pull 模型名 → 下载新模型\n• ollama rm 模型名 → 删除模型释放空间\n• Ctrl+C → 退出对话",
      tools:["ollama"],tips:"如果下载速度慢（国内网络），可以在系统设置里配代理。或者用国内镜像：hf-mirror.com 下载模型文件，再手动导入Ollama。"},
    {title:"LM Studio 安装教程（图形界面，零命令行）",
      content:"LM Studio 给不想碰命令行的人准备的，全程鼠标操作。\n\n① 打开 lmstudio.ai → 点「Download」\n② 选你的系统版本 → 下载 → 双击安装\n③ 安装完打开，看到主界面\n\n④ 顶部有个搜索框 → 输入你想用的模型名称（如 qwen3）\n⑤ 搜索结果里找到 Qwen3 14B → 点击\n⑥ 右边会显示模型信息和下载按钮 → 点「Download」\n⑦ 下载完，顶部切换到「Chat」标签\n⑧ 上方下拉框选刚下载的模型 → 下面输入框打字 → 回车\n\n✅ 就这么简单！全程不需要敲任何命令。\n\n💡 LM Studio 的好处：\n• 完全图形化，像用手机App一样\n• 内置模型搜索和下载，不需要去网站找\n• 可以调参数（温度、上下文长度等），滑条拖就行\n• 支持中文界面（设置里改语言）",
      tools:[],tips:"LM Studio 的优点是不用命令行，缺点是比Ollama占资源多一些。老电脑优先选Ollama。"},
    {title:"不同场景该用哪个本地模型？",
      content:"按需求选，不浪费电脑资源：\n\n💬 日常聊天/问答：\n→ Qwen3 14B（中文最好）或 Phi-4 14B（推理强）\n→ 8-16GB内存可跑，速度很快\n\n💻 写代码/编程：\n→ DeepSeek R1 32B（推理最强）或 Qwen Coder Next（速度最快）\n→ 需要至少12GB显存\n\n📄 分析文档/长文：\n→ Llama 4 Scout 17B（10M上下文）或 Kimi K2.5 32B（256K上下文）\n→ 适合扔一整个合同/论文进去分析\n\n🎨 AI 绘图：\n→ SD3 Turbo 或 SDXL Turbo（ComfyUI里跑）\n→ 需要8GB+显存，效果接近Midjourney\n\n🔊 语音转文字：\n→ Whisper V3 Large\n→ CPU就能跑，准确率极高\n\n📊 多语言（特别是英文）：\n→ Llama 4 Maverick 17B 或 Mistral Large 3 41B\n→ 英文能力比国产模型强很多\n\n💰 省钱建议：日常用用Qwen3 14B就够了。只有写代码才上DeepSeek R1，只有处理超长文档才上Llama 4 Scout。",
      tools:["ollama"],tips:"模型不是越大越好。越大的模型越吃配置、速度越慢。选适合你任务和配置的模型效率最高。"},
    {title:"汉化方案：解决英文工具和报错看不懂的问题",
      content:"很多AI工具是英文的，但有好几种方式解决：\n\n🔤 方式1：浏览器自带翻译（最推荐）\n• Chrome/Edge 浏览器 → 右键页面空白处 →「翻译为中文」\n• 整个网页瞬间变中文，包括按钮和菜单\n• 适用于Dify、Gamma、HuggingFace等网页工具\n\n🔤 方式2：截图发给AI翻译\n• 遇到英文报错 → 截图 → 发给Kimi/DeepSeek\n• 说「这个报错是什么意思？怎么解决？」\n• AI会告诉你意思和解决方法\n\n🔤 方式3：用国产替代\n• 不想用Ollama → 用LM Studio（有中文界面）\n• 不想用Dify（有英文）→ 用FastGPT或Coze（中文原生）\n• 不想用HuggingFace → 用ModelScope/魔搭（阿里出品，全中文）\n\n🔤 方式4：微信小程序\n• 搜「AI工具」会发现很多国产AI工具都有小程序版本\n• 通义千问、Kimi、豆包、文心一言全都有微信小程序\n• 小程序里全部是中文，零英文\n\n💡 终极方案：遇到任何英文不懂的 → 复制 → 发给Kimi →「翻译一下并解释什么意思」",
      tools:[],tips:"不用因为英文就放弃好工具。浏览器翻译+AI翻译能解决99%的问题。剩下的1%截图问AI就行。"},
  ]},
]

export function getStageLabel(stage: number): string {
  return {0:"了解AI",1:"应用工具",2:"安装Agent",3:"本地部署"}[stage]||""
}
