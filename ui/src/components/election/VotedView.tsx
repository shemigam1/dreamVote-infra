import ResultsChart from "./ResultsChart";

export default function VotedView({
  poll,
  votedFor,
  total,
  onRefresh,
}: {
  poll: Record<string, number>;
  votedFor: string;
  total: number;
  onRefresh: () => void;
}) {
  return (
    <>
      <div className="bg-[rgba(0,128,96,0.16)] border border-[rgba(0,128,96,0.4)] rounded-xl px-4 py-4 mb-7 flex items-center gap-3.5">
        <span className="w-9 h-9 rounded-full bg-[#008060] text-white flex items-center justify-center text-base font-bold flex-shrink-0">
          ✓
        </span>
        <div>
          <p className="text-[15px] font-semibold text-[#4FD1A8] mb-0.5">
            You voted for {votedFor}
          </p>
          <p className="text-sm text-[#9BA9C7]">
            Your vote is recorded and cannot be changed.
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-3.5 gap-3 flex-wrap">
        <div>
          <div className="text-[11px] text-[#6B7A9E] uppercase tracking-[0.08em] mb-1">
            Current results
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {total}{" "}
            <span className="text-sm font-normal text-[#9BA9C7]">votes</span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="text-[#9BA9C7] hover:text-[#F4F5F7] border border-[#1A2D5A] hover:border-[#2A4480] text-xs px-3 py-1.5 rounded-lg transition"
        >
          ↻ Refresh
        </button>
      </div>
      <ResultsChart poll={poll} votedFor={votedFor} showWinner={false} />
    </>
  );
}
