import { describe, it, expect, vi } from 'vitest';
import { computeStardate } from './stardate';

describe('computeStardate', () => {
  it('matches TrekGuide canonical value for 2026-05-18', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T00:00:00Z'));
    const v = parseFloat(computeStardate());
    // From v3-splash.jsx: May 18, 2026 → ~80376.4
    expect(v).toBeGreaterThan(80370);
    expect(v).toBeLessThan(80380);
    vi.useRealTimers();
  });

  it('returns a string with 4 decimal places', () => {
    expect(computeStardate()).toMatch(/^\d+\.\d{4}$/);
  });
});
