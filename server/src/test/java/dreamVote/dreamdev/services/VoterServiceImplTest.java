package dreamVote.dreamdev.services;

import dreamVote.dreamdev.data.repositories.VoterRepository;
import dreamVote.dreamdev.dtos.requests.LoginRequest;
import dreamVote.dreamdev.dtos.requests.LogoutRequest;
import dreamVote.dreamdev.dtos.requests.VoterRegisterationRequest;
import dreamVote.dreamdev.exceptions.DuplicateVoterException;
import dreamVote.dreamdev.exceptions.InvalidLoginDetailsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class VoterServiceImplTest {
    @Autowired
    private VoterService voterService;
    private VoterRegisterationRequest voterRegisterationRequest;
    @Autowired
    private VoterRepository voterRepository;

    private LoginRequest loginRequest;
    @BeforeEach
    public void setup(){
        voterRepository.deleteAll();
        voterRegisterationRequest = new VoterRegisterationRequest();
        voterRegisterationRequest.setEmail("email");
        voterRegisterationRequest.setFirstName("John");
        voterRegisterationRequest.setLastName("Doe");
        voterRegisterationRequest.setPassword("password");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
    }

    @Test
    public void register_successTest(){
        assertEquals(0L, voterRepository.count());
        voterService.register(voterRegisterationRequest);
        assertEquals(1L, voterRepository.count());
    }

    @Test
    public void registerTwiceWithSameEmail_throwExceptionTest(){
        assertEquals(0L, voterRepository.count());
        voterService.register(voterRegisterationRequest);
        assertThrows(DuplicateVoterException.class, ()-> voterService.register(voterRegisterationRequest));
        assertEquals(1L, voterRepository.count());
    }

    @Test
    public void loginRegisterVoter_voterIsLoggedInTest(){
        voterService.register(voterRegisterationRequest);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email");
        loginRequest.setPassword("password");
        voterService.login(loginRequest);
        assertTrue(voterRepository.findByEmail("email").get().isLoggedIn());
    }

    @Test
    public void loginUnregisteredUser_throwExceptionTest(){

        assertThrows(InvalidLoginDetailsException.class, ()-> voterService.login(loginRequest));
    }

    @Test
    public void register_voterIsNotLoggedInTest(){
        voterService.register(voterRegisterationRequest);
        assertFalse(voterRepository.findByEmail("email").get().isLoggedIn());
    }

    @Test
    public void loginWithWrongPassword_throwExceptionTest(){
        voterService.register(voterRegisterationRequest);
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail(loginRequest.getEmail());
        invalidRequest.setPassword("63637272");
        assertThrows(InvalidLoginDetailsException.class, ()-> voterService.login(invalidRequest));
        assertFalse(voterRepository.findByEmail(loginRequest.getEmail()).get().isLoggedIn());
    }

    @Test
    public void loginRegisteredUser_logoutUser_userIsLoggedOutTest(){
        voterService.register(voterRegisterationRequest);
        voterService.login(loginRequest);
        assertTrue(voterRepository.findByEmail(loginRequest.getEmail()).get().isLoggedIn());

        LogoutRequest logoutRequest = new LogoutRequest();
        logoutRequest.setEmail(loginRequest.getEmail());
        voterService.logout(logoutRequest);
        assertFalse(voterRepository.findByEmail(loginRequest.getEmail()).get().isLoggedIn());
    }

    @Test
    public void logoutUnregisteredUser_ThrowsExceptionTest(){
        LogoutRequest logoutRequest = new LogoutRequest();
        logoutRequest.setEmail(loginRequest.getEmail());
        assertThrows(InvalidLoginDetailsException.class, ()-> voterService.logout(logoutRequest));
    }

}