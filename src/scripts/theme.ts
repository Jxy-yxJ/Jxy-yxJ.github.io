// 主题切换：点击切换 data-theme 并持久化到 localStorage
const btn = document.querySelector('#theme-toggle');
btn?.addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = cur;
  localStorage.setItem('theme', cur);
  // 更新 aria-label（由调用页提供，这里仅同步图标状态）
  const labelEl = btn as HTMLElement;
  labelEl.setAttribute('aria-pressed', String(cur === 'dark'));
});
