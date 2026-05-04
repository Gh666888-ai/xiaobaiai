export interface Skill {
  id: string; name: string; description: string; category: SkillCategory
  platform: "QClaw"|"OpenClaw"|"Dify"|"Coze"|"n8n"|"通用"
  difficulty: "简单"|"中等"|"进阶"
  downloads: string; url: string; tags: string[]
}

export type SkillCategory = "自动化"|"内容创作"|"数据分析"|"开发工具"|"通讯社交"|"办公效率"|"学习教育"|"生活娱乐"|"企业应用"|"安全隐私"

export const skillCategories:{key:SkillCategory;label:string;icon:string}[]=[
  {key:"自动化",label:"自动化",icon:"🤖"},{key:"内容创作",label:"内容创作",icon:"🎨"},
  {key:"数据分析",label:"数据分析",icon:"📊"},{key:"开发工具",label:"开发工具",icon:"💻"},
  {key:"通讯社交",label:"通讯社交",icon:"📱"},{key:"办公效率",label:"办公效率",icon:"📋"},
  {key:"学习教育",label:"学习教育",icon:"📚"},{key:"生活娱乐",label:"生活娱乐",icon:"🎮"},
  {key:"企业应用",label:"企业应用",icon:"🏢"},{key:"安全隐私",label:"安全隐私",icon:"🔒"},
]

