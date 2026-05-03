package dreamVote.dreamdev.dtos.requests;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteForCandidateRequest {
    private String voterId;
    private String electionId;
    private String candidateLastName;
}
