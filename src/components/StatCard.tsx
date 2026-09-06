export function StatCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <div className="statCard">
      <div className="muted">{label}</div>
      <div className="statValue">{value}</div>
      {helper ? <div className="helper">{helper}</div> : null}
    </div>
  );
}
