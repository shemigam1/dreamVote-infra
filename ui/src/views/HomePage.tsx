import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../store/store";
import Navbar from "../components/Navbar";
import PhaseBadge, { getPhase } from "../components/PhaseBadge";
import { useGetAllElectionsQuery } from "../api/election";

type ElectionSummary = {
  id: string;
  title: string | null;
  createdAt: string;
  active: boolean;
  candidateCount: number;
  voteCount: number;
};

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl p-4">
      <div
        className="flex items-center gap-1.5 text-xs font-medium mb-2.5"
        style={{ color }}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-[32px] font-bold tracking-[-0.03em] tabular-nums">
        {value}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const voter = useSelector((state: RootState) => state.voter.voter);
  const { data: response, isLoading } = useGetAllElectionsQuery(undefined, {
    skip: !voter?.isLoggedIn,
  });

  useEffect(() => {
    if (!voter || !voter.isLoggedIn) navigate("/auth");
  }, [voter, navigate]);

  if (!voter || !voter.isLoggedIn) return null;

  const elections: ElectionSummary[] = Array.isArray(response?.data) ? response.data : [];

  const counts = {
    voting: elections.filter((e) => getPhase(e.active, e.voteCount) === "voting").length,
    nomination: elections.filter((e) => getPhase(e.active, e.voteCount) === "nomination").length,
    closed: elections.filter((e) => getPhase(e.active, e.voteCount) === "closed").length,
  };

  const grouped: Record<string, ElectionSummary[]> = {
    voting: elections.filter((e) => getPhase(e.active, e.voteCount) === "voting"),
    nomination: elections.filter((e) => getPhase(e.active, e.voteCount) === "nomination"),
    closed: elections.filter((e) => getPhase(e.active, e.voteCount) === "closed"),
  };

  return (
    <div className="min-h-screen bg-[#02102D] text-[#F4F5F7]">
      <Navbar />
      <div className="max-w-[680px] mx-auto px-5 py-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[28px] font-bold tracking-tight mb-1.5">
              Elections
            </h2>
            <p className="text-sm text-[#9BA9C7]">
              {elections.length} total · {counts.voting} open for voting
            </p>
          </div>
          <button
            onClick={() => navigate("/elections/new")}
            className="bg-[#0357EE] hover:bg-[#0048D1] text-white text-sm font-semibold px-4 py-2.5 rounded-[10px] transition"
          >
            + New election
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard icon="●" label="Voting open" value={counts.voting} color="#7FA8FF" />
          <StatCard icon="◔" label="In nomination" value={counts.nomination} color="#F5C16C" />
          <StatCard icon="▣" label="Closed" value={counts.closed} color="#9BA9C7" />
        </div>

        {isLoading && (
          <p className="text-center text-[#6B7A9E] py-12 font-mono text-sm">
            loading elections...
          </p>
        )}

        {!isLoading && elections.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#9BA9C7] mb-1">No elections yet.</p>
            <p className="text-[#6B7A9E] text-sm">
              Create one to get started.
            </p>
          </div>
        )}

        {(["voting", "nomination", "closed"] as const).map((phase) => {
          const items = grouped[phase];
          if (items.length === 0) return null;
          return (
            <div key={phase} className="mb-8">
              <div className="flex items-center gap-3 mb-3.5">
                <PhaseBadge phase={phase} />
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((e) => (
                  <ElectionCard
                    key={e.id}
                    election={e}
                    phase={phase}
                    onClick={() => navigate(`/elections/${e.id}`)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ElectionCard({
  election,
  phase,
  onClick,
}: {
  election: ElectionSummary;
  phase: "nomination" | "voting" | "closed";
  onClick: () => void;
}) {
  const slug = `election-${new Date(election.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toLowerCase().replace(" ", "-")}-${election.id.slice(-4)}`;

  return (
    <button
      onClick={onClick}
      className="block w-full text-left bg-[#081A3A] border border-[#1A2D5A] rounded-xl px-5 py-4 hover:border-[#2A4480] hover:bg-[#0D2145] transition"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {election.title ? (
            <>
              <div className="text-[15px] font-semibold tracking-tight truncate">
                {election.title}
              </div>
              <div className="font-mono text-[11px] text-[#6B7A9E] mb-2.5 truncate">
                {slug}
              </div>
            </>
          ) : (
            <div className="font-mono text-[13px] text-[#9BA9C7] mb-2.5 truncate">
              {slug}
            </div>
          )}
          <div className="flex gap-5 items-center flex-wrap">
            {phase === "voting" && (
              <>
                <Metric label="Candidates" value={election.candidateCount} />
                <Metric label="Votes cast" value={election.voteCount} />
              </>
            )}
            {phase === "nomination" && (
              <Metric label="Candidates so far" value={election.candidateCount} />
            )}
            {phase === "closed" && (
              <>
                <Metric label="Candidates" value={election.candidateCount} />
                <Metric label="Total votes" value={election.voteCount} />
              </>
            )}
          </div>
        </div>
        <span className="text-[#6B7A9E] text-xl flex-shrink-0">›</span>
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-[11px] text-[#6B7A9E] uppercase tracking-[0.08em] mb-1">
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
