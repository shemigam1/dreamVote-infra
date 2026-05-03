package dreamVote.dreamdev.dtos.requests;

import lombok.Data;

@Data
public class GetAllCandidatesRequest {
    private String voterId;
    private String electionId;
}
