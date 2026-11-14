# Component Specifications: Skynet E-Commerce Platform ("Apparel Hub")

This document details the UI component specifications required to implement the Apparel Hub platform, designed to deliver high-converting mobile shopping for Chloe and efficient management workflows for Marcus.

---

## 1. Global Navigation & Layout Components

### 1.1 Primary Header (`Header.tsx`)
*   **Description:** Sticky top navigation bar containing branding, global category links, live search, and user utilities.
*   **Anatomy:**
    *   **Brand Logo:** Typography-driven (`Skynet Apparel Hub`), bold, links to `/`.
    *   **Nav Links:** Women, Men, New Arrivals, Sale (Hover state: subtle bottom border underline in primary accent color).
    *   **Search Input:** Expanding pill or inline input with instant thumbnail preview dropdown on keystroke.
    *   **Utility Icons:** Wishlist (Badge count pill: red/accent), Cart Drawer Trigger (Badge count), Account Modal Trigger.
*   **States:** Default (transparent over hero on home, solid white elsewhere), Scrolled (solid white with subtle bottom box-shadow).
*   **Accessibility:** ARIA landmark `role="banner"`, keyboard navigable menu links with focus rings.

### 1.2 Slide-out Cart Drawer (`CartDrawer.tsx`)
*   **Description:** Slide-over panel triggered by the cart utility icon.
*   **Anatomy:**
    *   **Header:** "Your Shopping Bag" title + Close button (`X`).
    *   **Item List Container:** Scrollable vertical list of line items (Thumbnail image, Title, Variant details like Size/Color, Qty Modifier selector, Unit Price, Delete button).
    *   **Footer Summary:** Subtotal, calculated shipping/taxes note, Promo Code input field, Primary Action button ("Proceed to Checkout" / Express Apple Pay button).
*   **States:** Open (slides in from right with backdrop blur overlay), Closed (off-canvas right: `translateX(100%)`).

---

## 2. Catalog & Browsing Components

### 2.1 Product Card Grid (`ProductCard.tsx`)
*   **Description:** Displays individual clothing items inside PLP or homepage carousels.
*   **Anatomy:**
    *   **Image Container:** Aspect ratio 3:4. Supports secondary image swap on hover. Features absolute-positioned Wishlist toggle heart icon (top-right).
    *   **Meta Details:** Brand/Category subtitle, Product Title (Truncated to 1 line), Price (Current price + optional strike-through sale price).
    *   **Quick Add / Quick View:** Appears on container hover on desktop; always accessible on mobile.
*   **States:** Default, Hover (image swap, quick action slide-up), Wishlisted (heart filled with accent color).

### 2.2 Multi-Attribute Filter Bar (`FilterBar.tsx`)
*   **Description:** Horizontal or sidebar filtering mechanism for Product Listing Pages (PLP).
*   **Anatomy:** Dropdown selectors or accordion groups for Size (S, M, L, XL), Color swatches, Price Range slider, and Sort Options dropdown (Price: Low-High, Newest, Best Sellers).
*   **States:** Expanded/Collapsed filters, Active filter count badge indicator.

---

## 3. Product Detail Page (PDP) Components

### 3.1 Product Imagery Gallery (`ProductGallery.tsx`)
*   **Description:** Multi-angle photography viewer optimized for mobile swiping and desktop zoom.
*   **Anatomy:** Main high-res image container with pinch/click-to-zoom capabilities, accompanied by a horizontal thumbnail strip (mobile) or vertical stack (desktop).

### 3.2 Variant Selector & Express Checkout (`ProductActions.tsx`)
*   **Description:** Core conversion block on the PDP.
*   **Anatomy:**
    *   **Color Swatches:** Circular radio buttons displaying color hex values or texture previews.
    *   **Size Selector:** Grid of size blocks (S, M, L, XL) with out-of-stock sizes visually crossed out/disabled and a link to the "Size Guide" modal.
    *   **Quantity Selector:** Numeric stepper (`-` / `+`).
    *   **Primary Action:** "Add to Bag" primary button (Full width, dark background).
    *   **Express Pay:** Apple Pay / Google Pay single-click button directly below primary action.

---

## 4. Checkout & Account Components

### 4.1 Secure Checkout Form (`CheckoutForm.tsx`)
*   **Description:** Multi-step wizard guiding users through shipping and payment.
*   **Anatomy:** Step indicator header (1. Contact & Shipping -> 2. Delivery Method -> 3. Payment), floating label form inputs, inline validation error messages, and secure Stripe Elements credit card iframe container.

### 4.2 Order History List (`OrderHistoryTable.tsx`)
*   **Description:** User dashboard component displaying past purchases.
*   **Anatomy:** Tabular or card-based layout listing Order ID, Date, Item Thumbnails, Total Amount, and a colored Status Pill (*Confirmed*, *Shipped*, *Delivered*). Links to detailed tracking view.

---

## 5. Administrator Dashboard Components (`/admin`)

### 5.1 Admin Sidebar & Navigation (`AdminLayout.tsx`)
*   **Description:** Restricted layout shell for store administrators (Marcus).
*   **Anatomy:** Dark vertical sidebar navigation links (Dashboard Overview, Products, Inventory Control, Orders, Content & CMS), user profile footer, and main content canvas area.

### 5.2 Inventory Control Table (`InventoryTable.tsx`)
*   **Description:** Data table for monitoring stock levels and triggering restocks.
*   **Anatomy:** Columns for SKU, Product Thumbnail & Name, Size/Variant, Stock Count, and Action controls.
*   **Conditional Styling:** Rows where stock count $< 5$ feature a soft red background highlight and a warning badge to satisfy low-stock alert requirements (FR-05).