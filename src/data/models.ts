export interface Model {
  id: string; name: string; provider: string; type: "API"|"本地"
  category: "对话"|"编程"|"绘图"|"视频"|"音频"|"嵌入"
  rank: number; pricing: string; contextWindow: string
  speed: "极快"|"快"|"中等"|"慢"
  description: string; url: string; tags: string[]
}

export const models:Model[]=[
  // ===== API 模型 =====
  {id:"gpt5",name:"GPT-5",provider:"OpenAI",type:"API",category:"对话",rank:1,pricing:"$15/1M tokens",contextWindow:"256K",speed:"极快",description:"当前综合最强的商用模型，多步推理和工具调用能力顶尖。适合复杂任务和Agent控制中枢。",url:"https://platform.openai.com",tags:["最强","推理","Agent"]},
  {id:"claude4",name:"Claude 4 Sonnet",provider:"Anthropic",type:"API",category:"对话",rank:2,pricing:"$8/1M tokens",contextWindow:"200K",speed:"极快",description:"编程和写作表现顶级，安全性好。适合对输出质量有高要求的场景。",url:"https://console.anthropic.com",tags:["编程","安全","写作"]},
  {id:"claude4-opus",name:"Claude 4 Opus",provider:"Anthropic",type:"API",category:"对话",rank:3,pricing:"$45/1M tokens",contextWindow:"200K",speed:"快",description:"Anthropic最强模型，复杂推理和多步Agent任务表现超群。适合需要深度思考的任务。",url:"https://console.anthropic.com",tags:["最强","深度","Agent"]},
  {id:"deepseek-v3",name:"DeepSeek V3",provider:"DeepSeek",type:"API",category:"对话",rank:4,pricing:"¥1/1M tokens",contextWindow:"128K",speed:"极快",description:"国产最强API模型，性价比无敌。日常对话和Agent任务完全够用，价格只有GPT的1/15。",url:"https://platform.deepseek.com",tags:["国产","性价比","推荐"]},
  {id:"deepseek-r1",name:"DeepSeek R1",provider:"DeepSeek",type:"API",category:"编程",rank:5,pricing:"¥4/1M tokens",contextWindow:"128K",speed:"中等",description:"开源推理之王，数学和编程能力对标GPT-5。适合复杂逻辑推理和代码生成。",url:"https://platform.deepseek.com",tags:["推理","数学","开源"]},
  {id:"qwen-max",name:"通义千问 Max",provider:"阿里",type:"API",category:"对话",rank:6,pricing:"¥20/1M tokens",contextWindow:"128K",speed:"快",description:"国内综合能力最强的商用模型之一，中文理解优秀。适合企业级应用。",url:"https://dashscope.aliyun.com",tags:["国产","中文","企业"]},
  {id:"qwen-coder",name:"Qwen Coder",provider:"阿里",type:"API",category:"编程",rank:7,pricing:"¥4/1M tokens",contextWindow:"128K",speed:"极快",description:"通义千问专用编程模型，代码生成能力顶尖。速度和效果平衡好，推荐日常编码。",url:"https://dashscope.aliyun.com",tags:["编程","快","国产"]},
  {id:"gemini25",name:"Gemini 2.5 Pro",provider:"Google",type:"API",category:"对话",rank:8,pricing:"$3.5/1M tokens",contextWindow:"2000K",speed:"快",description:"200万token超长上下文，原生多模态。适合需要处理海量文档和跨模态分析场景。",url:"https://ai.google.dev",tags:["超长","多模态","Google"]},
  {id:"glm5",name:"GLM-5",provider:"智谱",type:"API",category:"对话",rank:9,pricing:"¥10/1M tokens",contextWindow:"256K",speed:"快",description:"智谱最新旗舰，多Agent协作和企业级应用表现优秀。中文场景适配好。",url:"https://open.bigmodel.cn",tags:["国产","企业","多Agent"]},
  {id:"kimi-k2",name:"Kimi K2.5",provider:"月之暗面",type:"API",category:"对话",rank:10,pricing:"¥12/1M tokens",contextWindow:"2000K",speed:"快",description:"200万字超长上下文，中文理解顶级。适合长文档分析和知识库问答。",url:"https://platform.moonshot.cn",tags:["超长","中文","文档"]},
  {id:"minimax-m2",name:"MiniMax M2.5",provider:"MiniMax",type:"API",category:"对话",rank:11,pricing:"¥8/1M tokens",contextWindow:"128K",speed:"极快",description:"多模态能力强，图文理解好。适合内容创作和多媒体处理场景。",url:"https://www.minimaxi.com",tags:["多模态","内容","快"]},
  {id:"yi-vision",name:"Yi Vision",provider:"零一万物",type:"API",category:"对话",rank:12,pricing:"¥6/1M tokens",contextWindow:"128K",speed:"快",description:"多模态理解优秀，中文视觉问答能力强。适合需要图文理解的场景。",url:"https://platform.lingyiwanwu.com",tags:["多模态","视觉","中文"]},
  {id:"moonshot-v1",name:"Moonshot V1",provider:"月之暗面",type:"API",category:"嵌入",rank:13,pricing:"¥0.5/1M tokens",contextWindow:"8K",speed:"极快",description:"中文嵌入模型，向量化效果好。适合知识库检索和语义搜索。",url:"https://platform.moonshot.cn",tags:["嵌入","向量","检索"]},
  {id:"dalle3",name:"DALL·E 3",provider:"OpenAI",type:"API",category:"绘图",rank:14,pricing:"$0.04/image",contextWindow:"-",speed:"快",description:"OpenAI绘图模型，文字渲染能力最强。准确理解和呈现复杂文字描述。",url:"https://platform.openai.com",tags:["绘图","文字渲染","OpenAI"]},
  {id:"sora-turbo",name:"Sora Turbo",provider:"OpenAI",type:"API",category:"视频",rank:15,pricing:"$0.50/video",contextWindow:"-",speed:"中等",description:"文字生视频模型标杆，画质和连贯性顶级。适合高质量视频生成场景。",url:"https://sora.com",tags:["视频","高质量","生成"]},
  {id:"suno-v4",name:"Suno V4",provider:"Suno",type:"API",category:"音频",rank:16,pricing:"$0.03/song",contextWindow:"-",speed:"快",description:"AI音乐生成标杆，V4音质大幅提升。支持多种音乐风格和歌词创作。",url:"https://suno.com",tags:["音乐","创作","高质量"]},
  {id:"elevenlabs-tts",name:"ElevenLabs TTS",provider:"ElevenLabs",type:"API",category:"音频",rank:17,pricing:"$0.015/1K chars",contextWindow:"-",speed:"极快",description:"最逼真的AI语音合成，支持29种语言和声音克隆。语音质量接近真人。",url:"https://elevenlabs.io",tags:["语音","克隆","多语言"]},
  // ===== 本地部署模型 =====
  {id:"deepseek-r1-local",name:"DeepSeek R1 32B",provider:"DeepSeek",type:"本地",category:"编程",rank:1,pricing:"免费",contextWindow:"128K",speed:"快",description:"本地最强推理模型，32B版本在24GB显存可跑。编程和数学能力远超同体积模型。",url:"https://ollama.com/library/deepseek-r1",tags:["推理","编程","开源最强"]},
  {id:"qwen3-local",name:"Qwen3 235B",provider:"阿里",type:"本地",category:"对话",rank:2,pricing:"免费",contextWindow:"128K",speed:"慢",description:"开源最大模型之一，综合能力接近GPT-4。需要大显存（多卡），适合企业本地部署。",url:"https://ollama.com/library/qwen3",tags:["最大","开源","企业"]},
  {id:"qwen3-72b",name:"Qwen3 72B",provider:"阿里",type:"本地",category:"对话",rank:3,pricing:"免费",contextWindow:"128K",speed:"中等",description:"72B版本在单卡48GB或双卡24GB可跑，中文能力极强。推荐有高端显卡的用户。",url:"https://ollama.com/library/qwen3",tags:["中文","开源","推荐"]},
  {id:"qwen3-32b",name:"Qwen3 32B",provider:"阿里",type:"本地",category:"对话",rank:4,pricing:"免费",contextWindow:"128K",speed:"快",description:"32B是性能和速度的最佳平衡点。24GB显存可跑，中文对话和编程表现优秀。强烈推荐。",url:"https://ollama.com/library/qwen3",tags:["平衡","中文","推荐"]},
  {id:"qwen3-14b",name:"Qwen3 14B",provider:"阿里",type:"本地",category:"对话",rank:5,pricing:"免费",contextWindow:"128K",speed:"极快",description:"14B版本16GB内存即可运行。日常问答足够用，适合普通电脑用户。",url:"https://ollama.com/library/qwen3",tags:["轻量","简易","推荐"]},
  {id:"qwen3-7b",name:"Qwen3 7B",provider:"阿里",type:"本地",category:"对话",rank:6,pricing:"免费",contextWindow:"128K",speed:"极快",description:"7B版本8GB内存可跑，速度快。适合老电脑和树莓派等低配设备。",url:"https://ollama.com/library/qwen3",tags:["最小","低配","快速"]},
  {id:"llama4",name:"Llama 4 70B",provider:"Meta",type:"本地",category:"对话",rank:7,pricing:"免费",contextWindow:"128K",speed:"中等",description:"Meta最强开源模型，英文能力顶级。建议搭配qwen做中英文互补。",url:"https://ollama.com/library/llama4",tags:["英文","Meta","开源"]},
  {id:"codestral",name:"Codestral 22B",provider:"Mistral",type:"本地",category:"编程",rank:8,pricing:"免费",contextWindow:"32K",speed:"极快",description:"专为编程优化的开源模型，代码补全和生成速度快。适合IDE集成和日常编码。",url:"https://ollama.com/library/codestral",tags:["编程","快速","IDE"]},
  {id:"phi4",name:"Phi-4 14B",provider:"微软",type:"本地",category:"对话",rank:9,pricing:"免费",contextWindow:"16K",speed:"极快",description:"微软小模型，推理能力强得惊人。14B体积接近70B水平，性价比极高。",url:"https://ollama.com/library/phi4",tags:["小体积","推理","微软"]},
  {id:"gemma3",name:"Gemma 3 27B",provider:"Google",type:"本地",category:"对话",rank:10,pricing:"免费",contextWindow:"128K",speed:"快",description:"Google开源模型，多语言支持好。27B版本在单卡24GB可跑，适合多语言场景。",url:"https://ollama.com/library/gemma3",tags:["Google","多语言","开源"]},
  {id:"stable-diffusion-xl",name:"SDXL Turbo",provider:"Stability AI",type:"本地",category:"绘图",rank:11,pricing:"免费",contextWindow:"-",speed:"极快",description:"实时AI绘图，一步生成高质量图片。ComfyUI集成，8GB显存可流畅运行。",url:"https://huggingface.co/stabilityai",tags:["绘图","实时","ComfyUI"]},
  {id:"stable-diffusion-3",name:"SD3 Medium",provider:"Stability AI",type:"本地",category:"绘图",rank:12,pricing:"免费",contextWindow:"-",speed:"快",description:"最新SD3模型，文字渲染和理解能力显著提升。适合高质量AI绘画。",url:"https://huggingface.co/stabilityai",tags:["绘图","文字","高质量"]},
  {id:"whisper-v3",name:"Whisper V3 Large",provider:"OpenAI",type:"本地",category:"音频",rank:13,pricing:"免费",contextWindow:"-",speed:"快",description:"最强开源语音识别，支持100+语言。本地转写无需联网，准确率极高。",url:"https://ollama.com/library/whisper",tags:["语音","转写","多语言"]},
]
