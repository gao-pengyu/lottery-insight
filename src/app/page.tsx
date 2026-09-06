export const dynamic = "force-dynamic";

import Link from "next/link";
import { BallGroup } from "@/components/Ball";
import { Disclaimer } from "@/components/Disclaimer";
import { MiniBarList } from "@/components/MiniBarList";
import { StatCard } from "@/components/StatCard";
import { formatDate, formatMoney } from "@/lib/format";
import { getLatestSsqDraw, getPublishedArticles, getSsqAnalysis } from "@/lib/data";

export default async function Home() {
  const [latest, analysis, articles] = await Promise.all([getLatestSsqDraw(), getSsqAnalysis(30), getPublishedArticles(5)]);

  return (
    <div className="container">
      <section className="hero">
        <div className="heroCard">
          <div className="eyebrow">福利彩票 · 双色球最小可用版本</div>
          <h1>看开奖、做分析、生成娱乐性参考号码</h1>
          <p className="muted">本地可运行的彩票信息站，已包含历史开奖、频率遗漏、和值趋势、中奖资讯与后台采集状态。</p>
          {latest ? <BallGroup red={latest.redNumbers} blue={latest.blueNumbers} /> : null}
          <div className="buttonRow">
            <Link className="primaryButton" href="/ssq/history">查看历史开奖</Link>
            <Link className="secondaryButton" href="/ssq/predict">生成参考号码</Link>
          </div>
        </div>
        <div className="grid">
          <StatCard label="最新期号" value={latest?.issueNo ?? "暂无"} helper={latest ? formatDate(latest.drawDate) : "请先初始化数据"} />
          <StatCard label="当前奖池" value={latest ? formatMoney(latest.poolAmount) : "暂无"} helper="示例或官方公开数据" />
        </div>
      </section>
      <Disclaimer />
      <section className="section grid cols3">
        <StatCard label="已收录期数" value={analysis.totalDraws} helper={`近 ${analysis.window} 期分析`} />
        <StatCard label="最高热号" value={analysis.hotRed[0]?.number ?? "-"} helper={`${analysis.hotRed[0]?.count ?? 0} 次出现`} />
        <StatCard label="最长遗漏" value={analysis.coldRed[0]?.number ?? "-"} helper={`遗漏 ${analysis.coldRed[0]?.currentOmission ?? 0} 期`} />
      </section>
      <section className="section grid cols2">
        <MiniBarList title="近 30 期热号" rows={analysis.hotRed.slice(0, 8).map((item) => ({ label: String(item.number).padStart(2, "0"), value: item.count }))} />
        <div className="card">
          <h3>最新资讯</h3>
          <div className="newsList">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`}>
                <span className="badge">{article.category}</span>
                <h3>{article.title}</h3>
                <p className="muted">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
