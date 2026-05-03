type Phase = "nomination" | "voting" | "closed";

const config = {
  nomination: {
    icon: "◔",
    label: "Nominations open",
    fg: "#F5C16C",
    bg: "rgba(245,166,35,0.14)",
    border: "rgba(245,166,35,0.3)",
  },
  voting: {
    icon: "●",
    label: "Voting open",
    fg: "#7FA8FF",
    bg: "rgba(3,87,238,0.14)",
    border: "rgba(3,87,238,0.45)",
  },
  closed: {
    icon: "▣",
    label: "Closed",
    fg: "#9BA9C7",
    bg: "rgba(139,146,165,0.14)",
    border: "rgba(139,146,165,0.3)",
  },
};

export function getPhase(active: boolean, voteCount: number): Phase {
  if (active) return "voting";
  if (voteCount > 0) return "closed";
  return "nomination";
}

export default function PhaseBadge({ phase }: { phase: Phase }) {
  const p = config[phase];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
      style={{ color: p.fg, background: p.bg, border: `1px solid ${p.border}` }}
    >
      <span className="text-[10px] leading-none">{p.icon}</span>
      <span>{p.label}</span>
    </span>
  );
}
