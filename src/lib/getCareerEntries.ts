import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { CareerEntry } from '@/components/island/CareerList';
import starsData from './stars.json';

type StarRecord = (typeof starsData)[number];

const starsById: Record<string, StarRecord> = Object.fromEntries(
  starsData.map((s) => [s.name, s]),
);

const fallback = starsById['mainseq'];

export async function getCareerEntries(limit?: number): Promise<CareerEntry[]> {
  const expEntries = await getCollection('experience');
  let exps: CollectionEntry<'experience'>['data'][] = expEntries.map(
    (e: CollectionEntry<'experience'>) => e.data,
  );

  if (limit !== undefined) {
    exps = exps.slice(0, limit);
  }

  return exps.map((e) => {
    const star = starsById[e.star] ?? fallback;
    return {
      id: e.id,
      date: e.date,
      role: e.role,
      org: e.org,
      summary: e.summary,
      tags: e.tags ?? [],
      star: {
        type: e.star,
        stellarClass: star.stellarClass,
        classDesc: star.classDesc,
        color: star.color,
        accent: 'accent' in star ? (star as any).accent : star.color,
        glow: star.glow,
        sizeMul: star.sizeMul,
        bri: star.bri,
      },
    };
  });
}
