import { Disclaimer } from "@/components/Disclaimer";
import { PredictionForm } from "@/components/PredictionForm";

export default function PredictPage() {
  return (
    <div className="container">
      <div className="pageTitle">
        <h1>双色球号码生成</h1>
        <p className="muted">根据历史频率、遗漏、和值、奇偶比等规则生成娱乐性参考号码。</p>
      </div>
      <Disclaimer />
      <PredictionForm />
    </div>
  );
}
