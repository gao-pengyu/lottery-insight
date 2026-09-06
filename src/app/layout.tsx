import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "彩数洞察 - 双色球数据分析与号码生成",
  description: "本地可运行的彩票信息网站 最小可用版本，提供双色球历史开奖、数据分析、娱乐性号码生成和资讯聚合。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <nav className="container nav">
            <Link href="/" className="logo">彩数洞察</Link>
            <div className="navLinks">
              <Link href="/ssq">双色球</Link>
              <Link href="/ssq/history">历史开奖</Link>
              <Link href="/ssq/analysis">数据分析</Link>
              <Link href="/ssq/predict">号码生成</Link>
              <Link href="/news">彩票资讯</Link>
              <Link href="/admin">后台</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">本站仅提供公开信息整理和娱乐性数据分析，不销售彩票，不提供投注服务。</div>
        </footer>
      </body>
    </html>
  );
}
