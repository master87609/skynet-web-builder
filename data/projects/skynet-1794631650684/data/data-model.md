# Skynet Database Architecture: Apple Cinematic Experience

**Document ID:** `data/data-model.md`  
**Classification:** Internal / Architectural Specification  
**Status:** Approved  
**Author:** Lead Database Architect, Skynet Infrastructure Division  
**Target System:** PostgreSQL 16+ / Distributed Edge Storage Cluster  

---

## 1. Executive Summary & Architecture Overview

To power a world-class, hyper-cinematic digital experience for Apple—characterized by silky-smooth 60fps web-gl animations, immersive 3D product configurations, rich editorial storytelling, and instantaneous global streaming—the underlying data architecture must be uncompromisingly fast, globally distributed, and meticulously structured.

### Architectural Principles:
1. **Read-Optimized & Denormalized for the Edge:** The public-facing cinematic layer relies heavily on read-heavy caching architectures, JSONB document payloads for dynamic UI components, and CDN-adjacent read replicas.
2. **Immutable Media Assets:** All heavy video assets, 3D USDZ/GLTF models, and high-res imagery are decoupled from the relational database, mapped exclusively via secure content delivery network (CDN) URIs with strict metadata tracking.
3. **Strict ACID Compliance for Commerce:** Product catalogs, real-time localized pricing, inventory states, and user sessions utilize rigorous relational integrity with PostgreSQL.

---

## 2. Entity-Relationship Model (Conceptual & Logical)

```
+-------------------+       +-------------------+       +-------------------+
|     Products      | 1---N |   ProductSkus     | 1---N |   Inventory       |
+-------------------+       +-------------------+       +-------------------+
        | 1                         | 1                        
        |                           |                          
        N                           N                          
+-------------------+       +-------------------+       +-------------------+
|  CinematicScenes  |       |   ConfigOptions   |       |    UserSessions   |
+-------------------+       +-------------------+       +-------------------+
        | 1                         
        |                           
        N                           
+-------------------+       
|   AssetManifest   |       
+-------------------+       
```

### Core Entities & Relationships:
* **`products`**: The master catalog of cinematic devices (e.g., iPhone 15 Pro, Vision Pro).
* **`product_skus`**: Specific configurations (Color, Storage, RAM, Region) driving the 3D model states.
* **`cinematic_scenes`**: Directs the scroll-driven storytelling, defining WebGL camera coordinates, lighting parameters, and trigger animations per product section.
* **`asset_manifests`**: Tracks spatial audio, 8K ProRes video streams, and 3D meshes associated with product variants.
* **`user_sessions` & `cart_items`**: Manages interactive 3D studio customizations saved by prospective buyers.

---

## 3. PostgreSQL DDL Table Schemas

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PRODUCTS & CATALOG
-- ============================================================================

CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(category_id) ON DELETE CASCADE,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    launch_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb, -- Flexible schema for specs (chipset, weight, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_skus (
    sku_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    sku_code VARCHAR(100) UNIQUE NOT NULL,
    model_identifier VARCHAR(50) NOT NULL,
    finish_name VARCHAR(100) NOT NULL,
    finish_hex VARCHAR(7), -- For UI fallback color chips
    storage_capacity_gb INT,
    base_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. CINEMATIC SCROLL & 3D ASSET ENGINE
-- ============================================================================

CREATE TABLE cinematic_scenes (
    scene_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    section_title VARCHAR(150),
    camera_keyframes JSONB NOT NULL, -- Stores Three.js / WebGL camera paths & interpolation data
    lighting_config JSONB NOT NULL, -- Ambient, directional, and HDRI environment maps
    scroll_duration_vh INT DEFAULT 300, -- Viewport height scroll length
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_manifests (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'gltf_model', 'usdz_model', 'video_8k', 'poster_image'
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    resolution_tag VARCHAR(50), -- e.g., '3840x2160', 'poly_low', 'poly_high'
    checksum_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. INTERACTIVE 3D CONFIGURATOR & COMMERCE
-- ============================================================================

CREATE TABLE user_configurations (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id UUID REFERENCES product_skus(sku_id) ON DELETE CASCADE,
    selected_options JSONB NOT NULL, -- Engraving text, accessory bundles, trade-in values
    total_calculated_price DECIMAL(10, 2) NOT NULL,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_nodes (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id UUID REFERENCES product_skus(sku_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL, -- e.g., 'US-WEST', 'EU-CENTRAL'
    stock_count INT NOT NULL DEFAULT 0,
    reserved_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Indexing Strategy

To guarantee sub-10ms response times for global page loads and real-time configurator swaps, the following indexes are deployed:

```sql
-- Optimize catalog lookups by category and slug
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = TRUE;

-- Fast SKU resolution for configurator states
CREATE INDEX idx_product_skus_product_id ON product_skus(product_id);
CREATE INDEX idx_product_skus_lookup ON product_skus(product_id, finish_name, storage_capacity_gb);

-- Speed up cinematic sequence sorting during scroll-jacking
CREATE INDEX idx_cinematic_scenes_sequence ON cinematic_scenes(product_id, sequence_order);

-- Quick retrieval of heavy 3D assets and video streams
CREATE INDEX idx_asset_manifests_type ON asset_manifests(product_id, asset_type);

-- JSONB GIN Indexes for flexible querying of hardware specifications and camera vectors
CREATE INDEX idx_products_metadata_gin ON products USING gin (metadata);
CREATE INDEX idx_cinematic_camera_gin ON cinematic_scenes USING gin (camera_keyframes);
```

---

## 5. Data Storage & Capacity Planning Estimates

Because this is a **cinematic** experience featuring heavy media assets, storage metrics are heavily bifurcated between relational database overhead and CDN object storage.

### 5.1 Relational Database Storage (PostgreSQL)
* **Row Estimates (Initial Launch):**
  * `products`: 50 master products
  * `product_skus`: ~600 configurations (across colors, storage, regional variants)
  * `cinematic_scenes`: ~400 total scroll-driven nodes
  * `asset_manifests`: ~2,500 media file pointers
* **Storage Footprint:** Extremely lean. Initial database size is estimated at **< 150 Megabytes**, growing by ~50MB annually. 
* **IOPS Requirements:** Moderate-to-High read IOPS (~5,000 read queries/sec peak global distribution) handled via read-replicas.

### 5.2 Blob & CDN Asset Storage (S3 / Edge Object Storage)
* **Asset Breakdown (Per Flagship Product - e.g., iPhone Pro):**
  * 3D GLTF / USDZ High-Poly Meshes: ~120 MB
  * 8K ProRes Web-Optimized Cinematic Video Loops: ~1.4 GB
  * High-Res Dynamic Texture Maps (PBR materials): ~450 MB
* **Total Media Storage Requirement:** ~50 GB for primary flagship lineup, scaling to **500 GB** with localized regional variants and archival assets.
* **Egress Strategy:** 100% offloaded to a global CDN (Cloudflare/CloudFront) with edge caching rules configured for immutable binary caching (`Cache-Control: public, max-age=31536000, immutable`).