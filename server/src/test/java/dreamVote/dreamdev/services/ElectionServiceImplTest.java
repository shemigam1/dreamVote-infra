package dreamVote.dreamdev.services;

import dreamVote.dreamdev.data.repositories.CandidateRepository;
import dreamVote.dreamdev.data.repositories.ElectionRepository;
import dreamVote.dreamdev.data.repositories.VoteRepository;
import dreamVote.dreamdev.data.repositories.VoterRepository;
import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.ApiResponse;
import dreamVote.dreamdev.dtos.responses.CreateElectionResponse;
import dreamVote.dreamdev.dtos.responses.VoterRegisterationResponse;
import dreamVote.dreamdev.exceptions.InvalidElectionIdException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ElectionServiceImplTest {
    @Autowired
    private ElectionService electionService;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private VoterService voterService;
    @Autowired
    private VoterRepository voterRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;


    @BeforeEach
    public void setup() {
        electionRepository.deleteAll();
        voterRepository.deleteAll();
        candidateRepository.deleteAll();
        voteRepository.deleteAll();

        VoterRegisterationRequest voterRegisterationRequest = new VoterRegisterationRequest();
        voterRegisterationRequest.setEmail("email");
        voterRegisterationRequest.setFirstName("John");
        voterRegisterationRequest.setLastName("Doe");
        voterRegisterationRequest.setPassword("password");
        voterService.register(voterRegisterationRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
        voterService.login(loginRequest);
    }

    @Test
    public void createElection_successTest() {
        String voterId = voterRepository.findByEmail("email").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(voterId);
        assertEquals(0L, electionRepository.count());
        electionService.createElection(createElectionRequest);
        assertEquals(1L, electionRepository.count());
    }

    @Test
    public void createElection_isNotActiveTest(){
        String voterId = voterRepository.findByEmail("email").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(voterId);
        CreateElectionResponse response = electionService.createElection(createElectionRequest);
        String electionId = response.getElectionId();
        assertFalse(electionRepository.findById(electionId).get().isActive());
    }

    @Test
    public void createElection_activateElectionTest(){
        String voterId = voterRepository.findByEmail("email").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(voterId);
        CreateElectionResponse response = electionService.createElection(createElectionRequest);
        String electionId = response.getElectionId();
        assertFalse(electionRepository.findById(electionId).get().isActive());
        ActivateElectionRequest activateElectionRequest = new ActivateElectionRequest();
        activateElectionRequest.setElectionId(electionId);
        activateElectionRequest.setVoterId(voterId);
        electionService.activate(activateElectionRequest);
        assertTrue(electionRepository.findById(electionId).get().isActive());
    }

    private String createActiveElection() {
        String voterId = voterRepository.findByEmail("email").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(voterId);
        CreateElectionResponse response = electionService.createElection(createElectionRequest);
        String electionId = response.getElectionId();
        ActivateElectionRequest activateElectionRequest = new ActivateElectionRequest();
        activateElectionRequest.setElectionId(electionId);
        activateElectionRequest.setVoterId(voterId);
        electionService.activate(activateElectionRequest);
        return electionId;
    }

    private String createInactiveElection() {
        String voterId = voterRepository.findByEmail("email").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(voterId);
        CreateElectionResponse response = electionService.createElection(createElectionRequest);
        return response.getElectionId();
    }

    @Test
    public void nominateCandidate_successTest() {
        String electionId = createInactiveElection();

        NominateCandidateRequest request = new NominateCandidateRequest();
        request.setElectionId(electionId);
        request.setFirstName("Semil");
        request.setLastName("Omotade");

        assertEquals(0L, candidateRepository.count());
        electionService.nominateCandidate(request);
        assertEquals(1L, candidateRepository.count());
    }

    @Test
    public void nominateCandidate_onActiveElection_throwsExceptionTest() {
        String electionId = createActiveElection();

        NominateCandidateRequest request = new NominateCandidateRequest();
        request.setElectionId(electionId);
        request.setFirstName("Semil");
        request.setLastName("Omotade");

        assertThrows(InvalidElectionIdException.class, () -> electionService.nominateCandidate(request));
    }

    @Test
    public void getElectionById_successTest() {
        String electionId = createInactiveElection();

        ApiResponse response = electionService.getElectionById(electionId);

        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }

    @Test
    public void getElectionById_invalidId_throwsExceptionTest() {
        assertThrows(InvalidElectionIdException.class, () -> electionService.getElectionById("nonexistent-id"));
    }

    @Test
    public void voteForCandidate_candidateNotInElection_throwsExceptionTest() {
        String electionIdA = createInactiveElection();
        String electionIdB = createInactiveElection();

        NominateCandidateRequest nominateRequest = new NominateCandidateRequest();
        nominateRequest.setElectionId(electionIdB);
        nominateRequest.setFirstName("Alice");
        nominateRequest.setLastName("Smith");
        electionService.nominateCandidate(nominateRequest);

        ActivateElectionRequest activateA = new ActivateElectionRequest();
        String voterId = voterRepository.findByEmail("email").get().getId();
        activateA.setElectionId(electionIdA);
        activateA.setVoterId(voterId);
        electionService.activate(activateA);

        VoteForCandidateRequest voteRequest = new VoteForCandidateRequest();
        voteRequest.setVoterId(voterId);
        voteRequest.setElectionId(electionIdA);
        voteRequest.setCandidateLastName("Smith");

        assertThrows(InvalidElectionIdException.class, () -> electionService.vote(voteRequest));
    }

    @Test
    public void getElectionsByCreator_successTest() {
        String voterId = voterRepository.findByEmail("email").get().getId();

        createInactiveElection();
        createInactiveElection();

        ApiResponse response = electionService.getElectionsByCreator(voterId);

        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }

    @Test
    public void getElectionsByCreator_doesNotReturnOtherVotersElectionsTest() {
        createInactiveElection();

        VoterRegisterationRequest secondVoterRequest = new VoterRegisterationRequest();
        secondVoterRequest.setEmail("email2");
        secondVoterRequest.setFirstName("Jane");
        secondVoterRequest.setLastName("Doe");
        secondVoterRequest.setPassword("password");
        voterService.register(secondVoterRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email2");
        loginRequest.setPassword("password");
        voterService.login(loginRequest);

        String secondVoterId = voterRepository.findByEmail("email2").get().getId();
        CreateElectionRequest createElectionRequest = new CreateElectionRequest();
        createElectionRequest.setVoterId(secondVoterId);
        electionService.createElection(createElectionRequest);
        electionService.createElection(createElectionRequest);

        ApiResponse response = electionService.getElectionsByCreator(secondVoterId);
        java.util.List<?> elections = (java.util.List<?>) response.getData();
        assertEquals(2, elections.size());
    }

    @Test
    public void getAllCandidates_successTest() {
        String electionId = createInactiveElection();

        NominateCandidateRequest nominateRequest = new NominateCandidateRequest();
        nominateRequest.setElectionId(electionId);
        nominateRequest.setFirstName("Alice");
        nominateRequest.setLastName("Smith");
        electionService.nominateCandidate(nominateRequest);

        String voterId = voterRepository.findByEmail("email").get().getId();
        GetAllCandidatesRequest getAllRequest = new GetAllCandidatesRequest();
        getAllRequest.setVoterId(voterId);
        getAllRequest.setElectionId(electionId);

        ApiResponse response = electionService.getAllCandidates(getAllRequest);
        assertTrue(response.isSuccess());
        assertNotNull(response.getData());
    }

    @Test
    public void voteForCandidate_successTest() {
        String electionId = createInactiveElection();

        NominateCandidateRequest nominateRequest = new NominateCandidateRequest();
        nominateRequest.setElectionId(electionId);
        nominateRequest.setFirstName("Alice");
        nominateRequest.setLastName("Smith");
        electionService.nominateCandidate(nominateRequest);

        String voterId = voterRepository.findByEmail("email").get().getId();
        ActivateElectionRequest activateRequest = new ActivateElectionRequest();
        activateRequest.setElectionId(electionId);
        activateRequest.setVoterId(voterId);
        electionService.activate(activateRequest);

        VoteForCandidateRequest voteRequest = new VoteForCandidateRequest();
        voteRequest.setElectionId(electionId);
        voteRequest.setVoterId(voterId);
        voteRequest.setCandidateLastName("Smith");

        assertEquals(0L, voteRepository.count());
        electionService.vote(voteRequest);
        assertEquals(1L, voteRepository.count());
    }


}