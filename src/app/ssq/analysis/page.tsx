export const dynamic = "force-dynamic";

import { MiniBarList } from "@/components/MiniBarList";
import { StatCard } from "@/components/StatCard";
import { getSsqAnalysis } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default async function AnalysisPage() {
  const analysis = await getSsqAnalysis(100);
  const latestPrize = analysis.prizeTrend.at(-1);
  const averageSum = Math.round(analysis.sumTrend.reduce((total, item) => total + item.sum, 0) / Math.max(analysis.sumTrend.length, 1));
  return (
    <div className="container">
      <div className="pageTitle">
        <h1>双色球数据分析</h1>
        <p className="muted">当前展示频率、遗漏、和值、奇偶比、大小比等 核心指标。</p>
      </div>
      <section className="grid cols3">
        <StatCard label="分析期数" value={analysis.totalDraws} />
        <StatCard label="红球平均和值" value={averageSum} />
        <StatCard label="最新奖池" value={latestPrize ? formatMoney(latestPrize.poolAmount) : "暂无"} />
      </section>
      <section className="section grid cols2">
        <MiniBarList title="红球出现频率前 10" rows={analysis.hotRed.slice(0, 10).map((item) => ({ label: String(item.number).padStart(2, "0"), value: item.count, helper: `遗漏 ${item.currentOmission}` }))} />
        <MiniBarList title="当前遗漏前 10" rows={analysis.coldRed.slice(0, 10).map((item) => ({ label: String(item.number).padStart(2, "0"), value: item.currentOmission, helper: `出现 ${item.count}` }))} valueLabel="期" />
      </section>
      <section className="section grid cols3">
        <div className="card"><h3>奇偶比分布</h3><pre>{JSON.stringify(analysis.ratioSummary.oddEven, null, 2)}</pre></div>
        <div className="card"><h3>大小比分布</h3><pre>{JSON.stringify(analysis.ratioSummary.bigSmall, null, 2)}</pre></div>
        <div className="card"><h3>区间分布</h3><pre>{JSON.stringify(analysis.ratioSummary.zone, null, 2)}</pre></div>
      </section>
      <section className="section card">
        <h3>最近和值走势</h3>
        <table className="table"><thead><tr><th>期号</th><th>和值</th></tr></thead><tbody>{analysis.sumTrend.slice(-20).reverse().map((item) => <tr key={item.issueNo}><td>{item.issueNo}</td><td>{item.sum}</td></tr>)}</tbody></table>
      </section>
    </div>
  );
}
