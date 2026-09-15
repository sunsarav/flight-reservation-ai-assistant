# ✈️ Flight Reservation AI Assistant

A Spring Boot flight reservation system, extended with an AI assistant that lets users search, book, and cancel flights through natural conversation.

---

## Architecture

```
Flight Reservation AI Assistant
│
├── ReactJS + TypeScript — Chatbot UI
├── Spring Boot REST API — Flight Controller, AI Chat Controller
├── AI Assistant — ChatClient, System Message, Chat Memory, Tools
├── Service Layer — Flight Booking Service
├── Repository Layer — Flight Booking Repository
└── MySQL Database
```

**Stack** — Java · Spring Boot · Spring AI · OpenAI · Spring Data JPA · MySQL · ReactJS · TypeScript · Vite · JUnit 5 · Mockito

---

## What It Does

**Reservation system**
View all flights, view available flights, book by name and email, cancel by email, check bookings by email.

**AI assistant**
Understands natural-language requests and carries them out — searching, booking, and cancelling flights through conversation, guided by a system message that defines its role. It keeps a limited in-memory chat history (per `chatId`) for context and asks for clarification when details are missing.

**Chatbot UI**
React frontend where users chat with the assistant and see responses in real time, continuing the same conversation via `chatId`.

---

## AI Tools

The assistant acts through Spring AI tool calling — it never touches the database directly, only the existing service layer, via `@Tool` / `defaultTools(...)`:

**searchAllFlights** → full flight list
**searchAvailableFlights** → flights with availability
**bookFlight** → books a flight by flight ID, name, and email
**findBookings** → looks up bookings by email
**cancelFlight** → cancels a booking by flight ID and email

---

## Requirements

Java 25 · Maven · MySQL · Node.js · npm · an OpenAI API key

## Configuration

```bash
OPENAI_API_KEY=your-openai-api-key
MYSQL_PASSWORD=your-mysql-password
```

---

## Running the Backend

```bash
git clone <repository-url>
cd <project-folder>
```

Make sure MySQL is running, set the environment variables above, then run the Spring Boot application. It starts on `http://localhost:8080`.

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on `http://localhost:5173`, and talks to the backend at:

```
GET /api/v1/ai/chat?chatId=...&message=...
```

---

## API Docs

Swagger UI: `http://localhost:8080/swagger-ui.html`
OpenAPI spec: `http://localhost:8080/v3/api-docs`

## Testing

JUnit 5 and Mockito cover core booking flows and tool-calling behavior, with the AI tools mocked against the service layer for fast local runs.
