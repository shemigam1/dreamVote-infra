import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useCreateElectionMutation } from "../api/election";

export default function CreateElectionPage() {
  const navigate = useNavigate();
  const voter = useSelector((state: RootState) => state.voter.voter);
  const [createElection, { isLoading }] = useCreateElectionMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!voter || !voter.isLoggedIn) navigate("/auth");
  }, [voter, navigate]);

  if (!voter || !voter.isLoggedIn) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      const res = await createElection({
        voterId: voter!.voterId,
        title: title.trim(),
        description: description.trim(),
      }).unwrap();
      if (res.success) navigate(`/elections/${res.data.electionId}`);
      else setError(res.data ?? "Failed to create election.");
    } catch (err: any) {
      setError(err?.data?.message ?? err?.message ?? "Could not create election.");
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
            to="/"
            className="text-sm text-[#9BA9C7] hover:text-[#F4F5F7] transition"
          >
            ‹ Elections
          </Link>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-5 py-10">
        <h2 className="text-[26px] font-bold tracking-tight mb-1.5">
          New election
        </h2>
        <p className="text-sm text-[#9BA9C7] mb-7">
          Give your election a name. You'll be able to nominate candidates next.
        </p>

        <div className="bg-[#081A3A] border border-[#1A2D5A] rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm text-[#9BA9C7] font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Class president 2026"
                className="w-full px-3.5 py-3 bg-[#02102D] border border-[#1A2D5A] rounded-[10px] text-[#F4F5F7] text-sm outline-none transition focus:border-[#0357EE] focus:ring-2 focus:ring-[#0357EE]/20"
                autoFocus
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm text-[#9BA9C7] font-medium mb-2">
                Description{" "}
                <span className="text-[#6B7A9E] font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this election about?"
                rows={4}
                className="w-full px-3.5 py-3 bg-[#02102D] border border-[#1A2D5A] rounded-[10px] text-[#F4F5F7] text-sm outline-none transition focus:border-[#0357EE] focus:ring-2 focus:ring-[#0357EE]/20 resize-none"
              />
            </div>

            {error && <p className="text-sm text-[#FF8E8E] mb-4">{error}</p>}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm border border-[#1A2D5A] hover:border-[#2A4480] hover:bg-[#0D2145] px-4 py-3 rounded-[10px] font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex-1 bg-[#0357EE] hover:bg-[#0048D1] text-white font-semibold py-3 rounded-[10px] text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create election"}
              </button>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}
