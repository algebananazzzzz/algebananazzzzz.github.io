export function magnitudeFor({ links, dateMs }: { links: number; dateMs: number }): number {
  const ageDays = Math.max(0, (Date.now() - dateMs) / 86400_000);
  const ageTax = Math.min(2.5, ageDays / 180);   // up to +2.5 mag over 6 mo
  const linkBoost = Math.log2(1 + links) * 1.2;  // brighter as links pile up
  return Math.max(-3, 6 - linkBoost + ageTax);
}
