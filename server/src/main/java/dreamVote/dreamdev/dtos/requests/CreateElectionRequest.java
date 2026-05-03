package dreamVote.dreamdev.dtos.requests;

import lombok.Data;

@Data
public class CreateElectionRequest {
    private String voterId;
    private String title;
    private String description;
}
