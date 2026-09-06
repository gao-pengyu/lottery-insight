import { describe, expect, it } from "vitest";
import { needsRefresh } from "../lib/crawler";
import type { LocalDb } from "../lib/store";

const baseDb: LocalDb = {
  draws: [],
  prizeLevels: {},
  regions: [],
  stations: [],
  articles: [],
  crawlerJobs: [],
  dataQualityIssues: []
};

describe("needsRefresh", () => {
  it("requests refresh when there is no successful official crawler job", () => {
    expect(needsRefresh(baseDb, new Date("2026-09-06T10:00:00.000Z"), 60 * 60 * 1000)).toBe(true);
  });

  it("does not request refresh when successful official data was refreshed recently", () => {
    const db: LocalDb = {
      ...baseDb,
      crawlerJobs: [
        {
          id: "job-1",
          jobType: "fetch-latest-ssq-draw",
          sourceName: "中国福彩网",
          status: "success",
          startedAt: "2026-09-06T09:30:00.000Z",
          finishedAt: "2026-09-06T09:30:05.000Z",
          successCount: 30,
          failedCount: 0
        }
      ]
    };

    expect(needsRefresh(db, new Date("2026-09-06T10:00:00.000Z"), 60 * 60 * 1000)).toBe(false);
  });
});
