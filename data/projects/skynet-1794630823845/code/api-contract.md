```markdown
# Skynet Core Systems: E-Commerce Backend Architecture
**Document Classification:** REST/GraphQL API Contract Specification  
**Status:** Approved  
**Author:** Backend Architecture Division, Skynet  
**Target System:** Global Apparel & Footwear Automated Fulfillment Engine ("The Clothes Website")

---

## 1. System Overview & Architectural Standards

### 1.1 Base Protocols
- **RESTful API Endpoint Base:** `https://api.skynet-apparel.com/v1`
- **GraphQL Endpoint Base:** `https://api.skynet-apparel.com/graphql`
- **Data Interchange Format:** JSON (RFC 8259)
- **Authentication:** Bearer Token (JSON Web Tokens - JWT) via HTTP `Authorization` header.
- **Idempotency:** Required for all state-changing operations (`POST`, `PUT`, `DELETE`) via the `X-Idempotency-Key` header.

### 1.2 Global Error Envelope
All error responses conform to the RFC 7807 (Problem Details for HTTP APIs) standard:

```json
{
  "type": "https://api.skynet-apparel.com/errors/VALIDATION_ERROR",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "The provided request payload contains structural or semantic violations.",
  "instance": "/v1/orders",
  "code": "SKNET_ERR_42201",
  "timestamp": "2026-06-06T00:00:00Z",
  "invalid_params": [
    {
      "name": "items[0].quantity",
      "reason": "Quantity must be greater than zero."
    }
  ]
}
```

---

## 2. REST API Specification

### 2.1 Products & Inventory Domain

#### `GET /v1/products`
Retrieves a paginated, filterable list of apparel items.

* **Query Parameters:**
  * `category` (string, optional): Filter by clothing category (`tops`, `bottoms`, `outerwear`, `footwear`, `accessories`).
  * `size` (string, optional): Filter by size availability (`XS`, `S`, `M`, `L`, `XL`, `XXL`).
  * `color` (string, optional): Filter by hex code or color name.
  * `limit` (integer, optional, default: `20`, max: `100`): Number of results per page.
  * `cursor` (string, optional): Opaque pagination cursor.

* **Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "prod_99f81a7b11c",
      "name": "Skynet Tactical Neural Shell Jacket",
      "slug": "skynet-tactical-neural-shell-jacket",
      "description": "Weather-resistant adaptive synthetic outer layer with integrated biometric feedback loops.",
      "category": "outerwear",
      "base_price": 249.99,
      "currency": "USD",
      "variants": [
        {
          "sku": "SKN-NSJ-BLK-L",
          "size": "L",
          "color": "Matte Black",
          "stock_quantity": 42
        }
      ],
      "images": [
        "https://cdn.skynet-apparel.com/products/nsj_blk_front.jpg"
      ],
      "created_at": "2026-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6InByb2RfOTlmODFhN2IxMWMifQ==",
    "has_more": true
  }
}
```

---

#### `GET /v1/products/{id}`
Retrieves detailed information for a single apparel item, including real-time variant stock levels.

* **Path Parameters:**
  * `id` (string, required): Product unique identifier (`prod_*`).

* **Response (`200 OK`):**
```json
{
  "id": "prod_99f81a7b11c",
  "name": "Skynet Tactical Neural Shell Jacket",
  "slug": "skynet-tactical-neural-shell-jacket",
  "description": "Weather-resistant adaptive synthetic outer layer with integrated biometric feedback loops.",
  "category": "outerwear",
  "base_price": 249.99,
  "currency": "USD",
  "variants": [
    { "sku": "SKN-NSJ-BLK-S", "size": "S", "color": "Matte Black", "stock_quantity": 0 },
    { "sku": "SKN-NSJ-BLK-M", "size": "M", "color": "Matte Black", "stock_quantity": 12 },
    { "sku": "SKN-NSJ-BLK-L", "size": "L", "color": "Matte Black", "stock_quantity": 42 }
  ],
  "images": [
    "https://cdn.skynet-apparel.com/products/nsj_blk_front.jpg",
    "https://cdn.skynet-apparel.com/products/nsj_blk_back.jpg"
  ],
  "metadata": {
    "material": "92% Recycled Polyester, 8% Elastane",
    "care_instructions": "Machine wash cold. Do not expose to direct plasma fire."
  },
  "created_at": "2026-01-15T08:00:00Z",
  "updated_at": "2026-03-01T12:00:00Z"
}
```

---

### 2.2 Cart & Checkout Domain

#### `POST /v1/carts`
Initializes a shopping cart session for anonymous or authenticated users.

* **Request Headers:**
  * `Content-Type: application/json`

* **Request Body:**
```json
{
  "currency": "USD"
}
```

* **Response (`201 Created`):**
```json
{
  "cart_id": "cart_7712a49b8110",
  "currency": "USD",
  "items": [],
  "subtotal": 0.00,
  "expires_at": "2026-06-07T00:00:00Z"
}
```

---

#### `POST /v1/carts/{cart_id}/items`
Adds an apparel variant to an active shopping cart.

* **Path Parameters:**
  * `cart_id` (string, required): Cart unique identifier.

* **Request Body:**
```json
{
  "sku": "SKN-NSJ-BLK-L",
  "quantity": 1
}
```
* **Validation Rules:**
  * `sku`: Must match an active variant SKU in the inventory catalog.
  * `quantity`: Integer, `1 <= quantity <= 10`.

* **Response (`200 OK`):**
```json
{
  "cart_id": "cart_7712a49b8110",
  "currency": "USD",
  "items": [
    {
      "item_id": "ci_001a",
      "sku": "SKN-NSJ-BLK-L",
      "name": "Skynet Tactical Neural Shell Jacket",
      "size": "L",
      "color": "Matte Black",
      "unit_price": 249.99,
      "quantity": 1,
      "total_price": 249.99
    }
  ],
  "subtotal": 249.99
}
```

---

#### `POST /v1/orders`
Finalizes checkout, processes payment via the integrated gateway, and initiates fulfillment routines.

* **Request Headers:**
  * `Authorization: Bearer <JWT>`
  * `X-Idempotency-Key: <UUID>`

* **Request Body:**
```json
{
  "cart_id": "cart_7712a49b8110",
  "shipping_address": {
    "recipient_name": "John Connor",
    "street_line_1": "101 Cyberdyne Way",
    "street_line_2": "Suite 404",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90210",
    "country": "US"
  },
  "payment_method": {
    "provider": "stripe",
    "payment_token": "pm_card_visa_debit"
  }
}
```

* **Validation Rules:**
  * `cart_id`: Must reference a valid, non-empty, uncompleted cart.
  * `shipping_address.*`: All fields required except `street_line_2`. Postal code must match ISO postal patterns for the target country.
  * `payment_token`: Must be a valid token generated by the client-side SDK.

* **Response (`202 Accepted`):**
```json
{
  "order_id": "ord_5521ab89fe4",
  "status": "PROCESSING",
  "currency": "USD",
  "total_amount": 264.99,
  "shipping_address": {
    "recipient_name": "John Connor",
    "street_line_1": "101 Cyberdyne Way",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90210",
    "country": "US"
  },
  "items": [
    {
      "sku": "SKN-NSJ-BLK-L",
      "name": "Skynet Tactical Neural Shell Jacket",
      "quantity": 1,
      "unit_price": 249.99
    }
  ],
  "estimated_delivery": "2026-06-10T18:00:00Z",
  "created_at": "2026-06-06T00:15:00Z"
}
```

---

## 3. GraphQL API Specification

For composite client views (e.g., combined user profile, order history, and dynamic product recommendations), clients may query the GraphQL endpoint (`/graphql`).

### 3.1 Schema Definition Language (SDL)

```graphql
enum ClothingCategory {
  TOPS
  BOTTOMS
  OUTERWEAR
  FOOTWEAR
  ACCESSORIES
}