export const skills:Skill[]=[
  // 自动化
  {id:"s1",name:"日报生成器",description:"自动汇总今日工作输出生成日报，支持飞书/微信推送。设定触发时间，每天自动运行。",category:"自动化",platform:"QClaw",difficulty:"简单",downloads:"12.3K",url:"#",tags:["日报","自动","推送"]},
  {id:"s2",name:"定时新闻摘要",description:"每天定时抓取指定网站新闻，AI分类总结后推送到微信/飞书。支持多源和多话题筛选。",category:"自动化",platform:"OpenClaw",difficulty:"简单",downloads:"8.1K",url:"#",tags:["新闻","定时","摘要"]},
  {id:"s3",name:"文件自动分类",description:"监控下载文件夹，自动按类型（文档/图片/视频/安装包）分类整理，清理重复文件。",category:"自动化",platform:"QClaw",difficulty:"简单",downloads:"15.6K",url:"#",tags:["文件","整理","自动化"]},
  {id:"s4",name:"定时任务调度器",description:"设置多个定时任务，到点自动执行。支持链式任务和条件触发。",category:"自动化",platform:"OpenClaw",difficulty:"中等",downloads:"6.2K",url:"#",tags:["调度","定时","任务"]},
  {id:"s5",name:"SEO自动发布",description:"自动将文章发布到多个自媒体平台（公众号/知乎/头条/百家号），定时定量推送。",category:"自动化",platform:"通用",difficulty:"中等",downloads:"4.5K",url:"#",tags:["SEO","发布","多平台"]},
  {id:"s6",name:"竞品监控",description:"定时访问竞品网站和社媒，检测产品更新、价格变化、营销活动，自动生成对比报告。",category:"自动化",platform:"通用",difficulty:"中等",downloads:"3.2K",url:"#",tags:["竞品","监控","报告"]},
  // 内容创作
  {id:"s7",name:"AI文案生成器",description:"输入产品信息和目标人群，自动生成适合不同平台的营销文案（小红书/抖音/淘宝）。",category:"内容创作",platform:"Coze",difficulty:"简单",downloads:"18.9K",url:"#",tags:["文案","营销","多平台"]},
  {id:"s8",name:"公众号排版助手",description:"自动将 Markdown 文章转换为公众号格式，调整排版、添加引导关注和阅读原文。",category:"内容创作",platform:"通用",difficulty:"简单",downloads:"9.7K",url:"#",tags:["公众号","排版","自动"]},
  {id:"s9",name:"视频脚本生成",description:"输入视频主题，自动生成拍摄脚本（分镜+台词+时长），支持多种视频风格。",category:"内容创作",platform:"Dify",difficulty:"简单",downloads:"11.2K",url:"#",tags:["视频","脚本","分镜"]},
  {id:"s10",name:"PPT自动生成",description:"输入大纲或文档，AI自动生成精美PPT。支持模板选择和品牌色定制。",category:"内容创作",platform:"Dify",difficulty:"简单",downloads:"14.3K",url:"#",tags:["PPT","自动","模板"]},
  {id:"s11",name:"多语言翻译器",description:"自动检测语言并翻译，保留原文格式。支持文档、网页、字幕等多种输入。",category:"内容创作",platform:"通用",difficulty:"简单",downloads:"7.8K",url:"#",tags:["翻译","多语言","自动检测"]},
  {id:"s12",name:"AI绘画提示词助手",description:"输入简单描述，AI扩展为专业的绘图提示词。支持Midjourney/SD/DALL-E格式。",category:"内容创作",platform:"通用",difficulty:"简单",downloads:"20.1K",url:"#",tags:["绘图","提示词","优化"]},
  // 数据分析
  {id:"s13",name:"Excel数据分析",description:"上传Excel自动分析数据趋势，生成可视化图表和文字报告。",category:"数据分析",platform:"Dify",difficulty:"简单",downloads:"16.1K",url:"#",tags:["Excel","图表","报告"]},
  {id:"s14",name:"SQL查询助手",description:"用自然语言描述需求，自动生成SQL查询语句。支持MySQL/PostgreSQL等多种数据库。",category:"数据分析",platform:"通用",difficulty:"中等",downloads:"5.8K",url:"#",tags:["SQL","数据库","查询"]},
  {id:"s15",name:"股票技术分析",description:"自动获取A股数据，执行技术指标分析（MACD/KDJ/RSI），生成买卖信号和风险提示。",category:"数据分析",platform:"OpenClaw",difficulty:"中等",downloads:"4.2K",url:"#",tags:["股票","技术分析","A股"]},
  {id:"s16",name:"PDF数据提取",description:"从PDF发票、合同、报告中自动提取结构化数据（金额/日期/公司名），存入Excel。",category:"数据分析",platform:"Dify",difficulty:"中等",downloads:"8.9K",url:"#",tags:["PDF","提取","数据"]},
  {id:"s17",name:"用户反馈分析",description:"批量分析用户评论/反馈，自动分类（Bug/需求/好评），提取高频关键词和情感倾向。",category:"数据分析",platform:"通用",difficulty:"中等",downloads:"3.5K",url:"#",tags:["反馈","分析","情感"]},
  // 开发工具
  {id:"s18",name:"Git提交信息生成",description:"读取代码变更自动生成规范的Git提交信息。支持Conventional Commits格式。",category:"开发工具",platform:"QClaw",difficulty:"简单",downloads:"6.8K",url:"#",tags:["Git","提交","规范"]},
  {id:"s19",name:"代码审查助手",description:"自动审查代码质量和安全性，指出潜在Bug、性能问题和安全漏洞，给出修改建议。",category:"开发工具",platform:"通用",difficulty:"中等",downloads:"4.1K",url:"#",tags:["代码","审查","安全"]},
  {id:"s20",name:"API文档生成",description:"读取代码自动生成REST API文档，支持OpenAPI/Swagger格式。从源码注释提取。",category:"开发工具",platform:"通用",difficulty:"中等",downloads:"3.3K",url:"#",tags:["API","文档","自动"]},
  {id:"s21",name:"环境部署助手",description:"一键部署Docker容器，自动配置Nginx/SSL/域名。支持Vercel/阿里云等多种平台。",category:"开发工具",platform:"OpenClaw",difficulty:"进阶",downloads:"2.1K",url:"#",tags:["部署","Docker","配置"]},
  {id:"s22",name:"数据库迁移工具",description:"AI辅助数据库Schema设计和迁移，自动生成迁移脚本。支持Prisma/TypeORM。",category:"开发工具",platform:"通用",difficulty:"进阶",downloads:"1.8K",url:"#",tags:["数据库","迁移","Schema"]},
  // 通讯社交
  {id:"s23",name:"微信自动回复",description:"设置关键词自动回复微信消息。支持文字/图片/链接多种回复类型和定时规则。",category:"通讯社交",platform:"QClaw",difficulty:"简单",downloads:"22.3K",url:"#",tags:["微信","回复","自动"]},
  {id:"s24",name:"飞书机器人",description:"创建飞书群机器人，自动发送通知、日报、提醒。支持交互式卡片消息。",category:"通讯社交",platform:"通用",difficulty:"简单",downloads:"10.5K",url:"#",tags:["飞书","机器人","通知"]},
  {id:"s25",name:"邮件智能分类",description:"自动分类收件箱邮件（重要/普通/垃圾），AI生成回复草稿，定时整理归档。",category:"通讯社交",platform:"OpenClaw",difficulty:"中等",downloads:"5.6K",url:"#",tags:["邮件","分类","回复"]},
  {id:"s26",name:"Discord社区管理",description:"自动管理Discord社区：欢迎新成员、回答FAQ、清理违规消息、生成活跃度报告。",category:"通讯社交",platform:"OpenClaw",difficulty:"中等",downloads:"3.9K",url:"#",tags:["Discord","社区","管理"]},
  {id:"s27",name:"Telegram Bot",description:"搭建Telegram机器人，支持命令触发、定时推送、群组管理。",category:"通讯社交",platform:"通用",difficulty:"简单",downloads:"7.2K",url:"#",tags:["Telegram","Bot","推送"]},
  // 办公效率
  {id:"s28",name:"会议纪要生成",description:"上传录音自动转录为文字，提取关键议题、决议、待办事项，生成结构化会议纪要。",category:"办公效率",platform:"Dify",difficulty:"简单",downloads:"17.4K",url:"#",tags:["会议","纪要","转录"]},
  {id:"s29",name:"简历筛选器",description:"批量分析简历，匹配职位需求，自动评分排序。提取关键信息生成候选人报告。",category:"办公效率",platform:"Dify",difficulty:"中等",downloads:"4.3K",url:"#",tags:["简历","筛选","HR"]},
  {id:"s30",name:"合同审查助手",description:"自动审查合同文本，标注风险条款、缺失项和不合理条款，生成审查意见。",category:"办公效率",platform:"通用",difficulty:"进阶",downloads:"2.8K",url:"#",tags:["合同","审查","风险"]},
  {id:"s31",name:"周报自动生成",description:"从日历/邮件/聊天记录自动提取本周工作，生成结构化周报。支持模板定制。",category:"办公效率",platform:"QClaw",difficulty:"简单",downloads:"13.2K",url:"#",tags:["周报","自动","提取"]},
  {id:"s32",name:"发票识别录入",description:"拍照上传发票自动识别金额/税号/公司名，录入Excel或财务系统。",category:"办公效率",platform:"通用",difficulty:"简单",downloads:"8.7K",url:"#",tags:["发票","识别","录入"]},
  // 学习教育
  {id:"s33",name:"AI英语口语陪练",description:"AI英语对话练习，纠正发音和语法。支持多种场景（面试/旅游/商务）和难度等级。",category:"学习教育",platform:"通用",difficulty:"简单",downloads:"11.8K",url:"#",tags:["英语","口语","练习"]},
  {id:"s34",name:"论文写作助手",description:"辅助学术论文写作：文献检索、大纲生成、引用格式、查重建议。",category:"学习教育",platform:"通用",difficulty:"中等",downloads:"9.2K",url:"#",tags:["论文","学术","写作"]},
  {id:"s35",name:"编程学习教练",description:"交互式编程学习，根据你的水平生成练习题和项目。支持Python/JS/Java等多语言。",category:"学习教育",platform:"通用",difficulty:"简单",downloads:"6.5K",url:"#",tags:["编程","学习","练习"]},
  {id:"s36",name:"考试刷题助手",description:"上传题库自动生成练习题和模拟考试。智能识别薄弱知识点，针对性出题。",category:"学习教育",platform:"Dify",difficulty:"简单",downloads:"5.1K",url:"#",tags:["考试","刷题","题库"]},
  // 生活娱乐
  {id:"s37",name:"AI旅行规划",description:"输入目的地和预算，自动生成详细旅行计划（交通/住宿/景点/美食），支持行程调整。",category:"生活娱乐",platform:"通用",difficulty:"简单",downloads:"14.6K",url:"#",tags:["旅行","规划","攻略"]},
  {id:"s38",name:"智能菜谱推荐",description:"输入冰箱里有的食材，AI推荐能做哪些菜并给出步骤。支持饮食偏好和忌口设定。",category:"生活娱乐",platform:"通用",difficulty:"简单",downloads:"10.3K",url:"#",tags:["菜谱","烹饪","推荐"]},
  {id:"s39",name:"健身计划生成",description:"输入身体数据和目标，AI生成个性化健身和饮食计划。每周根据进展自动调整。",category:"生活娱乐",platform:"通用",difficulty:"简单",downloads:"7.4K",url:"#",tags:["健身","计划","饮食"]},
  {id:"s40",name:"AI音乐播放器",description:"根据心情/场景自动生成歌单，支持Suno/Udio生成专属BGM。",category:"生活娱乐",platform:"通用",difficulty:"简单",downloads:"4.8K",url:"#",tags:["音乐","歌单","BGM"]},
  // 企业应用
  {id:"s41",name:"客服Agent系统",description:"搭建7x24智能客服：FAQ自动回复、订单查询、售后处理、复杂问题转人工。",category:"企业应用",platform:"Dify",difficulty:"中等",downloads:"19.2K",url:"#",tags:["客服","FAQ","自动"]},
  {id:"s42",name:"销售线索评分",description:"自动分析销售线索，根据行为数据和画像评分，帮助销售团队优先跟进高意向客户。",category:"企业应用",platform:"Dify",difficulty:"中等",downloads:"3.1K",url:"#",tags:["销售","线索","评分"]},
  {id:"s43",name:"库存预警系统",description:"监控库存数据，低于阈值自动预警并生成采购建议。支持多渠道库存同步。",category:"企业应用",platform:"通用",difficulty:"中等",downloads:"2.4K",url:"#",tags:["库存","预警","采购"]},
  {id:"s44",name:"企业知识库",description:"搭建企业内部知识库Agent，员工自然语言提问获取制度/流程/文档信息。",category:"企业应用",platform:"Dify",difficulty:"中等",downloads:"5.3K",url:"#",tags:["知识库","企业","查询"]},
  // 安全隐私
  {id:"s45",name:"密码管理器",description:"AI生成强密码并加密存储。自动填写登录表单，检测密码泄露风险。",category:"安全隐私",platform:"通用",difficulty:"简单",downloads:"6.7K",url:"#",tags:["密码","安全","加密"]},
  {id:"s46",name:"隐私数据扫描",description:"扫描本地文件和云存储中的敏感信息（身份证/银行卡/电话），标记并支持加密。",category:"安全隐私",platform:"OpenClaw",difficulty:"中等",downloads:"2.1K",url:"#",tags:["隐私","扫描","敏感"]},
  {id:"s47",name:"反诈骗识别",description:"AI分析来电/短信/链接，识别诈骗特征并预警。保护长辈免受电信诈骗。",category:"安全隐私",platform:"通用",difficulty:"简单",downloads:"8.9K",url:"#",tags:["反诈","识别","预警"]},
  {id:"s48",name:"VPN自动切换",description:"监控网络连接，自动选择最优节点。支持多协议和分流规则。",category:"安全隐私",platform:"OpenClaw",difficulty:"中等",downloads:"3.4K",url:"#",tags:["VPN","网络","自动"]},
]
