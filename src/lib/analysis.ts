import type { AnalysisResult, DrawFeature, DrawResult, NumberStat } from "./types";

export function validateSsqNumbers(redNumbers: number[], blueNumbers: number[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (redNumbers.length !== 6) errors.push("红球数量必须为 6");
  if (blueNumbers.length !== 1) errors.push("蓝球数量必须为 1");
  if (new Set(redNumbers).size !== redNumbers.length) errors.push("红球不能重复");
  if (redNumbers.some((number) => number < 1 || number > 33)) errors.push("红球范围必须是 1-33");
  if (blueNumbers.some((number) => number < 1 || number > 16)) errors.push("蓝球范围必须是 1-16");

  return { valid: errors.length === 0, errors };
}

export function sumRed(redNumbers: number[]): number {
  return redNumbers.reduce((total, number) => total + number, 0);
}

export function getOddEvenRatio(redNumbers: number[]): string {
  const odd = redNumbers.filter((number) => number % 2 === 1).length;
  return `${odd}:${redNumbers.length - odd}`;
}

export function getBigSmallRatio(redNumbers: number[]): string {
  const small = redNumbers.filter((number) => number <= 16).length;
  return `${small}:${redNumbers.length - small}`;
}

export function getZoneRatio(redNumbers: number[]): string {
  const zone1 = redNumbers.filter((number) => number >= 1 && number <= 11).length;
  const zone2 = redNumbers.filter((number) => number >= 12 && number <= 22).length;
  const zone3 = redNumbers.filter((number) => number >= 23 && number <= 33).length;
  return `${zone1}-${zone2}-${zone3}`;
}

export function hasConsecutive(redNumbers: number[]): boolean {
  const sorted = [...redNumbers].sort((a, b) => a - b);
  return sorted.some((number, index) => index > 0 && number - sorted[index - 1] === 1);
}

function ratioCounter(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function computeNumberStats(draws: DrawResult[], range: number, field: "redNumbers" | "blueNumbers"): NumberStat[] {
  const stats: NumberStat[] = [];

  for (let number = 1; number <= range; number += 1) {
    const hitIndexes = draws
      .map((draw, index) => ({ draw, index }))
      .filter(({ draw }) => draw[field].includes(number));
    const count = hitIndexes.length;
    const lastHit = hitIndexes.at(-1);
    const currentOmission = lastHit ? draws.length - 1 - lastHit.index : draws.length;
    const hitPositions = hitIndexes.map(({ index }) => index);
    const gaps = hitPositions.slice(1).map((position, index) => position - hitPositions[index]);
    const maxInternalGap = gaps.length > 0 ? Math.max(...gaps) - 1 : 0;
    const leadingGap = hitPositions.length > 0 ? hitPositions[0] : draws.length;
    const maxOmission = Math.max(currentOmission, leadingGap, maxInternalGap);
    const averageGap = gaps.length > 0 ? gaps.reduce((total, gap) => total + gap, 0) / gaps.length : draws.length;

    stats.push({
      number,
      count,
      frequency: draws.length === 0 ? 0 : count / draws.length,
      currentOmission,
      maxOmission,
      averageGap: Number(averageGap.toFixed(2)),
      lastIssueNo: lastHit?.draw.issueNo ?? null
    });
  }

  return stats;
}

export function analyzeDraws(allDraws: DrawResult[], window = 100): AnalysisResult {
  const draws = [...allDraws]
    .sort((a, b) => a.drawDate.localeCompare(b.drawDate) || a.issueNo.localeCompare(b.issueNo))
    .slice(-window);

  const features: DrawFeature[] = draws.map((draw, index) => {
    const previous = index > 0 ? draws[index - 1] : undefined;
    return {
      issueNo: draw.issueNo,
      sum: sumRed(draw.redNumbers),
      oddEvenRatio: getOddEvenRatio(draw.redNumbers),
      bigSmallRatio: getBigSmallRatio(draw.redNumbers),
      zoneRatio: getZoneRatio(draw.redNumbers),
      hasConsecutive: hasConsecutive(draw.redNumbers),
      repeatFromPrevious: previous ? draw.redNumbers.filter((number) => previous.redNumbers.includes(number)) : []
    };
  });

  const redFrequency = computeNumberStats(draws, 33, "redNumbers").sort((a, b) => a.number - b.number);
  const blueFrequency = computeNumberStats(draws, 16, "blueNumbers").sort((a, b) => a.number - b.number);

  return {
    window,
    totalDraws: draws.length,
    redFrequency,
    blueFrequency,
    hotRed: [...redFrequency].sort((a, b) => b.count - a.count || a.currentOmission - b.currentOmission).slice(0, 8),
    coldRed: [...redFrequency].sort((a, b) => b.currentOmission - a.currentOmission || a.count - b.count).slice(0, 8),
    sumTrend: draws.map((draw) => ({ issueNo: draw.issueNo, drawDate: draw.drawDate, sum: sumRed(draw.redNumbers) })),
    prizeTrend: draws.map((draw) => ({ issueNo: draw.issueNo, drawDate: draw.drawDate, salesAmount: draw.salesAmount, poolAmount: draw.poolAmount })),
    ratioSummary: {
      oddEven: ratioCounter(features.map((feature) => feature.oddEvenRatio)),
      bigSmall: ratioCounter(features.map((feature) => feature.bigSmallRatio)),
      zone: ratioCounter(features.map((feature) => feature.zoneRatio))
    },
    features
  };
}
