package dreamVote.dreamdev.services;

import dreamVote.dreamdev.data.models.Candidate;
import dreamVote.dreamdev.data.models.Election;
import dreamVote.dreamdev.data.models.Vote;
import dreamVote.dreamdev.data.models.Voter;
import dreamVote.dreamdev.data.repositories.CandidateRepository;
import dreamVote.dreamdev.data.repositories.ElectionRepository;
import dreamVote.dreamdev.data.repositories.VoteRepository;
import dreamVote.dreamdev.data.repositories.VoterRepository;
import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.ApiResponse;
import dreamVote.dreamdev.dtos.responses.CreateElectionResponse;
import dreamVote.dreamdev.dtos.responses.VoteForCandidateResponse;
import dreamVote.dreamdev.dtos.responses.getAllElectionsResponse;
import dreamVote.dreamdev.exceptions.InvalidElectionIdException;
import dreamVote.dreamdev.exceptions.InvalidLoginDetailsException;
import dreamVote.dreamdev.exceptions.InvalidVoterIdException;
import dreamVote.dreamdev.utils.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static dreamVote.dreamdev.utils.Mapper.*;

@Service
public class ElectionServiceImpl implements ElectionService{
    @Autowired
    private ElectionRepository electionRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private VoteRepository voteRepository;

    private void validateVoter(Voter voter) {
        if (!voter.isLoggedIn()) throw new InvalidLoginDetailsException("Voter is not logged in");
    }

