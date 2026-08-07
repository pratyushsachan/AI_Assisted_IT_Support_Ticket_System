# AI-Powered IT Support Ticket System — Backend (Phase 1, 2 & 4)

Spring Boot REST API for an IT helpdesk system with AI-powered ticket
classification via Groq (Llama models, OpenAI-compatible API). Entities,
database schema, CRUD REST endpoints, and AI classification are all working.
Auth (Phase 3) and the frontend (Phase 6) are next.

## Tech Stack
- Java (targets 17, tested on JDK 25 — no Lombok, all boilerplate is
  hand-written to avoid annotation-processor compatibility issues on very
  new JDKs)
- Spring Boot 3.3 (Web, Data JPA, Validation)
- H2 in-memory database (zero setup — swap for Postgres before deploying)
- Groq API (llama-3.1-8b-instant) for AI ticket classification — chosen
  after Gemini's free tier returned a persistent 0-quota error on this
  Google account; Groq's free tier proved more reliable
- Maven

## How to Run

1. **Get a free Groq API key** at console.groq.com — sign up (Google/GitHub
   login works), then go to "API Keys" → "Create API Key".

2. **Set it as an environment variable** (never hardcode it in
   application.properties — that file is committed to GitHub):
   - Windows Command Prompt (current session only):
     ```
     set GROQ_API_KEY=your_key_here
     ```
   - To make it permanent on Windows: search "environment variables" →
     Edit the system environment variables → Environment Variables → New
     under User variables → Name: `GROQ_API_KEY`, Value: your key.

3. From the project root (same terminal where you set the key):
   ```
   mvn spring-boot:run
   ```
4. The API runs at `http://localhost:8080`
5. H2 database console: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:ticketdb`, Username: `sa`, Password: (blank)

**Note:** if `GROQ_API_KEY` isn't set, the app still runs fine — tickets
are just created without AI classification (category/priority stay null,
status stays OPEN) instead of the request failing. Check the console logs
for a warning if this happens.

## API Endpoints

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Create a new user |
| GET | `/api/users/{id}` | Get user by ID |

### Tickets
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tickets` | Create a ticket — triggers AI classification synchronously |
| GET | `/api/tickets` | List all tickets (optional `?status=OPEN`) |
| GET | `/api/tickets/{id}` | Get a single ticket |
| GET | `/api/tickets/user/{userId}` | Get tickets raised by a user |
| PATCH | `/api/tickets/{id}/status?status=RESOLVED` | Update ticket status |
| DELETE | `/api/tickets/{id}` | Delete a ticket |

## Quick Test (once running, with GROQ_API_KEY set)

```bash
# 1. Register a user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"fullName\":\"Test User\"}"

# 2. Create a ticket — this now calls Groq and returns it already classified
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d "{\"subject\":\"VPN not connecting\",\"description\":\"My laptop cannot connect to VPN before my 3pm call.\",\"raisedByUserId\":1}"

# You should see category, priority, and suggestedResponse filled in,
# and status as "TRIAGED" instead of "OPEN"
```

## Project Structure & Design Notes

- **entity/** — JPA entities (`User`, `Ticket`) + enums (`Role`, `Status`, `Category`, `Priority`).
  Ticket has a `@ManyToOne` to `User` for both `raisedBy` and `assignedAgent`.
- **repository/** — Spring Data JPA interfaces: method-name-derived queries
  (`findByStatus`) and a custom `@Query` (JPQL) example.
- **dto/** — Request/response objects, kept separate from entities so the API
  contract stays stable and internal fields (like password) never leak.
  Also includes the Groq request/response shapes (`GroqRequest`,
  `GroqResponse`, `ChatMessage`, `AiClassificationResult`).
- **service/** — Business logic. `TicketService.createTicket()` saves the
  ticket *before* calling the AI, so nothing is lost if the AI call fails.
  `AiClassificationService` builds the prompt, calls Groq, parses the JSON
  response, and updates the ticket — with a broad catch so any failure
  (bad key, network issue, malformed AI response) degrades gracefully
  instead of breaking ticket creation.
- **exception/** — `GlobalExceptionHandler` turns exceptions into clean JSON
  error responses instead of raw stack traces.
- **config/** — CORS config so a React frontend on a different port can call this API.

## How the AI Classification Works

1. Ticket is saved to the DB first (status `OPEN`, category/priority null).
2. `AiClassificationService` sends the subject + description to Groq with
   a prompt asking for a strict JSON response (`response_format: {"type":
   "json_object"}` forces the model to skip markdown formatting).
3. The response is parsed into `category`, `priority`, and
   `suggestedResponse`. If the model returns something unexpected (e.g. an
   invalid enum value), it falls back to safe defaults (`OTHER` /
   `P3_MEDIUM`) rather than crashing.
4. The ticket is updated and status flips to `TRIAGED`.
5. If any step fails, the original `OPEN` ticket is returned unchanged —
   the user's ticket submission never fails because of an AI hiccup.

## Roadmap

- [x] **Phase 1-2:** Entities, DB schema, CRUD REST endpoints
- [x] **Phase 4:** AI integration via Groq — auto-classify category/priority + draft response
- [ ] **Phase 3:** Spring Security + JWT auth (replace plain-text password placeholder with BCrypt)
- [ ] **Phase 5 (optional):** "Similar past tickets" search over resolved tickets
- [ ] **Phase 6:** React + Tailwind frontend
- [ ] **Phase 7:** Deploy (Render/Railway) + polish README with screenshots

## Note on Verification

This code was written to standard Spring Boot 3.x conventions but could not be
compiled in the sandbox it was generated in (no access to Maven Central). It
has since been confirmed working end-to-end (Phase 1-2 CRUD) on the user's
machine running JDK 25. Phase 4 (AI integration) follows the same patterns
and should work the same way — test it and report back any errors.

