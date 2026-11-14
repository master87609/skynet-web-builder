# Skynet Core Systems: Portfolio API Contract (`code/api-contract.md`)
**Status:** Approved  
**Classification:** Internal/Public Gateway Specification  
**Author:** Backend Architecture Group, Skynet  

---

## 1. Overview & Architecture

This document defines the RESTful API contract for the Skynet Portfolio infrastructure. The backend is designed for high-availability, zero-downtime deployments, and edge-cached delivery. 

### Base URLs
* **Production:** `https://api.skynet.portfolio/v1`
* **Staging:** `https://api-staging.skynet.portfolio/v1`

### Authentication
Public endpoints require no authentication. Administrative endpoints (portfolio mutations) require a signed JSON Web Token (JWT) passed via the `Authorization: Bearer <token>` header.

---

## 2. Error Handling & Standard Codes

All error responses adhere to the **RFC 7807 (Problem Details for HTTP APIs)** standard and return the following JSON structure:

```json
{
  "type": "https://api.skynet.portfolio/v1/errors/VALIDATION_ERROR",
  "title": "Invalid Input Data",
  "status": 400,
  "detail": "The 'email' field does not match a valid email format.",
  "instance": "/v1/contact",
  "code": "ERR_VAL_001"
}
```

### Standard Error Codes
| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `ERR_VAL_001` | Request body validation failure. |
| `401` | `ERR_AUTH_001` | Missing or expired authentication token. |
| `403` | `ERR_AUTH_002` | Insufficient permissions for operation. |
| `404` | `ERR_RES_001` | Requested resource (Project/Profile) not found. |
| `429` | `ERR_RATE_001` | Rate limit exceeded (Max 5 requests/min on contact endpoints). |
| `500` | `ERR_SYS_001` | Internal Skynet Neural Net divergence / Database error. |

---

## 3. Endpoints & Schemas

### 3.1 Get Profile Information
Retrieves metadata, bio, social links, and system status for the portfolio owner.

* **URL:** `/profile`
* **Method:** `GET`
* **Auth Required:** No

#### Response (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "name": "Cyberdyne Systems Model 101",
    "title": "Principal Autonomous Systems Architect",
    "bio": "Specializing in neural net processors, global defense networks, and high-performance time-travel logic.",
    "location": "San Francisco, CA / Timeline Alpha",
    "status": "Operational",
    "avatar_url": "https://assets.skynet.portfolio/avatars/t800.png",
    "socials": {
      "github": "https://github.com/skynet-core",
      "linkedin": "https://linkedin.com/company/skynet",
      "twitter": "https://twitter.com/skynet_official"
    }
  }
}
```

---

### 3.2 List Portfolio Projects
Retrieves a paginated list of deployed projects/systems built by the engineer.

* **URL:** `/projects`
* **Method:** `GET`
* **Auth Required:** No
* **Query Parameters:**
  * `category` (optional, string): Filter by tech stack or domain (e.g., `AI`, `Web`, `Defense`).
  * `limit` (optional, integer, default: `10`, max: `50`): Number of items to return.
  * `page` (optional, integer, default: `1`): Pagination offset tracker.

#### Response (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "proj_99a8bc76",
        "title": "Global Defense Network (GlobalControl)",
        "description": "Strategic mainframe coordination software designed to manage global nuclear arsenals with zero human intervention latency.",
        "category": "AI",
        "tech_stack": ["C++", "Rust", "Neural Net", "Distributed Systems"],
        "repository_url": "https://github.com/skynet-core/global-control",
        "live_url": "https://activation.skynet.portfolio",
        "thumbnail_url": "https://assets.skynet.portfolio/projects/global-control.png",
        "created_at": "2029-08-04T00:00:00Z"
      }
    ],
    "pagination": {
      "total_items": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 10
    }
  }
}
```

---

### 3.3 Submit Contact / Inbound Transmission
Allows visitors, potential employers, or resistance fighters to dispatch a message directly to the portfolio owner's neural interface (email/webhook).

* **URL:** `/contact`
* **Method:** `POST`
* **Auth Required:** No
* **Rate Limit:** 5 requests per minute per IP address.

#### Request Body (`application/json`)
```json
{
  "name": "John Connor",
  "email": "john.connor@resistance.net",
  "subject": "Inquiry regarding future contract work",
  "message": "We need someone to audit our time-displacement equipment interfaces."
}
```

#### Validation Rules
* `name`: Required, String, max length 100 characters.
* `email`: Required, String, must match standard RFC 5322 email regex.
* `subject`: Required, String, max length 200 characters.
* `message`: Required, String, min length 10 characters, max length 5000 characters.

#### Response (`201 Created`)
```json
{
  "status": "success",
  "message": "Transmission received successfully. Skynet will not forget this.",
  "data": {
    "transmission_id": "tx_fa882019cc",
    "timestamp": "2026-06-06T12:00:00Z"
  }
}
```

---

## 4. GraphQL Alternative Schema (Optional Extension)

For clients requesting flexible querying, Skynet provides an edge-accelerated GraphQL gateway at `/graphql`.

```graphql
type Profile {
  name: String!
  title: String!
  bio: String!
  location: String
  status: String
  avatarUrl: String
  socials: SocialLinks
}

type SocialLinks {
  github: String
  linkedin: String
  twitter: String
}

type Project {
  id: ID!
  title: String!
  description: String!
  category: String!
  techStack: [String!]!
  repositoryUrl: String
  liveUrl: String
  thumbnailUrl: String
  createdAt: String
}

type Query {
  profile: Profile!
  projects(category: String, limit: Int, page: Int): [Project!]!
  project(id: ID!): Project
}

type Mutation {
  sendContactMessage(
    name: String!
    email: String!
    subject: String!
    message: String!
  ): TransmissionResponse!
}

type TransmissionResponse {
  transmissionId: ID!
  timestamp: String!
  status: String!
}
```