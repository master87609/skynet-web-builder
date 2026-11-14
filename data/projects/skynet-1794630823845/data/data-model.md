# Skynet Database Architecture: E-Commerce Apparel Platform
**Document ID:** `data/data-model.md`  
**Classification:** INTERNAL // SKYNET CORE SYSTEMS  
**Status:** APPROVED  

---

## 1. Executive Summary

This document outlines the enterprise-grade PostgreSQL data model for Skynet’s next-generation apparel e-commerce platform. Designed for high-throughput transactional integrity, horizontal read scaling, and multi-currency inventory tracking, this schema supports a global catalog, complex variant matrices (Size/Color), dynamic pricing engines, and real-time order fulfillment pipelines.

---

## 2. Entity Relationship Diagram (ERD)

```text
+-----------------------+       +-----------------------+       +-----------------------+
|        users          |       |       addresses       |       |       categories      |
+-----------------------+       +-----------------------+       +-----------------------+
| PK id                 |       | PK id                 |       | PK id                 |
|    email (UQ)         |--+    | FK user_id            |       | FK parent_id          |
|    password_hash      |  |    |    line1, city, etc.  |       |    name, slug         |
+-----------------------+  |    +-----------------------+       +-----------------------+
                           |                                                |
                           +------------------+                             |
                           |                  |                             |
                           v                  v                             v
+-----------------------+       +-----------------------+       +-----------------------+
|        orders         |       |        carts          |       |       products        |
+-----------------------+       +-----------------------+       +-----------------------+
| PK id                 |       | PK id                 |       | PK id                 |
| FK user_id            |       | FK user_id (UQ)       |       | FK category_id        |
|    total_amount       |       |    updated_at         |       |    name, slug, desc   |
|    status             |       +-----------------------+       +-----------------------+
+-----------------------+                 |                                 |
         |                                v                                 |
         |                      +-----------------------+                   |
         |                      |      cart_items       |                   |
         |                      +-----------------------+                   |
         |                      | PK id                 |                   |
         |                      | FK cart_id            |                   |
         |                      | FK variant_id         |<--+               |
         |                      |    quantity           |   |               |
         |                      +-----------------------+   |               |
         |                                                  |               |
         v                                                  |               |
+-----------------------+                                   |               v
|     order_items       |                                   |   +-----------------------+
+-----------------------+                                   |   |    product_variants   |
| PK id                 |                                   |   +-----------------------+
| FK order_id           |                                   |   | PK id                 |
| FK variant_id         |-----------------------------------+   | FK product_id         |
|    quantity           |                                       |    sku (UQ), price    |
|    unit_price         |                                       |    attributes (JSONB) |
+-----------------------+                                       +-----------------------+
                                                                            |
                                                                            v
                                                                +-----------------------+
                                                                |       inventory       |
                                                                +-----------------------+
                                                                | PK variant_id         |
                                                                |    stock_quantity     |
                                                                |    reserved_quantity  |
                                                                +-----------------------+
```

---

## 3. PostgreSQL DDL Schema

```sql
-- Enable UUID extension for distributed primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer', -- customer, admin, support
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CATALOG & INVENTORY
-- ============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0),
    -- Stores flexible attributes like {"size": "L", "color": "Midnight Black", "material": "Cotton"}
    attributes JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
    variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. SHOPPING CART
-- ============================================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- Nullable for guest carts if tracked via session token externally
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_cart_variant UNIQUE (cart_id, variant_id)
);

-- ============================================================================
-- 4. ORDERS & CHECKOUT
-- ============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled
    subtotal_amount NUMERIC(10, 2) NOT NULL CHECK (subtotal_amount >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address JSONB NOT NULL, -- Snapshotted at purchase time
    billing_address JSONB NOT NULL,  -- Snapshotted at purchase time
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name_snapshot VARCHAR(255) NOT NULL,
    variant_sku_snapshot VARCHAR(100) NOT NULL,
    attributes_snapshot JSONB NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);
```

---

## 4. Indexes & Performance Tuning

To ensure sub-millisecond lookups for high-concurrency traffic spikes, the following indexing strategy is deployed:

```sql
-- Users & Auth Lookups
CREATE INDEX idx_users_email ON users(email);

-- Catalog Filtering & Search Optimization
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- GIN Index for fast JSONB querying on dynamic apparel attributes (e.g., filtering by color/size)
CREATE INDEX idx_variants_attributes ON product_variants USING gin (attributes);

-- Cart & Checkout Performance
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## 5. Data Storage & Capacity Planning Estimates

Calculations are modeled for a baseline mid-scale apparel e-commerce deployment scaling to **1,000,000 registered users** and **100,000 active SKUs**.

### 5.1 Average Row Sizes
* **`users`**: ~250 bytes
* **`products`**: ~400 bytes
* **`product_variants`**: ~350 bytes (inclusive of JSONB attribute maps)
* **`orders`**: ~800 bytes (inclusive of JSONB address snapshots)
* **`order_items`**: ~300 bytes

### 5.2 Storage Growth Projections (Year 1 Target)

| Table | Estimated Volume | Avg Row Size | Total Storage (Data) | Index Overhead (~30%) |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | 1,000,000 rows | 250 Bytes | ~250 MB | ~75 MB |
| **`addresses`** | 1,500,000 rows | 200 Bytes | ~300 MB | ~90 MB |
| **`products`** | 10,000 records | 400 Bytes | ~4 MB | ~1.2 MB |
| **`product_variants`** | 100,000 records | 350 Bytes | ~35 MB | ~10.5 MB |
| **`inventory`** | 100,000 records | 50 Bytes | ~5 MB | ~1.5 MB |
| **`carts` & `cart_items`**| 50,000 active sessions | 150 Bytes | ~15 MB | ~4.5 MB |
| **`orders`** | 500,000 orders | 800 Bytes | ~400 MB | ~120 MB |
| **`order_items`** | 1,500,000 items | 300 Bytes | ~450 MB | ~135 MB |
| **TOTAL** | — | — | **~1.45 GB** | **~438 MB** |

**Recommended Provisioning:** 
* **Initial Database Instance:** AWS RDS / Aurora PostgreSQL `db.t4g.medium` (4 vCPU, 8 GB RAM) or equivalent.
* **Storage Allocation:** 50 GB General Purpose SSD (gp3) with IOPS baseline provisioned to 3,000 to accommodate holiday traffic surges and analytics query workloads.