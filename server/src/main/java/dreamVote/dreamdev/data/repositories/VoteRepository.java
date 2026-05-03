package dreamVote.dreamdev.data.repositories;

import dreamVote.dreamdev.data.models.Vote;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VoteRepository extends MongoRepository <Vote, String> {
    Optional<Object> findByVoterIDAndElectionId(String voterID, String electionId);
}
