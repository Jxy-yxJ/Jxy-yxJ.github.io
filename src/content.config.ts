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
    heroImage: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    period: z.string(),
    summary: z.string(),
    tags: z.array(z.enum(['robotics', 'ml', 'embodied-ai', 'cv', 'nlp'])).default([]),
    links: z
      .object({
        code: z.string().url().optional(),
        paper: z.string().url().optional(),
        demo: z.string().url().optional(),
        page: z.string().url().optional(), // internal project page
      })
      .default({}),
    highlights: z.array(z.string()).default([]),
    cover: z.string().optional(),
    order: z.number().default(0),
  }),
});

const photography = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/photography' }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    date: z.coerce.date(),
    camera: z.string().optional(),
    description: z.string().optional(),
    image: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    cover: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// ★ 迁移：embed 由必填改可选；新增 type/audio/date/venue/city/poster（向后兼容旧条目）
const music = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['track', 'gig', 'playlist', 'note']).default('track'),
    artist: z.string().optional(),
    embed: z.string().url().optional(),
    audio: z.string().optional(), // /audio/xxx.mp3
    date: z.coerce.date().optional(),
    venue: z.string().optional(),
    city: z.string().optional(),
    poster: z.string().optional(),
    note: z.string().optional(),
    order: z.number().default(0),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/cv' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    updated: z.coerce.date(),
    pdf: z.string(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/education' }),
  schema: z.object({
    school: z.string(),
    degree: z.string(), // e.g. "B.S. in Computer Science"
    field: z.string().optional(),
    period: z.string(), // e.g. "2021 – 2025"
    details: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/experience' }),
  schema: z.object({
    org: z.string(),
    role: z.string(),
    advisor: z.string().optional(),
    period: z.string(),
    details: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.string(),
    links: z
      .object({
        paper: z.string().url().optional(),
        code: z.string().url().optional(),
        project: z.string().url().optional(),
      })
      .default({}),
    order: z.number().default(0),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    org: z.string().optional(),
    year: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = {
  notes,
  research,
  photography,
  music,
  cv,
  education,
  experience,
  publications,
  awards,
};
