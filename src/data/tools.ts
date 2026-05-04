// AI 工具导航数据 · 小白AI
export interface Tool {
  id: string; name: string; url: string; description: string; logo: string
  category: ToolCategory; stage: number; pricing: "免费"|"免费+付费"|"付费"|"有免费额度"
  tags: string[]; featured: boolean; addedAt: string
}

// Simple Icons CDN: https://cdn.simpleicons.org/[slug]
function logo(slug: string) { return `https://cdn.simpleicons.org/${slug}` }

export type ToolCategory =
  |"对话AI"|"AI绘图"|"AI视频"|"AI写作"|"AI编程"|"AI办公"
  |"AI搜索"|"Agent平台"|"模型平台"|"AI音频"|"AI设计"
  |"AI营销"|"AI数据"|"AI学习"|"AI效率"

export const categories:{key:ToolCategory;label:string;icon:string}[]=[
  {key:"对话AI",label:"对话 AI",icon:"💬"},
  {key:"AI绘图",label:"AI 绘图",icon:"🎨"},
  {key:"AI视频",label:"AI 视频",icon:"🎬"},
  {key:"AI写作",label:"AI 写作",icon:"✍️"},
  {key:"AI编程",label:"AI 编程",icon:"💻"},
  {key:"AI办公",label:"AI 办公",icon:"📋"},
  {key:"AI搜索",label:"AI 搜索",icon:"🔍"},
  {key:"Agent平台",label:"Agent 平台",icon:"🤖"},
  {key:"模型平台",label:"模型平台",icon:"🧠"},
  {key:"AI音频",label:"AI 音频",icon:"🎵"},
  {key:"AI设计",label:"AI 设计",icon:"🎯"},
  {key:"AI营销",label:"AI 营销",icon:"📢"},
  {key:"AI数据",label:"AI 数据",icon:"📊"},
  {key:"AI学习",label:"AI 学习",icon:"📚"},
  {key:"AI效率",label:"AI 效率",icon:"⚡"},
]

export const stageLabels:Record<number,string>={0:"纯小白",1:"初体验",2:"日常提效",3:"Prompt进阶",4:"工具达人",5:"Agent入门",6:"Agent进阶",7:"Agent实战"}

// ====== 工具数据 ======
const free="免费";const fp="免费+付费";const paid="付费";const quota="有免费额度"

