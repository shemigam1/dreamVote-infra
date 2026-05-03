package dreamVote.dreamdev.dtos.requests;

import lombok.Data;

@Data
public class ActivateElectionRequest {
    private String electionId;
    private String voterId;
}
