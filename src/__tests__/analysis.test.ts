import { describe, expect, it } from "vitest";
import { analyzeDraws, validateSsqNumbers } from "../lib/analysis";
import type { DrawResult } from "../lib/types";

const draws: DrawResult[] = [
  {
    id: "1",
    lotteryCode: "ssq",
    issueNo: "2026001",
    drawDate: "2026-01-01",
    redNumbers: [1, 2, 3, 10, 20, 33],
    blueNumbers: [8],
    salesAmount: 100,
    poolAmount: 200,
    sourceName: "sample",
    sourceUrl: "local",
    verifiedStatus: "verified"
  },
  {
    id: "2",
    lotteryCode: "ssq",
    issueNo: "2026002",
    drawDate: "2026-01-03",
    redNumbers: [1, 5, 9, 10, 18, 30],
    blueNumbers: [8],
    salesAmount: 120,
    poolAmount: 240,
    sourceName: "sample",
    sourceUrl: "local",
    verifiedStatus: "verified"
  },
  {
    id: "3",
    lotteryCode: "ssq",
    issueNo: "2026003",
    drawDate: "2026-01-05",
    redNumbers: [2, 6, 10, 11, 19, 32],
    blueNumbers: [2],
    salesAmount: 130,
    poolAmount: 260,
    sourceName: "sample",
    sourceUrl: "local",
    verifiedStatus: "verified"
  }
];

describe("validateSsqNumbers", () => {
  it("accepts six unique red balls and one valid blue ball", () => {
    expect(validateSsqNumbers([1, 2, 3, 4, 5, 33], [16])).toEqual({ valid: true, errors: [] });
  });

  it("rejects duplicate and out-of-range双色球 numbers", () => {
    const result = validateSsqNumbers([1, 1, 3, 4, 5, 34], [17]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("红球不能重复");
    expect(result.errors).toContain("红球范围必须是 1-33");
    expect(result.errors).toContain("蓝球范围必须是 1-16");
  });
});

describe("analyzeDraws", () => {
  it("calculates frequency, omission, ratios and trends from history", () => {
    const result = analyzeDraws(draws, 3);

    expect(result.redFrequency.find((item) => item.number === 10)?.count).toBe(3);
    expect(result.blueFrequency.find((item) => item.number === 8)?.count).toBe(2);
    expect(result.redFrequency.find((item) => item.number === 33)?.currentOmission).toBe(2);
    expect(result.sumTrend.map((item) => item.sum)).toEqual([69, 73, 80]);
    expect(result.ratioSummary.oddEven["3:3"]).toBe(2);
    expect(result.ratioSummary.bigSmall["4:2"]).toBe(3);
  });
});
