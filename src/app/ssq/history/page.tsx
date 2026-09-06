export const dynamic = "force-dynamic";

import Link from "next/link";
import { BallGroup } from "@/components/Ball";
import { RefreshButton } from "@/components/RefreshButton";
import { getSsqDraws } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

export default async function HistoryPage() {
  const draws = await getSsqDraws(80);
  return (
    <div className="container">
      <div className="pageTitle">
        <h1>双色球历史开奖</h1>
        <p className="muted">展示最近收录的双色球开奖数据，支持后续扩展筛选和导出。</p>
        <RefreshButton />
      </div>
      <div className="tableWrap">
        <table className="table">
          <thead><tr><th>期号</th><th>日期</th><th>开奖号码</th><th>销售额</th><th>奖池</th><th>来源</th></tr></thead>
          <tbody>
            {draws.map((draw) => (
              <tr key={draw.id}>
                <td><Link href={`/ssq/draws/${draw.issueNo}`}>{draw.issueNo}</Link></td>
                <td>{formatDate(draw.drawDate)}</td>
                <td><BallGroup red={draw.redNumbers} blue={draw.blueNumbers} /></td>
                <td>{formatMoney(draw.salesAmount)}</td>
                <td>{formatMoney(draw.poolAmount)}</td>
                <td>{draw.sourceName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
