import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { SITE } from '../consts';

export async function GET(context: { site: URL }) {
  const notes = (await getCollection('notes'))
    .filter((n) => n.id.startsWith('en/'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE.author} · Notes`,
    description: 'Research & learning progress notes.',
    site: context.site,
    items: notes.map((n) => {
      const slug = n.id.split('/').slice(1).join('/');
      return {
        title: n.data.title,
        pubDate: n.data.pubDate,
        description: n.data.description,
        link: getRelativeLocaleUrl('en', `notes/${slug}`),
      };
    }),
  });
}
