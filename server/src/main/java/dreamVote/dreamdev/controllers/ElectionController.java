package dreamVote.dreamdev.controllers;

import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.ApiResponse;
import dreamVote.dreamdev.exceptions.DreamVoteException;
import dreamVote.dreamdev.services.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/elections")
public class ElectionController {
    @Autowired
    private ElectionService electionService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse> createElection(@RequestBody CreateElectionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, electionService.createElection(request)));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllElections(){
        try{
            return ResponseEntity.ok(electionService.getAllElections());
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PatchMapping("/{electionId}/activate")
    public ResponseEntity<ApiResponse> activate(@PathVariable String electionId, @RequestBody ActivateElectionRequest request) {
        try {
            request.setElectionId(electionId);
            return ResponseEntity.ok(electionService.activate(request));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PatchMapping("/{electionId}/deactivate")
    public ResponseEntity<ApiResponse> deactivate(@PathVariable String electionId, @RequestBody ActivateElectionRequest request) {
        try {
            request.setElectionId(electionId);
            return ResponseEntity.ok(electionService.deactivate(request));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/nominate")
    public ResponseEntity<ApiResponse> nominateCandidate(@RequestBody NominateCandidateRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(electionService.nominateCandidate(request));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse> getAllCandidates(@RequestBody GetAllCandidatesRequest request) {
        try {
            return ResponseEntity.ok(electionService.getAllCandidates(request));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<ApiResponse> vote(@RequestBody VoteForCandidateRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, electionService.vote(request)));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/{electionId}/polls")
    public ResponseEntity<ApiResponse> viewPolls(@PathVariable String electionId) {
        try {
            return ResponseEntity.ok(electionService.getPolls(electionId));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/{electionId}")
    public ResponseEntity<ApiResponse> getElectionById(@PathVariable String electionId) {
        try {
            return ResponseEntity.ok(electionService.getElectionById(electionId));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/creator/{voterId}")
    public ResponseEntity<ApiResponse> getElectionsByCreator(@PathVariable String voterId) {
        try {
            return ResponseEntity.ok(electionService.getElectionsByCreator(voterId));
        } catch (DreamVoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }
}