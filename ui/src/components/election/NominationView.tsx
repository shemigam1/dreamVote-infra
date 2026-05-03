import { useNavigate } from "react-router";
import type { Election } from "../utils/types";

export default function NominationView({
  election,
  isCreator,
  endNomConfirm,
  onEndNomClick,
  onCancelEndNom,
  onConfirmEndNom,
}: {
  election: Election;
  isCreator: boolean;
  endNomConfirm: boolean;
  onEndNomClick: () => void;
  onCancelEndNom: () => void;
  onConfirmEndNom: () => void;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3.5 border-b border-[#1A2D5A] flex justify-between items-center">
          <span className="text-[11px] text-[#6B7A9E] uppercase tracking-[0.08em] font-medium">
            Candidates
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {election.candidates.length}
          </span>
        </div>
        {election.candidates.length === 0 ? (
          <p className="px-4 py-7 text-sm text-[#6B7A9E] text-center">
            No candidates yet. Nominate one to start.
          </p>
        ) : (
          election.candidates.map((c, i) => {
            const initials = `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm ${i < election.candidates.length - 1 ? "border-b border-[#1A2D5A]" : ""}`}
              >
                <span className="w-7 h-7 rounded-full bg-[rgba(3,87,238,0.14)] border border-[rgba(3,87,238,0.45)] text-[#7FA8FF] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                  {initials}
                </span>
                <span>
                  {c.firstName} {c.lastName}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <button
          onClick={() => navigate(`/elections/${election.id}/nominate`)}
          className="bg-[#0357EE] hover:bg-[#0048D1] text-white font-semibold px-5 py-3 rounded-[10px] text-sm transition"
        >
          + Nominate candidate
        </button>

        {isCreator && !endNomConfirm && (
          <>
            <button
              onClick={onEndNomClick}
              className="text-[#F4F5F7] border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#081A3A] px-4 py-3 rounded-[10px] text-sm font-medium transition"
            >
              End nominations
            </button>
            <span className="font-mono text-[11px] text-[#6B7A9E]">
              admin · starts voting
            </span>
          </>
        )}
      </div>

      {isCreator && endNomConfirm && (
        <div className="mt-3 bg-[rgba(245,166,35,0.14)] border border-[rgba(245,166,35,0.3)] rounded-[10px] px-4 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm">
            <strong className="text-[#F5C16C]">Start voting?</strong>{" "}
            <span className="text-[#9BA9C7]">Nominations will close.</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onCancelEndNom}
              className="text-sm border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#081A3A] px-3 py-2 rounded-[10px] font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmEndNom}
              className="text-sm bg-[#0357EE] hover:bg-[#0048D1] text-white px-3 py-2 rounded-[10px] font-medium transition"
            >
              Start voting
            </button>
          </div>
        </div>
      )}
    </>
  );
}
