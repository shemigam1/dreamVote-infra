package dreamVote.dreamdev.data.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Data
@Document
public class Election {
    @Id
    private String id;
    private String title;
    private String description;
    private String createdBy;
    private ArrayList<Vote> votes = new ArrayList<>();
    private ArrayList<Candidate> candidates = new ArrayList<>();
    private Map<String, Integer> poll = new HashMap<>();
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean active;
}
