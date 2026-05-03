import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import type { RootState } from "../store/store";
import { clearVoter } from "../slice/voterSlice";
import { useLogoutMutation } from "../api/auth";

export default function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const voter = useSelector((state: RootState) => state.voter.voter);
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    if (!voter || !voter.isLoggedIn) navigate("/auth");
  }, [voter, navigate]);

  if (!voter || !voter.isLoggedIn) return null;

  const initials = voter.firstName && voter.lastName
    ? `${voter.firstName[0]}${voter.lastName[0]}`.toUpperCase()
    : voter.email[0].toUpperCase();

  const displayName = voter.firstName && voter.lastName
    ? `${voter.firstName} ${voter.lastName}`
    : voter.email.split("@")[0];

  async function handleLogout() {
    try {
      await logout({ email: voter!.email }).unwrap();
    } catch {}
    dispatch(clearVoter());
    localStorage.removeItem("voter");
    navigate("/auth");
  }

  return (
    <div className="min-h-screen bg-[#02102D] text-[#F4F5F7]">
      <header className="sticky top-0 z-10 bg-[#02102D] border-b border-[#1A2D5A]">
        <div className="max-w-[560px] mx-auto px-5 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="font-mono text-[11px] text-[#7FA8FF] bg-[rgba(3,87,238,0.14)] border border-[rgba(3,87,238,0.45)] px-2.5 py-1 rounded-md tracking-[0.08em]"
          >
            DREAM VOTE
          </Link>
          <span className="text-[#6B7A9E] text-sm">/</span>
          <Link
            to="/"
            className="text-sm text-[#9BA9C7] hover:text-[#F4F5F7] transition"
          >
            ‹ Elections
          </Link>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-5 py-10">
        <h2 className="text-[26px] font-bold tracking-tight mb-7">Account</h2>

        <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl p-6 mb-5 flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-[#0357EE] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </span>
          <div className="flex-1">
            <p className="text-lg font-semibold tracking-tight mb-1">
              {displayName}
            </p>
            <p className="text-sm text-[#9BA9C7] mb-0.5">{voter.email}</p>
            <p className="font-mono text-[11px] text-[#6B7A9E]">
              id · {voter.voterId}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#081A3A] text-[#F4F5F7] font-medium py-3 rounded-[10px] text-sm transition disabled:opacity-60"
        >
          {isLoading ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
