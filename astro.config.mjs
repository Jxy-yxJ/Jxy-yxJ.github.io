// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ★ 站点根：GitHub Pages 用户站 = https://<user>.github.io/
//   若是「项目页」 username.github.io/<repo>，需补 base:'/<repo>/'
//   部署上线前请把下面 site 改成你真实的 GitHub Pages 地址。
export default defineConfig({
  site: 'https://Jxy-yxJ.github.io', // 用户站根路径，无需 base
  // base: '/<repo>/',               // 仅当用「项目页」时取消注释
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: true }, // /en/ 和 /zh/ 都显式带前缀
  },
  integrations: [mdx(), sitemap()],
  image: {
    responsiveStyles: true,
  },
  markdown: {
    shikiConfig: { theme: 'css-variables' }, // 代码块随明暗主题变化
  },
});
