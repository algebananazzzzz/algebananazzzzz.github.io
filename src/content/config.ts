import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const ClusterId = z.enum(['brewery', 'llm', 'cloud', 'reading', 'general']);
const Accent = z.enum(['cosmic', 'sunset', 'aurora', 'nebula']);
const Status = z.enum(['seedling', 'budding', 'evergreen']);
const StarType = z.enum(['neutron', 'giant', 'subgiant', 'mainseq', 'protostar', 'whitedwarf']);

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
    span: z.string(),
    role: z.string(),
    org: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    star: z.object({ type: StarType, brightness: z.number() }),
  }),
});

const notes = defineCollection({
  loader: file('src/content/notes.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    excerpt: z.string(),
    cluster: ClusterId,
    status: Status,
    links: z.number().int().nonnegative(),
    date: z.string(),
    readTime: z.string(),
    words: z.number().int().nonnegative(),
    arm: z.number().int(),
    t: z.number().min(0).max(1),
    backlinks: z.array(z.string()),
    related: z.array(z.string()),
  }),
});

const clusters = defineCollection({
  loader: file('src/content/clusters.yaml'),
  schema: z.object({ id: ClusterId, label: z.string(), dotColor: z.string() }),
});

const mottos = defineCollection({
  loader: file('src/content/mottos.yaml'),
  schema: z.object({ id: z.string(), text: z.string(), cluster: ClusterId, noteId: z.string() }),
});

export const collections = { projects, experience, notes, clusters, mottos };
