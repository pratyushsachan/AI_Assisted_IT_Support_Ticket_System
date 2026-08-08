package com.support.ticketai.controller;

import com.support.ticketai.dto.MessageRequest;
import com.support.ticketai.dto.MessageResponse;
import com.support.ticketai.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/tickets/{ticketId}/send")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long ticketId,
            @RequestParam Long senderId,
            @Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(ticketId, senderId, request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tickets/{ticketId}")
    public ResponseEntity<List<MessageResponse>> getTicketMessages(@PathVariable Long ticketId) {
        return ResponseEntity.ok(messageService.getTicketMessages(ticketId));
    }
}