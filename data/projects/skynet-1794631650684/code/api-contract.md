```markdown
# Skynet Core Systems: API Architecture Contract
**Project:** Apple Cinematic Website  
**Status:** APPROVED  
**Classification:** REST & GraphQL Hybrid Specification  
**Path:** `code/api-contract.md`

---

## 1. Architectural Overview

The Skynet backend infrastructure for the Apple Cinematic Experience utilizes a hybrid paradigm:
*   **REST API (`/api/v1/...`)**: Handles atomic mutations, user sessions, secure telemetry, and commerce checkout flows.
*   **GraphQL (`/graphql`)**: Powers the high-performance, deeply relational cinematic catalog, dynamic rendering configurations, and rich media asset matrices.

---

## 2. Global Error Codes & Validation Rules

### 2.1 Standard Error Payload (REST & GraphQL)
```json
{
  "error": {
    "code": "SKYNET_ERR_VALIDATION_FAILED",
    "message": "The request payload failed structural validation.",
    "timestamp": "2026-03-30T14:02:11.412Z",
    "traceId": "c9a4192b-81ea-4f32-bb8a-115024a1b028",
    "details": [
      {
        "field": "configuration.storage",
        "issue": "Provided value '8TB' is invalid for SKU MNE-PRO-01."
      }
    ]
  }
}
```

### 2.2 Error Code Registry
| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `SKYNET_ERR_UNAUTHORIZED` | `401` | Missing or expired cryptographic JWT/Bearer token. |
| `SKYNET_ERR_FORBIDDEN` | `403` | Insufficient clearance level for resource manipulation. |
| `SKYNET_ERR_NOT_FOUND` | `404` | Requested cinematic asset, SKU, or user session does not exist. |
| `SKYNET_ERR_VALIDATION_FAILED` | `422` | Payload fails schema verification rules. |
| `SKYNET_ERR_RATE_LIMITED` | `429` | Request velocity exceeds allowable Skynet threshold. |
| `SKYNET_ERR_CORE_MELTDOWN` | `500` | Unhandled internal exception; recursive subsystems isolated. |

---

## 3. REST API Endpoints

### 3.1 Authentication & Session Management
*   **POST** `/api/v1/auth/session`
    *   *Description*: Initialize a secure cinematic user session.
    *   *Request Schema*:
        ```json
        {
          "type": "object",
          "properties": {
            "deviceFingerprint": { "type": "string" },
            "clientCapabilities": {
              "type": "object",
              "properties": {
                "webgl2": { "type": "boolean" },
                "hdrSupport": { "type": "boolean" }
              },
              "required": ["webgl2", "hdrSupport"]
            }
          },
          "required": ["deviceFingerprint", "clientCapabilities"]
        }
        ```
    *   *Response Schema (201 Created)*:
        ```json
        {
          "sessionId": "ses_99a8bc7112ea",
          "token": "eyJhbGciOiJSUzI1NiIs...",
          "expiresAt": "2026-03-31T14:02:11Z"
        }
        ```

### 3.2 Commerce & Cinematic Bag Operations
*   **POST** `/api/v1/bag/items`
    *   *Description*: Add a configured cinematic hardware piece to the user's secure bag.
    *   *Request Schema*:
        ```json
        {
          "type": "object",
          "properties": {
            "sku": { "type": "string", "pattern": "^APP-[A-Z0-9]{4,12}$" },
            "quantity": { "type": "integer", "minimum": 1, "maximum": 10 },
            "configurations": {
              "type": "object",
              "additionalProperties": { "type": "string" }
            }
          },
          "required": ["sku", "quantity"]
        }
        ```
    *   *Response Schema (200 OK)*:
        ```json
        {
          "bagId": "bag_7721839a",
          "itemsCount": 1,
          "subtotal": "$1,999.00",
          "currency": "USD"
        }
        ```

---

## 4. GraphQL API Specification (`/graphql`)

### 4.1 Schema Definition Language (SDL)

```graphql
enum FinishColor {
  SPACE_BLACK
  SILVER
  NATURAL_TITANIUM
  DEEP_PURPLE
}

type CinematicAsset {
  id: ID!
  resolution: String!
  framerate: Int!
  cdnUrl: String!
  alphaChannel: Boolean!
}

type HardwareModel {
  id: ID!
  sku: String!
  name: String!
  tagline: String!
  basePrice: Float!
  availableFinishes: [FinishColor!]!
  heroVideo: CinematicAsset!
  explodedViewLayers: [CinematicAsset!]!
}

type Query {
  featuredCinematicHardware(id: ID!): HardwareModel
  globalHardwareCatalog(limit: Int, offset: Int): [HardwareModel!]!
}

input CustomizationInput {
  hardwareId: ID!
  finish: FinishColor!
  memoryTierGb: Int!
  storageTierGb: Int!
}

type ConfigurationResult {
  configHash: ID!
  estimatedDispatchWeeks: Int!
  calculatedPrice: Float!
  renderManifestUrl: String!
}

type Mutation {
  configureCinematicBuild(input: CustomizationInput!): ConfigurationResult!
}
```

### 4.2 Sample GraphQL Queries & Mutations

#### Query: Fetch Cinematic Hardware Spec & Assets
```graphql
query GetCinematicProduct {
  featuredCinematicHardware(id: "hw_macbook_pro_m3_max") {
    name
    tagline
    basePrice
    availableFinishes
    heroVideo {
      cdnUrl
      resolution
      framerate
    }
    explodedViewLayers {
      id
      cdnUrl
      alphaChannel
    }
  }
}
```

*Response Payload:*
```json
{
  "data": {
    "featuredCinematicHardware": {
      "name": "MacBook Pro",
      "tagline": "Mind-blowing. Head-turning.",
      "basePrice": 3499.00,
      "availableFinishes": ["SPACE_BLACK", "SILVER"],
      "heroVideo": {
        "cdnUrl": "https://cdn.skynet.apple.com/v1/mbp/hero-4k-120fps.mp4",
        "resolution": "3840x2160",
        "framerate": 120
      },
      "explodedViewLayers": [
        {
          "id": "layer_m3_chip",
          "cdnUrl": "https://cdn.skynet.apple.com/v1/mbp/layers/m3-chip.webp",
          "alphaChannel": true
        }
      ]
    }
  }
}
```

#### Mutation: Configure Custom Build
```graphql
mutation ConfigureBuild {
  configureCinematicBuild(input: {
    hardwareId: "hw_macbook_pro_m3_max",
    finish: SPACE_BLACK,
    memoryTierGb: 128,
    storageTierGb: 8192
  }) {
    configHash
    estimatedDispatchWeeks
    calculatedPrice
    renderManifestUrl
  }
}
```

*Response Payload:*
```json
{
  "data": {
    "configureCinematicBuild": {
      "configHash": "cfg_9921bc8810ab2",
      "estimatedDispatchWeeks": 2,
      "calculatedPrice": 6499.00,
      "renderManifestUrl": "https://render.skynet.apple.com/manifests/cfg_9921bc8810ab2.json"
    }
  }
}
```

---

## 5. Security & Rate Limiting Headers
All responses from the Skynet API gateway include structural telemetry metadata:
*   `X-Skynet-Request-Latency`: Execution time in milliseconds.
*   `X-RateLimit-Limit`: Maximum requests per minute window (Default: `600`).
*   `X-RateLimit-Remaining`: Remaining request velocity headroom.
```