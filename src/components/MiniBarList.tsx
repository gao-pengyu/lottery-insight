export function MiniBarList({
  title,
  rows,
  valueLabel = "次"
}: {
  title: string;
  rows: Array<{ label: string | number; value: number; helper?: string }>;
  valueLabel?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="barList">
        {rows.map((row) => (
          <div className="barRow" key={row.label}>
            <span className="barLabel">{row.label}</span>
            <span className="barTrack">
              <span className="barFill" style={{ width: `${Math.max(6, (row.value / max) * 100)}%` }} />
            </span>
            <span className="barValue">{row.value}{valueLabel}</span>
            {row.helper ? <span className="helper">{row.helper}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
