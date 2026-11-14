```markdown
# Skynet Backend Architecture: API Contract
**Project:** Artisanal Sourdough Bakery with Preorders  
**Status:** Approved  
**Path:** `code/api-contract.md`

---

## 1. Architectural Overview & Standards

*   **Protocol:** REST over HTTPS (JSON payloads) + GraphQL for complex client-side querying (Catalog & Preorder history).
*   **Authentication:** Bearer Token (JWT) issued via `/api/v1/auth/*`. Role-based access control (RBAC): `CUSTOMER`, `BAKER`, `ADMIN`.
*   **Idempotency:** Required for all state-changing preorder and payment endpoints via `Idempotency-Key` header (UUID v4).
*   **Time & Currency:** All timestamps must be in ISO-8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`, UTC). All monetary values must be represented as integers in the smallest currency unit (e.g., USD in cents: `$12.50` -> `1250`).
*   **Pagination:** Cursor-based pagination for high-velocity feeds (Catalog, Order History).

---

## 2. Common Error Codes & Handling

All errors adhere to the RFC 7807 (Problem Details for HTTP APIs) specification.

```json
{
  "type": "https://api.skynet.bakery/errors/VAL-001",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request body contains invalid fields.",
  "instance": "/api/v1/preorders",
  "invalid_params": [
    {
      "name": "pickup_date",
      "reason": "Must be at least 48 hours in advance for sourdough fermentation cycles."
    }
  ]
}
```

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `AUTH-001` | 401 Unauthorized | Missing or expired JWT. |
| `AUTH-002` | 403 Forbidden | Insufficient permissions for resource. |
| `VAL-001` | 400 Bad Request | Payload validation failure. |
| `INV-001` | 409 Conflict | Item sold out / Inventory capacity reached for selected slot. |
| `PAY-001` | 402 Payment Required | Payment processing failed or card declined. |
| `SYS-001` | 500 Internal Error | Skynet core subsystem exception. |

---

## 3. REST API Endpoints

### 3.1 Catalog & Inventory

#### `GET /api/v1/catalog`
Retrieve available artisanal breads, pastries, and merchandise for a given fulfillment date range.

*   **Query Parameters:**
    *   `date` (string, optional): ISO-8601 date (`YYYY-MM-DD`). Defaults to next available bake day.
    *   `category` (string, optional): `sourdough`, `pastry`, `pantry`.
*   **Response (200 OK):**
```json
{
  "data": [
    {
      "id": "prod_sd_country_boule_01",
      "name": "Signature Country Boule",
      "category": "sourdough",
      "description": "36-hour cold fermented, 20% whole grain, open crumb.",
      "price_cents": 950,
      "currency": "USD",
      "image_url": "https://cdn.skynet.bakery/images/country-boule.jpg",
      "is_available": true,
      "remaining_capacity": 14,
      "allergens": ["wheat"],
      "ingredients": ["Organic stone-ground wheat flour", "water", "sea salt", "wild yeast culture"]
    }
  ]
}
```

---

### 3.2 Preorders & Checkout

#### `POST /api/v1/preorders`
Create a new preorder. Requires an idempotency key to prevent double-charging.

*   **Headers:**
    *   `Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`
    *   `Authorization: Bearer <JWT>`
*   **Request JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "fulfillment_method": { "type": "string", "enum": ["pickup", "local_delivery"] },
    "pickup_slot_id": { "type": "string" },
    "delivery_address_id": { "type": "string" },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "product_id": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1, "maximum": 10 }
        },
        "required": ["product_id", "quantity"]
      }
    },
    "tip_cents": { "type": "integer", "minimum": 0 }
  },
  "required": ["fulfillment_method", "items"]
}
```
*   **Response (201 Created):**
```json
{
  "data": {
    "preorder_id": "ord_9981a7bc-2231",
    "status": "pending_payment",
    "subtotal_cents": 1900,
    "tax_cents": 152,
    "tip_cents": 200,
    "total_cents": 2252,
    "currency": "USD",
    "client_secret": "seti_1Mv2..._secret_...", 
    "created_at": "2023-10-24T08:30:00Z"
  }
}
```

#### `GET /api/v1/preorders/{id}`
Fetch state and details of a specific preorder.

*   **Response (200 OK):**
```json
{
  "data": {
    "preorder_id": "ord_9981a7bc-2231",
    "status": "confirmed",
    "fulfillment_method": "pickup",
    "pickup_window": {
      "start": "2023-10-28T09:00:00Z",
      "end": "2023-10-28T11:00:00Z"
    },
    "items": [
      {
        "product_id": "prod_sd_country_boule_01",
        "name": "Signature Country Boule",
        "quantity": 2,
        "unit_price_cents": 950
      }
    ],
    "total_cents": 2052
  }
}
```

---

### 3.3 Fulfillment Slots

#### `GET /api/v1/fulfillment/slots`
Fetch available pickup or delivery windows based on live baking capacity limits.

*   **Query Parameters:**
    *   `date` (string, required): `YYYY-MM-DD`
    *   `method` (string, required): `pickup` or `local_delivery`
*   **Response (200 OK):**
```json
{
  "data": [
    {
      "slot_id": "slot_20231028_0900",
      "start_time": "2023-10-28T09:00:00Z",
      "end_time": "2023-10-28T11:00:00Z",
      "available": true,
      "capacity_remaining": 8
    }
  ]
}
```

---

## 4. GraphQL API Contract (Alternative High-Flex Interface)

**Endpoint:** `POST /api/v1/graphql`

### Schema Definition
```graphql
enum FulfillmentMethod {
  PICKUP
  LOCAL_DELIVERY
}

enum OrderStatus {
  PENDING_PAYMENT
  CONFIRMED
  BAKING
  READY
  COMPLETED
  CANCELLED
}

type Allergen {
  name: String!
}

type Product {
  id: ID!
  name: String!
  category: String!
  description: String
  priceCents: Int!
  imageUrl: String
  isAvailable: Boolean!
  remainingCapacity: Int!
  allergens: [String!]!
}

type FulfillmentSlot {
  id: ID!
  startTime: String!
  endTime: String!
  available: Boolean!
  capacityRemaining: Int!
}

type PreorderItem {
  product: Product!
  quantity: Int!
  unitPriceCents: Int!
}

type Preorder {
  id: ID!
  status: OrderStatus!
  fulfillmentMethod: FulfillmentMethod!
  pickupSlot: FulfillmentSlot
  items: [PreorderItem!]!
  subtotalCents: Int!
  totalCents: Int!
  createdAt: String!
}

type Query {
  catalog(date: String, category: String): [Product!]!
  fulfillmentSlots(date: String!, method: FulfillmentMethod!): [FulfillmentSlot!]!
  myPreorders(limit: Int, cursor: String): [Preorder!]!
}

input PreorderItemInput {
  productId: ID!
  quantity: Int!
}

input CreatePreorderInput {
  fulfillmentMethod: FulfillmentMethod!
  pickupSlotId: ID
  deliveryAddressId: ID
  items: [PreorderItemInput!]!
  tipCents: Int
}

type Mutation {
  createPreorder(input: CreatePreorderInput!): Preorder!
  cancelPreorder(id: ID!): Preorder!
}
```

---

## 5. Validation Rules Matrix

| Field | Rule Constraint | Error Generated |
| :--- | :--- | :--- |
| `items.quantity` | Integer between `1` and `10` | `VAL-001` |
| `pickup_slot_id` | Must exist and have `capacity_remaining >= requested_quantity` | `INV-001` |
| `fulfillment_date` | Minimum 48 hours in the future (due to levain building schedule) | `VAL-001` |
| `Idempotency-Key` | Must be a valid UUID v4; enforced 24-hour cache window | `VAL-001` / `409 Conflict` |
```