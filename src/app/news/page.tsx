export const dynamic = "force-dynamic";

import Link from "next/link";
import { getPublishedArticles } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function NewsPage() {
  const articles = await getPublishedArticles(50);
  return (
    <div className="container">
      <div className="pageTitle"><h1>彩票资讯与中奖故事</h1><p className="muted">展示开奖公告、风险提示、数据趣闻等内容。当前版本仅展示摘要和来源。</p></div>
      <div className="newsList">
        {articles.map((article) => (
          <Link className="card" key={article.id} href={`/news/${article.id}`}>
            <span className="badge">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <p className="muted">{article.sourceName} · {formatDate(article.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
