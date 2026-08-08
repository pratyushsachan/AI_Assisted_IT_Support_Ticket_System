package com.support.ticketai.dto;

import com.support.ticketai.entity.Category;
import com.support.ticketai.entity.Priority;
import com.support.ticketai.entity.Status;
import com.support.ticketai.entity.Ticket;
import java.time.LocalDateTime;

public class TicketResponse {

    private Long id;
    private String subject;
    private String description;
    private Category category;
    private Priority priority;
    private String suggestedResponse;
    private String similarTicketsSummary;
    private Status status;
    private String raisedByEmail;
    private String assignedAgentEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String adminResponse;
    private boolean aiSolved;

    public TicketResponse() {
    }

    // Maps the entity -> DTO. Keeping this logic here (or in a mapper class)
    // keeps the entity from ever leaking straight out over the API.
    public static TicketResponse fromEntity(Ticket ticket) {
        TicketResponse dto = new TicketResponse();
        dto.setId(ticket.getId());
        dto.setSubject(ticket.getSubject());
        dto.setDescription(ticket.getDescription());
        dto.setCategory(ticket.getCategory());
        dto.setPriority(ticket.getPriority());
        dto.setSuggestedResponse(ticket.getSuggestedResponse());
        dto.setSimilarTicketsSummary(ticket.getSimilarTicketsSummary());
        dto.setStatus(ticket.getStatus());
        dto.setRaisedByEmail(ticket.getRaisedBy() != null ? ticket.getRaisedBy().getEmail() : null);
        dto.setAssignedAgentEmail(ticket.getAssignedAgent() != null ? ticket.getAssignedAgent().getEmail() : null);
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setAdminResponse(ticket.getAdminResponse());
        dto.setAiSolved(ticket.isAiSolved());
        return dto;
    }

    // --- Manual getters/setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getSuggestedResponse() {
        return suggestedResponse;
    }

    public void setSuggestedResponse(String suggestedResponse) {
        this.suggestedResponse = suggestedResponse;
    }

    public String getSimilarTicketsSummary() {
        return similarTicketsSummary;
    }

    public void setSimilarTicketsSummary(String similarTicketsSummary) {
        this.similarTicketsSummary = similarTicketsSummary;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getRaisedByEmail() {
        return raisedByEmail;
    }

    public void setRaisedByEmail(String raisedByEmail) {
        this.raisedByEmail = raisedByEmail;
    }

    public String getAssignedAgentEmail() {
        return assignedAgentEmail;
    }

    public void setAssignedAgentEmail(String assignedAgentEmail) {
        this.assignedAgentEmail = assignedAgentEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public boolean isAiSolved() {
        return aiSolved;
    }

    public void setAiSolved(boolean aiSolved) {
        this.aiSolved = aiSolved;
    }
}
