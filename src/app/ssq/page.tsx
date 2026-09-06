export const dynamic = "force-dynamic";

import Link from "next/link";
import { BallGroup } from "@/components/Ball";
import { Disclaimer } from "@/components/Disclaimer";
import { StatCard } from "@/components/StatCard";
import { getLatestSsqDraw, getSsqAnalysis } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

export default async function SsqPage() {
  const [latest, analysis] = await Promise.all([getLatestSsqDraw(), getSsqAnalysis(30)]);
  return (
    <div className="container">
      <div className="pageTitle">
        <div className="eyebrow">双色球专题</div>
        <h1>双色球开奖与数据中心</h1>
        <p className="muted">覆盖最新开奖、历史数据、号码分析、奖金趋势和娱乐性号码生成。</p>
      </div>
      <Disclaimer />
      {latest ? (
        <section className="card">
          <div className="rowBetween">
            <div>
              <h2>第 {latest.issueNo} 期</h2>
              <p className="muted">开奖日期：{formatDate(latest.drawDate)} · 来源：{latest.sourceName}</p>
            </div>
            <Link className="secondaryButton" href={`/ssq/draws/${latest.issueNo}`}>查看详情</Link>
          </div>
          <BallGroup red={latest.redNumbers} blue={latest.blueNumbers} />
        </section>
      ) : null}
      <section className="section grid cols3">
        <StatCard label="奖池金额" value={latest ? formatMoney(latest.poolAmount) : "暂无"} />
        <StatCard label="近 30 期均值" value={Math.round(analysis.sumTrend.reduce((sum, item) => sum + item.sum, 0) / Math.max(analysis.sumTrend.length, 1))} helper="红球和值" />
        <StatCard label="数据状态" value={latest?.verifiedStatus === "verified" ? "已校验" : "待确认"} helper="本地演示可手动刷新" />
      </section>
      <section className="section grid cols3">
        <Link className="card" href="/ssq/history"><h3>历史开奖</h3><p className="muted">按期号查看开奖数据。</p></Link>
        <Link className="card" href="/ssq/analysis"><h3>数据分析</h3><p className="muted">频率、遗漏、和值、奇偶比。</p></Link>
        <Link className="card" href="/ssq/predict"><h3>号码生成</h3><p className="muted">根据规则生成娱乐参考号码。</p></Link>
      </section>
    </div>
  );
}
