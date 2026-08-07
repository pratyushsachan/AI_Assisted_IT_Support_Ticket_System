package com.support.ticketai.controller;

import com.support.ticketai.dto.RegisterUserRequest;
import com.support.ticketai.entity.User;
import com.support.ticketai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterUserRequest request) {
        User created = userService.register(request);
        created.setPassword(null); // never echo the password back, even a placeholder one
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getById(id);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
