# Triage — AI Support Desk (Frontend)

React + Vite + Tailwind frontend for the AI-powered IT support ticket
system. Talks to the Spring Boot backend at `http://localhost:8080`.

## Design

Dark console-style interface — leans into the "IT/network support" domain
rather than a generic SaaS look. Priority is shown as signal-strength bars
(a literal callback to network tickets) instead of a plain colored pill.
Submitting a ticket reveals the AI's triage result in a terminal-style
readout, since that's the actual differentiating feature of this project.

- **Display font:** Space Grotesk (headings)
- **Body font:** Inter
- **Mono font:** JetBrains Mono (ticket IDs, timestamps, data, the AI readout)
- **Palette:** near-black slate background, teal accent (AI/success),
  amber/danger for priority urgency

## How to Run

**The backend must already be running** at `http://localhost:8080`
(see the backend README) — this frontend has nothing to talk to otherwise.

1. Install dependencies:
   ```
   npm install
   ```
2. Start the dev server:
   ```
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser

## How It Works

- No login/auth yet (that's backend Phase 3, not built yet) — the
  "Get started" screen just registers a user via `/api/users/register`
  and remembers their id in `localStorage` so tickets can be attached to
  them. Click "switch user" in the top-right to register as someone else.
- **Dashboard** (`/`) — lists all tickets, filterable by status.
- **New ticket** (`/new`) — submitting shows a real loading state while
  the backend calls the AI, then reveals the classification result
  (category, priority, suggested response) with a staggered fade-in.
- **Ticket detail** (`/tickets/:id`) — full ticket view with manual
  status update buttons (useful since there's no agent-assignment flow yet).

## Project Structure

- `src/api/client.js` — single fetch wrapper for every backend call
- `src/components/` — `PriorityBadge` (signal bars), `StatusPill`,
  `TicketRow`, `Sidebar`
- `src/pages/` — `Onboarding`, `Dashboard`, `NewTicket`, `TicketDetail`

## Note on Verification

This was built and test-compiled (`npm run build`) successfully before
being handed over — unlike the Java backend, npm packages were reachable
in the environment this was built in, so this one is genuinely verified,
not just "should work."

## Next Steps

- Wire in real auth once backend Phase 3 (Spring Security + JWT) is done
  — replace the localStorage user id with a real JWT-based session
- Add the "similar past tickets" panel if backend Phase 5 gets built
- Deploy alongside the backend (Phase 7)
