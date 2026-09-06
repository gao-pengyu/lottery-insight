import { notFound } from "next/navigation";
import { getArticle } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();
  return (
    <div className="container">
      <article className="pageTitle">
        <span className="badge">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="muted">{article.sourceName} · {formatDate(article.publishedAt)} · 可信度：{article.credibility}</p>
      </article>
      <section className="card">
        <p>{article.summary}</p>
        <p className="muted">为降低版权风险，当前版本只展示摘要、来源和链接，不搬运原文全文。</p>
        <p className="muted">来源链接：{article.sourceUrl}</p>
      </section>
    </div>
  );
}
