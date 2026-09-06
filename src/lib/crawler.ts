import crypto from "node:crypto";
import { validateSsqNumbers } from "./analysis";
import { sampleDraws } from "./sample-data";
import { makeId, readDb, writeDb } from "./store";
import type { DrawResult } from "./types";

interface RemoteCwlItem {
  code?: string;
  date?: string;
  red?: string;
  blue?: string;
  sales?: string;
  poolmoney?: string;
}

function normalizeMoney(value?: string): number {
  if (!value) return 0;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRemoteItem(item: RemoteCwlItem): DrawResult | null {
  const redNumbers = (item.red ?? "").split(",").map(Number).filter(Boolean);
  const blueNumbers = (item.blue ?? "").split(",").map(Number).filter(Boolean);
  const validation = validateSsqNumbers(redNumbers, blueNumbers);
  if (!item.code || !item.date || !validation.valid) return null;
  return {
    id: `remote-${item.code}`,
    lotteryCode: "ssq",
    issueNo: item.code,
    drawDate: item.date.slice(0, 10),
    redNumbers,
    blueNumbers,
    salesAmount: normalizeMoney(item.sales),
    poolAmount: normalizeMoney(item.poolmoney),
    sourceName: "中国福彩网",
    sourceUrl: "https://www.cwl.gov.cn/",
    verifiedStatus: "verified"
  };
}

async function fetchOfficialSsqDraws(): Promise<DrawResult[]> {
  const url = "https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=30";
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.cwl.gov.cn/",
      "User-Agent": "Mozilla/5.0 LotteryInsight/1.0"
    },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`官方数据请求失败：${response.status}`);
  const json = (await response.json()) as { result?: RemoteCwlItem[] };
  const draws = (json.result ?? []).map(parseRemoteItem).filter((item): item is DrawResult => Boolean(item));
  if (draws.length === 0) throw new Error("官方数据为空");
  return draws;
}

export function needsRefresh(db: { crawlerJobs: Array<{ status: string; sourceName: string; finishedAt?: string | null }> }, now = new Date(), ttlMs = 60 * 60 * 1000): boolean {
  const latestSuccess = db.crawlerJobs
    .filter((job) => job.status === "success" && job.sourceName === "中国福彩网" && job.finishedAt)
    .sort((a, b) => String(b.finishedAt).localeCompare(String(a.finishedAt)))[0];
  if (!latestSuccess?.finishedAt) return true;
  return now.getTime() - new Date(latestSuccess.finishedAt).getTime() > ttlMs;
}

export async function ensureFreshSsqData(ttlMs = 60 * 60 * 1000): Promise<void> {
  const db = await readDb();
  if (!needsRefresh(db, new Date(), ttlMs)) return;
  await refreshSsqData();
}

export async function upsertDraws(draws: DrawResult[]) {
  const db = await readDb();
  let successCount = 0;
  let failedCount = 0;
  for (const draw of draws) {
    const validation = validateSsqNumbers(draw.redNumbers, draw.blueNumbers);
    if (!validation.valid) {
      failedCount += 1;
      db.dataQualityIssues.push({
        id: makeId("issue"),
        issueType: "号码格式异常",
        entityType: "draw_result",
        entityId: draw.issueNo,
        description: validation.errors.join("；"),
        severity: "P0",
        status: "pending",
        createdAt: new Date().toISOString()
      });
      continue;
    }
    const index = db.draws.findIndex((item) => item.issueNo === draw.issueNo);
    if (index >= 0) db.draws[index] = { ...db.draws[index], ...draw };
    else db.draws.push(draw);
    successCount += 1;
  }
  await writeDb(db);
  return { successCount, failedCount };
}

export async function refreshSsqData() {
  const db = await readDb();
  const jobId = makeId("job");
  db.crawlerJobs.unshift({
    id: jobId,
    jobType: "fetch-latest-ssq-draw",
    sourceName: "中国福彩网",
    status: "running",
    startedAt: new Date().toISOString(),
    successCount: 0,
    failedCount: 0
  });
  await writeDb(db);

  try {
    let draws: DrawResult[] = [];
    let source = "official";
    try {
      draws = await fetchOfficialSsqDraws();
    } catch {
      draws = sampleDraws;
      source = "sample-fallback";
    }
    const result = await upsertDraws(draws);
    const nextDb = await readDb();
    const job = nextDb.crawlerJobs.find((item) => item.id === jobId);
    if (job) {
      job.status = "success";
      job.finishedAt = new Date().toISOString();
      job.successCount = result.successCount;
      job.failedCount = result.failedCount;
    }
    const sourceUrl = `local://refresh/${source}`;
    if (!nextDb.articles.some((article) => article.sourceUrl === sourceUrl)) {
      nextDb.articles.unshift({
        id: makeId("article"),
        title: source === "official" ? "已从官方来源刷新双色球开奖数据" : "官方数据暂不可用，已使用本地示例数据保障演示",
        summary: source === "official" ? "系统完成一次官方开奖数据刷新。" : "本地演示环境会自动回退到示例数据，网站仍可完整浏览。",
        sourceName: "系统任务",
        sourceUrl,
        publishedAt: new Date().toISOString(),
        category: "开奖公告",
        lotteryCode: "ssq",
        credibility: source === "official" ? "官方" : "本站整理",
        status: "published"
      });
    }
    crypto.createHash("sha1").update(source).digest("hex");
    await writeDb(nextDb);
    return { ...result, source };
  } catch (error) {
    const nextDb = await readDb();
    const job = nextDb.crawlerJobs.find((item) => item.id === jobId);
    if (job) {
      job.status = "failed";
      job.finishedAt = new Date().toISOString();
      job.failedCount = 1;
      job.errorMessage = error instanceof Error ? error.message : "未知错误";
    }
    await writeDb(nextDb);
    throw error;
  }
}
