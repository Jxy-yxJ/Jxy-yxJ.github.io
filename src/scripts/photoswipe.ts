import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// 摄影页灯箱：暗色沉浸、显示每张图的文字笔记（caption）
const lightbox = new PhotoSwipeLightbox({
  gallery: '#pswp-gallery',
  children: 'a',
  pswpModule: () => import('photoswipe'),
  bgOpacity: 0.95,
});
lightbox.init();
