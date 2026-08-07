package com.support.ticketai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.support.ticketai.dto.AiClassificationResult;
import com.support.ticketai.dto.ChatMessage;
import com.support.ticketai.dto.GroqRequest;
import com.support.ticketai.dto.GroqResponse;
import com.support.ticketai.entity.Category;
import com.support.ticketai.entity.Priority;
import com.support.ticketai.entity.Status;
import com.support.ticketai.entity.Ticket;
import com.support.ticketai.exception.ResourceNotFoundException;
import com.support.ticketai.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Calls the Groq API (OpenAI-compatible chat completions) to auto-classify a
 * ticket: category, priority, and a suggested first response.
 *
 * Design decision: this NEVER throws back up to the controller. If the AI
 * call fails for any reason (bad key, network issue, malformed response),
 * the ticket simply stays in its current state (OPEN, unclassified) instead
 * of the whole request failing. The ticket itself is never lost — see the
 * comment in TicketService.createTicket for why that ordering matters.
 */
@Service
public class AiClassificationService {

    private static final Logger log = LoggerFactory.getLogger(AiClassificationService.class);

    private final TicketRepository ticketRepository;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    public AiClassificationService(TicketRepository ticketRepository, ObjectMapper objectMapper) {
        this.ticketRepository = ticketRepository;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.create();
    }

    public Ticket classifyAndUpdate(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("GROQ_API_KEY not set — skipping AI classification for ticket {}. " +
                    "Ticket will remain unclassified.", ticketId);
            return ticket;
        }

        try {
            String prompt = buildPrompt(ticket);
            GroqRequest request = buildRequest(prompt);

            GroqResponse response = restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GroqResponse.class);

            String rawJson = extractText(response);
            AiClassificationResult result = objectMapper.readValue(rawJson, AiClassificationResult.class);

            ticket.setCategory(parseCategory(result.getCategory()));
            ticket.setPriority(parsePriority(result.getPriority()));
            ticket.setSuggestedResponse(result.getSuggestedResponse());
            ticket.setStatus(Status.TRIAGED);

            Ticket saved = ticketRepository.save(ticket);
            log.info("Ticket {} classified as {} / {}", ticketId, saved.getCategory(), saved.getPriority());
            return saved;

        } catch (Exception e) {
            // Deliberately broad catch: network errors, JSON parse errors, API
            // errors (bad key, rate limit) should all degrade gracefully, not break
            // ticket creation for the user.
            log.error("AI classification failed for ticket {}: {}", ticketId, e.getMessage());
            return ticket;
        }
    }

    private String buildPrompt(Ticket ticket) {
        return """
                You are an IT support ticket triage assistant. Classify the following ticket
                and respond with ONLY a raw JSON object (no markdown, no explanation) in
                exactly this shape:

                {
                  "category": one of HARDWARE, NETWORK_VPN, SOFTWARE, ACCESS_PERMISSIONS, ACCOUNT, OTHER,
                  "priority": one of P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW,
                  "suggestedResponse": a short, professional 2-3 sentence first response to send the user
                }

                Ticket subject: %s
                Ticket description: %s
                """.formatted(ticket.getSubject(), ticket.getDescription());
    }

    private GroqRequest buildRequest(String prompt) {
        ChatMessage message = new ChatMessage("user", prompt);
        GroqRequest.ResponseFormat responseFormat = new GroqRequest.ResponseFormat("json_object");
        return new GroqRequest(model, List.of(message), 0.2, responseFormat);
    }

    private String extractText(GroqResponse response) {
        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            throw new IllegalStateException("Groq returned no choices");
        }
        ChatMessage message = response.getChoices().get(0).getMessage();
        if (message == null || message.getContent() == null) {
            throw new IllegalStateException("Groq response had no message content");
        }
        return message.getContent();
    }

    private Category parseCategory(String value) {
        try {
            return Category.valueOf(value);
        } catch (Exception e) {
            log.warn("AI returned unrecognized category '{}', defaulting to OTHER", value);
            return Category.OTHER;
        }
    }

    private Priority parsePriority(String value) {
        try {
            return Priority.valueOf(value);
        } catch (Exception e) {
            log.warn("AI returned unrecognized priority '{}', defaulting to P3_MEDIUM", value);
            return Priority.P3_MEDIUM;
        }
    }
}
