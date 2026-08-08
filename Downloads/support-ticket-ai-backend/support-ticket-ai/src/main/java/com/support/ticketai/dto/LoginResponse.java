package com.support.ticketai.dto;

import com.support.ticketai.entity.Role;
import com.support.ticketai.entity.User;

public class LoginResponse {

    private Long id;
    private String email;
    private String fullName;
    private Role role;

    public static LoginResponse fromEntity(User user) {
        LoginResponse dto = new LoginResponse();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        return dto;
    }

    // --- Getters/Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}