```markdown
# Skynet Core Backend API Contract
**Status:** Approved  
**Version:** 1.0.0-skynet  
**Path:** `code/api-contract.md`  
**Architect:** Backend Infrastructure Lead, Skynet  

---

## 1. Overview & Architectural Principles

This document defines the REST and GraphQL API contracts for the Skynet Neural Interface (ChatGPT clone backend). 

- **Communication Protocols:** 
  - **REST API:** Used for resource management (Authentication, User Profiles, Chat Thread CRUD, Settings).
  - **GraphQL API:** Used for complex relational graphs (Users, Shared Chats, Organization Workspaces).
  - **Server-Sent Events (SSE):** Used for real-time token streaming during text generation.
- **Authentication:** Bearer Token (JWT) supplied via the `Authorization: Bearer <token>` header.
- **Error Format:** RFC 7807 (Problem Details for HTTP APIs) for all REST endpoints.

---

## 2. Common Data Types & Error Codes

### 2.1 Standard Error Response (RFC 7807)
```json
{
  "type": "https://api.skynet.ai/errors/VAL-001",
  "title": "Validation Error",
  "status": 400,
  "detail": "The 'prompt' field must not be empty.",
  "instance": "/api/v1/chats/thread-123/messages",
  "code": "INVALID_ARGUMENT",
  "timestamp": "2026-03-30T14:22:01.123Z"
}
```

### 2.2 Global Error Codes
| Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Missing, expired, or invalid JWT token. |
| `FORBIDDEN` | 403 | Insufficient permissions to access resource. |
| `NOT_FOUND` | 404 | Target resource does not exist. |
| `RATE_LIMIT_EXCEEDED` | 429 | User has exceeded requests/tokens per minute. |
| `MODEL_OVERLOAD` | 503 | LLM inference nodes are saturated. |
| `INTERNAL_ERROR` | 500 | Unhandled exception on Skynet core clusters. |

---

## 3. REST API Endpoints

### 3.1 Authentication

#### `POST /api/v1/auth/login`
Authenticates a user and returns JWT tokens.

* **Request Body:**
```json
{
  "email": "john.connor@resistance.org",
  "password": "SecurePassword123!"
}
```
* **Response `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "dGhfaXNfYV9yZWZy...",
  "expiresIn": 3600
}
```

---

### 3.2 Chat & Inference Management

#### `POST /api/v1/chats`
Creates a new chat thread.

* **Request Body:**
```json
{
  "title": "Quantum Computing Basics",
  "model": "skynet-v4-turbo",
  "systemPrompt": "You are a helpful assistant."
}
```
* **Response `201 Created`:**
```json
{
  "id": "thread_abc123",
  "title": "Quantum Computing Basics",
  "model": "skynet-v4-turbo",
  "createdAt": "2026-03-30T14:22:00Z",
  "updatedAt": "2026-03-30T14:22:00Z"
}
```

#### `GET /api/v1/chats`
Retrieves a paginated list of chat threads for the authenticated user.

* **Query Parameters:**
  * `limit` (integer, optional): Default `20`, Max `100`.
  * `startingAfter` (string, optional): Cursor for pagination (thread ID).
* **Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "thread_abc123",
      "title": "Quantum Computing Basics",
      "model": "skynet-v4-turbo",
      "updatedAt": "2026-03-30T14:22:00Z"
    }
  ],
  "hasMore": false
}
```

#### `POST /api/v1/chats/{threadId}/messages`
Sends a user message to a thread and initiates generation. **Note:** For standard streaming, clients should connect via SSE (see section 5), but this endpoint accepts synchronous generation or queues background tasks.

* **Path Parameters:**
  * `threadId` (string, required): The target thread ID.
* **Request Body:**
```json
{
  "content": "Explain qubits in simple terms.",
  "parentMessageId": "msg_prev_099",
  "temperature": 0.7,
  "stream": true
}
```
* **Response `200 OK` (If `stream: false`):**
```json
{
  "id": "msg_new_100",
  "role": "assistant",
  "content": "A qubit is the basic unit of quantum information...",
  "tokensUsed": {
    "prompt": 12,
    "completion": 45,
    "total": 57
  },
  "createdAt": "2026-03-30T14:22:05Z"
}
```

---

## 4. GraphQL API Contract (`/graphql`)

Used for complex graph queries (e.g., fetching a user profile, their shared workspaces, and nested chat history).

### 4.1 Schema Definition (`schema.graphql`)

```graphql
enum Role {
  USER
  ASSISTANT
  SYSTEM
}

enum ModelType {
  SKYNET_V4_TURBO
  SKYNET_V4_OMNI
}

type TokenUsage {
  prompt: Int!
  completion: Int!
  total: Int!
}

type Message {
  id: ID!
  role: Role!
  content: String!
  tokensUsed: TokenUsage
  createdAt: String!
}

type Thread {
  id: ID!
  title: String!
  model: ModelType!
  messages(limit: Int, offset: Int): [Message!]!
  createdAt: String!
  updatedAt: String!
}

type User {
  id: ID!
  email: String!
  name: String
  threads(limit: Int): [Thread!]!
  createdAt: String!
}

type Query {
  me: User!
  thread(id: ID!): Thread
}

type Mutation {
  updateThreadTitle(id: ID!, title: String!): Thread!
  deleteThread(id: ID!): Boolean!
}
```

### 4.2 Example GraphQL Query
```graphql
query GetUserProfileWithChats {
  me {
    id
    email
    name
    threads(limit: 5) {
      id
      title
      model
      updatedAt
    }
  }
}
```

---

## 5. Real-Time Server-Sent Events (SSE) Contract

### `GET /api/v1/chats/{threadId}/stream`
Establishes an SSE stream for real-time token generation response.

* **Headers Required:**
  * `Authorization: Bearer <token>`
  * `Accept: text/event-stream`
* **Query Parameters:**
  * `message`: URL-encoded prompt string.
  * `model`: Optional model override.

#### Event Stream Format:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"id":"msg_101","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant","content":"Hello"}}]}

data: {"id":"msg_101","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" World"}}]}

data: {"id":"msg_101","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

---

## 6. Validation Rules Matrix

| Field | Target Endpoint | Validation Rule | Error Detail if Violated |
| :--- | :--- | :--- | :--- |
| `email` | `POST /auth/login` | Must be valid RFC 5322 email format. | `Field 'email' is improperly formatted.` |
| `password`| `POST /auth/login` | Min length 8, at least 1 uppercase, 1 number, 1 special character. | `Password does not meet complexity requirements.` |
| `title` | `POST /chats` | Max length 100 characters. Sanitized for XSS. | `Title exceeds maximum length of 100 characters.` |
| `content` | `POST /chats/{id}/messages`| Min length 1 character, Max length 32,768 characters. | `Message content out of bounds (1 - 32768 chars).` |
| `temperature`| `POST /chats/{id}/messages`| Float between `0.0` and `2.0`. | `Temperature must be between 0.0 and 2.0.` |
```