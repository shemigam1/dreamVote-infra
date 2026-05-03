import type { Election } from "../utils/types";

export default function VotingView({
  election,
  selected,
  confirmOpen,
  onSelect,
  onVoteClick,
  onCancelVote,
  onConfirmVote,
  isCreator,
  onDeactivate,
}: {
  election: Election;
  selected: string | null;
  confirmOpen: boolean;
  onSelect: (name: string) => void;
  onVoteClick: () => void;
  onCancelVote: () => void;
  onConfirmVote: () => void;
  isCreator: boolean;
  onDeactivate: () => void;
}) {
  return (
    <>
      <div className="bg-[rgba(3,87,238,0.14)] border border-[rgba(3,87,238,0.45)] rounded-[10px] px-3.5 py-3 mb-5 text-sm text-[#9FBDFF]">
        <strong className="text-[#BFD4FF]">Choose one candidate.</strong> Your
        vote cannot be changed after confirmation.
      </div>

      <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl overflow-hidden mb-5">
        {election.candidates.map((c, i) => {
          const lastName = c.lastName;
          const isSelected = selected === lastName;
          const initials = `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
          return (
            <button
              key={i}
              onClick={() => !confirmOpen && onSelect(lastName)}
              className={`flex items-center gap-3.5 w-full px-4 py-4 text-left transition font-medium text-sm ${i < election.candidates.length - 1 ? "border-b border-[#1A2D5A]" : ""} ${isSelected ? "bg-[rgba(3,87,238,0.14)]" : "hover:bg-[#0D2145]"}`}
            >
              <span
                className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: isSelected ? "#0357EE" : "#2A4480",
                }}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#0357EE] block" />
                )}
              </span>
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{
                  background: isSelected ? "#0357EE" : "#0D2145",
                  color: isSelected ? "#fff" : "#9BA9C7",
                }}
              >
                {initials}
              </span>
              <span className="flex-1">
                {c.firstName} {c.lastName}
              </span>
            </button>
          );
        })}
      </div>

      {confirmOpen ? (
        <div className="bg-[#081A3A] border-2 border-[#0357EE] rounded-xl px-5 py-4">
          <p className="text-[15px] mb-3.5">
            Confirm vote for{" "}
            <strong>
              {election.candidates.find((c) => c.lastName === selected)
                ? `${election.candidates.find((c) => c.lastName === selected)!.firstName} ${selected}`
                : selected}
            </strong>{" "}
            — <span className="text-[#F5C16C]">this is final</span>.
          </p>
          <div className="flex gap-2.5 justify-end">
            <button
              onClick={onCancelVote}
              className="text-sm border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#0D2145] px-4 py-2.5 rounded-[10px] font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmVote}
              className="text-sm bg-[#0357EE] hover:bg-[#0048D1] text-white px-4 py-2.5 rounded-[10px] font-semibold transition"
            >
              Confirm vote
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onVoteClick}
          disabled={!selected}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] transition"
          style={{
            background: selected ? "#0357EE" : "#0D2145",
            color: selected ? "#fff" : "#9BA9C7",
            cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.5,
          }}
        >
          {selected
            ? `Cast vote for ${election.candidates.find((c) => c.lastName === selected)?.firstName} ${selected}`
            : "Select a candidate to vote"}
        </button>
      )}

      {isCreator && (
        <button
          onClick={onDeactivate}
          className="mt-4 w-full text-center text-sm text-[#6B7A9E] hover:text-[#9BA9C7] font-mono transition"
        >
          Close election · admin
        </button>
      )}
    </>
  );
}
