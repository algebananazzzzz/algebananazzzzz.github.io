import { describe, it, expect } from 'vitest';
import { magnitudeFor } from './magnitude';

describe('magnitudeFor', () => {
  it('returns lower (brighter) magnitude for more-linked notes', () => {
    const heavy = magnitudeFor({ links: 9, dateMs: Date.now() });
    const light = magnitudeFor({ links: 2, dateMs: Date.now() });
    expect(heavy).toBeLessThan(light);
  });
  it('penalises older notes (higher magnitude)', () => {
    const fresh = magnitudeFor({ links: 5, dateMs: Date.now() });
    const aged  = magnitudeFor({ links: 5, dateMs: Date.now() - 365 * 86400_000 });
    expect(aged).toBeGreaterThan(fresh);
  });
  it('clamps to a reasonable range', () => {
    const m = magnitudeFor({ links: 99, dateMs: Date.now() });
    expect(m).toBeGreaterThanOrEqual(-3);
  });
});
