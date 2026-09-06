export function Ball({ value, color = "red" }: { value: number; color?: "red" | "blue" }) {
  return <span className={`ball ${color === "blue" ? "ballBlue" : "ballRed"}`}>{String(value).padStart(2, "0")}</span>;
}

export function BallGroup({ red, blue }: { red: number[]; blue: number[] }) {
  return (
    <div className="ballGroup" aria-label={`红球 ${red.join("、")} 蓝球 ${blue.join("、")}`}>
      {red.map((number) => (
        <Ball key={`r-${number}`} value={number} />
      ))}
      {blue.map((number) => (
        <Ball key={`b-${number}`} value={number} color="blue" />
      ))}
    </div>
  );
}
