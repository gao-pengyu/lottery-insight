import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Article, DrawResult, PrizeLevel } from "./types";

export interface RegionRecord {
  id: string;
  drawId: string;
  province: string;
  city?: string | null;
  winningCount: number;
  amount: number;
  sourceUrl?: string | null;
}

export interface StationRecord {
  id: string;
  drawId: string;
  stationNo: string;
  province: string;
  city?: string | null;
  district?: string | null;
  address: string;
  amount: number;
  sourceUrl?: string | null;
}

export interface CrawlerJobRecord {
  id: string;
  jobType: string;
  sourceName: string;
  status: string;
  startedAt: string;
  finishedAt?: string | null;
  successCount: number;
  failedCount: number;
  errorMessage?: string | null;
}

export interface DataQualityIssueRecord {
  id: string;
  issueType: string;
  entityType: string;
  entityId: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface LocalDb {
  draws: DrawResult[];
  prizeLevels: Record<string, PrizeLevel[]>;
  regions: RegionRecord[];
  stations: StationRecord[];
  articles: Article[];
  crawlerJobs: CrawlerJobRecord[];
  dataQualityIssues: DataQualityIssueRecord[];
}

export const dbPath = path.join(process.cwd(), "data", "db.json");

export function emptyDb(): LocalDb {
  return { draws: [], prizeLevels: {}, regions: [], stations: [], articles: [], crawlerJobs: [], dataQualityIssues: [] };
}

export async function readDb(): Promise<LocalDb> {
  try {
    const raw = await readFile(dbPath, "utf8");
    return { ...emptyDb(), ...(JSON.parse(raw) as LocalDb) };
  } catch {
    return emptyDb();
  }
}

export async function writeDb(db: LocalDb): Promise<void> {
  await mkdir(path.dirname(dbPath), { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
