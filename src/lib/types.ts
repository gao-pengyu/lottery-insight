export type VerifiedStatus = "pending" | "verified" | "conflict";
export type ArticleStatus = "draft" | "published" | "hidden";
export type PredictionMode = "random" | "hot" | "cold" | "mixed" | "custom";

export interface DrawResult {
  id: string;
  lotteryCode: "ssq";
  issueNo: string;
  drawDate: string;
  redNumbers: number[];
  blueNumbers: number[];
  salesAmount: number;
  poolAmount: number;
  sourceName: string;
  sourceUrl: string;
  verifiedStatus: VerifiedStatus;
}

export interface PrizeLevel {
  level: string;
  winningCount: number;
  prizeAmount: number;
  totalAmount: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  lotteryCode: string;
  province?: string | null;
  credibility: string;
  status: ArticleStatus;
}

export interface NumberStat {
  number: number;
  count: number;
  frequency: number;
  currentOmission: number;
  maxOmission: number;
  averageGap: number;
  lastIssueNo: string | null;
}

export interface DrawFeature {
  issueNo: string;
  sum: number;
  oddEvenRatio: string;
  bigSmallRatio: string;
  zoneRatio: string;
  hasConsecutive: boolean;
  repeatFromPrevious: number[];
}

export interface AnalysisResult {
  window: number;
  totalDraws: number;
  redFrequency: NumberStat[];
  blueFrequency: NumberStat[];
  hotRed: NumberStat[];
  coldRed: NumberStat[];
  sumTrend: Array<{ issueNo: string; drawDate: string; sum: number }>;
  prizeTrend: Array<{ issueNo: string; drawDate: string; salesAmount: number; poolAmount: number }>;
  ratioSummary: {
    oddEven: Record<string, number>;
    bigSmall: Record<string, number>;
    zone: Record<string, number>;
  };
  features: DrawFeature[];
}

export interface PredictionConstraints {
  mustIncludeRed?: number[];
  excludeRed?: number[];
  mustIncludeBlue?: number[];
  excludeBlue?: number[];
  sumRange?: [number, number];
  oddEvenRatio?: string[];
  bigSmallRatio?: string[];
  allowConsecutive?: boolean;
  allowRepeatFromLastDraw?: boolean;
}

export interface PredictionRequest {
  mode: PredictionMode;
  count: number;
  historyWindow: number;
  constraints?: PredictionConstraints;
  seed?: number;
}

export interface PredictionResult {
  red: number[];
  blue: number[];
  score: number;
  features: {
    sum: number;
    oddEvenRatio: string;
    bigSmallRatio: string;
    zoneRatio: string;
    hasConsecutive: boolean;
  };
  reason: string;
}
