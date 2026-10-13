export function calculateFloodRisk({ rainfallMm, drainLoad, blockage }) {
  const rainfallRisk = Math.min(Math.max(rainfallMm, 0), 100) * 0.45;
  const drainRisk = Math.min(Math.max(drainLoad, 0), 100) * 0.35;
  const blockageRisk = Math.min(Math.max(blockage, 0), 100) * 0.2;
  const score = Math.round(rainfallRisk + drainRisk + blockageRisk);

  if (score >= 75) return { score, level: 'Critical' };
  if (score >= 55) return { score, level: 'High' };
  if (score >= 30) return { score, level: 'Elevated' };
  return { score, level: 'Low' };
}