export const tools:Tool[]=[
  // ============ 对话 AI ============
  {id:"chatgpt",name:"ChatGPT",url:"https://chat.openai.com",description:"OpenAI出品，全球最流行的AI助手。多轮对话、文件分析、图片理解，GPT-5系列推理能力顶尖。",logo:logo("openai"),category:"对话AI",stage:1,pricing:fp,tags:["全球首选","多模态","GPT-5"],featured:true,addedAt:"2026-01-01"},
  {id:"kimi",name:"Kimi 月之暗面",url:"https://kimi.moonshot.cn",description:"200万字超长上下文，中文理解顶级。可一次性分析整本书，支持文件上传和联网搜索，完全免费。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["长文本","200万token","中文顶级"],featured:true,addedAt:"2026-01-01"},
  {id:"deepseek",name:"DeepSeek",url:"https://chat.deepseek.com",description:"推理能力极强，完全免费，支持联网搜索和文件上传。在国际基准测试中多次超越GPT，是性价比最高的选择。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["推理强","免费","联网","开源"],featured:true,addedAt:"2026-01-15"},
  {id:"claude",name:"Claude",url:"https://claude.ai",description:"Anthropic出品，以安全和深度思考著称。写作和编程表现极佳，思维过程透明。Claude Code是命令行编程利器。",logo:"",category:"对话AI",stage:2,pricing:fp,tags:["安全","长文写作","编程强"],featured:true,addedAt:"2026-01-01"},
  {id:"tongyi",name:"通义千问",url:"https://tongyi.aliyun.com",description:"阿里全能AI助手，整合对话、绘图、文档、代码等能力。免费使用，阿里云生态深度整合。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["阿里出品","多功能","中文","免费"],featured:false,addedAt:"2026-01-01"},
  {id:"doubao",name:"豆包",url:"https://www.doubao.com",description:"字节跳动出品，界面友好流畅，适合日常聊天和内容创作。支持网页和App，注册简单。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["字节出品","易上手","多端"],featured:false,addedAt:"2026-01-01"},
  {id:"ernie",name:"文心一言",url:"https://yiyan.baidu.com",description:"百度出品，中文理解能力扎实。深度整合百度搜索和百度系产品生态，适合中文场景。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["百度出品","中文","搜索整合"],featured:false,addedAt:"2026-04-01"},
  {id:"xinghuo",name:"讯飞星火",url:"https://xinghuo.xfyun.cn",description:"科大讯飞出品，语音交互是核心优势。支持语音输入输出，适合需要语音交互的场景。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["讯飞","语音交互","中文"],featured:false,addedAt:"2026-04-01"},
  {id:"hunyuan",name:"腾讯混元",url:"https://hunyuan.tencent.com",description:"腾讯出品，深度整合微信生态。在社交场景和内容创作方面有独特优势，适合微信运营者。",logo:"",category:"对话AI",stage:1,pricing:free,tags:["腾讯","微信生态","社交"],featured:false,addedAt:"2026-04-01"},
  {id:"gemini",name:"Gemini",url:"https://gemini.google.com",description:"Google出品，原生多模态。2M超长上下文，深度整合Google全家桶（Gmail/Drive/YouTube/地图）。",logo:"",category:"对话AI",stage:2,pricing:fp,tags:["Google","多模态","2M上下文"],featured:false,addedAt:"2026-04-01"},
  {id:"grok",name:"Grok",url:"https://grok.com",description:"xAI（马斯克）出品，风格幽默直接，实时获取X（Twitter）数据。适合关注实时热点和社交媒体的用户。",logo:"",category:"对话AI",stage:2,pricing:fp,tags:["马斯克","实时数据","幽默"],featured:false,addedAt:"2026-04-01"},
  {id:"character-ai",name:"Character.AI",url:"https://character.ai",description:"创建和对话AI角色的平台。你可以跟任何虚构或真实的角色聊天，适合娱乐、语言学习和创意写作。",logo:"",category:"对话AI",stage:1,pricing:fp,tags:["角色扮演","娱乐","创意"],featured:false,addedAt:"2026-04-01"},
  {id:"poe",name:"Poe",url:"https://poe.com",description:"一站式聚合多个AI模型（GPT/Claude/Gemini/DALL-E等），一个平台切换不同模型，方便对比和选择。",logo:"",category:"对话AI",stage:2,pricing:fp,tags:["聚合","多模型","对比"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 绘图 ============
  {id:"midjourney",name:"Midjourney",url:"https://www.midjourney.com",description:"AI绘画标杆，图像艺术品质顶级。通过Discord使用，需学习提示词技巧。V7版本画质再上新台阶。",logo:"",category:"AI绘图",stage:2,pricing:paid,tags:["艺术品质","Discord","标杆"],featured:true,addedAt:"2026-01-01"},
  {id:"dalle",name:"DALL·E 3",url:"https://openai.com/dall-e-3",description:"OpenAI出品，与ChatGPT深度整合。文字渲染能力极强，可以直接在对话中生成和修改图片。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["OpenAI","文字渲染","ChatGPT集成"],featured:true,addedAt:"2026-04-01"},
  {id:"jimeng",name:"即梦",url:"https://jimeng.jianying.com",description:"字节出品，中文提示词理解好，出图快。支持文生图和图生图，有免费额度，国内最易上手的AI绘图。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["中文友好","易上手","免费额度"],featured:true,addedAt:"2026-01-01"},
  {id:"stable-diffusion",name:"Stable Diffusion",url:"https://stability.ai",description:"开源AI绘画模型，可本地部署无审查。ComfyUI节点式工作流极灵活，社区生态全球最丰富。",logo:"",category:"AI绘图",stage:4,pricing:free,tags:["开源","本地部署","可定制","无审查"],featured:false,addedAt:"2026-01-01"},
  {id:"leonardo",name:"Leonardo AI",url:"https://leonardo.ai",description:"专注游戏和设计领域的AI绘图，内置海量模型和风格模板。适合游戏资产、角色设计和概念艺术。",logo:"",category:"AI绘图",stage:3,pricing:quota,tags:["游戏资产","设计","模板丰富"],featured:false,addedAt:"2026-04-01"},
  {id:"ideogram",name:"Ideogram",url:"https://ideogram.ai",description:"文字渲染最强的AI绘图工具，可以把文字准确渲染到图片中。适合做logo、海报、带文字的设计。",logo:"",category:"AI绘图",stage:2,pricing:quota,tags:["文字渲染","LOGO","海报"],featured:false,addedAt:"2026-04-01"},
  {id:"wanxiang",name:"通义万相",url:"https://tongyi.aliyun.com/wanxiang",description:"阿里出品，中文提示词理解好。支持文生图、图生图、风格迁移，通义千问生态一环。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["阿里出品","中文","风格迁移"],featured:false,addedAt:"2026-04-01"},
  {id:"seaart",name:"SeaArt",url:"https://www.seaart.ai",description:"国内用户量大的AI绘画平台，模型丰富，社区活跃。支持在线生图，有大量现成模板可一键使用。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["国内热门","模板多","社区"],featured:false,addedAt:"2026-04-01"},
  {id:"yige",name:"文心一格",url:"https://yige.baidu.com",description:"百度出品，中文理解和国风表现力强。对传统文化、国潮风格有独特的渲染能力。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["百度","国风","中文"],featured:false,addedAt:"2026-04-01"},
  {id:"pixai",name:"PixAI",url:"https://pixai.art",description:"专注动漫和二次元风格的AI绘画平台。内置大量动漫模型，可以生成高质量的动漫风格图片。",logo:"",category:"AI绘图",stage:1,pricing:quota,tags:["动漫","二次元","角色"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 视频 ============
  {id:"sora",name:"Sora",url:"https://sora.com",description:"OpenAI出品，从文字生成高质量视频，代表AI视频生成最高水平。支持文生视频和图生视频。",logo:"",category:"AI视频",stage:2,pricing:paid,tags:["OpenAI","高质量","文生视频"],featured:true,addedAt:"2026-03-01"},
  {id:"runway",name:"Runway",url:"https://runwayml.com",description:"专业AI视频编辑平台，文/图生视频、视频风格转换、动态笔刷。创意工作者的完整工具箱。",logo:"",category:"AI视频",stage:3,pricing:quota,tags:["视频编辑","创意","多模式"],featured:true,addedAt:"2026-01-01"},
  {id:"kling",name:"可灵",url:"https://kling.kuaishou.com",description:"快手出品，视频连贯性和画质突出。支持文生视频和图生视频，生成效果接近真实拍摄。",logo:"",category:"AI视频",stage:2,pricing:quota,tags:["快手出品","连贯性好","真实感"],featured:true,addedAt:"2026-01-01"},
  {id:"pika",name:"Pika",url:"https://pika.art",description:"轻量级AI视频生成工具，操作极简。适合快速生成短视频片段，支持多种风格和特效。",logo:"",category:"AI视频",stage:1,pricing:quota,tags:["轻量","快速","短视频"],featured:false,addedAt:"2026-04-01"},
  {id:"jianying-ai",name:"剪映AI（即梦视频）",url:"https://www.jianying.com",description:"剪映内置的AI视频功能，模板丰富操作简单。适合做短视频、口播视频、Vlog的新手。",logo:"",category:"AI视频",stage:1,pricing:free,tags:["剪映","模板","短视频","新手"],featured:false,addedAt:"2026-04-01"},
  {id:"heygen",name:"HeyGen",url:"https://www.heygen.com",description:"AI数字人视频生成，制作逼真的虚拟人讲解视频。支持多种语言，适合做产品介绍、培训视频。",logo:"",category:"AI视频",stage:3,pricing:quota,tags:["数字人","多语言","讲解视频"],featured:false,addedAt:"2026-04-01"},
  {id:"synthesia",name:"Synthesia",url:"https://www.synthesia.io",description:"企业级AI视频生成，140+AI主持人形象，支持120+语言。适合做企业培训、营销视频。",logo:"",category:"AI视频",stage:3,pricing:paid,tags:["企业级","多语言","数字人"],featured:false,addedAt:"2026-04-01"},
  {id:"invideo",name:"Invideo AI",url:"https://invideo.io",description:"输入文字脚本自动生成完整视频（画面+配音+字幕）。适合做YouTube/社交媒体内容。",logo:"",category:"AI视频",stage:2,pricing:quota,tags:["脚本生视频","全自动","自媒体"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 写作 ============
  {id:"notion-ai",name:"Notion AI",url:"https://www.notion.so/product/ai",description:"笔记中的AI写作助手，生成、改写、翻译、总结一站式。无缝融入日常笔记工作流。",logo:"",category:"AI写作",stage:2,pricing:paid,tags:["笔记集成","工作流","团队"],featured:false,addedAt:"2026-01-01"},
  {id:"xiezuocat",name:"秘塔写作猫",url:"https://xiezuocat.com",description:"中文AI写作标杆，文章续写、润色、纠错。对中文语感和语法有深度优化，适合各类写作场景。",logo:"",category:"AI写作",stage:2,pricing:fp,tags:["中文写作","润色","纠错"],featured:true,addedAt:"2026-01-01"},
  {id:"jasper",name:"Jasper",url:"https://www.jasper.ai",description:"海外最流行的AI写作工具之一，擅长营销文案、博客、社交媒体内容。品牌声音定制是核心特色。",logo:"",category:"AI写作",stage:3,pricing:paid,tags:["营销文案","品牌声音","海外热门"],featured:true,addedAt:"2026-04-01"},
  {id:"copyai",name:"Copy.ai",url:"https://www.copy.ai",description:"专注营销和销售文案的AI写作工具。内置海量模板，从广告语到销售邮件一键生成。",logo:"",category:"AI写作",stage:2,pricing:quota,tags:["营销文案","模板","销售"],featured:false,addedAt:"2026-04-01"},
  {id:"writesonic",name:"Writesonic",url:"https://writesonic.com",description:"全能AI写作平台，覆盖博客、广告、电商、SEO。内置AI搜索和事实核查功能。",logo:"",category:"AI写作",stage:2,pricing:quota,tags:["全能","SEO","电商"],featured:false,addedAt:"2026-04-01"},
  {id:"jenni",name:"Jenni AI",url:"https://jenni.ai",description:"专注学术写作的AI助手，论文写作、文献引用、查重。适合学生和研究者。",logo:"",category:"AI写作",stage:3,pricing:quota,tags:["学术","论文","引用"],featured:false,addedAt:"2026-04-01"},
  {id:"huoshan",name:"火山写作",url:"https://writing.volcengine.com",description:"字节出品的中文AI写作工具，支持全文润色、风格转换。针对公众号、小红书等平台优化。",logo:"",category:"AI写作",stage:1,pricing:free,tags:["字节出品","中文","自媒体"],featured:false,addedAt:"2026-04-01"},
  {id:"rytr",name:"Rytr",url:"https://rytr.me",description:"性价比极高的AI写作工具，支持30+语言和多种写作场景。操作简单，适合初学和预算有限的用户。",logo:"",category:"AI写作",stage:1,pricing:quota,tags:["性价比","多语言","简单"],featured:false,addedAt:"2026-04-01"},
  {id:"xunfei-aiwrite",name:"讯飞写作",url:"https://writing.xfyun.cn",description:"讯飞出品的AI写作工具，语音输入转文字后AI优化。适合口述写作、会议记录转文章等场景。",logo:"",category:"AI写作",stage:1,pricing:quota,tags:["讯飞","语音写作","记录转文章"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 编程 ============
  {id:"claude-code",name:"Claude Code",url:"https://claude.ai",description:"Anthropic出品的终端AI编程助手，可直接读写文件、管理Git、执行命令。目前最强CLI编程工具。",logo:"",category:"AI编程",stage:4,pricing:paid,tags:["CLI","终端","Git","Anthropic"],featured:true,addedAt:"2026-03-01"},
  {id:"cursor",name:"Cursor",url:"https://cursor.sh",description:"基于VS Code的AI编辑器，理解整个代码库，支持自然语言编程。最受开发者欢迎的AI编程工具。",logo:"",category:"AI编程",stage:4,pricing:fp,tags:["代码编辑","VS Code","人气最高"],featured:true,addedAt:"2026-01-01"},
  {id:"github-copilot",name:"GitHub Copilot",url:"https://github.com/features/copilot",description:"GitHub出品，深度集成各大IDE。实时代码补全、生成测试、解释代码，老牌可靠。",logo:"",category:"AI编程",stage:3,pricing:paid,tags:["GitHub","代码补全","多IDE"],featured:true,addedAt:"2026-01-01"},
  {id:"windsurf",name:"Windsurf",url:"https://codeium.com/windsurf",description:"Codeium出品的AI IDE，主打Agent模式——AI自主分析项目并执行多步编程任务，是Cursor的主要竞争者。",logo:"",category:"AI编程",stage:4,pricing:fp,tags:["Agent模式","AI IDE","自动编程"],featured:true,addedAt:"2026-04-01"},
  {id:"bolt",name:"Bolt.new",url:"https://bolt.new",description:"浏览器里用AI创建全栈应用，输入描述直接生成可运行的Web应用。适合快速原型和MVP验证。",logo:"",category:"AI编程",stage:3,pricing:quota,tags:["全栈生成","浏览器","原型"],featured:false,addedAt:"2026-04-01"},
  {id:"v0",name:"v0.dev",url:"https://v0.dev",description:"Vercel出品，用自然语言描述生成前端界面代码。生成的是生产级React/Tailwind代码，可直接使用。",logo:"",category:"AI编程",stage:3,pricing:quota,tags:["前端生成","React","Vercel"],featured:false,addedAt:"2026-04-01"},
  {id:"lovable",name:"Lovable",url:"https://lovable.dev",description:"AI全栈应用生成器，从描述到可部署应用。适合非程序员创建SaaS产品MVP，速度极快。",logo:"",category:"AI编程",stage:2,pricing:quota,tags:["全栈","SaaS","非程序员"],featured:false,addedAt:"2026-04-01"},
  {id:"cody",name:"Cody (Sourcegraph)",url:"https://sourcegraph.com/cody",description:"Sourcegraph出品，能理解整个代码仓库的AI编程助手。代码搜索+AI理解=强大的代码理解能力。",logo:"",category:"AI编程",stage:4,pricing:fp,tags:["代码理解","代码搜索","仓库级"],featured:false,addedAt:"2026-04-01"},
  {id:"replit-agent",name:"Replit Agent",url:"https://replit.com/ai",description:"Replit的AI编程助手，浏览器里写代码、部署、分享一站完成。适合初学者快速上手编程。",logo:"",category:"AI编程",stage:2,pricing:quota,tags:["在线IDE","初学者","一键部署"],featured:false,addedAt:"2026-04-01"},
  {id:"tabnine",name:"Tabnine",url:"https://www.tabnine.com",description:"老牌AI代码补全工具，支持本地模型运行。注重代码隐私和安全，适合企业环境。",logo:"",category:"AI编程",stage:3,pricing:fp,tags:["本地模型","隐私","企业"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 办公 ============
  {id:"gamma",name:"Gamma",url:"https://gamma.app",description:"AI PPT和文档生成工具，输入主题一键生成精美演示文稿。支持中英文，导出PDF/PPTX。",logo:"",category:"AI办公",stage:2,pricing:quota,tags:["PPT生成","一键","精美"],featured:true,addedAt:"2026-01-01"},
  {id:"feishu-ai",name:"飞书智能伙伴",url:"https://www.feishu.cn/product/ai",description:"飞书内置AI，在文档/表格/会议中直接使用。团队协作AI提效，无缝融入日常工作流。",logo:"",category:"AI办公",stage:2,pricing:free,tags:["飞书","团队","办公集成"],featured:false,addedAt:"2026-01-01"},
  {id:"beautiful-ai",name:"Beautiful.ai",url:"https://www.beautiful.ai",description:"智能PPT设计工具，拖拽式操作AI自动排版。不需要设计基础就能做出专业级演示文稿。",logo:"",category:"AI办公",stage:2,pricing:quota,tags:["PPT设计","自动排版","专业"],featured:false,addedAt:"2026-04-01"},
  {id:"otter",name:"Otter.ai",url:"https://otter.ai",description:"AI会议记录工具，实时转写、自动生成纪要、提取行动项。支持Zoom/Teams/Google Meet。",logo:"",category:"AI办公",stage:2,pricing:quota,tags:["会议记录","实时转写","纪要"],featured:false,addedAt:"2026-04-01"},
  {id:"fireflies",name:"Fireflies.ai",url:"https://fireflies.ai",description:"AI会议助手，自动加入会议并记录、转录、总结。支持搜索会议内容，跨平台同步。",logo:"",category:"AI办公",stage:2,pricing:quota,tags:["会议助手","自动加入","搜索"],featured:false,addedAt:"2026-04-01"},
  {id:"xunfei-tingjian",name:"讯飞听见",url:"https://www.iflyrec.com",description:"科大讯飞出品的语音转文字工具，中文识别准确率最高。支持实时转写、录音转文字、字幕制作。",logo:"",category:"AI办公",stage:1,pricing:quota,tags:["讯飞","语音转文字","中文最佳"],featured:false,addedAt:"2026-04-01"},
  {id:"qianwen-ppt",name:"AiPPT",url:"https://www.aippt.cn",description:"国产AI PPT生成工具，输入主题自动生成完整PPT。中文模板丰富，支持在线编辑。",logo:"",category:"AI办公",stage:1,pricing:quota,tags:["PPT","国产","中文模板"],featured:false,addedAt:"2026-04-01"},
  {id:"motion",name:"Motion",url:"https://www.usemotion.com",description:"AI日程管理，自动规划每日任务安排。根据优先级和截止日期智能调度，大幅提升时间管理效率。",logo:"",category:"AI办公",stage:3,pricing:paid,tags:["日程管理","自动规划","时间管理"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 搜索 ============
  {id:"perplexity",name:"Perplexity",url:"https://www.perplexity.ai",description:"AI搜索引擎标杆，对话式搜索带完整引用。Pro版支持深度研究和多步推理搜索。",logo:"",category:"AI搜索",stage:1,pricing:fp,tags:["AI搜索","引用","深度研究"],featured:true,addedAt:"2026-01-01"},
  {id:"metaso",name:"秘塔AI搜索",url:"https://metaso.cn",description:"国内最佳AI搜索，学术搜索和深度研究模式出色。回答质量高，有明确来源引用。",logo:"",category:"AI搜索",stage:1,pricing:free,tags:["中文搜索","学术","国产最佳"],featured:true,addedAt:"2026-01-01"},
  {id:"google-ai",name:"Google AI Overview",url:"https://www.google.com",description:"Google搜索内置的AI总结功能，搜索结果页顶部直接展示AI生成的综合答案，覆盖全球信息。",logo:"",category:"AI搜索",stage:1,pricing:free,tags:["Google","搜索结果","全球"],featured:false,addedAt:"2026-04-01"},
  {id:"copilot-search",name:"Microsoft Copilot",url:"https://copilot.microsoft.com",description:"微软AI搜索，整合GPT和Bing搜索。免费使用GPT模型，支持对话式搜索和图片生成。",logo:"",category:"AI搜索",stage:1,pricing:free,tags:["微软","GPT免费","Bing"],featured:false,addedAt:"2026-04-01"},
  {id:"devv",name:"Devv",url:"https://devv.ai",description:"面向程序员的AI搜索引擎，专为代码和技术问题优化。搜索结果偏向GitHub/Stack Overflow等技术社区。",logo:"",category:"AI搜索",stage:4,pricing:fp,tags:["程序员","技术","代码搜索"],featured:false,addedAt:"2026-04-01"},
  {id:"tiangong",name:"天工AI搜索",url:"https://www.tiangong.cn",description:"昆仑万维出品，国内首个AI搜索产品。支持多轮对话式深度搜索，覆盖新闻、学术、生活等场景。",logo:"",category:"AI搜索",stage:1,pricing:free,tags:["国产","多轮搜索","昆仑万维"],featured:false,addedAt:"2026-04-01"},

  // ============ Agent 平台 ============
  {id:"dify",name:"Dify",url:"https://dify.ai",description:"最适合新手入门的Agent平台。拖拽式零代码构建AI应用，内置RAG和工作流。3天上线第一个Agent。",logo:"",category:"Agent平台",stage:5,pricing:fp,tags:["零代码","新手首选","RAG"],featured:true,addedAt:"2026-01-01"},
  {id:"openclaw",name:"OpenClaw（龙虾）",url:"https://github.com/openclaw/openclaw",description:"2026最火开源Agent框架，GitHub 24万+星。可接管电脑执行任务，对接12+通讯平台，13000+技能包。",logo:"",category:"Agent平台",stage:6,pricing:free,tags:["开源","GitHub顶流","多平台","技能市场"],featured:true,addedAt:"2026-02-01"},
  {id:"hermes",name:"Hermes Agent",url:"https://github.com/NousResearch/hermes-agent",description:"Nous Research 开源的Agent框架，GitHub 4.7万星。持久记忆+自我学习（从任务中自动生成可复用技能）+ 16+平台消息网关。一条命令安装，零配置上手。",logo:"",category:"Agent平台",stage:6,pricing:free,tags:["开源","自我进化","16+平台","一键安装"],featured:true,addedAt:"2026-04-01"},
  {id:"qclaw",name:"QClaw 小龙虾",url:"https://qclaw.qq.com",description:"腾讯出品，基于OpenClaw的本地化AI助手。下载安装包→双击→微信扫码→搞定。内置Kimi/GLM-5/DeepSeek等国产模型，5000+技能开箱即用，支持微信远程操控电脑。最适合新手入门的桌面Agent。",logo:"",category:"Agent平台",stage:5,pricing:free,tags:["腾讯","零门槛","微信操控","国产模型","新手首选"],featured:true,addedAt:"2026-04-15"},
  {id:"coze",name:"Coze 扣子",url:"https://www.coze.cn",description:"字节出品，可视化编排Agent，支持发布到飞书/微信/抖音。插件市场丰富，社区活跃。",logo:"",category:"Agent平台",stage:5,pricing:free,tags:["字节出品","多平台发布","插件"],featured:true,addedAt:"2026-01-01"},
  {id:"n8n",name:"n8n",url:"https://n8n.io",description:"开源工作流自动化，连接400+应用。可视化编排复杂自动化流程，可自部署保证数据隐私。",logo:"",category:"Agent平台",stage:6,pricing:fp,tags:["开源","自部署","400+集成"],featured:false,addedAt:"2026-02-01"},
  {id:"flowise",name:"Flowise",url:"https://flowiseai.com",description:"开源低代码LLM应用构建器，基于LangChain。节点式拖拽构建RAG管道和Agent，适合想深入原理的用户。",logo:"",category:"Agent平台",stage:6,pricing:free,tags:["开源","LangChain","节点式"],featured:false,addedAt:"2026-01-01"},
  {id:"zhipu-agent",name:"智谱清言 Agent",url:"https://open.bigmodel.cn",description:"智谱AI的Agent平台，基于GLM系列模型。提供API和可视化工具，适合企业级应用。",logo:"",category:"Agent平台",stage:5,pricing:quota,tags:["智谱","GLM","企业级"],featured:false,addedAt:"2026-02-01"},
  {id:"make",name:"Make (Integromat)",url:"https://www.make.com",description:"强大的自动化集成平台，可视化连接2000+应用。配合AI模块构建跨平台自动化工作流。",logo:"",category:"Agent平台",stage:6,pricing:fp,tags:["自动化","2000+应用","可视化"],featured:false,addedAt:"2026-01-01"},
  {id:"wenxin-agent",name:"文心智能体",url:"https://agents.baidu.com",description:"百度出品，基于文心大模型的Agent平台。零代码创建智能体，可发布到百度搜索等渠道。",logo:"",category:"Agent平台",stage:5,pricing:free,tags:["百度","文心","零代码"],featured:false,addedAt:"2026-04-01"},

  // ============ 模型平台 ============
  {id:"huggingface",name:"Hugging Face",url:"https://huggingface.co",description:"AI界的GitHub，数十万开源模型和数据集。免费体验各种模型Demo，AI开发者的必备平台。",logo:"",category:"模型平台",stage:4,pricing:fp,tags:["开源模型","社区","AI GitHub"],featured:true,addedAt:"2026-01-01"},
  {id:"modelscope",name:"ModelScope 魔搭",url:"https://modelscope.cn",description:"阿里AI模型社区，中文友好。汇集国内外开源模型，支持在线体验和一键部署。",logo:"",category:"模型平台",stage:4,pricing:free,tags:["阿里","中文","在线体验"],featured:false,addedAt:"2026-01-01"},
  {id:"replicate",name:"Replicate",url:"https://replicate.com",description:"云端运行开源AI模型，一行代码调用。不需要GPU，按使用量付费，适合快速测试和集成模型。",logo:"",category:"模型平台",stage:4,pricing:quota,tags:["云端运行","一行代码","按量付费"],featured:false,addedAt:"2026-04-01"},
  {id:"ollama",name:"Ollama",url:"https://ollama.com",description:"本地运行开源大模型的工具。一条命令下载和运行Llama/DeepSeek/Qwen等模型，保护数据隐私。",logo:"",category:"模型平台",stage:4,pricing:free,tags:["本地运行","一条命令","隐私"],featured:false,addedAt:"2026-04-01"},
  {id:"groq",name:"Groq",url:"https://groq.com",description:"最快的AI推理平台，基于自研LPU芯片。免费提供Llama/DeepSeek等开源模型的极速API。",logo:"",category:"模型平台",stage:4,pricing:quota,tags:["极速推理","LPU","免费API"],featured:false,addedAt:"2026-04-01"},
  {id:"siliconflow",name:"硅基流动",url:"https://siliconflow.cn",description:"国内一站式模型API平台，聚合DeepSeek/Qwen/Llama等主流开源模型。中文友好，价格便宜。",logo:"",category:"模型平台",stage:4,pricing:quota,tags:["国产","模型聚合","便宜"],featured:false,addedAt:"2026-04-01"},
  {id:"openrouter",name:"OpenRouter",url:"https://openrouter.ai",description:"统一API网关，一个接口调用200+模型。自动路由选择最优模型，方便对比不同模型的效果。",logo:"",category:"模型平台",stage:4,pricing:quota,tags:["API网关","200+模型","自动路由"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 音频 ============
  {id:"suno",name:"Suno",url:"https://suno.com",description:"AI音乐生成标杆，输入歌词和风格一键生成完整歌曲。V4版本音质大幅提升，接近专业水准。",logo:"",category:"AI音频",stage:2,pricing:quota,tags:["音乐生成","歌词","V4"],featured:true,addedAt:"2026-04-01"},
  {id:"udio",name:"Udio",url:"https://www.udio.com",description:"Suno的主要竞品，音质和音乐性各有千秋。支持更复杂的音乐结构和更长时长。",logo:"",category:"AI音频",stage:3,pricing:quota,tags:["音乐生成","音质好","长时长"],featured:true,addedAt:"2026-04-01"},
  {id:"elevenlabs",name:"ElevenLabs",url:"https://elevenlabs.io",description:"最逼真的AI语音合成，支持29种语言。可克隆声音、生成有声书、配音，声音质量接近真人。",logo:"",category:"AI音频",stage:2,pricing:quota,tags:["语音合成","声音克隆","多语言"],featured:true,addedAt:"2026-04-01"},
  {id:"notebynote",name:"网易天音",url:"https://tianyin.music.163.com",description:"网易出品的一站式AI音乐创作工具，输入灵感即可生成完整编曲。适合视频创作者和音乐爱好者。",logo:"",category:"AI音频",stage:1,pricing:quota,tags:["网易","音乐创作","一站式"],featured:false,addedAt:"2026-04-01"},
  {id:"aiva",name:"AIVA",url:"https://www.aiva.ai",description:"AI古典音乐和影视配乐生成，支持250+风格。适合游戏、影视、广告等专业配乐场景。",logo:"",category:"AI音频",stage:3,pricing:quota,tags:["配乐","古典","影视"],featured:false,addedAt:"2026-04-01"},
  {id:"mubert",name:"Mubert",url:"https://mubert.com",description:"AI实时生成免版权背景音乐。输入场景/心情/风格即可生成，适合视频、直播、播客的背景音乐。",logo:"",category:"AI音频",stage:1,pricing:quota,tags:["背景音乐","免版权","实时"],featured:false,addedAt:"2026-04-01"},
  {id:"haimian",name:"海绵语音",url:"https://haimian.ai",description:"国内AI语音合成工具，中文语音质量高。支持多种主播音色，适合做有声内容、视频配音。",logo:"",category:"AI音频",stage:1,pricing:quota,tags:["国产","中文语音","配音"],featured:false,addedAt:"2026-04-01"},
  {id:"descript",name:"Descript",url:"https://www.descript.com",description:"AI音视频编辑器，像编辑文档一样编辑音视频。支持AI配音、去口癖、降噪等。",logo:"",category:"AI音频",stage:3,pricing:quota,tags:["音频编辑","视频编辑","文档式"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 设计 ============
  {id:"canva-ai",name:"Canva AI",url:"https://www.canva.com/ai",description:"Canva内置AI设计功能，文字生图、智能抠图、魔术橡皮擦、自动排版。设计师和非设计师都在用。",logo:"",category:"AI设计",stage:1,pricing:fp,tags:["设计平台","AI修图","模板"],featured:true,addedAt:"2026-04-01"},
  {id:"figma-ai",name:"Figma AI",url:"https://www.figma.com/ai",description:"Figma内置AI功能，自动生成设计稿、填充内容、一键替换风格。UI设计师的效率倍增器。",logo:"",category:"AI设计",stage:4,pricing:fp,tags:["UI设计","自动生成","专业"],featured:false,addedAt:"2026-04-01"},
  {id:"galileo",name:"Galileo AI",url:"https://www.usegalileo.ai",description:"文字描述生成完整UI设计稿。输入需求自动生成高保真设计，适合产品经理和创业者快速原型。",logo:"",category:"AI设计",stage:2,pricing:quota,tags:["UI生成","描述生成","原型"],featured:false,addedAt:"2026-04-01"},
  {id:"uizard",name:"Uizard",url:"https://uizard.io",description:"AI UI设计工具，手绘草图转设计稿、截图转设计。适合不会用Figma的产品经理。",logo:"",category:"AI设计",stage:2,pricing:quota,tags:["草图转设计","截图转设计","PM友好"],featured:false,addedAt:"2026-04-01"},
  {id:"removebg",name:"Remove.bg",url:"https://www.remove.bg",description:"一键AI抠图，上传图片自动去除背景。速度快精度高，支持批量处理，是最常用的AI图像工具之一。",logo:"",category:"AI设计",stage:1,pricing:quota,tags:["抠图","一键","批量"],featured:false,addedAt:"2026-04-01"},
  {id:"clipdrop",name:"Clipdrop",url:"https://clipdrop.co",description:"AI图像处理套件，背景替换、物体移除、图片放大、光照调整。功能全面且操作简单。",logo:"",category:"AI设计",stage:1,pricing:quota,tags:["图像处理","套件","简单"],featured:false,addedAt:"2026-04-01"},
  {id:"jiaojian",name:"稿定AI",url:"https://www.gaoding.com/ai",description:"国内AI设计平台，智能抠图、AI商品图、AI消除。电商和营销设计场景优化。",logo:"",category:"AI设计",stage:1,pricing:quota,tags:["国产","电商设计","营销"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 营销 ============
  {id:"yizhuan",name:"易撰",url:"https://www.yizhuan.com",description:"AI新媒体内容创作工具，公众号/头条/百家号多平台适配。热点追踪+AI写作，自媒体必备。",logo:"",category:"AI营销",stage:3,pricing:quota,tags:["自媒体","多平台","热点"],featured:false,addedAt:"2026-04-01"},
  {id:"shuodong",name:"数说故事",url:"https://www.datastory.com.cn",description:"AI消费者洞察和社媒分析平台，品牌舆情监控、竞品分析、趋势发现。适合品牌方和营销团队。",logo:"",category:"AI营销",stage:4,pricing:paid,tags:["品牌","舆情","竞品分析"],featured:false,addedAt:"2026-04-01"},
  {id:"adcreative",name:"AdCreative.ai",url:"https://www.adcreative.ai",description:"AI广告创意生成，一键生成多种尺寸和风格的广告素材。数据驱动优化，提升广告转化率。",logo:"",category:"AI营销",stage:3,pricing:quota,tags:["广告创意","多尺寸","转化优化"],featured:false,addedAt:"2026-04-01"},
  {id:"seowriting",name:"SEO Writing AI",url:"https://seowriting.ai",description:"AI SEO文章写作，一键生成SEO友好的长文。自动优化关键词、标题和结构，支持多语言。",logo:"",category:"AI营销",stage:3,pricing:quota,tags:["SEO","长文","多语言"],featured:false,addedAt:"2026-04-01"},
  {id:"chati",name:"Chati",url:"https://chati.ai",description:"中文AI短视频脚本生成，输入产品/主题一键生成抖音/小红书/视频号脚本。适合短视频创作者。",logo:"",category:"AI营销",stage:1,pricing:quota,tags:["短视频","脚本","国产"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 数据 ============
  {id:"julius",name:"Julius AI",url:"https://julius.ai",description:"对话式数据分析工具，上传数据用自然语言提问。自动生成图表和统计报告，适合不懂代码的数据分析师。",logo:"",category:"AI数据",stage:2,pricing:quota,tags:["数据分析","对话式","图表"],featured:true,addedAt:"2026-04-01"},
  {id:"chatcsv",name:"ChatCSV",url:"https://www.chatcsv.co",description:"上传CSV用聊天方式分析数据。问趋势、做统计、画图表，无需Excel公式和编程。",logo:"",category:"AI数据",stage:1,pricing:free,tags:["CSV","聊天分析","免费"],featured:false,addedAt:"2026-04-01"},
  {id:"chatexcel",name:"酷表ChatExcel",url:"https://www.chatexcel.com",description:"北大团队出品，用对话操控Excel表格。输入自然语言指令自动完成数据处理、筛选、统计。",logo:"",category:"AI数据",stage:1,pricing:free,tags:["Excel","北大","对话操控"],featured:false,addedAt:"2026-04-01"},
  {id:"tomoro",name:"Tomoro",url:"https://www.tomoro.ai",description:"AI电子表格，融合了AI能力的新一代表格工具。自然语言查询、自动分析、智能图表。",logo:"",category:"AI数据",stage:2,pricing:quota,tags:["电子表格","AI原生","智能"],featured:false,addedAt:"2026-04-01"},
  {id:"nanonets",name:"Nanonets",url:"https://nanonets.com",description:"AI OCR和数据提取，从发票、合同、表格等文档中自动提取结构化数据。适合财务和行政自动化。",logo:"",category:"AI数据",stage:4,pricing:quota,tags:["OCR","文档提取","财务"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 学习 ============
  {id:"waytoagi",name:"通往AGI之路",url:"https://waytoagi.com",description:"优质中文AI学习社区，汇集AI教程、工具评测和实践案例。中文AI学习者的核心资源站。",logo:"",category:"AI学习",stage:0,pricing:free,tags:["学习社区","中文","教程","案例"],featured:true,addedAt:"2026-01-01"},
  {id:"ai-bot-cn",name:"AI工具集",url:"https://ai-bot.cn",description:"国内最大AI工具导航站之一，700+工具分类清晰更新及时。适合泛览AI工具生态。",logo:"",category:"AI学习",stage:0,pricing:free,tags:["工具导航","中文","入口"],featured:false,addedAt:"2026-01-01"},
  {id:"fastai",name:"fast.ai",url:"https://www.fast.ai",description:"全球最受欢迎的免费AI课程，从零基础教深度学习。强调实践和可接近性，不需要数学博士。",logo:"",category:"AI学习",stage:0,pricing:free,tags:["免费课程","深度学习","零基础"],featured:false,addedAt:"2026-04-01"},
  {id:"datawhale",name:"Datawhale",url:"https://datawhale.club",description:"国内最大的AI开源学习社区，免费学习路线图+组队学习。从Python到机器学习到Agent全覆盖。",logo:"",category:"AI学习",stage:0,pricing:free,tags:["国内","开源","组队学习"],featured:false,addedAt:"2026-04-01"},
  {id:"aistudio",name:"百度AI Studio",url:"https://aistudio.baidu.com",description:"百度AI学习平台，免费GPU算力。大量课程和实训项目，从入门到竞赛一站式。",logo:"",category:"AI学习",stage:0,pricing:free,tags:["百度","免费GPU","实训"],featured:false,addedAt:"2026-04-01"},
  {id:"aliyun-ai",name:"阿里云AI社区",url:"https://developer.aliyun.com/ai",description:"阿里云AI开发者社区，技术文档、最佳实践、模型体验。适合有一定基础后深入学习。",logo:"",category:"AI学习",stage:4,pricing:free,tags:["阿里云","开发者","技术文档"],featured:false,addedAt:"2026-04-01"},

  // ============ AI 效率 ============
  {id:"mem",name:"Mem",url:"https://get.mem.ai",description:"AI驱动的个人知识管理工具，自动整理笔记并建立关联。AI理解你的知识网络，帮你找到遗忘的信息。",logo:"",category:"AI效率",stage:3,pricing:quota,tags:["知识管理","自动整理","AI搜"],featured:false,addedAt:"2026-04-01"},
  {id:"taskade",name:"Taskade",url:"https://www.taskade.com",description:"AI项目管理+思维导图+笔记，集多种效率工具于一体。AI自动生成任务清单和项目计划。",logo:"",category:"AI效率",stage:2,pricing:quota,tags:["项目管理","思维导图","一体化"],featured:false,addedAt:"2026-04-01"},
  {id:"sanebox",name:"SaneBox",url:"https://www.sanebox.com",description:"AI邮件管理，自动分类重要邮件、过滤垃圾、定时提醒。学习你的邮件习惯，越来越精准。",logo:"",category:"AI效率",stage:2,pricing:paid,tags:["邮件管理","自动分类","学习习惯"],featured:false,addedAt:"2026-04-01"},
  {id:"tldv",name:"tl;dv",url:"https://tldv.io",description:"AI会议记录+回放，记录Google Meet/Zoom/Teams会议。AI生成时间戳笔记和摘要，可搜索任意时刻的发言。",logo:"",category:"AI效率",stage:2,pricing:quota,tags:["会议记录","回放","搜索"],featured:false,addedAt:"2026-04-01"},
  {id:"rewind",name:"Rewind",url:"https://www.rewind.ai",description:"AI第二大脑，记录你在电脑上看到和做的一切。可搜索你浏览过的任何网页、说过的话。",logo:"",category:"AI效率",stage:4,pricing:paid,tags:["第二大脑","全记录","搜索"],featured:false,addedAt:"2026-04-01"},
  {id:"monica",name:"Monica",url:"https://monica.im",description:"全能AI浏览器助手，侧边栏集成ChatGPT/Claude。在任何网页上一键总结、翻译、改写，阅读效率翻倍。",logo:"",category:"AI效率",stage:2,pricing:fp,tags:["浏览器","侧边栏","阅读"],featured:false,addedAt:"2026-04-01"},
]
