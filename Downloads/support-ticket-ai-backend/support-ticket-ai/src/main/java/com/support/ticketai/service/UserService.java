package com.support.ticketai.service;

import com.support.ticketai.dto.RegisterUserRequest;
import com.support.ticketai.entity.Role;
import com.support.ticketai.entity.User;
import com.support.ticketai.exception.ResourceNotFoundException;
import com.support.ticketai.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder; // wired in Phase 3 with Spring Security

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                // TODO Phase 3: .password(passwordEncoder.encode(request.getPassword()))
                .password(request.getPassword()) // PLAIN TEXT — placeholder only, replace before real use
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
