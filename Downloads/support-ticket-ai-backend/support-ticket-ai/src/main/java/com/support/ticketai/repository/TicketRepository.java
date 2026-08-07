package com.support.ticketai.repository;

import com.support.ticketai.entity.Status;
import com.support.ticketai.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Spring Data derives the SQL from the method name — no query needed
    List<Ticket> findByRaisedById(Long userId);

    List<Ticket> findByStatus(Status status);

    List<Ticket> findByAssignedAgentId(Long agentId);

    // Example of a custom JPQL query — good to show you understand @Query too,
    // not just method-name derivation
    @Query("SELECT t FROM Ticket t WHERE t.category = :category AND t.status = 'RESOLVED'")
    List<Ticket> findResolvedTicketsByCategory(@Param("category") com.support.ticketai.entity.Category category);
}
