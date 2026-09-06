"use client";

import { useState } from "react";

export function RefreshButton() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/crawlers/refresh", { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "刷新失败");
      setStatus(`已刷新：${json.source === "official" ? "官方数据" : "本地兜底数据"}，成功 ${json.successCount} 条`);
      window.location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "刷新失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="refreshBox">
      <button className="primaryButton" onClick={refresh} disabled={loading}>{loading ? "刷新中..." : "刷新官方数据"}</button>
      {status ? <span className="helper">{status}</span> : <span className="helper">如页面不是最新，可手动拉取一次官方公开数据。</span>}
    </div>
  );
}
