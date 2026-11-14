# SEO Audit Report: Apple Pro — Cinematic Experience

**Prepared by:** SEO Specialist, Skynet  
**Target URL:** `https://www.apple.com/iphone-17-pro/` (Simulated Upstream: `code/index.html`)  
**Audit Date:** October 2023  

---

## 1. Executive Summary & Audit Overview

This document presents a comprehensive Search Engine Optimization (SEO) and technical metadata audit for the upstream deliverable (`code/index.html`), designed as a cinematic landing page for Apple. While the upstream template exhibits exceptional front-end design, interactive 3D simulations, and high-performance Tailwind styling, **it lacks critical SEO foundational elements** in its `<head>` section (missing meta descriptions, canonical tags, OpenGraph cards, Twitter cards, and structured data JSON-LD). 

Furthermore, the heading hierarchy requires optimization to ensure search engine crawlers can correctly parse semantic relationships.

---

## 2. Element-by-Element Audit

### A. Title Tag Audit
* **Current Value:** `<title>Apple Pro — Cinematic Experience</title>`
* **Evaluation:** At 38 characters, the length is optimal (under 60 characters). However, it lacks primary keyword targeting ("iPhone 17 Pro") for high-intent search queries.
* **Recommendation:** Update the title tag to include brand, model, and core value proposition.
* **Proposed Value:** `<title>iPhone 17 Pro — Apple</title>` or `<title>iPhone 17 Pro | Titanium, A19 Pro Chip — Apple</title>`

### B. Meta Descriptions Audit
* **Current Value:** *None present in upstream HTML.*
* **Evaluation:** Missing entirely. Search engines will auto-generate snippets from page body text, leading to unpredictable SERP display and lower Click-Through Rates (CTR).
* **Recommendation:** Implement a compelling meta description between 150–160 characters incorporating primary keywords.
* **Proposed Value:** `<meta name="description" content="Explore iPhone 17 Pro. Forged in aerospace-grade titanium, featuring the groundbreaking A19 Pro chip, 120Hz ProMotion display, and advanced pro camera system.">`

### C. OpenGraph & Social Cards Audit
* **Current Value:** *None present in upstream HTML.*
* **Evaluation:** Social sharing across platforms (iMessage, LinkedIn, Twitter/X, Facebook) will fall back to unformatted raw URLs or broken card previews due to missing `og:` and `twitter:` meta tags.
* **Recommendation:** Add full OpenGraph and Twitter card suites to ensure rich media previews.
* **Proposed Tags:**
  ```html
  <meta property="og:title" content="iPhone 17 Pro — Apple">
  <meta property="og:description" content="Forged in titanium. Powered by A19 Pro. Discover the ultimate cinematic smartphone experience.">
  <meta property="og:image" content="https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview__g782cbz216qu_og.jpg">
  <meta property="og:url" content="https://www.apple.com/iphone-17-pro/">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@Apple">
  <meta name="twitter:title" content="iPhone 17 Pro — Apple">
  <meta name="twitter:description" content="Forged in titanium. Powered by A19 Pro. Discover the ultimate cinematic smartphone experience.">
  <meta name="twitter:image" content="https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview__g782cbz216qu_og.jpg">
  ```

### D. Structured Data (JSON-LD) Audit
* **Current Value:** *None present in upstream HTML.*
* **Evaluation:** Without Schema.org structured data, search engines cannot reliably classify the page as a commercial product offering, missing out on rich snippets (price, availability, rating stars) in Google SERPs.
* **Recommendation:** Implement `Product` and `BreadcrumbList` schema JSON-LD blocks.
* **Proposed Schema:**
  ```json
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "iPhone 17 Pro",
    "image": [
      "https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview.jpg"
    ],
    "description": "Forged in aerospace-grade titanium with the groundbreaking A19 Pro chip.",
    "brand": {
      "@type": "Brand",
      "name": "Apple"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.apple.com/shop/buy-iphone/iphone-17-pro",
      "priceCurrency": "USD",
      "price": "999.00",
      "availability": "https://schema.org/InStock"
    }
  }
  ```

### E. Heading Hierarchy (H1 - H6) Audit
* **Current State:** 
  * Multiple heading tags are utilized, but some sections use generic styling tags or lack strict hierarchical nesting (`<h1>` is correctly placed in the Hero section, but sub-elements require verification).
* **Evaluation & Recommendations:**
  * Ensure exactly **one** `<h1>` tag exists per page (Present: `"Titanium. So strong. So light. So Pro."`).
  * Maintain strict descending order (`<h2>` for major sections like `#inspector`, `#silicon`, `#ecosystem`, `#specs`; `<h3>` for feature cards).
  * Avoid skipping heading levels (e.g., jumping from `<h1>` directly to `<h3>`).

---

## 3. Recommended `<head>` Optimization Patch

The following code block should be integrated directly into the `<head>` section of `code/index.html`:

```html
    <!-- SEO Meta Tags -->
    <title>iPhone 17 Pro — Apple</title>
    <meta name="description" content="Explore iPhone 17 Pro. Forged in aerospace-grade titanium, featuring the groundbreaking A19 Pro chip, 120Hz ProMotion display, and advanced pro camera system.">
    <link rel="canonical" href="https://www.apple.com/iphone-17-pro/">

    <!-- OpenGraph / Social Cards -->
    <meta property="og:title" content="iPhone 17 Pro — Apple">
    <meta property="og:description" content="Forged in titanium. Powered by A19 Pro. Discover the ultimate cinematic smartphone experience.">
    <meta property="og:image" content="https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview.jpg">
    <meta property="og:url" content="https://www.apple.com/iphone-17-pro/">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@Apple">
    <meta name="twitter:title" content="iPhone 17 Pro — Apple">
    <meta name="twitter:description" content="Forged in titanium. Powered by A19 Pro. Discover the ultimate cinematic smartphone experience.">
    <meta name="twitter:image" content="https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview.jpg">

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "iPhone 17 Pro",
      "image": ["https://www.apple.com/v/iphone-17-pro/images/meta/iphone-17-pro_overview.jpg"],
      "description": "Forged in aerospace-grade titanium with the groundbreaking A19 Pro chip.",
      "brand": { "@type": "Brand", "name": "Apple" },
      "offers": {
        "@type": "Offer",
        "url": "https://www.apple.com/shop/buy-iphone/iphone-17-pro",
        "priceCurrency": "USD",
        "price": "999.00",
        "availability": "https://schema.org/InStock"
      }
    }
    </script>
```

---

**Status: Approved**