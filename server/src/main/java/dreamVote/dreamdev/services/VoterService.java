package dreamVote.dreamdev.services;

import dreamVote.dreamdev.dtos.requests.*;
import dreamVote.dreamdev.dtos.responses.*;

public interface VoterService {
    VoterRegisterationResponse register(VoterRegisterationRequest voterRegisterationRequest);

    LoginResponse login(LoginRequest loginRequest);

    LogoutResponse logout(LogoutRequest logoutRequest);

}
