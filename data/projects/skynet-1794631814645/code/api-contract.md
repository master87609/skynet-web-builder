# Skynet Backend Architecture: Cinematic Shoe Web Application
**Document Path:** `code/api-contract.md`  
**Status:** Approved  
**Author:** Backend Architect, Skynet Core Systems  

---

## 1. Overview & Architecture Principles

This document defines the RESTful and GraphQL API contracts for the Skynet cinematic scrolling-motion shoe experience. The backend is engineered for ultra-low latency, high-frequency scroll-state synchronization, and dynamic asset delivery (WebGL/3D models, high-res textures, spatial audio cues).

### Key Architectural Decisions:
*   **Protocol Split:** 
    *   **REST API:** Used for static data, e-commerce transactions, user authentication, and inventory management.
    *   **GraphQL API:** Used for complex, deeply nested relational fetches (e.g., shoe customization states, variant matrices, and localized pricing).
*   **Edge Caching:** All static assets (GLTF/GLB models, normal maps, HDRIs) are served via global CDN with immutable cache-control headers.
*   **State Synchronization:** Stateless backend. Client maintains scroll and frame interpolation state locally, committing user interactions (likes, cart updates, custom configurations) via transactional endpoints.

---

## 2. REST API Specifications

### Base URL
*   `https://api.skynet.shoes/v1`

### Authentication
*   Bearer Token (JWT) passed in the `Authorization` header for protected routes.
*   Guest sessions are initialized via `/session/init` returning an ephemeral tracking token.

---

### 2.1 Endpoints

#### `GET /shoes/cinematic-sequence`
Retrieves the master timeline configuration for the scrolling cinematic experience, mapping scroll percentages to camera angles, 3D model keyframes, lighting states, and audio triggers.

*   **Request Headers:**
    *   `Accept: application/json`
    *   `X-Device-Tier: [high | medium | low]` (Determines texture resolution payloads)
*   **Response 200 OK:**
    ```json
    {
      "sequence_id": "seq_nexus_01",
      "total_scroll_height_px": 12000,
      "fps": 60,
      "keyframes": [
        {
          "scroll_offset_start": 0,
          "scroll_offset_end": 1500,
          "camera": {
            "position": [0, 5, 10],
            "target": [0, 0, 0],
            "fov": 45
          },
          "model_transform": {
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1]
          },
          "lighting": {
            "ambient_intensity": 0.8,
            "spotlight_color": "#FF0055"
          },
          "active_annotations": []
        },
        {
          "scroll_offset_start": 1501,
          "scroll_offset_end": 4000,
          "camera": {
            "position": [-5, 2, 4],
            "target": [0, -1, 0],
            "fov": 35
          },
          "model_transform": {
            "rotation": [0, 3.14, 0],
            "scale": [1.2, 1.2, 1.2]
          },
          "lighting": {
            "ambient_intensity": 0.3,
            "spotlight_color": "#00FFFF"
          },
          "active_annotations": ["ann_carbon_plate", "ann_air_pod"]
        }
      ]
    }
    ```

---

#### `GET /shoes/{shoe_id}/assets`
Fetches the optimized 3D and media assets required for rendering the cinematic experience based on client GPU capability.

*   **Path Parameters:**
    *   `shoe_id` (string): Unique identifier for the shoe model (e.g., `skynet-x-apex`).
*   **Query Parameters:**
    *   `tier` (string): `ultra` (4K textures, high poly), `balanced` (2K textures, medium poly), `lite` (1K textures, low poly).
*   **Response 200 OK:**
    ```json
    {
      "shoe_id": "skynet-x-apex",
      "mesh_url": "https://cdn.skynet.shoes/models/skynet-x-apex/mesh_draco.glb",
      "textures": {
        "albedo": "https://cdn.skynet.shoes/models/skynet-x-apex/albedo_2k.webp",
        "normal": "https://cdn.skynet.shoes/models/skynet-x-apex/normal_2k.webp",
        "roughness": "https://cdn.skynet.shoes/models/skynet-x-apex/roughness_2k.webp",
        "metalness": "https://cdn.skynet.shoes/models/skynet-x-apex/metalness_2k.webp"
      },
      "hdr_environment": "https://cdn.skynet.shoes/env/cyberpunk_studio_1k.hdr",
      "audio_track": "https://cdn.skynet.shoes/audio/ambient_hum_01.mp3"
    }
    ```

---

#### `POST /cart/items`
Adds a customized or standard shoe configuration to the user's shopping cart.

