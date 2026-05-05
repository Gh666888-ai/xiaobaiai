// 小白AI · AI资讯自动抓取脚本
const https = require("https")
const fs = require("fs")
const path = require("path")

// 抓取源配置
const sources = [
  { name:"OpenAI Blog", url:"https://openai.com/blog/rss.xml", type:"rss", imp:8, cat:"产品发布" },
  { name:"Anthropic Blog", url:"https://www.anthropic.com/blog/rss.xml", type:"rss", imp:8, cat:"产品发布" },
  { name:"Google AI Blog", url:"https://blog.google/technology/ai/rss/", type:"rss", imp:7, cat:"产品发布" },
  { name:"HuggingFace Daily", url:"https://huggingface.co/papers", type:"hf", imp:7, cat:"开源项目" },
  { name:"36氪 AI频道", url:"https://36kr.com/feed-ai", type:"rss", imp:6, cat:"行业动态" },
  { name:"机器之心", url:"https://jiqizhixin.com/rss", type:"rss", imp:6, cat:"行业动态" },
  { name:"DeepSeek Blog", url:"https://api-docs.deepseek.com/news", type:"scrape", imp:7, cat:"开源项目" },
  { name:"Qwen Blog", url:"https://qwenlm.github.io/blog/", type:"scrape", imp:6, cat:"开源项目" },
  { name:"Coze Blog", url:"https://www.coze.cn/blog", type:"scrape", imp:5, cat:"教程资源" },
  { name:"Dify Blog", url:"https://dify.ai/blog", type:"scrape", imp:6, cat:"教程资源" },
  { name:"WAYTOAGI", url:"https://waytoagi.com", type:"scrape", imp:5, cat:"行业动态" },
  { name:"Meta AI Blog", url:"https://ai.meta.com/blog/", type:"scrape", imp:7, cat:"产品发布" },
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ""; res.on("data", c => data += c)
      res.on("end", () => resolve(data))
    }).on("error", reject)
  })
}

async function main() {
  console.log("🔄 开始抓取AI资讯...")
  const allNews = []

  for (const src of sources) {
    try {
      console.log(`  📡 ${src.name}...`)
      const html = await get(src.url)
      // 简单提取标题和链接
      const items = []
      if (src.type === "rss") {
        const titles = html.match(/<title>(.+?)<\/title>/g)?.slice(1) || []
        const links = html.match(/<link>(.+?)<\/link>/g)?.slice(1) || []
        for (let i = 0; i < Math.min(titles.length, 5); i++) {
          const title = titles[i]?.replace(/<\/?title>/g, "").trim()
          const link = links[i]?.replace(/<\/?link>/g, "").trim()
          if (title && title.length > 10) items.push({ title, url:link||src.url, source:src.name, importance:src.imp, category:src.cat })
        }
      }
      allNews.push(...items)
      await new Promise(r => setTimeout(r, 1000)) // 避免请求太快
    } catch (e) { console.log(`    ⚠️ ${src.name} 抓取失败`)}
  }

  // 写入临时JSON
  const outPath = path.join(__dirname, "..", "fetched-news.json")
  fs.writeFileSync(outPath, JSON.stringify(allNews, null, 2))
  console.log(`✅ 抓到 ${allNews.length} 条，保存到 ${outPath}`)
}

main()
