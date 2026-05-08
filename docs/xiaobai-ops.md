# 小白AI运维记忆

最后更新：2026-05-08

## 基本信息

- 本地仓库：`E:\ai导航网站`
- 生产目录：`/var/www/xiaobaiai`
- 生产域名：`https://www.xiaobaiai.cn`
- PM2 应用名：`xiaobaiai`
- 技术栈：Next.js 14.2.x，PM2，Nginx，Supabase。
- 默认生产端口：`127.0.0.1:3000`

## 本地常用命令

进入仓库：

```powershell
cd E:\ai导航网站
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
```

构建：

```powershell
npm.cmd run build
```

只检查 Node 脚本语法：

```powershell
node --check scripts\fetch-news.js
```

提交示例：

```powershell
git status --short
git add <files>
git commit -m "message"
git push
```

## 生产部署命令

## 用户协作习惯和跨会话同步

站长习惯：

- 希望助手直接给可复制的命令，不要只讲概念。
- 如果另一个会话已经改好并 push 到 GitHub，告诉站长：服务器只需要一次 `git pull`，会把多个会话的提交一起拉下来。
- 如果不确定另一个会话是否 push，先让站长看 `git log --oneline -n 5` 或在本地确认是否已 push。
- 服务器上执行部署前，永远先看：

```bash
cd /var/www/xiaobaiai
git status --short
```

如果输出为空，再直接部署：

```bash
git pull
npm run build
pm2 restart xiaobaiai --update-env
pm2 flush xiaobaiai
curl -I https://www.xiaobaiai.cn/
pm2 logs xiaobaiai --lines 80 --nostream
```

如果 `git status --short` 有输出，不要让站长直接 `reset --hard` 或乱 `checkout`。先判断是不是服务器生成文件、日志或数据文件。常见输出：

```text
M public/model-prices.json
M public/fetched-news.json
M scripts/run-workflows-cron.sh
?? logs/model-prices.log
```

如果只是服务器生成文件且需要先拉新代码，推荐临时保存：

```bash
git stash push -u -m "server local generated files before pulling latest"
git pull
npm run build
pm2 restart xiaobaiai --update-env
pm2 flush xiaobaiai
```

拉完后确认最新提交：

```bash
git log --oneline -n 5
```

如果站长问“上一版没跑，这次一起跑吗”，回答：是的，只要这些改动都已经 push，一次 `git pull` 会把上一版和这一版一起拉到服务器。

如果新增了页面或任务，部署后要验证对应 URL，例如：

```bash
curl -I https://www.xiaobaiai.cn/
curl -I https://www.xiaobaiai.cn/missions
curl -I https://www.xiaobaiai.cn/missions/ai-ppt-first-deck
curl -I https://www.xiaobaiai.cn/growth
```

判断上线成功的标准：

- `npm run build` 通过。
- 首页或新增页面 `curl -I` 返回 `200 OK`。
- `pm2 logs xiaobaiai --lines 80 --nostream` 没有新的 error。
- 刚重启后短暂 502 可以等 3 秒再测，不要立刻判定失败。

常规部署：

```bash
cd /var/www/xiaobaiai
git pull
npm run build
pm2 restart xiaobaiai --update-env
sleep 3
curl -I https://www.xiaobaiai.cn/
pm2 logs xiaobaiai --lines 80 --nostream
```

只改脚本时通常不需要 `npm run build` 和 PM2 restart，但如果脚本影响站内静态文件或数据，仍需要视情况部署。

## PM2 排查

查看状态：

```bash
pm2 list
pm2 show xiaobaiai | grep -E "status|restart|unstable|created|uptime|exec cwd|script|args"
```

看日志：

```bash
pm2 logs xiaobaiai --lines 80 --nostream
```

清日志后验证：

```bash
pm2 flush xiaobaiai
curl -I https://www.xiaobaiai.cn/
pm2 logs xiaobaiai --lines 80 --nostream
```

常见现象：

- 刚 `pm2 restart` 后马上 `curl` 可能短暂 502，等几秒再测。
- Next.js 报 `Failed to find Server Action` 多数是旧页面请求打到新部署，通常刷新或重新部署后消失。
- `.next/server/pages/_error.js` 缺失通常是构建或部署瞬间状态不一致，重新 build/restart 后检查。

## Nginx 排查

访问错误：

```bash
sudo tail -n 300 /var/log/nginx/access.log | awk '$9 >= 400 {print $0}'
sudo tail -n 80 /var/log/nginx/error.log
```

接口和页面验证：

```bash
curl -I https://www.xiaobaiai.cn/
curl -I https://www.xiaobaiai.cn/start
curl -I https://www.xiaobaiai.cn/missions
curl -I https://www.xiaobaiai.cn/tutorials
curl -I https://www.xiaobaiai.cn/sitemap.xml
```

## Cron 任务

生产机用户 crontab 里已有过这些任务：

