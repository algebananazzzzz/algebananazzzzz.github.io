import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const ClusterId = z.enum(['brewery', 'llm', 'cloud', 'reading', 'general']);
const Accent = z.enum(['cosmic', 'sunset', 'aurora', 'nebula']);
const StarType = z.enum([
  'neutron',
  'giant',
  'subgiant',
  'mainseq',
  'protostar',
  'whitedwarf',
  'dwarf',
  'kmain',
  'gmain',
  'bgiant',
  'blackhole',
]);

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    tagline: z.string(),
    tech: z.array(z.string()),
    summary: z.string(),
    bullets: z.array(z.string()),
    role: z.string(),
    impact: z.string(),
    cluster: ClusterId,
    accent: Accent,
    href: z.string().url(),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    id: z.string(),
    date: z.string(),
    role: z.string(),
    org: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    star: StarType,
  }),
});

export const collections = { projects, experience };
