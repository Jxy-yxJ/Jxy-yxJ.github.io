// Astro 5 内容层（Content Layer API）
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(), // 如 /photography/xxx.jpg
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    role: z.string(), // e.g. "Lead Engineer"
    period: z.string(), // e.g. "2024 – Present"
    summary: z.string(),
    tags: z.array(z.enum(['robotics', 'ml', 'embodied-ai', 'cv', 'nlp'])).default([]),
    links: z
      .object({
        code: z.string().url().optional(),
        paper: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .default({}),
    highlights: z.array(z.string()).default([]),
    cover: z.string().optional(), // /photography/... 缩略图（URL 字符串）
    order: z.number().default(0),
  }),
});

const photography = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/photography' }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    date: z.coerce.date(),
    camera: z.string().optional(), // 相机/镜头
    description: z.string().optional(),
    image: z.string(), // ★ URL 字符串：/photography/xxx.jpg
    width: z.number().optional(), // 供 PhotoSwipe 用
    height: z.number().optional(),
    cover: z.boolean().default(false), // 是否进首页/封面
    order: z.number().default(0),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    embed: z.string().url(), // Spotify / YouTube 嵌入链接
    note: z.string().optional(),
    order: z.number().default(0),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/cv' }),
  schema: z.object({
    name: z.string(),
    title: z.string(), // 求职抬头
    updated: z.coerce.date(),
    pdf: z.string(), // 对应 public/cv/*.pdf 路径
  }),
});

export const collections = { notes, research, photography, music, cv };
