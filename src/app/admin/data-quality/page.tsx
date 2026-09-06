export const dynamic = "force-dynamic";

import { readDb } from "@/lib/store";

export default async function DataQualityPage() {
  const db = await readDb();
  const issues = [...db.dataQualityIssues].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
  return (
    <div className="container">
      <div className="pageTitle"><h1>数据质量审核</h1><p className="muted">展示采集和校验过程中发现的问题。</p></div>
      <table className="table"><thead><tr><th>等级</th><th>类型</th><th>对象</th><th>描述</th><th>状态</th></tr></thead><tbody>{issues.map((issue) => <tr key={issue.id}><td>{issue.severity}</td><td>{issue.issueType}</td><td>{issue.entityId}</td><td>{issue.description}</td><td>{issue.status}</td></tr>)}</tbody></table>
    </div>
  );
}
