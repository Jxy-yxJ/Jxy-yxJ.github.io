// Decap CMS OAuth 回调（Cloudflare Pages Functions）
// 文档：https://decapcms.org/docs/oauth/
//
// 部署：把 oauth-callback/ 推到独立仓库，连 Cloudflare Pages（framework: none），
// 或在本地 `wrangler pages deploy oauth-callback`。
// 在 CF 控制台设置环境变量 CLIENT_ID / CLIENT_SECRET（来自 GitHub OAuth App）。

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const SITE = 'https://yourname.github.io'; // ← 改成你的 GitHub Pages 地址
  const CALLBACK = 'https://your-oauth-callback.pages.dev/callback'; // ← 改成你的回调地址

  // 1) 登录入口：把用户带到 GitHub 授权页
  if (url.pathname === '/' || url.pathname === '') {
    const state = url.searchParams.get('state') ?? '';
    const gh =
      'https://github.com/login/oauth/authorize' +
      `?client_id=${env.CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(CALLBACK)}` +
      `&scope=repo` +
      (state ? `&state=${encodeURIComponent(state)}` : '');
    return Response.redirect(gh, 302);
  }

  // 2) 回调：用 code 换 access_token，再以 fragment 形式回传 admin
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') ?? '';
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        code,
      }),
    });
    const { access_token } = await tokenRes.json();
    return Response.redirect(
      `${SITE}/admin/#/access_token=${access_token}&state=${encodeURIComponent(state)}`,
      302
    );
  }

  return new Response('Not found', { status: 404 });
}
