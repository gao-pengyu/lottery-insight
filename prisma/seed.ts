import { writeDb } from "../src/lib/store";
import { sampleArticles, sampleDraws, samplePrizeLevels } from "../src/lib/sample-data";

async function main() {
  const latest = sampleDraws.at(-1);
  await writeDb({
    draws: sampleDraws,
    prizeLevels: latest ? { [latest.id]: samplePrizeLevels } : {},
    regions: latest
      ? [
          { id: "region-1", drawId: latest.id, province: "广东", city: "广州", winningCount: 2, amount: 14_400_000, sourceUrl: "local://seed/region" },
          { id: "region-2", drawId: latest.id, province: "浙江", city: "杭州", winningCount: 1, amount: 7_200_000, sourceUrl: "local://seed/region" },
          { id: "region-3", drawId: latest.id, province: "山东", city: "青岛", winningCount: 1, amount: 7_200_000, sourceUrl: "local://seed/region" }
        ]
      : [],
    stations: latest
      ? [
          { id: "station-1", drawId: latest.id, stationNo: "44010001", province: "广东", city: "广州", district: "天河区", address: "示例路 100 号", amount: 7_200_000, sourceUrl: "local://seed/station" },
          { id: "station-2", drawId: latest.id, stationNo: "33010001", province: "浙江", city: "杭州", district: "西湖区", address: "示例街 88 号", amount: 7_200_000, sourceUrl: "local://seed/station" }
        ]
      : [],
    articles: sampleArticles,
    crawlerJobs: [
      { id: "job-seed", jobType: "seed-local-data", sourceName: "本地示例数据", status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), successCount: sampleDraws.length, failedCount: 0 }
    ],
    dataQualityIssues: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
