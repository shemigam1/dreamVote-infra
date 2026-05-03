package dreamVote.dreamdev.services;

import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.ApiResponse;
import dreamVote.dreamdev.dtos.responses.CreateElectionResponse;
import dreamVote.dreamdev.dtos.responses.VoteForCandidateResponse;

public interface ElectionService {
    VoteForCandidateResponse vote(VoteForCandidateRequest voteForCandidateRequest);

    ApiResponse nominateCandidate(NominateCandidateRequest nominateCandidateRequest);

    ApiResponse getAllCandidates(GetAllCandidatesRequest getAllCandidatesRequest);

    CreateElectionResponse createElection(CreateElectionRequest createElectionRequest);

    ApiResponse activate(ActivateElectionRequest activateElectionRequest);

    ApiResponse deactivate(ActivateElectionRequest activateElectionRequest);

    ApiResponse getPolls(String electionId);

    ApiResponse getAllElections();

    ApiResponse getElectionById(String electionId);

    ApiResponse getElectionsByCreator(String voterId);
}