    @Override
    public VoteForCandidateResponse vote(VoteForCandidateRequest voteForCandidateRequest) {
        Optional<Voter> optionalVoter =
                voterRepository.findById(voteForCandidateRequest.getVoterId());
        if (optionalVoter.isEmpty()) throw new InvalidLoginDetailsException("Voter not found");
        validateVoter(optionalVoter.get());

        Optional<Election> optionalElection = electionRepository.findById(voteForCandidateRequest.getElectionId());
        if (optionalElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");
        if (!optionalElection.get().isActive()) throw new InvalidElectionIdException("Election is not active");

        Election election = optionalElection.get();
        Candidate optionalCandidate = election.getCandidates().stream()
                .filter(c -> c.getLastName().equals(voteForCandidateRequest.getCandidateLastName()))
                .findFirst()
                .orElseThrow(() -> new InvalidElectionIdException("Candidate not found in this election"));

        boolean alreadyVoted = voteRepository.findByVoterIDAndElectionId(
                voteForCandidateRequest.getVoterId(),
                voteForCandidateRequest.getElectionId()
        ).isPresent();
        if (alreadyVoted) throw new InvalidLoginDetailsException("Voter has already voted in this election");

        Vote vote = new Vote();
        vote.setVoterID(voteForCandidateRequest.getVoterId());
        vote.setCandidateId(optionalCandidate.getId());
        vote.setElectionId(voteForCandidateRequest.getElectionId());
        Vote savedVote = voteRepository.save(vote);

        election.getVotes().add(savedVote);
        election.getPoll().merge(optionalCandidate.getLastName(), 1, Integer::sum);
        electionRepository.save(election);

        return mapToVoteForCandidateResponse(optionalVoter.get(), optionalCandidate);
    }

    @Override
    public ApiResponse nominateCandidate(NominateCandidateRequest nominateCandidateRequest) {
        Optional<Election> optionalElection = electionRepository.findById(nominateCandidateRequest.getElectionId());
        if (optionalElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");
        if (optionalElection.get().isActive()) throw new InvalidElectionIdException("Cannot nominate: election is in voting phase");

        Candidate candidate = map(nominateCandidateRequest);
        Candidate savedCandidate = candidateRepository.save(candidate);

        Election election = optionalElection.get();
        election.getCandidates().add(savedCandidate);
        electionRepository.save(election);
        return new ApiResponse(true, election.getCandidates());
    }

    @Override
    public ApiResponse getAllCandidates(GetAllCandidatesRequest getAllCandidatesRequest) {
        Optional<Voter> optionalVoter = voterRepository.findById(getAllCandidatesRequest.getVoterId());
        if (optionalVoter.isEmpty()) throw new InvalidLoginDetailsException("Voter not found");
        if (!optionalVoter.get().isLoggedIn()) throw new InvalidLoginDetailsException("Voter is not logged in");

        Optional<Election> optionalElection = electionRepository.findById(getAllCandidatesRequest.getElectionId());
        if (optionalElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");

        return new ApiResponse(true, optionalElection.get().getCandidates());
    }

    @Override
    public CreateElectionResponse createElection(CreateElectionRequest createElectionRequest) {
        Optional<Voter> optionalVoter = voterRepository.findById(createElectionRequest.getVoterId());
        if (optionalVoter.isEmpty()) throw new InvalidLoginDetailsException("Voter not found");
        if (!optionalVoter.get().isLoggedIn()) throw new InvalidLoginDetailsException("Voter is not logged in");

        Election election = new Election();
        election.setActive(false);
        election.setCreatedBy(optionalVoter.get().getId());
        election.setTitle(createElectionRequest.getTitle());
        election.setDescription(createElectionRequest.getDescription());
        Election savedElection = electionRepository.save(election);
        return mapToCreateElectionResponse(savedElection);
    }

    @Override
    public ApiResponse activate(ActivateElectionRequest activateElectionRequest) {
        Optional<Election> savedElection = electionRepository.findById(activateElectionRequest.getElectionId());
        if (savedElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");

        if (!Objects.equals(activateElectionRequest.getVoterId(), savedElection.get().getCreatedBy()))
            throw new InvalidVoterIdException("Only the user that created the election can activate it");

        Election election = savedElection.get();
        if (election.isActive()) throw new InvalidElectionIdException("Election is already Active");
        election.setActive(true);
        electionRepository.save(election);
        return new ApiResponse(true, "Election activated successfully");
    }

    @Override
    public ApiResponse deactivate(ActivateElectionRequest activateElectionRequest) {
        Optional<Election> savedElection = electionRepository.findById(activateElectionRequest.getElectionId());
        if (savedElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");

        if (!Objects.equals(activateElectionRequest.getVoterId(), savedElection.get().getCreatedBy()))
            throw new InvalidVoterIdException("Only the user that created the election can deactivate it");

        Election election = savedElection.get();
        if (!election.isActive()) throw new InvalidElectionIdException("Election is already deactivated");
        election.setActive(false);
        electionRepository.save(election);
        return new ApiResponse(true, "Election deactivated successfully");
    }

    @Override
    public ApiResponse getPolls(String electionId) {
        Optional<Election> optionalElection = electionRepository.findById(electionId);
        if (optionalElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");

        return new ApiResponse(true, optionalElection.get().getPoll());
    }

    @Override
    public ApiResponse getAllElections(){
        List<getAllElectionsResponse> elections = electionRepository.findAll()
                .stream()
                .map(Mapper::mapToElectionSummary)
                .toList();
        return new ApiResponse(true, elections);
    }

    @Override
    public ApiResponse getElectionById(String electionId) {
        Optional<Election> optionalElection = electionRepository.findById(electionId);
        if (optionalElection.isEmpty()) throw new InvalidElectionIdException("Election does not exist");
        Election election = optionalElection.get();

        List<Map<String, String>> candidates = election.getCandidates().stream()
                .map(c -> {
                    Map<String, String> m = new HashMap<>();
                    m.put("firstName", c.getFirstName());
                    m.put("lastName", c.getLastName());
                    return m;
                })
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("id", election.getId());
        data.put("title", election.getTitle());
        data.put("description", election.getDescription());
        data.put("createdBy", election.getCreatedBy());
        data.put("active", election.isActive());
        data.put("createdAt", election.getCreatedAt().toString());
        data.put("candidates", candidates);
        data.put("poll", election.getPoll());
        data.put("voteCount", election.getVotes().size());

        return new ApiResponse(true, data);
    }

    @Override
    public ApiResponse getElectionsByCreator(String voterId) {
        List<getAllElectionsResponse> elections = electionRepository.findByCreatedBy(voterId)
                .stream()
                .map(Mapper::mapToElectionSummary)
                .toList();
        return new ApiResponse(true, elections);
    }
}
