import { analyzeDraws, getBigSmallRatio, getOddEvenRatio, getZoneRatio, hasConsecutive, sumRed } from "./analysis";
import type { DrawResult, PredictionRequest, PredictionResult } from "./types";

type WeightedNumber = { number: number; weight: number };

function createRng(seed = Date.now()): () => number {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function weightedPick(items: WeightedNumber[], rng: () => number, excluded: Set<number>): number {
  const available = items.filter((item) => !excluded.has(item.number));
  const total = available.reduce((sum, item) => sum + Math.max(item.weight, 0.1), 0);
  let cursor = rng() * total;
  for (const item of available) {
    cursor -= Math.max(item.weight, 0.1);
    if (cursor <= 0) return item.number;
  }
  return available.at(-1)?.number ?? 1;
}

function createWeights(draws: DrawResult[], mode: PredictionRequest["mode"], max: number, field: "redNumbers" | "blueNumbers"): WeightedNumber[] {
  const analysis = analyzeDraws(draws, draws.length || 1);
  const stats = field === "redNumbers" ? analysis.redFrequency : analysis.blueFrequency;
  return Array.from({ length: max }, (_, index) => {
    const number = index + 1;
    const stat = stats.find((item) => item.number === number);
    const count = stat?.count ?? 0;
    const omission = stat?.currentOmission ?? draws.length;
    let weight = 1;
    if (mode === "hot") weight = 1 + count * 2;
    if (mode === "cold") weight = 1 + omission * 1.5;
    if (mode === "mixed" || mode === "custom") weight = 1 + count * 1.2 + omission * 0.8;
    return { number, weight };
  });
}

function scoreCandidate(red: number[], draws: DrawResult[], request: PredictionRequest): number {
  const features = {
    sum: sumRed(red),
    oddEvenRatio: getOddEvenRatio(red),
    bigSmallRatio: getBigSmallRatio(red),
    zoneRatio: getZoneRatio(red),
    hasConsecutive: hasConsecutive(red)
  };
  let score = 60;
  if (features.sum >= 70 && features.sum <= 130) score += 10;
  if (["2:4", "3:3", "4:2"].includes(features.oddEvenRatio)) score += 8;
  if (["2:4", "3:3", "4:2"].includes(features.bigSmallRatio)) score += 8;
  if (["2-2-2", "1-2-3", "2-1-3", "3-2-1", "1-3-2", "2-3-1", "3-1-2"].includes(features.zoneRatio)) score += 5;
  if (request.mode === "random") score += 3;
  if (request.mode === "mixed" || request.mode === "custom") score += 6;

  const lastDraw = draws.at(-1);
  const repeatCount = lastDraw ? red.filter((number) => lastDraw.redNumbers.includes(number)).length : 0;
  if (repeatCount <= 2) score += 3;

  return Math.min(99, Math.round(score * 10) / 10);
}

function satisfies(red: number[], blue: number, request: PredictionRequest, draws: DrawResult[]): boolean {
  const constraints = request.constraints ?? {};
  const redSet = new Set(red);
  if (red.length !== 6 || redSet.size !== 6) return false;
  if (red.some((number) => number < 1 || number > 33)) return false;
  if (blue < 1 || blue > 16) return false;
  if (constraints.mustIncludeRed?.some((number) => !redSet.has(number))) return false;
  if (constraints.excludeRed?.some((number) => redSet.has(number))) return false;
  if (constraints.mustIncludeBlue && constraints.mustIncludeBlue.length > 0 && !constraints.mustIncludeBlue.includes(blue)) return false;
  if (constraints.excludeBlue?.includes(blue)) return false;
  if (constraints.sumRange) {
    const sum = sumRed(red);
    if (sum < constraints.sumRange[0] || sum > constraints.sumRange[1]) return false;
  }
  if (constraints.oddEvenRatio && !constraints.oddEvenRatio.includes(getOddEvenRatio(red))) return false;
  if (constraints.bigSmallRatio && !constraints.bigSmallRatio.includes(getBigSmallRatio(red))) return false;
  if (constraints.allowConsecutive === false && hasConsecutive(red)) return false;
  if (constraints.allowRepeatFromLastDraw === false) {
    const lastDraw = draws.at(-1);
    if (lastDraw && red.some((number) => lastDraw.redNumbers.includes(number))) return false;
  }
  return true;
}

export function generateSsqPredictions(allDraws: DrawResult[], request: PredictionRequest): PredictionResult[] {
  const count = Math.min(Math.max(request.count || 5, 1), 20);
  const draws = [...allDraws]
    .sort((a, b) => a.drawDate.localeCompare(b.drawDate) || a.issueNo.localeCompare(b.issueNo))
    .slice(-(request.historyWindow || 100));
  const rng = createRng(request.seed);
  const redWeights = createWeights(draws, request.mode, 33, "redNumbers");
  const blueWeights = createWeights(draws, request.mode, 16, "blueNumbers");
  const results: PredictionResult[] = [];
  const seen = new Set<string>();
  const constraints = request.constraints ?? {};

  for (let attempt = 0; results.length < count && attempt < 5000; attempt += 1) {
    const selected = new Set<number>(constraints.mustIncludeRed ?? []);
    const excluded = new Set<number>(constraints.excludeRed ?? []);
    while (selected.size < 6) {
      selected.add(weightedPick(redWeights, rng, new Set([...selected, ...excluded])));
    }
    const red = [...selected].sort((a, b) => a - b);
    const blueExcluded = new Set<number>(constraints.excludeBlue ?? []);
    let blue = constraints.mustIncludeBlue?.[0] ?? weightedPick(blueWeights, rng, blueExcluded);
    if (blueExcluded.has(blue)) blue = weightedPick(blueWeights, rng, blueExcluded);

    if (!satisfies(red, blue, request, draws)) continue;
    const key = `${red.join("-")}|${blue}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const features = {
      sum: sumRed(red),
      oddEvenRatio: getOddEvenRatio(red),
      bigSmallRatio: getBigSmallRatio(red),
      zoneRatio: getZoneRatio(red),
      hasConsecutive: hasConsecutive(red)
    };
    const score = scoreCandidate(red, draws, request);
    results.push({
      red,
      blue: [blue],
      score,
      features,
      reason: `仅供娱乐：该组合和值 ${features.sum}，奇偶比 ${features.oddEvenRatio}，大小比 ${features.bigSmallRatio}，按 ${request.mode} 规则生成，不能预测真实开奖结果。`
    });
  }

  if (results.length === 0) {
    throw new Error("当前约束过强，无法生成号码，请放宽和值、奇偶比或排除号码条件。");
  }

  return results;
}
