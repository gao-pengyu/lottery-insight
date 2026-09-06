import type { Article, DrawResult } from "./types";
import { analyzeDraws } from "./analysis";
import { readDb } from "./store";
import { ensureFreshSsqData } from "./crawler";

function sortDesc(draws: DrawResult[]): DrawResult[] {
  return [...draws].sort((a, b) => b.drawDate.localeCompare(a.drawDate) || b.issueNo.localeCompare(a.issueNo));
}

export async function getSsqDraws(limit = 100, options: { autoRefresh?: boolean } = {}): Promise<DrawResult[]> {
  if (options.autoRefresh !== false) await ensureFreshSsqData();
  const db = await readDb();
  return sortDesc(db.draws).slice(0, limit);
}

export async function getSsqDrawsAscending(limit = 100, options: { autoRefresh?: boolean } = {}): Promise<DrawResult[]> {
  return (await getSsqDraws(limit, options)).reverse();
}

export async function getLatestSsqDraw() {
  await ensureFreshSsqData();
  const db = await readDb();
  const latest = sortDesc(db.draws)[0];
  if (!latest) return null;
  return {
    ...latest,
    prizeLevels: db.prizeLevels[latest.id] ?? [],
    regions: db.regions.filter((region) => region.drawId === latest.id),
    stations: db.stations.filter((station) => station.drawId === latest.id)
  };
}

export async function getSsqDrawDetail(issueNo: string) {
  await ensureFreshSsqData();
  const db = await readDb();
  const draw = db.draws.find((item) => item.issueNo === issueNo);
  if (!draw) return null;
  return {
    ...draw,
    prizeLevels: db.prizeLevels[draw.id] ?? [],
    regions: db.regions.filter((region) => region.drawId === draw.id),
    stations: db.stations.filter((station) => station.drawId === draw.id)
  };
}

export async function getSsqAnalysis(window = 100) {
  const draws = await getSsqDrawsAscending(window);
  return analyzeDraws(draws, window);
}

export async function getPublishedArticles(limit = 20): Promise<Article[]> {
  const db = await readDb();
  return db.articles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const db = await readDb();
  return db.articles.find((article) => article.id === id);
}

export async function getAdminSummary() {
  const db = await readDb();
  const jobs = [...db.crawlerJobs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 8);
  const issues = [...db.dataQualityIssues].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  return {
    drawCount: db.draws.length,
    articleCount: db.articles.length,
    jobCount: db.crawlerJobs.length,
    issueCount: db.dataQualityIssues.filter((issue) => issue.status === "pending").length,
    jobs,
    issues
  };
}
