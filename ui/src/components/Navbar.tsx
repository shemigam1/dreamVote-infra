import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { RootState } from "../store/store";

function Navbar() {
  const voter = useSelector((state: RootState) => state.voter.voter);

  const displayName = voter
    ? voter.firstName && voter.lastName
      ? `${voter.firstName} ${voter.lastName[0]}.`
      : (voter.email?.split("@")[0] ?? "")
    : "";

  const initials = voter
    ? voter.firstName && voter.lastName
      ? `${voter.firstName[0]}${voter.lastName[0]}`.toUpperCase()
      : (voter.email?.[0] ?? "?").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-10 bg-[#02102D] border-b border-[#1A2D5A]">
      <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 pt-4">
          {/* <span className="text-[#F4F5F7] font-semibold tracking-tight">
            Ballot
          </span> */}

          <span className="inline-block font-mono text-[#7FA8FF] bg-[#0357EE]/15 border border-[#0357EE]/45 px-2.5 py-1 rounded-md tracking-tight mb-4">
            DREAM VOTE
          </span>
        </Link>

        {voter && (
          <Link
            to="/account"
            className="flex items-center gap-2.5 bg-[#081A3A] border border-[#1A2D5A] hover:border-[#2A4480] pl-1 pr-3 py-1 rounded-full transition"
          >
            <div className="w-6 h-6 rounded-full bg-[#0357EE] flex items-center justify-center text-white text-[11px] font-semibold">
              {initials}
            </div>
            <span className="text-sm text-[#F4F5F7]">{displayName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
