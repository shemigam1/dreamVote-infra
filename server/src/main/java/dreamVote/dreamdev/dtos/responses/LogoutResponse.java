package dreamVote.dreamdev.dtos.responses;

import lombok.Data;

@Data
public class LogoutResponse {
    private String voterId;
    private String email;
    private boolean isLoggedIn;
}
