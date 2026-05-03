import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Election } from "../components/utils/types";
import PhaseBadge, { getPhase } from "../components/PhaseBadge";
import PageShell from "../components/election/PageShell";
import NominationView from "../components/election/NominationView";
import VotingView from "../components/election/VotingView";
import VotedView from "../components/election/VotedView";
import ClosedView from "../components/election/ClosedView";
import {
  useGetElectionByIdQuery,
  useActivateElectionMutation,
  useDeactivateElectionMutation,
  useVoteMutation,
} from "../api/election";

export default function ElectionDetailPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const voter = useSelector((state: RootState) => state.voter.voter);

  const { data: response, isLoading, refetch } = useGetElectionByIdQuery(electionId!);
  const [activate] = useActivateElectionMutation();
  const [deactivate] = useDeactivateElectionMutation();
  const [vote] = useVoteMutation();

  const [selected, setSelected] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [endNomConfirm, setEndNomConfirm] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!voter || !voter.isLoggedIn) navigate("/auth");
  }, [voter, navigate]);

  useEffect(() => {
    if (electionId) {
      const stored = localStorage.getItem(`vote_${electionId}`);
      if (stored) setVotedFor(stored);
    }
  }, [electionId]);

  if (!voter || !voter.isLoggedIn) return null;
  if (isLoading) {
    return (
      <PageShell>
        <p className="text-center text-[#6B7A9E] py-16 font-mono text-sm">
          loading election...
        </p>
      </PageShell>
    );
  }

  const election: Election | undefined = response?.data;
  if (!election) {
    return (
      <PageShell>
        <p className="text-center text-[#9BA9C7] py-16">Election not found.</p>
      </PageShell>
    );
  }

  const voteCount = election.voteCount ?? 0;
  const phase = getPhase(election.active, voteCount);
  const isCreator = election.createdBy === voter.voterId;
  const slug = `election-${new Date(election.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toLowerCase().replace(" ", "-")}-${election.id.slice(-4)}`;
  const total = Object.values(election.poll).reduce((a, b) => a + b, 0);

  async function handleActivate() {
    await activate({ electionId: election!.id, voterId: voter!.voterId });
    setEndNomConfirm(false);
    refetch();
  }

  async function handleDeactivate() {
    await deactivate({ electionId: election!.id, voterId: voter!.voterId });
    refetch();
  }

  async function handleVote() {
    if (!selected) return;
    try {
      await vote({
        electionId: election!.id,
        voterId: voter!.voterId,
        candidateLastName: selected,
      }).unwrap();
      localStorage.setItem(`vote_${electionId}`, selected);
      setVotedFor(selected);
      setConfirmOpen(false);
      refetch();
    } catch {}
  }

  return (
    <PageShell back={{ label: "Elections", to: "/" }}>
      <div className="max-w-[680px] mx-auto px-5 py-10">
        <div className="mb-7">
          <PhaseBadge phase={phase} />
          {election.title ? (
            <>
              <h2 className="mt-4 mb-1.5 text-[26px] font-bold tracking-tight text-[#F4F5F7]">
                {election.title}
              </h2>
              <p className="font-mono text-[11px] text-[#6B7A9E] mb-2 break-all">
                {slug}
              </p>
            </>
          ) : (
            <h2 className="mt-4 mb-1.5 font-mono text-[22px] font-bold tracking-tight break-all text-[#F4F5F7]">
              {slug}
            </h2>
          )}
          {election.description && (
            <p className="text-sm text-[#9BA9C7] mb-2 whitespace-pre-wrap">
              {election.description}
            </p>
          )}
          <p className="text-sm text-[#9BA9C7]">
            Created{" "}
            {new Date(election.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {phase === "nomination" && (
          <NominationView
            election={election}
            isCreator={isCreator}
            endNomConfirm={endNomConfirm}
            onEndNomClick={() => setEndNomConfirm(true)}
            onCancelEndNom={() => setEndNomConfirm(false)}
            onConfirmEndNom={handleActivate}
          />
        )}

        {phase === "voting" && !votedFor && (
          <VotingView
            election={election}
            selected={selected}
            confirmOpen={confirmOpen}
            onSelect={setSelected}
            onVoteClick={() => setConfirmOpen(true)}
            onCancelVote={() => setConfirmOpen(false)}
            onConfirmVote={handleVote}
            isCreator={isCreator}
            onDeactivate={handleDeactivate}
          />
        )}

        {phase === "voting" && votedFor && (
          <VotedView
            poll={election.poll}
            votedFor={votedFor}
            total={total}
            onRefresh={refetch}
          />
        )}

        {phase === "closed" && (
          <ClosedView poll={election.poll} total={total} />
        )}
      </div>
    </PageShell>
  );
}
