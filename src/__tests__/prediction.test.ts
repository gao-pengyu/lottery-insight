import { describe, expect, it } from "vitest";
import { generateSsqPredictions } from "../lib/prediction";
import type { DrawResult } from "../lib/types";

const draws: DrawResult[] = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  lotteryCode: "ssq",
  issueNo: `2026${String(index + 1).padStart(3, "0")}`,
  drawDate: `2026-01-${String(index + 1).padStart(2, "0")}`,
  redNumbers: [1, 2 + (index % 10), 12, 18, 24, 30],
  blueNumbers: [(index % 16) + 1],
  salesAmount: 100,
  poolAmount: 200,
  sourceName: "sample",
  sourceUrl: "local",
  verifiedStatus: "verified"
}));

describe("generateSsqPredictions", () => {
  it("generates valid双色球 predictions that satisfy basic custom constraints", () => {
    const result = generateSsqPredictions(draws, {
      mode: "custom",
      count: 3,
      historyWindow: 20,
      constraints: {
        mustIncludeRed: [1],
        excludeRed: [33],
        excludeBlue: [16],
        sumRange: [60, 120],
        oddEvenRatio: ["2:4", "3:3", "4:2"],
        bigSmallRatio: ["2:4", "3:3", "4:2"],
        allowConsecutive: true,
        allowRepeatFromLastDraw: true
      },
      seed: 42
    });

    expect(result).toHaveLength(3);
    for (const item of result) {
      expect(item.red).toHaveLength(6);
      expect(new Set(item.red).size).toBe(6);
      expect(item.red).toContain(1);
      expect(item.red).not.toContain(33);
      expect(item.blue[0]).not.toBe(16);
      expect(item.features.sum).toBeGreaterThanOrEqual(60);
      expect(item.features.sum).toBeLessThanOrEqual(120);
      expect(item.score).toBeGreaterThan(0);
      expect(item.reason).toContain("仅供娱乐");
    }
  });
});
