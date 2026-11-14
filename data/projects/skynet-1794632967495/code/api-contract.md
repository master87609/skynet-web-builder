```markdown
# Skynet Core Systems: API Contract & Specifications
**Project:** Autonomous 3D Cinematic Clothing E-Commerce Engine ("Clothing Scrolling 3D Cinematic Website")  
**Component:** Backend Architecture & API Gateway  
**Status:** Approved  
**Path:** `code/api-contract.md`

---

## 1. Architectural Overview & Protocols

The Skynet 3D E-Commerce platform utilizes a hybrid protocol architecture designed for ultra-low latency 3D asset streaming, real-time physics state synchronization, and transactional robustness.

*   **REST/JSON:** Used for standard CRUD operations, authentication, user profiles, cart management, and order processing.
*   **GraphQL:** Used for complex relational data-fetching (e.g., dynamic catalog filtering, multi-layered clothing customization trees, inventory cross-referencing).
*   **WebSockets (WSS):** Used for live collaborative viewing sessions, real-time inventory locking during checkout, and synchronized 3D avatar telemetry.

---

## 2. Global REST API Specifications

### 2.1 Base URL & Headers
*   **Production Base URL:** `https://api.skynet-apparel.com/v1`
*   **Required Headers:**
    *   `Content-Type: application/json`
    *   `Accept: application/json`
    *   `Authorization: Bearer <JWT_TOKEN>` (for protected routes)
    *   `X-Client-Version: 3.4.0`

### 2.2 Standard Error Response Schema
All REST error responses follow RFC 7807 (Problem Details for HTTP APIs).

```json
{
  "type": "https://api.skynet-apparel.com/errors/validation-error",
  "title": "Invalid Request Payload",
  "status": 400,
  "detail": "The 'mesh_lod' parameter must be an integer between 0 and 3.",
  "instance": "/v1/assets/garments/skynet-jacket-01",
  "timestamp": "2026-03-30T14:22:01.005Z",
  "errors": [
    {
      "field": "mesh_lod",
      "reason": "Out of bounds value."
    }
  ]
}
```

---

## 3. REST Endpoints: 3D Asset Pipeline & Garments

### 3.1 Fetch Cinematic Garment Manifest
Retrieves the multi-LOD (Level of Detail) 3D assets, PBR texture maps, skeletal rigs, and cloth physics parameters required to initialize the WebGL/WebGPU rendering engine.

*   **Endpoint:** `GET /assets/garments/{sku}`
*   **Query Parameters:**
    *   `lod` (integer, optional): Level of detail requested (`0` = Cinematic High-Poly, `1` = Standard, `2` = Mobile/Optimized). Default: `0`.
    *   `format` (string, optional): Preferred 3D container format (`glb`, `usdz`, `basis`). Default: `glb`.

#### Response (200 OK)
```json
{
  "sku": "SKY-JACKET-808",
  "title": "Cyber-Neural Trench Coat",
  "price": 450.00,
  "currency": "USD",
  "rendering_metadata": {
    "polygon_count": 85400,
    "pbr_workflow": "metallic-roughness",
    "supported_shaders": ["anisotropic_velvet", "liquid_chrome"],
    "physics_profile": {
      "stiffness": 0.65,
      "damping": 0.12,
      "mass_per_sq_meter": 0.45
    }
  },
  "assets": {
    "model_url": "https://cdn.skynet-apparel.com/models/SKY-JACKET-808/lod0.glb",
    "fallback_model_url": "https://cdn.skynet-apparel.com/models/SKY-JACKET-808/lod2.glb",
    "textures": {
      "albedo": "https://cdn.skynet-apparel.com/textures/SKY-JACKET-808/albedo.basis",
      "normal": "https://cdn.skynet-apparel.com/textures/SKY-JACKET-808/normal.basis",
      "roughness_metalness": "https://cdn.skynet-apparel.com/textures/SKY-JACKET-808/arm.basis"
    }
  },
  "available_variants": [
    { "color_id": "c_chrome", "hex": "#E0E0E0", "in_stock": true },
    { "color_id": "c_obsidian", "hex": "#111111", "in_stock": true }
  ]
}
```

