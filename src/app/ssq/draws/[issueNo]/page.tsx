export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { BallGroup } from "@/components/Ball";
import { StatCard } from "@/components/StatCard";
import { getSsqDrawDetail } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

export default async function DrawDetailPage({ params }: { params: Promise<{ issueNo: string }> }) {
  const { issueNo } = await params;
  const draw = await getSsqDrawDetail(issueNo);
  if (!draw) notFound();
  return (
    <div className="container">
      <div className="pageTitle">
        <h1>双色球第 {draw.issueNo} 期开奖详情</h1>
        <p className="muted">开奖日期：{formatDate(draw.drawDate)} · 来源：{draw.sourceName}</p>
      </div>
      <section className="card"><BallGroup red={draw.redNumbers} blue={draw.blueNumbers} /></section>
      <section className="section grid cols3">
        <StatCard label="销售金额" value={formatMoney(draw.salesAmount)} />
        <StatCard label="奖池金额" value={formatMoney(draw.poolAmount)} />
        <StatCard label="校验状态" value={draw.verifiedStatus === "verified" ? "已校验" : "待确认"} />
      </section>
      <section className="section grid cols2">
        <div className="card">
          <h3>奖级分布</h3>
          <table className="table"><tbody>{draw.prizeLevels.map((level) => <tr key={level.level}><td>{level.level}</td><td>{level.winningCount.toLocaleString("zh-CN")} 注</td><td>{formatMoney(level.prizeAmount)}</td></tr>)}</tbody></table>
        </div>
        <div className="card">
          <h3>中奖地区</h3>
          <table className="table"><tbody>{draw.regions.map((region) => <tr key={region.id}><td>{region.province}{region.city ?? ""}</td><td>{region.winningCount} 注</td><td>{formatMoney(region.amount)}</td></tr>)}</tbody></table>
        </div>
      </section>
      <section className="section card">
        <h3>公开站点信息</h3>
        <table className="table"><tbody>{draw.stations.map((station) => <tr key={station.id}><td>{station.stationNo}</td><td>{station.province}{station.city}{station.district}</td><td>{station.address}</td><td>{formatMoney(station.amount)}</td></tr>)}</tbody></table>
      </section>
    </div>
  );
}
