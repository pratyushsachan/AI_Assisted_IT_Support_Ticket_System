package com.support.ticketai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A single message in the OpenAI-compatible chat format that Groq uses.
 * Shared shape for both request messages (role="user") and the response
 * message Groq sends back (role="assistant").
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessage {

    private String role;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
