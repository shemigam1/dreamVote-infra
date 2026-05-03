package dreamVote.dreamdev.dtos.responses;

import lombok.Data;

@Data
public class CreateElectionResponse {
    private String electionId;
    private boolean isActive;
}
