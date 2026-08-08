package com.support.ticketai.dto;

import com.support.ticketai.entity.Message;
import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private Long ticketId;
    private String senderEmail;
    private String content;
    private LocalDateTime createdAt;

    public static MessageResponse fromEntity(Message message) {
        MessageResponse dto = new MessageResponse();
        dto.setId(message.getId());
        dto.setTicketId(message.getTicket().getId());
        dto.setSenderEmail(message.getSender().getEmail());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }

    // --- Getters/Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}