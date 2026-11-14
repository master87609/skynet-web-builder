# mvp-scope.md

# MVP Scope & Roadmap: Skynet E-Commerce Platform ("Apparel Hub")

This document defines the exact boundaries for the Version 1.0 (v1) Minimum Viable Product versus future post-launch expansions, based on the requirements and user stories.

---

## 1. Version 1.0 (v1) MVP Feature Breakdown

The v1 release focuses exclusively on core transactional loops for both shoppers and store administrators, ensuring high performance, security, and baseline functionality.

### Frontend & Shopper Experience (React / Next.js & Tailwind CSS)
*   **FR-01 / US-01: Product Catalog & Browsing**
    *   Categorized clothing catalog layout.
    *   Multi-attribute filtering (size, color, category, price range, gender).
    *   Responsive, mobile-first UI meeting WCAG 2.1 Level AA standards.
*   **FR-02 / US-02: User Authentication & Profiles**
    *   Secure email/password registration and login (bcrypt password hashing $\ge 12$ cost factor).
    *   Social login integration (Google / Apple).
    *   Basic user profile management (delivery address book, past order history).
*   **FR-03 / US-03 / US-04: Shopping Cart & Express Checkout**
    *   Persistent shopping cart with dynamic subtotal recalculation (add, update quantities, remove items).
    *   Dynamic shipping cost and tax calculation.
    *   Secure third-party payment gateway integration (Stripe / PayPal) supporting express checkout (Apple Pay / Google Pay / credit card autofill).
*   **FR-04 / US-05: Order Tracking & Notifications**
    *   Generation of unique order tracking numbers.
    *   Automated transactional emails for order status (Confirmed, Shipped, Delivered).

### Backend & Administrative Control (Node.js / Express & PostgreSQL)
*   **FR-05 / US-06: Inventory & Stock Control**
    *   Automated stock deduction upon successful payment confirmation.
    *   Admin dashboard inventory management (add/edit clothing items, upload product imagery, update stock counts).
    *   Low-stock threshold alerts for administrators (< 5 units).
*   **FR-06: Content & Promotional Management**
    *   Admin controls to update homepage banner images.
    *   Promo code generation and validation engine at checkout.
*   **Security & Infrastructure (NFR Compliance)**
    *   HTTPS/TLS 1.3 encryption in transit and GDPR/CCPA data privacy compliance.
    *   Automated hourly database backups and disaster recovery protocols.

---

## 2. Future Expansion (Post-v1 Roadmap)

Features scoped out of the initial v1 release to maintain delivery velocity and focus on core revenue generation:

*   **Advanced Personalization & AI:** AI-driven product recommendations based on browsing history and past purchases ("Complete the Look").
*   **Loyalty & Rewards Program:** Points-based system, referral discounts, and VIP tiered membership benefits.
*   **Enhanced Customer Service:** Integrated live chat widget (e.g., Zendesk / Interoperable chatbot) and automated self-service returns/exchanges portal.
*   **Multi-Currency & Internationalization:** Localization support for multiple global currencies and languages with cross-border tax calculation automation.
*   **Advanced Analytics & Reporting:** Comprehensive visual sales forecasting, cohort analysis, and conversion funnel drop-off reports for administrators (Marcus).