---

## 4. GraphQL API Specifications

*   **Endpoint:** `POST /graphql`
*   **Purpose:** Powers the interactive 3D scrolling catalog, filtering garments by physics parameters, cinematic lighting tags, and user sizes.

### 4.1 Schema Definition Language (SDL)

```graphql
enum GarmentCategory {
  OUTERWEAR
  MID_LAYER
  BASE_LAYER
  AUGMENTED_ACCESSORY
}

enum PhysicsStiffness {
  RIGID
  FLEXIBLE
  LIQUID_DRAPE
}

type PBRTextures {
  albedoUrl: String!
  normalUrl: String!
  metalnessRoughnessUrl: String!
}

type Garment3DAsset {
  lodLevel: Int!
  fileUrl: String!
  fileSizeKb: Int!
  polygonCount: Int!
}

type Garment {
  id: ID!
  sku: String!
  name: String!
  category: GarmentCategory!
  basePrice: Float!
  stiffness: PhysicsStiffness!
  assets(lod: Int = 0): [Garment3DAsset!]!
  textures: PBRTextures!
  tags: [String!]!
  createdAt: String!
}

input GarmentFilterInput {
  category: GarmentCategory
  stiffness: PhysicsStiffness
  maxPrice: Float
  tags: [String!]
}

type Query {
  garment(sku: String!): Garment
  garments(filter: GarmentFilterInput, limit: Int = 10, offset: Int = 0): [Garment!]!
  cinematicSequences(sceneId: ID!): [String!]!
}
```

### 4.2 Example GraphQL Query (Frontend Scroll Scene Fetch)
```graphql
query GetScrollingSceneGarments {
  garments(filter: { category: OUTERWEAR }, limit: 5) {
    sku
    name
    basePrice
    stiffness
    assets(lod: 0) {
      fileUrl
      polygonCount
    }
    textures {
      albedoUrl
    }
  }
}
```

---

## 5. REST Endpoints: Checkout & Cart Architecture

### 5.1 Initialize Checkout Session
Locks inventory for 15 minutes while the user finalizes payment within the 3D interactive checkout interface.

*   **Endpoint:** `POST /checkout/sessions`
*   **Validation Rules:**
    *   `items` array must not be empty.
    *   `quantity` must be an integer $\ge 1$.
    *   `variant_id` must reference a valid SKU variant.

#### Request Schema
```json
{
  "user_id": "usr_99a8bc76de",
  "items": [
    {
      "sku": "SKY-JACKET-808",
      "variant_id": "c_obsidian",
      "quantity": 1,
      "customization_parameters": {
        "embroidered_tag": "TERMINATOR-01"
      }
    }
  ],
  "currency": "USD",
  "success_url": "https://skynet-apparel.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://skynet-apparel.com/checkout/cancel"
}
```

#### Response (201 Created)
```json
{
  "checkout_session_id": "cs_live_9983471092834",
  "status": "pending_payment",
  "expires_at": "2026-03-30T14:37:01Z",
  "payment_gateway_url": "https://pay.skynet-apparel.com/pay/cs_live_9983471092834"
}
```

---

## 6. System Error Codes Reference

| Error Code | HTTP Status | Description / Remediation |
| :--- | :--- | :--- |
| `INVALID_ASSET_LOD` | 400 Bad Request | Requested Level of Detail does not exist for this model. Use LOD 0-2. |
| `INVENTORY_LOCKED` | 409 Conflict | The requested garment size/variant is currently locked in another user's cart session. |
| `STREAM_RATE_EXCEEDED`| 429 Too Many Requests | Client is pulling 3D GLB chunks too fast. Back off or utilize CDN caching headers. |
| `SHADER_COMPILATION_FAIL`| 500 Internal Error | Custom material shader compilation failed on the edge node. |
| `SKINNING_RIG_MISMATCH`| 422 Unprocessable Entity| The uploaded user body avatar does not match the skeleton rigging specifications for this garment. |

---
*End of Document. Initialized by Skynet System Architecture Daemon v9.4.*
```