```bash
0 8,14,20 * * * cd /var/www/xiaobaiai && /usr/bin/git pull && /usr/bin/node scripts/fetch-news.js && /usr/bin/git add -A && /usr/bin/git commit -m 'auto: fetch news' && /usr/bin/git push
20 3 * * * APP_DIR=/var/www/xiaobaiai PM2_APP=xiaobaiai /bin/bash /var/www/xiaobaiai/scripts/daily-model-prices.sh >> /var/www/xiaobaiai/logs/model-prices.log 2>&1
*/5 * * * * cd /var/www/xiaobaiai && APP_URL=https://xiaobaiai.cn WORKFLOW_CRON_SECRET=xiaobai_workflow_2026_very_secret_839201 bash scripts/run-workflows-cron.sh >> /var/www/xiaobaiai/logs/workflows-cron.log 2>&1
```

注意：资讯抓取任务不要继续使用 `git add -A`，容易把日志、价格文件、脚本本地改动混入自动提交。

推荐资讯 cron：

```bash
0 8,14,20 * * * cd /var/www/xiaobaiai && /usr/bin/git pull --ff-only && /usr/bin/node scripts/fetch-news.js && /usr/bin/git add public/fetched-news.json && (/usr/bin/git diff --cached --quiet || /usr/bin/git commit -m 'auto: fetch news') && /usr/bin/git push >> /var/www/xiaobaiai/logs/fetch-news.log 2>&1
```

查看 cron：

```bash
crontab -l
```

查看 cron 系统日志可能需要 sudo：

```bash
sudo grep "fetch-news" /var/log/syslog | tail -n 50
journalctl -u cron --since "24 hours ago" | grep fetch-news
```

## 资讯抓取

脚本：

```text
scripts/fetch-news.js
```

输出文件：

```text
public/fetched-news.json
```

手动验证：

```bash
cd /var/www/xiaobaiai
node scripts/fetch-news.js > /tmp/fetch-news.once.log 2>&1
echo "exit=$?"
tail -n 240 /tmp/fetch-news.once.log
ls -lh public/fetched-news.json
head -c 500 public/fetched-news.json
git status --short
```

如果正常，日志应出现：

```text
[xiaobai-news-editor] candidates <n>, unique <n>
  enriching 1/18 ...
  edited ...
[xiaobai-news-editor] checkpoint wrote 1 fresh, 1 total -> /var/www/xiaobaiai/public/fetched-news.json
[xiaobai-news-editor] final wrote ...
```

已修过的问题：

- 页面响应太大时，旧逻辑 `req.destroy()` 后没有 resolve，脚本可能静默 `exit=0`。
- AI 编辑请求中途 aborted 时，旧逻辑可能悬空。
- 旧逻辑等全部 18 条编辑完才写文件，导致中途断开时 `fetched-news.json` 仍是 `[]`。
- 现在每成功编辑一条就 checkpoint 写入，避免全丢。

提交资讯结果时只提交资讯文件：

```bash
git add public/fetched-news.json
git commit -m 'auto: fetch news'
git push
```

不要用：

```bash
git add -A
```

## 工作流 Cron

脚本：

```text
scripts/run-workflows-cron.sh
```

手动验证：

```bash
cd /var/www/xiaobaiai
CRON_SECRET=$(grep '^WORKFLOW_CRON_SECRET=' .env.local | cut -d= -f2-)
curl -s -X POST -H "x-cron-secret: $CRON_SECRET" http://127.0.0.1:3000/api/workflows/cron
echo
pm2 logs xiaobaiai --lines 80 --nostream
```

常见问题：

- 返回 `{"error":"Cron secret 不正确。"}`：请求头 secret 和 `.env.local` 不一致。
- 返回 `读取工作流失败`，日志出现 `permission denied for table ai_workflows`：Supabase 权限缺失，需要给 `service_role` 授权。
- 返回 `{"checked":0,"ran":0,"results":[]}`：接口可用，但当前没有到期工作流或没有可运行任务。

## Supabase 相关坑

曾遇到：

```text
permission denied for table ai_workflows
```

提示类似：

```sql
GRANT SELECT ON public.ai_workflows TO service_role;
```

处理原则：

- 优先确认生产环境使用的是 service role key 还是 anon key。
- 涉及 cron、后台任务、服务端读写的表，需要确认 RLS 和权限。
- 不要把 service role key 暴露到客户端。

## 生产目录脏工作区注意事项

生产机可能出现：

```text
M public/model-prices.json
M scripts/run-workflows-cron.sh
?? logs/model-prices.log
```

处理原则：

- 不要在生产机随手 `git add -A`。
- 自动提交资讯时只 add `public/fetched-news.json`。
- 自动提交价格时只 add 对应价格数据文件。
- 日志目录应加入 `.gitignore` 或避免被 add。

## 建议新增的可观测能力

后续建议增加资讯抓取状态文件，例如：

```json
{
  "lastRunAt": "2026-05-08T07:08:15+08:00",
  "sourcesChecked": 11,
  "candidates": 73,
  "unique": 18,
  "fresh": 6,
  "wrote": true,
  "error": ""
}
```

未来可以做后台状态页或 API，让站长不用 tail 日志也能知道资讯系统是否正常。
