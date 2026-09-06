export const dynamic = "force-dynamic";

import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { getAdminSummary } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminPage() {
  const summary = await getAdminSummary();
  return (
    <div className="container">
      <div className="pageTitle"><h1>后台监控</h1><p className="muted">当前版本提供采集任务、数据量和质量问题的只读监控。</p></div>
      <section className="grid cols3">
        <StatCard label="开奖记录" value={summary.drawCount} />
        <StatCard label="资讯文章" value={summary.articleCount} />
        <StatCard label="待处理问题" value={summary.issueCount} />
      </section>
      <section className="section card">
        <div className="rowBetween"><h3>采集任务</h3><Link className="secondaryButton" href="/admin/crawlers">查看全部</Link></div>
        <table className="table"><tbody>{summary.jobs.map((job) => <tr key={job.id}><td>{job.jobType}</td><td>{job.status}</td><td>{formatDate(job.startedAt)}</td><td>成功 {job.successCount} / 失败 {job.failedCount}</td></tr>)}</tbody></table>
      </section>
    </div>
  );
}
