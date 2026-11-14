# Skynet Data Architecture: Artisanal Sourdough Bakery with Preorders
**Document ID:** `data/data-model.md`  
**Classification:** Skynet Internal / Approved Architecture  
**Author:** Database Architect, Skynet Systems  

---

## 1. Executive Summary & Architecture Overview

This document specifies the relational database schema, indexing strategy, and data sizing estimates for the artisanal sourdough bakery preorder platform. The system is designed around time-slot-based capacity management, inventory traceability (batch baking), and frictionless customer preordering.

The database engine targeted is **PostgreSQL 15+** to leverage advanced JSONB document storage, native range types (for time slots), and robust transactional integrity (ACID) essential for inventory control.

---

## 2. Entity Relationship Model (ERD)

The conceptual architecture below outlines the domain entities and their cardinalities.

```
+------------------+       +------------------+       +------------------+
|     Customers    | 1   N |      Orders      | 1   N |   Order_Items    |
+------------------+-------+------------------+-------+------------------+
| customer_id (PK) |       | order_id (PK)    |       | order_item_id(PK)|
| email (UK)       |       | customer_id (FK) |       | order_id (FK)    |
| phone            |       | slot_id (FK)     |       | product_id (FK)  |
+------------------+       | status           |       | quantity         |
                           +------------------+       | unit_price       |
                                    |                 +------------------+
                                    | 1
                                    |
                                    | N
                           +------------------+       +------------------+
                           |   Pickup_Slots   | N   1 |     Products     |
                           +------------------+-------+------------------+
                           | slot_id (PK)     |       | product_id (PK)  |
                           | start_time       |       | name             |
                           | max_capacity     |       | base_price       |
                           | current_load     |       | is_active        |
                           +------------------+       +------------------+
                                                               |
                                                               | 1
                                                               |
                                                               | N
                                                      +------------------+
                                                      |   Baking_Batches |
                                                      +------------------+
                                                      | batch_id (PK)    |
                                                      | product_id (FK)  |
                                                      | bake_date        |
                                                      | dough_weight_g   |
                                                      +------------------+
```

---

## 3. PostgreSQL DDL Table Schemas

Execute the following script to provision the database schema.

```sql
-- Enable UUID extension for distributed primary keys if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (Sourdough loaves, pastries, seasonal items)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0.00),
    is_active BOOLEAN DEFAULT TRUE,
    preparation_lead_time_hours INT DEFAULT 24, -- Sourdough takes time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pickup Slots Table (Manages bakery throughput capacity)
CREATE TABLE pickup_slots (
    slot_id SERIAL PRIMARY KEY,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    current_load INT DEFAULT 0 CHECK (current_load >= 0),
    is_open BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_slot_times CHECK (end_time > start_time),
    CONSTRAINT check_capacity_limit CHECK (current_load <= max_capacity)
);

-- 4. Orders Table
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    slot_id INT NOT NULL REFERENCES pickup_slots(slot_id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, READY, COMPLETED, CANCELLED
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0.00),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items Table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0.00)
);

-- 6. Baking Batches Table (For internal production tracking & inventory traceability)
CREATE TABLE baking_batches (
    batch_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    bake_date DATE NOT NULL,
    target_loaf_count INT NOT NULL CHECK (target_loaf_count > 0),
    actual_loaf_count INT,
    recipe_version VARCHAR(50) DEFAULT 'v1.0-standard',
    status VARCHAR(50) DEFAULT 'PLANNED' -- PLANNED, MIXING, FERMENTING, BAKING, COMPLETED
);
```

---

## 4. Indexes & Performance Optimization

To ensure fast lookups during peak preorder rushes, the following indexing strategy must be applied:

```sql
-- Optimize customer lookup during checkout login
CREATE INDEX idx_customers_email ON customers(email);

-- Optimize order retrieval by customer history
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Optimize schedule management and slot availability queries
CREATE INDEX idx_pickup_slots_time_open ON pickup_slots(start_time, is_open) 
    WHERE is_open = TRUE;

-- Optimize kitchen production sheets (filtering batches by date)
CREATE INDEX idx_baking_batches_date ON baking_batches(bake_date);

-- Composite index for order status reporting
CREATE INDEX idx_orders_status_date ON orders(status, created_at);
```

---

## 5. Data Storage & Capacity Planning Estimates

Calculations assume a mid-to-high scale artisanal bakery handling digital preorders.

### Assumptions:
* **Active Customers:** 10,000 profiles.
* **Preorder Volume:** 500 orders/week (~2,000 orders/month).
* **Order Composition:** Average of 2.5 items per order.
* **Retention Policy:** Hot storage maintained for 3 years of transactional history.

### Row-Size & Table Footprint Calculations (Annual Projections):

| Table Name | Average Row Size | Estimated Annual Rows | Annual Storage Growth |
| :--- | :--- | :--- | :--- |
| `customers` | ~250 Bytes | +2,500 new/yr | ~625 KB / year |
| `products` | ~500 Bytes | Static (~20 items) | ~10 KB |
| `pickup_slots` | ~128 Bytes | ~1,500 slots/yr | ~192 KB / year |
| `orders` | ~300 Bytes | 24,000 orders/yr | ~7.2 MB / year |
| `order_items` | ~100 Bytes | 60,000 items/yr | ~6.0 MB / year |
| `baking_batches`| ~200 Bytes | ~1,200 batches/yr | ~240 KB / year |

### Total Storage Footprint:
* **Transactional Data (Data Only):** < 25 MB per year.
* **Indexes & Overhead (Est. 40%):** ~10 MB per year.
* **Total Projected Database Footprint (3-year horizon):** **< 150 MB**. 

*Architectural Note:* While data volume is small, **concurrency is high** during bread drop releases (e.g., Friday 6 PM preorder window opening). Connection pooling (PgBouncer) and strict row-level locking on `pickup_slots.current_load` are required to prevent overselling limited sourdough inventory.