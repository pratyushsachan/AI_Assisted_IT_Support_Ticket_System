package com.support.ticketai.service;

import com.support.ticketai.dto.CreateTicketRequest;
import com.support.ticketai.dto.TicketResponse;
import com.support.ticketai.entity.Status;
import com.support.ticketai.entity.Ticket;
import com.support.ticketai.entity.User;
import com.support.ticketai.exception.ResourceNotFoundException;
import com.support.ticketai.repository.TicketRepository;
import com.support.ticketai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AiClassificationService aiClassificationService;

    // Explicit constructor (Spring auto-injects this — this is what
    // Lombok's @RequiredArgsConstructor would normally generate)
    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
                          AiClassificationService aiClassificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.aiClassificationService = aiClassificationService;
    }

    /**
     * Creates a ticket and saves it immediately — before any AI call.
     * This matters: if the AI API is slow, down, or errors out, the user's
     * ticket is never lost. Classification is applied as a follow-up update.
     */
    public TicketResponse createTicket(CreateTicketRequest request) {
        User raisedBy = userRepository.findById(request.getRaisedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getRaisedByUserId()));

        Ticket ticket = Ticket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .raisedBy(raisedBy)
                .status(Status.OPEN)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // Classify immediately (synchronous). The ticket is already safely saved
        // above, so if this call fails or is slow, no data is ever lost —
        // see AiClassificationService for the graceful-degradation handling.
        Ticket classified = aiClassificationService.classifyAndUpdate(saved.getId());

        return TicketResponse.fromEntity(classified);
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = findTicketOrThrow(id);
        return TicketResponse.fromEntity(ticket);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    public List<TicketResponse> getTicketsByUser(Long userId) {
        return ticketRepository.findByRaisedById(userId).stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    public List<TicketResponse> getTicketsByStatus(Status status) {
        return ticketRepository.findByStatus(status).stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    public TicketResponse updateStatus(Long id, Status newStatus) {
        Ticket ticket = findTicketOrThrow(id);
        ticket.setStatus(newStatus);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        Ticket ticket = findTicketOrThrow(id);
        ticketRepository.delete(ticket);
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }
}
