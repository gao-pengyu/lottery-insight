"use client";

import { useState } from "react";
import { BallGroup } from "./Ball";
import { parseNumberList } from "@/lib/number-input";
import type { PredictionMode, PredictionResult } from "@/lib/types";

const modes: Array<{ value: PredictionMode; label: string }> = [
  { value: "mixed", label: "混合权重" },
  { value: "random", label: "随机均衡" },
  { value: "hot", label: "热号优先" },
  { value: "cold", label: "冷号回补" },
  { value: "custom", label: "自定义规则" }
];


export function PredictionForm() {
  const [mode, setMode] = useState<PredictionMode>("mixed");
  const [count, setCount] = useState(5);
  const [historyWindow, setHistoryWindow] = useState(30);
  const [mustIncludeRed, setMustIncludeRed] = useState("");
  const [excludeRed, setExcludeRed] = useState("");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/predictions/ssq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          count,
          historyWindow,
          constraints: {
            mustIncludeRed: parseNumberList(mustIncludeRed),
            excludeRed: parseNumberList(excludeRed),
            sumRange: [70, 130],
            oddEvenRatio: ["2:4", "3:3", "4:2"],
            bigSmallRatio: ["2:4", "3:3", "4:2"],
            allowConsecutive: true,
            allowRepeatFromLastDraw: true
          }
        })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "生成失败");
      setResults(json.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="predictionGrid">
      <div className="card formCard">
        <label>
          生成模式
          <select value={mode} onChange={(event) => setMode(event.target.value as PredictionMode)}>
            {modes.map((item) => (
              <option value={item.value} key={item.value}>{item.label}</option>
            ))}
          </select>
        </label>
        <label>
          生成注数
          <input type="number" min="1" max="20" value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </label>
        <label>
          统计期数
          <input type="number" min="5" max="200" value={historyWindow} onChange={(event) => setHistoryWindow(Number(event.target.value))} />
        </label>
        <label>
          必选红球（用逗号分隔）
          <input value={mustIncludeRed} placeholder="例如：6, 8" onChange={(event) => setMustIncludeRed(event.target.value)} />
        </label>
        <label>
          排除红球（用逗号分隔）
          <input value={excludeRed} placeholder="例如：13, 14" onChange={(event) => setExcludeRed(event.target.value)} />
        </label>
        <button className="primaryButton" onClick={generate} disabled={loading}>{loading ? "生成中..." : "生成参考号码"}</button>
        {error ? <p className="errorText">{error}</p> : null}
      </div>

      <div className="resultsStack">
        {results.map((item, index) => (
          <div className="card resultCard" key={`${item.red.join("-")}-${item.blue.join("-")}`}>
            <div className="rowBetween">
              <strong>第 {index + 1} 组</strong>
              <span className="score">评分 {item.score}</span>
            </div>
            <BallGroup red={item.red} blue={item.blue} />
            <div className="featureLine">和值 {item.features.sum} · 奇偶 {item.features.oddEvenRatio} · 大小 {item.features.bigSmallRatio} · 区间 {item.features.zoneRatio}</div>
            <p className="muted">{item.reason}</p>
          </div>
        ))}
        {results.length === 0 ? <div className="emptyState">选择规则后生成号码。结果仅用于娱乐和规则演示。</div> : null}
      </div>
    </div>
  );
}
