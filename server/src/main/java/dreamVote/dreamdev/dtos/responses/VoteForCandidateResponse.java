package dreamVote.dreamdev.dtos.responses;

import lombok.Data;

@Data
public class VoteForCandidateResponse {
    private String voterId;
    private String email;
    private String candidateName;
    private boolean isLoggedIn;
}