*   **Request Body (JSON):**
    ```json
    {
      "shoe_id": "skynet-x-apex",
      "size": "10.5",
      "colorway_id": "cw_obsidian_red",
      "customizations": {
        "engraving": "SKYNET-01",
        "sole_glow": true
      },
      "quantity": 1
    }
    ```
*   **Response 201 Created:**
    ```json
    {
      "cart_item_id": "ci_998127381",
      "shoe_id": "skynet-x-apex",
      "price": 299.99,
      "currency": "USD",
      "status": "added",
      "expires_at": "2023-12-31T23:59:59Z"
    }
    ```

---

## 3. GraphQL API Specifications

### Endpoint
*   `https://api.skynet.shoes/graphql`

### Schema Definition Language (SDL)

```graphql
type Query {
  shoe(id: ID!): Shoe
  catalog(filter: ShoeFilterInput, pagination: PaginationInput): ShoeConnection!
  userProfile(token: String!): User
}

type Mutation {
  saveCustomization(input: CustomizationInput!): CustomizationResult!
  submitOrder(input: OrderInput!): OrderResult!
}

type Shoe {
  id: ID!
  name: String!
  tagline: String!
  description: String!
  basePrice: Float!
  currency: String!
  variants: [ShoeVariant!]!
  annotations: [Annotation!]!
  technicalSpecs: [TechSpec!]!
}

type ShoeVariant {
  id: ID!
  colorName: String!
  hexCode: String!
  inStock: Boolean!
  images: [String!]!
}

type Annotation {
  id: ID!
  title: String!
  description: String!
  coordinates3D: [Float!]! # [x, y, z]
}

type TechSpec {
  category: String!
  metric: String!
  value: String!
}

input ShoeFilterInput {
  inStockOnly: Boolean
  maxPrice: Float
  category: String
}

input PaginationInput {
  limit: Int = 10
  offset: Int = 0
}

input CustomizationInput {
  shoeId: ID!
  selectedVariantId: ID!
  laserEngraving: String
  customColors: [String!]
}

type CustomizationResult {
  success: Boolean!
  configurationToken: String!
  previewImageUrl: String!
}

type User {
  id: ID!
  email: String!
  savedConfigurations: [CustomizationResult!]!
}

input OrderInput {
  cartItemId: ID!
  shippingAddressId: ID!
  paymentMethodToken: String!
}

type OrderResult {
  orderId: ID!
  status: String!
  estimatedDelivery: String!
}
```

---

## 4. Error Codes & Validation Rules

### Standard Error Response Format
All errors return a standard JSON payload adhering to RFC 7807 (Problem Details for HTTP APIs).

```json
{
  "type": "https://api.skynet.shoes/errors/validation-error",
  "title": "Invalid Request Content",
  "status": 400,
  "detail": "The provided shoe size is not available for this variant.",
  "instance": "/v1/cart/items",
  "invalid_params": [
    {
      "name": "size",
      "reason": "Size '14.0' is out of stock for SKU skynet-x-apex-red."
    }
  ]
}
```

### Error Code Registry

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `INVALID_PAYLOAD` | Request body fails JSON schema validation. |
| `400` | `OUT_OF_STOCK` | Requested size or colorway has zero inventory. |
| `401` | `UNAUTHORIZED` | Missing or expired JWT / Guest Token. |
| `403` | `FORBIDDEN` | Insufficient permissions to access resource. |
| `404` | `RESOURCE_NOT_FOUND` | Shoe ID, Asset, or Cart item does not exist. |
| `429` | `RATE_LIMIT_EXCEEDED` | Too many requests sent from IP/Token (Cinematic asset DDoS protection). |
| `500` | `INTERNAL_SERVER_ERROR` | Skynet core logic failure. |

---

### Validation Rules

1.  **Shoe Sizes (`size`):**
    *   Must be a string representing US standard sizing (e.g., `"7.0"`, `"7.5"` through `"13.0"` in 0.5 increments).
2.  **Laser Engraving (`customizations.engraving`):**
    *   Max length: 12 characters.
    *   Allowed characters: Alphanumeric uppercase (`A-Z`, `0-9`), hyphens (`-`), spaces. Regex: `^[A-Z0-9\-\\s]{0,12}$`.
3.  **Scroll Timeline Offsets (`scroll_offset_start` / `scroll_offset_end`):**
    *   Must be non-negative integers.
    *   `scroll_offset_end` must strictly be greater than `scroll_offset_start`.
4.  **Device Tier Header (`X-Device-Tier`):**
    *   Must be strictly one of: `high`, `medium`, `lite`. Defaults to `balanced` if omitted.