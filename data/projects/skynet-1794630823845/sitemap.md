# Information Architecture & Sitemap: Skynet E-Commerce Platform ("Apparel Hub")

This document outlines the complete information architecture and hierarchical sitemap for the Apparel Hub platform, optimized for both high-converting mobile shopping (Chloe) and streamlined administrative control (Marcus).

## 1. Global Navigation Architecture

### Primary Header
*   **Brand Logo** (Links to Homepage)
*   **Global Navigation Links:** Women, Men, New Arrivals, Sale
*   **Search Bar** (Live predictive search with instant thumbnail previews)
*   **User Utility Icons:**
    *   Wishlist / Saved Items (Badge count)
    *   Shopping Cart (Drawer trigger with live item count)
    *   User Account / Authentication Modal Trigger

### Secondary Footer
*   **Customer Care:** Contact Us, Shipping & Returns, Size Guide, FAQs, Order Tracking
*   **About Us:** Our Story, Sustainability, Careers, Press
*   **Legal & Compliance:** Privacy Policy (GDPR/CCPA), Terms of Service, Cookie Settings
*   **Newsletter Signup:** Email subscription input with discount incentive
*   **Social Channels:** Instagram, TikTok, Pinterest, Twitter/X

---

## 2. Complete Hierarchical Sitemap

```text
1.0 Homepage (/)
├── 1.1 Hero Promotional Banner (Dynamic CMS update)
├── 1.2 Featured Categories Grid (Women, Men, Accessories)
├── 1.3 New Arrivals Carousel (Quick add-to-cart)
├── 1.4 Promotional Callout / Seasonal Collection
└── 1.5 Social Proof / Instagram Feed

2.0 Catalog & Browsing
├── 2.1 Category Landing Page (/catalog/[gender])
│   ├── Sub-Category Filter (Tops, Bottoms, Outerwear, Dresses)
│   └── Featured Collections
└── 2.2 Product Listing Page (PLP) (/catalog/[gender]/[category])
    ├── Multi-Attribute Filtering (Size, Color, Price Range, Gender)
    ├── Sort Options (Price: Low-High, Newest, Best Sellers)
    └── Product Card Grid (Quick view, Image hover state, Wishlist toggle)

3.0 Product Detail Page (PDP) (/product/[slug])
├── 3.1 Product Imagery Gallery (Zoom, multi-angle)
├── 3.2 Product Details (Title, Price, SKU, Description, Material/Care)
├── 3.3 Variant Selectors (Color swatches, Size selector with Size Guide modal)
├── 3.4 Quantity Selector & Primary Action ("Add to Bag")
├── 3.5 Express Checkout Action (Apple Pay / Google Pay single-click)
└── 3.6 Related / "Complete the Look" Recommendations

4.0 Shopping Cart & Checkout
├── 4.1 Slide-out Cart Drawer / Dedicated Cart Page (/cart)
│   ├── Item List (Qty modifier, Remove item)
│   ├── Promo Code Application Input
│   ├── Dynamic Subtotal, Shipping, Tax, and Total Calculation
│   └── Primary Action ("Proceed to Checkout")
└── 4.2 Secure Checkout Flow (/checkout)
    ├── Step 1: Customer Contact & Shipping Address
    ├── Step 2: Shipping Method Selection
    ├── Step 3: Payment Gateway Integration (Stripe / PayPal / Express Pay)
    └── Step 4: Order Confirmation & Receipt Success Screen (/checkout/success/[orderId])

5.0 User Account & Authentication
├── 5.1 Authentication Modal / Pages (/auth)
│   ├── Login (Email/Password & Social OAuth: Google / Apple)
│   ├── Registration Form
│   └── Password Reset Flow
└── 5.2 User Dashboard (/account)
    ├── 5.2.1 Profile Overview
    ├── 5.2.2 Order History & Tracking (/account/orders/[orderId])
    └── 5.2.3 Saved Addresses & Payment Methods

6.0 Content & Support Pages
├── 6.1 Order Tracking Portal (/track-order)
├── 6.2 Customer Support / FAQ (/help)
└── 6.3 Static Information Pages (/legal - Privacy, Terms, Shipping Policy)

7.0 Administrator Dashboard (Restricted Access /admin)
├── 7.1 Dashboard Overview (Daily sales metrics, quick links)
├── 7.2 Product Management (/admin/products)
│   ├── Product List Table (Inventory status, SKU, Price)
│   ├── Add New Product Form (Imagery upload, variants, inventory counts)
│   └── Edit / Delete Product Controls
├── 7.3 Inventory Control (/admin/inventory)
│   ├── Stock Level Monitoring Table
│   └── Low-Stock Alerts (< 5 units threshold indicators)
├── 7.4 Order Management (/admin/orders)
│   ├── Customer Orders List & Status Filter (Confirmed, Shipped, Delivered)
│   └── Order Detail & Status Update Trigger (Sends automated email/SMS)
└── 7.5 Content & Promotional Management (/admin/cms)
    ├── Homepage Banner Manager (Image upload & link mapping)
    └── Promo Code Generator (Discount rules, expiration dates, active toggles)
```

---

## 3. Sitemap Navigation Matrix

| Level 1 | Level 2 | Level 3 | Target Audience | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **1.0 Homepage** | *Various Blocks* | - | All Users | Brand immersion, direct path to collections & promotions. |
| **2.0 Catalog** | 2.1 Category / 2.2 PLP | Filters & Sorting | Shoppers (Chloe) | Enable multi-attribute discovery and comparison. |
| **3.0 Product** | 3.1-3.6 PDP | Variants, Add to Cart | Shoppers (Chloe) | Convert product interest into a cart addition. |
| **4.0 Checkout** | 4.1 Cart / 4.2 Checkout | Payment & Shipping | Shoppers (Chloe) | Frictionless transaction completion. |
| **5.0 Account** | 5.1 Auth / 5.2 Dashboard | Profile, Orders | Registered Users | Manage personal details, review past purchases and delivery tracking. |
| **6.0 Support** | 6.1-6.3 Help Center | FAQ, Tracking, Legal | All Users | Self-service customer support and trust building. |
| **7.0 Admin** | 7.1-7.5 Dashboard | Products, Inventory, CMS | Administrator (Marcus) | Daily store operations, catalog management, order fulfillment. |