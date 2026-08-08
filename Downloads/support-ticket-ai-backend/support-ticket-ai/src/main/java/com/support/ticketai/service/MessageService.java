package com.support.ticketai.service;

import com.support.ticketai.dto.MessageResponse;
import com.support.ticketai.entity.Message;
import com.support.ticketai.entity.Ticket;
import com.support.ticketai.entity.User;
import com.support.ticketai.exception.ResourceNotFoundException;
import com.support.ticketai.repository.MessageRepository;
import com.support.ticketai.repository.TicketRepository;
import com.support.ticketai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          TicketRepository ticketRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public MessageResponse sendMessage(Long ticketId, Long senderId, String content) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Message message = new Message();
        message.setTicket(ticket);
        message.setSender(sender);
        message.setContent(content);

        Message saved = messageRepository.save(message);
        return MessageResponse.fromEntity(saved);
    }

    public List<MessageResponse> getTicketMessages(Long ticketId) {
        return messageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(MessageResponse::fromEntity)
                .toList();
    }
}