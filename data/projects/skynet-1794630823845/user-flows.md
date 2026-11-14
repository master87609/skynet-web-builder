# User Flows & Navigation Paths: Skynet E-Commerce Platform ("Apparel Hub")

This document outlines the step-by-step conversion and navigation pathways for primary user personas (Chloe the Trendy Shopper and Marcus the Store Administrator) on the Apparel Hub platform, engineered to achieve high conversion rates and operational efficiency.

---

## Flow 1: Express Purchase Path (Chloe, 24 — Mobile-First Shopper)
*Objective: Discover an item via social media/homepage link and complete a purchase in under 60 seconds using mobile-optimized express checkout.*

```text
[Landing: Homepage or Direct Ad URL] 
       │
       ▼
[Product Listing Page (PLP) / Category Filter] 
       │  (Filters applied: Size "M", Color "Black", Category "Dresses")
       ▼
[Product Detail Page (PDP)] 
       │  (Selects size, reviews photos)
       ▼
[Action Trigger] ──(Click)──► [Apple Pay / Google Pay Express Button]
       │                            │
       │                            ▼
       │                    [Biometric Authentication / Address Auto-fill]
       │                            │
       │                            ▼
       │                    [Order Success Screen (/checkout/success/[orderId])]
       │
       └─(Alternative: Standard Add to Bag)──► [Slide-out Cart Drawer]
                                                    │
                                                    ▼
                                            [Standard Checkout Flow]
                                              ├── 1. Enter Shipping Info
                                              ├── 2. Confirm Shipping Method
                                              └── 3. Secure Payment (Stripe / CC)
                                                    │
                                                    ▼
                                            [Order Success Screen] 
                                                    │
                                                    ▼
                                            [Automated Email/SMS Confirmation Sent]
```

### Step-by-Step Breakdown:
1. **Entry:** Chloe arrives via a mobile social media ad directly to a filtered PLP (`/catalog/women/dresses?size=M&color=black`).
2. **Evaluation:** Taps a product card to open the PDP (`/product/black-summer-dress`).
3. **Conversion Trigger:** Instead of adding to a traditional cart, Chloe taps the native **Apple Pay / Google Pay** express checkout button located directly below the primary size selector.
4. **Frictionless Auth & Payment:** The native device payment sheet pops up, auto-populating her verified shipping address and credit card information.
5. **Completion:** Biometric verification (FaceID/TouchID) authorizes payment. The system instantly generates a unique order tracking number, deducts inventory, and displays the success screen while triggering an automated confirmation email.

---

## Flow 2: User Registration & Order Tracking (Chloe, 24)
*Objective: Register a new account via Google OAuth, view past order history, and track an active delivery.*

```text
[Header / Account Icon] ──► [Authentication Modal (/auth)]
                                  │
                          (Click "Sign in with Google")
                                  │
                                  ▼
                         [Google OAuth Consent] 
                                  │
                                  ▼
                         [User Dashboard (/account)]
                                  │
                     (Click "Order History & Tracking")
                                  │
                                  ▼
                         [Order History List (/account/orders)]
                                  │
                         (Select Specific Order ID)
                                  │
                                  ▼
                         [Order Status View]
                           ├── Status: Shipped
                           ├── Live Tracking Link
                           └── Itemized Receipt
```

### Step-by-Step Breakdown:
1. **Initiation:** Chloe clicks the user icon in the global header to open the auth modal.
2. **Social Login:** She selects "Sign in with Google," bypassing password creation fields.
3. **Dashboard Land:** Upon successful authentication, she is redirected to `/account`.
4. **History Access:** She clicks "Order History," viewing a list of past transactions with status pills (*Confirmed*, *Shipped*, *Delivered*).
5. **Tracking:** Tapping an active order displays real-time fulfillment updates, fulfilling FR-02 and FR-04.

---

## Flow 3: Daily Inventory & Promotional Management (Marcus, 38 — Store Administrator)
*Objective: Update inventory levels, add a new clothing item, and publish a new homepage promotional banner.*

```text
[Admin Login (/admin)] 
       │
       ▼
[Admin Dashboard Overview (/admin)]
       │
       ├─► Path A: Inventory Update ──► [Inventory Control (/admin/inventory)]
       │                                     │
       │                             (Filter Low-Stock Items < 5)
       │                                     │
       │                             (Update Stock Count: +50 units)
       │                                     │
       │                                     ▼
       │                             [Stock Saved & DB Updated]
       │
       ├─► Path B: Add New Product ──► [Product Management (/admin/products/new)]
       │                                     │
       │                             (Upload Imagery, Set Price & Variants)
       │                                     │
       │                                     ▼
       │                             [Product Published to Catalog (PLP/PDP)]
       │
       └─► Path C: CMS Banner Update ──► [Content Management (/admin/cms)]
                                             │
                                     (Upload Banner Asset, Set Link URL)
                                             │
                                             ▼
                                     [Homepage Hero Updated Live (1.1)]
```

### Step-by-Step Breakdown:
1. **Authentication:** Marcus logs into the secure `/admin` portal with administrative credentials.
2. **Dashboard Overview:** He lands on the control panel, immediately noticing a red badge indicator for low-stock items (< 5 units threshold alert per FR-05).
3. **Inventory Action (Path A):** He clicks into `/admin/inventory`, locates the depleted SKU, updates the stock count from 2 to 50, and saves. The database instantly reflects the change.
4. **Product Addition (Path B):** Marcus navigates to `/admin/products/new` to list a new fall jacket. He uploads product photography, inputs multi-attribute variants (Sizes S-XL, Colors), sets pricing, and publishes. The item instantly populates the public catalog.
5. **Promotional Management (Path C):** Marcus navigates to `/admin/cms`, uploads a new seasonal banner graphic for the homepage hero slot, attaches the link destination (`/catalog/women/fall-collection`), and hits publish. The homepage updates instantaneously for all incoming shoppers.