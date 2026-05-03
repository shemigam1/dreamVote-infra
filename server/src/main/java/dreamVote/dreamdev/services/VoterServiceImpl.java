package dreamVote.dreamdev.services;

import dreamVote.dreamdev.data.models.Vote;
import dreamVote.dreamdev.data.models.Voter;
import dreamVote.dreamdev.data.repositories.VoterRepository;
import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.*;
import dreamVote.dreamdev.exceptions.DuplicateVoterException;
import dreamVote.dreamdev.exceptions.InvalidLoginDetailsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static dreamVote.dreamdev.utils.Mapper.*;

@Service
public class VoterServiceImpl implements VoterService{
    @Autowired
    private VoterRepository voterRepository;

    @Override
    public VoterRegisterationResponse register(VoterRegisterationRequest voterRegisterationRequest) {
        if(voterRepository.findByEmail(voterRegisterationRequest.getEmail()).isPresent())
            throw new DuplicateVoterException("Voter with email " +
                voterRegisterationRequest.getEmail() + " already exists");
        Voter voter = map(voterRegisterationRequest);
        voter.setLoggedIn(true);
        Voter savedVoter =  voterRepository.save(voter);
        return map(savedVoter);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        Optional<Voter> optionalVoter = voterRepository.findByEmail(loginRequest.getEmail());
        if(optionalVoter.isEmpty()) throw new InvalidLoginDetailsException("Voter with email " + loginRequest.getEmail() + " does not exist");

        Voter voter = optionalVoter.get();
        if(!voter.getPassword().equals(loginRequest.getPassword())) throw new InvalidLoginDetailsException("Invalid password");
        voter.setLoggedIn(true);
        Voter savedVoter = voterRepository.save(voter);
        return mapToLoginResponse(savedVoter);
    }

    @Override
    public LogoutResponse logout(LogoutRequest logoutRequest) {
        Optional<Voter> optionalVoter = voterRepository.findByEmail(logoutRequest.getEmail());
        if(optionalVoter.isEmpty()) throw new InvalidLoginDetailsException("Voter with email " + logoutRequest.getEmail() + " does not exist");

        Voter voter = optionalVoter.get();
        voter.setLoggedIn(false);
        Voter savedVoter = voterRepository.save(voter);
        return mapToLogoutResponse(savedVoter);
    }

}
