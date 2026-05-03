package dreamVote.dreamdev.utils;

import dreamVote.dreamdev.data.models.Candidate;
import dreamVote.dreamdev.data.models.Election;
import dreamVote.dreamdev.data.models.Voter;
import dreamVote.dreamdev.dtos.requests.NominateCandidateRequest;
import dreamVote.dreamdev.dtos.requests.VoterRegisterationRequest;
import dreamVote.dreamdev.dtos.responses.*;

public class Mapper {
    public static Voter map(VoterRegisterationRequest request) {
        Voter voter = new Voter();
        voter.setFirstName(request.getFirstName());
        voter.setLastName(request.getLastName());
        voter.setEmail(request.getEmail());
        voter.setPassword(request.getPassword());
        voter.setLoggedIn(false);
        return voter;
    }

    public static VoterRegisterationResponse map(Voter voter) {
        VoterRegisterationResponse response = new VoterRegisterationResponse();
        response.setVoterId(voter.getId());
        response.setEmail(voter.getEmail());
        response.setLoggedIn(voter.isLoggedIn());
        response.setFirstName(voter.getFirstName());
        response.setLastName(voter.getLastName());
        return response;
    }

    public static LoginResponse mapToLoginResponse(Voter savedVoter) {
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setLoggedIn(savedVoter.isLoggedIn());
        loginResponse.setEmail(savedVoter.getEmail());
        loginResponse.setVoterId(savedVoter.getId());
        return loginResponse;
    }

    public static LogoutResponse mapToLogoutResponse(Voter savedVoter) {
        LogoutResponse logoutResponse = new LogoutResponse();
        logoutResponse.setLoggedIn(savedVoter.isLoggedIn());
        logoutResponse.setEmail(savedVoter.getEmail());
        return logoutResponse;
    }

    public static CreateElectionResponse mapToCreateElectionResponse(Election newElection){
        CreateElectionResponse createElectionResponse = new CreateElectionResponse();
        createElectionResponse.setElectionId(newElection.getId());
        createElectionResponse.setActive(newElection.isActive());
        return createElectionResponse;
    }

    public static Candidate map(NominateCandidateRequest request) {
        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        return candidate;
    }

    public static VoteForCandidateResponse mapToVoteForCandidateResponse(Voter
                                                                                 voter, Candidate candidate) {
        VoteForCandidateResponse response = new VoteForCandidateResponse();
        response.setVoterId(voter.getId());
        response.setEmail(voter.getEmail());
        response.setCandidateName(candidate.getFirstName() + " " +
                candidate.getLastName());
        response.setLoggedIn(voter.isLoggedIn());
        return response;
    }

    public static getAllElectionsResponse mapToElectionSummary(Election election) {
        return new getAllElectionsResponse(
                election.getId(),
                election.getTitle(),
                election.getCreatedAt(),
                election.isActive(),
                election.getCandidates().size(),
                election.getVotes().size()
        );
    }
}


