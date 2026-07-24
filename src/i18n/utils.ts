import type { Lang } from './ui';
import { ui } from './ui';

// 从内容条目 id（如 "en/first-post"）推导语言
export function getLocaleFromId(id: string): Lang {
  return id.startsWith('zh/') ? 'zh' : 'en';
}

// 取 UI 文案
export function useTranslations(lang: Lang) {
  return ui[lang];
}

// 取当前页 pathname 去掉语言前缀后的部分（用于语言切换保留当前页）
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
}
