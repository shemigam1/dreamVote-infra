package dreamVote.dreamdev.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginResponse {
    private String voterId;
    private String email;
    @JsonProperty("isLoggedIn")
    private boolean isLoggedIn;
}
