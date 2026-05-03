import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNominateCandidateMutation, useGetElectionByIdQuery } from "../api/election";

export default function NominatePage() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const voter = useSelector((state: RootState) => state.voter.voter);

  const { data: response } = useGetElectionByIdQuery(electionId!);
  const [nominateCandidate, { isLoading }] = useNominateCandidateMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!voter || !voter.isLoggedIn) navigate("/auth");
  }, [voter, navigate]);

  if (!voter || !voter.isLoggedIn) return null;

  const election = response?.data;
  const existingLastNames: string[] =
    election?.candidates?.map((c: { lastName: string }) =>
      c.lastName.toLowerCase()
    ) ?? [];
  const lastConflict =
    lastName.trim() !== "" &&
    existingLastNames.includes(lastName.trim().toLowerCase());

  const slug = election
    ? `election-${new Date(election.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toLowerCase().replace(" ", "-")}-${election.id.slice(-4)}`
    : electionId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || lastConflict) return;
    setError("");
    try {
      const res = await nominateCandidate({
        electionId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        voterId: voter!.voterId,
      }).unwrap();
      if (res.success) navigate(`/elections/${electionId}`);
      else setError(res.message ?? "Nomination failed.");
    } catch (err: any) {
      setError(err?.data?.message ?? "Something went wrong.");
    }
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
            to={`/elections/${electionId}`}
            className="text-sm text-[#9BA9C7] hover:text-[#F4F5F7] transition"
          >
            ‹ {slug}
          </Link>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-5 py-10">
        <h2 className="text-[26px] font-bold tracking-tight mb-1.5">
          Nominate a candidate
        </h2>
        <p className="text-sm text-[#9BA9C7] mb-7">
          Add a candidate to{" "}
          <span className="font-mono text-[13px] text-[#9BA9C7]">{slug}</span>
        </p>

        <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div>
                <label className="block text-sm text-[#9BA9C7] font-medium mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#02102D] border border-[#1A2D5A] rounded-[10px] text-[#F4F5F7] text-sm outline-none transition focus:border-[#0357EE] focus:ring-2 focus:ring-[#0357EE]/20"
                  placeholder="Ada"
                />
              </div>
              <div>
                <label className="block text-sm text-[#9BA9C7] font-medium mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-3.5 py-3 bg-[#02102D] rounded-[10px] text-[#F4F5F7] text-sm outline-none transition ${lastConflict ? "border border-[#E14B4B]" : "border border-[#1A2D5A] focus:border-[#0357EE] focus:ring-2 focus:ring-[#0357EE]/20"}`}
                  placeholder="Okafor"
                />
              </div>
            </div>

            {lastConflict && (
              <div className="mb-5 px-3.5 py-3 bg-[rgba(225,75,75,0.12)] border border-[rgba(225,75,75,0.4)] rounded-lg">
                <p className="text-sm text-[#FF8E8E] font-medium mb-0.5">
                  Last name conflict
                </p>
                <p className="text-xs text-[#9BA9C7]">
                  A candidate with this last name already exists.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-[#FF8E8E] mb-4">{error}</p>
            )}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => navigate(`/elections/${electionId}`)}
                className="text-sm border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#0D2145] px-4 py-3 rounded-[10px] font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  lastConflict ||
                  !firstName.trim() ||
                  !lastName.trim()
                }
                className="flex-1 bg-[#0357EE] hover:bg-[#0048D1] text-white font-semibold py-3 rounded-[10px] text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add candidate"}
              </button>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}