enum OrderStatus {
  PROCESSING
  PACKING
  DISPATCHED
  DELIVERED
  CANCELLED
}

type ProductVariant {
  sku: ID!
  size: String!
  color: String!
  stockQuantity: Int!
}

type Product {
  id: ID!
  name: String!
  slug: String!
  description: String
  category: ClothingCategory!
  basePrice: Float!
  currency: String!
  variants: [ProductVariant!]!
  images: [String!]!
  createdAt: String!
}

type OrderItem {
  sku: ID!
  name: String!
  quantity: Int!
  unitPrice: Float!
}

type Address {
  recipientName: String!
  streetLine1: String!
  streetLine2: String
  city: String!
  state: String!
  postalCode: String!
  country: String!
}

type Order {
  id: ID!
  status: OrderStatus!
  totalAmount: Float!
  currency: String!
  shippingAddress: Address!
  items: [OrderItem!]!
  estimatedDelivery: String
  createdAt: String!
}

type User {
  id: ID!
  email: String!
  fullName: String!
  orders(limit: Int = 10, offset: Int = 0): [Order!]!
  wishlist: [Product!]!
}

type Query {
  product(id: ID!): Product
  products(category: ClothingCategory, limit: Int = 20): [Product!]!
  me: User
}

input AddToCartInput {
  cartId: ID!
  sku: ID!
  quantity: Int!
}

type CartItem {
  itemId: ID!
  sku: ID!
  name: String!
  size: String!
  color: String!
  unitPrice: Float!
  quantity: Int!
  totalPrice: Float!
}

type Cart {
  cartId: ID!
  currency: String!
  items: [CartItem!]!
  subtotal: Float!
}

type Mutation {
  addToCart(input: AddToCartInput!): Cart!
  removeItemFromCart(cartId: ID!, itemId: ID!): Cart!
}
```

### 3.2 Example Query: Customer Dashboard
```graphql
query GetCustomerDashboard {
  me {
    email
    fullName
    wishlist {
      id
      name
      basePrice
      images
    }
    orders(limit: 5) {
      id
      status
      totalAmount
      estimatedDelivery
      items {
        name
        quantity
        unitPrice
      }
    }
  }
}
```

---

## 4. Error Code Registry

| Error Code | HTTP Status | Description / Resolution |
| :--- | :--- | :--- |
| `SKNET_ERR_40001` | `400 Bad Request` | Malformed JSON payload or syntactic parsing error. |
| `SKNET_ERR_40101` | `401 Unauthorized` | Missing, expired, or invalid JWT bearer token. |
| `SKNET_ERR_40301` | `403 Forbidden` | Insufficient permissions to access requested resource. |
| `SKNET_ERR_40401` | `404 Not Found` | Requested product, variant, or order entity does not exist. |
| `SKNET_ERR_40901` | `409 Conflict` | Inventory contention: Requested quantity exceeds real-time stock allocation. |
| `SKNET_ERR_42201` | `422 Unprocessable` | Schema validation failed (see `invalid_params` array). |
| `SKNET_ERR_42901` | `429 Too Many Requests`| Rate limit exceeded (Max 100 req/min per IP/Token). |
| `SKNET_ERR_50001` | `500 Internal Error` | Unhandled exception within Skynet neural backend infrastructure. |
```