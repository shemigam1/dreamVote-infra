package dreamVote.dreamdev.dtos.requests;

import lombok.Data;

@Data
public class VoterRegisterationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;

}
