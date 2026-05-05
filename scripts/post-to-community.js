// 小白AI · 自动发帖脚本
// 用法: node scripts/post-to-community.js
// 读取 public/community-posts.json，通过 API 发布到数据库

const fs = require("fs")
const path = require("path")

const API_URL = process.env.API_URL || "http://localhost:3000"

async function main() {
  const filePath = path.join(__dirname, "..", "public", "community-posts.json")
  if (!fs.existsSync(filePath)) {
    console.log("❌ community-posts.json 不存在")
    process.exit(1)
  }

  const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  console.log(`📝 共 ${posts.length} 篇帖子待发布\n`)

  let success = 0
  let skip = 0
  let fail = 0

  for (const post of posts) {
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          author_name: post.author_name,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        console.log(`  ✅ ${post.title.slice(0, 40)}...`)
        success++
      } else if (data.error && data.error.includes("duplicate")) {
        console.log(`  ⏭️  ${post.title.slice(0, 40)}... (已存在)`)
        skip++
      } else {
        console.log(`  ⚠️  ${post.title.slice(0, 40)}... ${data.error || res.status}`)
        fail++
      }
    } catch (e) {
      console.log(`  ❌ ${post.title.slice(0, 40)}... ${e.message}`)
      fail++
    }

    // 间隔 500ms 防止请求过快
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\n🎯 完成: ${success} 成功, ${skip} 跳过, ${fail} 失败`)
  console.log("💡 帖子状态为 pending，请在 /moderate 审核通过后显示")
}

main()
