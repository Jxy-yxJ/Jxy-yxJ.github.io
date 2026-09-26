# Personal Site — Astro + i18n + Decap CMS

个人网站：申请展示、记录科研/学习进展、展示摄影与音乐作品、实习与工作。
技术栈 **Astro**（静态站） + 完整中英双语（i18n） + **Decap CMS**（浏览器后台更新） + **GitHub Pages** 部署。

## 板块
首页 · 关于 · 科研 · 日志 · 摄影 · 音乐 · 简历 · 联系（每板块均有 `/en/` 与 `/zh/` 版本）

## 本地开发
```bash
npm install
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

## 上线（GitHub Pages）
1. 把本仓库推到 GitHub（建议仓库名 `<user>.github.io`，即「用户站」，站点根路径无需改 base）。
   - 若用「项目页」`<user>.github.io/<repo>`，在 `astro.config.mjs` 取消注释 `base: '/<repo>/'` 并改 `site`。
2. 仓库 → Settings → Pages → Source 选 **GitHub Actions**。
3. 改 `astro.config.mjs` 里的 `site` 为你的真实地址（`https://<user>.github.io`）。
4. 推送 `main` 即自动构建并上线。

## 改个人信息
- 站点名/邮箱/社交链接：`src/consts.ts`
- 导航/按钮文案（双语）：`src/i18n/ui.ts`
- 关于页内容：`src/pages/[lang]/about.astro`
- 签名色/明暗主题：`src/styles/global.css`（搜索 `--accent`）

## 用 Decap CMS 在浏览器里更新内容（不用碰 Git）
1. 在 GitHub 建一个 **OAuth App**（Settings → Developer settings）：
   - Homepage URL：`https://<user>.github.io`
   - Authorization callback URL：你的 OAuth 回调地址（见下）
2. 部署 OAuth 回调（`oauth-callback/`，Cloudflare Pages 或 Vercel 无服务函数）：
   - `wrangler pages deploy oauth-callback`，在控制台设置环境变量 `CLIENT_ID` / `CLIENT_SECRET`。
   - 把 `oauth-callback/functions/callback.js` 里的 `SITE` 与 `CALLBACK` 改成你的地址。
3. 改 `public/admin/config.yml`：
   - `repo: <user>/<repo>`
   - `base_url: https://<你的回调地址>`
4. 访问 `https://<user>.github.io/admin/`，用 GitHub 登录即可在网页里增删改内容，提交后自动重新部署。

> 不用 Decap 也行：直接编辑 `src/content/*` 下的 Markdown 文件（每篇含 `en/` 与 `zh/` 两个文件），提交即上线。

## 摄影图片
- 原图放在 `public/photography/`（高画质，建议长边 ≤3000px、quality 80–90）。
- 每张图在 `src/content/photography/<lang>/` 下一个 Markdown 条目，含标题/地点/相机/笔记。
- 为避免仓库膨胀，建议用 **Git LFS** 跟踪图片（见 `.gitattributes`）：`git lfs install` 后正常提交即可。

## 注意事项 / 已知坑
- `astro.config.mjs` 的 `site` 必填（sitemap/RSS 需要）。
- 用户站（`<user>.github.io`）是根路径，**不要**设 `base`；项目页才需要。
- Decap 的 `backend: github` 必须自建 OAuth 回调（见上），不能用 Netlify git-gateway。
