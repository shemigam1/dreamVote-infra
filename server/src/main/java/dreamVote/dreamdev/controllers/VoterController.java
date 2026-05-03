package dreamVote.dreamdev.controllers;

import dreamVote.dreamdev.dtos.requests.LoginRequest;
import dreamVote.dreamdev.dtos.requests.LogoutRequest;
import dreamVote.dreamdev.dtos.requests.VoterRegisterationRequest;
import dreamVote.dreamdev.dtos.responses.ApiResponse;
import dreamVote.dreamdev.exceptions.DreamVoteException;
import dreamVote.dreamdev.services.VoterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/voters")
public class VoterController {
    @Autowired
    private VoterService voterService;

    @PostMapping("/")
    public ResponseEntity<?> register(@RequestBody VoterRegisterationRequest request) {
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, voterService.register(request)));
        } catch (DreamVoteException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try{
            return ResponseEntity.ok(new ApiResponse(true, voterService.login(request)));

        }catch (DreamVoteException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestBody LogoutRequest request) {
        try{

            return ResponseEntity.ok(new ApiResponse(true, voterService.logout(request)));
        } catch (DreamVoteException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        }
    }
}
