import type { Article, DrawResult, PrizeLevel } from "./types";

const redSets = [
  [2, 6, 9, 14, 22, 27],
  [1, 7, 12, 18, 23, 31],
  [4, 8, 11, 16, 25, 33],
  [3, 10, 13, 19, 21, 30],
  [5, 9, 15, 17, 24, 29],
  [6, 12, 14, 20, 26, 32],
  [2, 8, 16, 18, 22, 28],
  [1, 4, 10, 13, 27, 31],
  [7, 11, 15, 19, 23, 33],
  [3, 5, 12, 21, 25, 30],
  [6, 9, 14, 17, 24, 32],
  [2, 8, 13, 20, 26, 29],
  [1, 10, 16, 18, 22, 31],
  [4, 7, 11, 19, 25, 33],
  [3, 6, 12, 17, 23, 30],
  [5, 9, 15, 21, 26, 32],
  [2, 8, 14, 18, 24, 29],
  [1, 4, 10, 16, 22, 31],
  [7, 11, 13, 19, 25, 33],
  [3, 6, 12, 17, 23, 30],
  [5, 9, 15, 21, 26, 32],
  [2, 8, 14, 18, 24, 29],
  [1, 4, 10, 16, 22, 31],
  [7, 11, 13, 19, 25, 33],
  [3, 6, 12, 17, 23, 30],
  [5, 9, 15, 21, 26, 32],
  [2, 8, 14, 18, 24, 29],
  [1, 4, 10, 16, 22, 31],
  [7, 11, 13, 19, 25, 33],
  [3, 6, 12, 17, 23, 30]
];

export const sampleDraws: DrawResult[] = redSets.map((redNumbers, index) => {
  const issue = 2026070 + index;
  const date = new Date(Date.UTC(2026, 6, 1 + index * 2));
  return {
    id: `sample-${issue}`,
    lotteryCode: "ssq",
    issueNo: String(issue),
    drawDate: date.toISOString().slice(0, 10),
    redNumbers,
    blueNumbers: [((index * 5) % 16) + 1],
    salesAmount: 340_000_000 + index * 2_300_000,
    poolAmount: 1_600_000_000 + index * 13_000_000,
    sourceName: "本地示例数据",
    sourceUrl: "local://seed/ssq",
    verifiedStatus: "verified"
  };
});

export const samplePrizeLevels: PrizeLevel[] = [
  { level: "一等奖", winningCount: 6, prizeAmount: 7_200_000, totalAmount: 43_200_000 },
  { level: "二等奖", winningCount: 128, prizeAmount: 96_000, totalAmount: 12_288_000 },
  { level: "三等奖", winningCount: 1420, prizeAmount: 3000, totalAmount: 4_260_000 },
  { level: "四等奖", winningCount: 75888, prizeAmount: 200, totalAmount: 15_177_600 },
  { level: "五等奖", winningCount: 1_420_000, prizeAmount: 10, totalAmount: 14_200_000 },
  { level: "六等奖", winningCount: 8_300_000, prizeAmount: 5, totalAmount: 41_500_000 }
];

export const sampleArticles: Article[] = [
  {
    id: "article-1",
    title: "双色球数据站最小可用版本上线：可查看历史走势与娱乐性号码生成",
    summary: "本站聚合公开开奖数据，提供号码频率、遗漏、和值、奇偶比等分析，并强调所有预测仅供娱乐。",
    sourceName: "本站公告",
    sourceUrl: "local://article/mvp",
    publishedAt: "2026-09-06T08:00:00.000Z",
    category: "官方公告",
    lotteryCode: "ssq",
    province: null,
    credibility: "官方",
    status: "published"
  },
  {
    id: "article-2",
    title: "理性购彩提醒：不要相信所谓内部号码和包中奖服务",
    summary: "彩票开奖结果具有随机性，任何宣称内部号、稳赚、包中的信息都应保持警惕。",
    sourceName: "风险提示",
    sourceUrl: "local://article/risk",
    publishedAt: "2026-09-05T08:00:00.000Z",
    category: "风险提示",
    lotteryCode: "ssq",
    province: null,
    credibility: "官方",
    status: "published"
  },
  {
    id: "article-3",
    title: "从历史开奖看双色球和值区间：多数样本集中在中间区域",
    summary: "基于本地样例数据，红球和值更常落在 70 到 130 的区间内，该结论仅用于数据展示。",
    sourceName: "数据趣闻",
    sourceUrl: "local://article/sum-range",
    publishedAt: "2026-09-04T08:00:00.000Z",
    category: "数据榜单",
    lotteryCode: "ssq",
    province: null,
    credibility: "本站整理",
    status: "published"
  }
];
