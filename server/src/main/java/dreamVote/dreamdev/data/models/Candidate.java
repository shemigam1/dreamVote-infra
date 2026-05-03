package dreamVote.dreamdev.data.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
public class Candidate {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt = LocalDateTime.now();
}
