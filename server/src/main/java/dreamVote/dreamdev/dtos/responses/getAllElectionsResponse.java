package dreamVote.dreamdev.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class getAllElectionsResponse {
    private String id;
    private String title;
    private LocalDateTime createdAt;
    private boolean isActive;
    private int candidateCount;
    private int voteCount;
}
