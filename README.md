# AI-Assisted IT Support Ticket System (Backend)

A Spring Boot REST API for an IT helpdesk where employees raise tickets, an AI model (Groq, Llama) classifies each ticket and drafts a first response, and an admin decides how to resolve it.

## Features

- Role-based access: admin sees all tickets, employees see only their own
- AI classification of each ticket (category, priority, suggested response) via the Groq API
- Tickets are saved before the AI call, so a failed AI request never loses a ticket
- Admin-to-employee chat tied to each ticket
- Employee confirmation step before a ticket is closed
- Demo accounts seeded automatically on startup

## Tech Stack

- Java 25
- Spring Boot, Spring Web, Spring Data JPA
- H2 in-memory database
- Maven
- Groq API (llama-3.1-8b-instant)

## Architecture

The backend follows a layered structure:

- **Controller**: REST endpoints (`TicketController`, `AuthController`, `MessageController`, `UserController`)
- **Service**: business logic (`TicketService`, `AiClassificationService`, `AuthService`, `MessageService`, `UserService`)
- **Repository**: Spring Data JPA interfaces for the database
- **Entity**: JPA classes for `User`, `Ticket`, and `Message`
- **DTO**: request and response shapes, so entities are never exposed directly

## Prerequisites

- JDK 25
- Maven 3.9+
- A Groq API key from https://console.groq.com/keys

## Setup

1. Clone the repository:
```bash
   git clone https://github.com/pratyushsachan/-support-ticket-ai.git
   cd -support-ticket-ai
```

2. Set your Groq API key as an environment variable.

   On Windows (permanent):
   - Open System Environment Variables, add a User variable named `GROQ_API_KEY` with your key as the value
   - Open a new terminal and check with `echo %GROQ_API_KEY%`

   On macOS/Linux:
```bash
   export GROQ_API_KEY=your_key_here
```

3. Run the application:
```bash
   mvn spring-boot:run
```

   The API starts on `http://localhost:8080`.

## Demo Accounts

Seeded automatically on every startup (the database resets on restart).

| Role     | Email                  | Password |
|----------|------------------------|----------|
| Admin    | admin@company.com      | admin123 |
| Employee | employee1@company.com  | emp123   |
| Employee | employee2@company.com  | emp123   |
| Employee | employee3@company.com  | emp123   |

## Key API Endpoints

| Method | Endpoint                                  | Purpose                        |
|--------|-------------------------------------------|--------------------------------|
| POST   | `/api/auth/login`                         | Log in                         |
| POST   | `/api/tickets`                            | Create a ticket (triggers AI)  |
| GET    | `/api/tickets`                            | List all tickets (admin)       |
| GET    | `/api/tickets/user/{id}`                  | List a user's tickets          |
| PATCH  | `/api/tickets/{id}/status`                | Update ticket status           |
| POST   | `/api/messages/tickets/{id}/send`         | Send a chat message            |
| GET    | `/api/messages/tickets/{id}`              | Get chat messages for a ticket |

## Design Decisions

- **Save first, then classify.** The ticket is persisted before the Groq call. If the AI request fails or times out, the ticket remains and is handled manually.
- **DTOs over entities.** API responses are mapped to DTOs so internal model changes do not leak into the API.
- **Provider-agnostic AI layer.** Groq's API is OpenAI-compatible, so switching providers requires a configuration change rather than a rewrite.
- **No Lombok.** Removed due to compatibility issues with JDK 25; getters, setters, and constructors are written explicitly.

## Known Limitations

- Authentication is a plain email/password check. JWT and BCrypt password hashing are planned.
- H2 is in-memory, so data resets on restart.
- No real-time updates; the frontend needs a refresh to see new messages.

## Frontend

The React + Vite + Tailwind frontend lives in its own repository: [add frontend repo link here].

## Next Steps

- Spring Security with JWT authentication
- BCrypt password hashing
- Persistent database (PostgreSQL)
- Deployment
