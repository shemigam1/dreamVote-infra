package dreamVote.dreamdev.data.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
public class Vote {
    @Id
    private String id;
    private String voterID;
    private String candidateId;
    private String electionId;
    private LocalDateTime createdAt = LocalDateTime.now();
}
