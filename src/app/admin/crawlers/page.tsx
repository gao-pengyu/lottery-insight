export const dynamic = "force-dynamic";

import { RefreshButton } from "@/components/RefreshButton";
import { readDb } from "@/lib/store";
import { formatDate } from "@/lib/format";

export default async function CrawlersPage() {
  const db = await readDb();
  const jobs = [...db.crawlerJobs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 50);
  return (
    <div className="container">
      <div className="pageTitle"><h1>采集任务管理</h1><p className="muted">可通过接口 POST /api/crawlers/refresh 手动刷新双色球数据。</p><RefreshButton /></div>
      <table className="table"><thead><tr><th>任务</th><th>来源</th><th>状态</th><th>时间</th><th>结果</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id}><td>{job.jobType}</td><td>{job.sourceName}</td><td>{job.status}</td><td>{formatDate(job.startedAt)}</td><td>成功 {job.successCount} / 失败 {job.failedCount}</td></tr>)}</tbody></table>
    </div>
  );
}
