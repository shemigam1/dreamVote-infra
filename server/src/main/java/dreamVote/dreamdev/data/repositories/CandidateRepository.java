package dreamVote.dreamdev.data.repositories;

import dreamVote.dreamdev.data.models.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CandidateRepository extends MongoRepository<Candidate, String> {
    Optional<Candidate> findByLastName(String lastName);
}
