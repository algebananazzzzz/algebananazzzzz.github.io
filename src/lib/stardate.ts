const STARDATE_EPOCH_MS = Date.UTC(1946, 0, 1);
const MS_PER_JULIAN_YEAR = 365.25 * 24 * 3600 * 1000;

export function computeStardate(now: number = Date.now()): string {
  const yrs = (now - STARDATE_EPOCH_MS) / MS_PER_JULIAN_YEAR;
  return (yrs * 1000).toFixed(4);
}
