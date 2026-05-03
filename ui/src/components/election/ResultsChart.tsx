export default function ResultsChart({
  poll,
  showWinner,
  votedFor,
}: {
  poll: Record<string, number>;
  showWinner: boolean;
  votedFor?: string;
}) {
  const entries = Object.entries(poll).sort(([, a], [, b]) => b - a);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;

  if (entries.length === 0) {
    return (
      <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl px-4 py-7 text-center text-sm text-[#6B7A9E]">
        No votes yet.
      </div>
    );
  }

  return (
    <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl p-4">
      {entries.map(([name, count], i) => {
        const pct = Math.round((count / total) * 100);
        const barPct = Math.round((count / max) * 100);
        const isWinner = showWinner && i === 0;
        const isYours = votedFor === name;
        return (
          <div
            key={name}
            className={`py-3 ${i < entries.length - 1 ? "border-b border-[#1A2D5A]" : ""}`}
          >
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                <span
                  className={`text-[15px] ${isWinner ? "font-semibold" : "font-medium"}`}
                >
                  {name}
                </span>
                {isWinner && (
                  <span className="text-[10px] font-semibold bg-[rgba(0,128,96,0.16)] text-[#4FD1A8] px-2 py-0.5 rounded-full border border-[rgba(0,128,96,0.3)] uppercase tracking-[0.06em]">
                    Winner
                  </span>
                )}
                {isYours && (
                  <span className="text-[10px] font-medium bg-[rgba(3,87,238,0.14)] text-[#7FA8FF] px-2 py-0.5 rounded-full border border-[rgba(3,87,238,0.45)]">
                    Your vote
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 tabular-nums flex-shrink-0">
                <span className="text-lg font-bold">{count}</span>
                <span className="text-xs text-[#6B7A9E]">{pct}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-[#02102D] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${barPct}%`,
                  background: isWinner ? "#008060" : "#0357EE",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
