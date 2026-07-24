// 轻量滚动视差：对 [data-parallax] 元素按滚动位置做 translateY lerp
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));

if (!reduced && fine && els.length > 0) {
  const items = els.map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax || '0.08'),
    current: 0,
    target: 0,
  }));
  let ticking = false;

  function measure() {
    const vh = window.innerHeight;
    for (const it of items) {
      const r = it.el.getBoundingClientRect();
      const center = r.top + r.height / 2 - vh / 2; // 元素中心相对视口中心的偏移
      it.target = -center * it.speed;
    }
  }
  function update() {
    let active = false;
    for (const it of items) {
      it.current += (it.target - it.current) * 0.085;
      if (Math.abs(it.target - it.current) > 0.1) active = true;
      it.el.style.transform = `translateY(${it.current.toFixed(2)}px)`;
    }
    if (active) requestAnimationFrame(update);
    else ticking = false;
  }
  function onScroll() {
    measure();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
}
