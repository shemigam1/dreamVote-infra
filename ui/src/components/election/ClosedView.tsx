import ResultsChart from "./ResultsChart";

export default function ClosedView({
  poll,
  total,
}: {
  poll: Record<string, number>;
  total: number;
}) {
  return (
    <>
      <div className="flex items-baseline justify-between mb-3.5 gap-3 flex-wrap">
        <div>
          <div className="text-[11px] text-[#6B7A9E] uppercase tracking-[0.08em] mb-1">
            Final results
          </div>
          <div className="text-[32px] font-bold tabular-nums">
            {total}{" "}
            <span className="text-sm font-normal text-[#9BA9C7]">
              total votes
            </span>
          </div>
        </div>
      </div>
      <ResultsChart poll={poll} showWinner />
    </>
  );
}
