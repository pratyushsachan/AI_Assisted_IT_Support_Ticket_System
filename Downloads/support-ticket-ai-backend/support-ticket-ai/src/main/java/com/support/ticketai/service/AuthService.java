package com.support.ticketai.service;

import com.support.ticketai.dto.LoginRequest;
import com.support.ticketai.dto.LoginResponse;
import com.support.ticketai.entity.User;
import com.support.ticketai.exception.ResourceNotFoundException;
import com.support.ticketai.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Simple login — checks email and password.
     * Phase 3 (real auth) would use BCrypt hashing and JWT tokens.
     * For now this is a placeholder so the frontend can distinguish
     * admin vs employee and show role-appropriate UI.
     */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + request.getEmail()));

        // TODO Phase 3: use passwordEncoder.matches() here instead of plain comparison
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return LoginResponse.fromEntity(user);
    }
}