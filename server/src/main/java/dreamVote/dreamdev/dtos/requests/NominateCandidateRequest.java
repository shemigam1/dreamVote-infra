package dreamVote.dreamdev.dtos.requests;

import lombok.Data;

@Data
public class NominateCandidateRequest {
    private String electionId;
    private String firstName;
    private String lastName;
}
