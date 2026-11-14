```markdown
# SEO Audit Report: Skynet Bakehouse

**Client Website:** Artisanal sourdough bakery with preorders  
**Target URL:** `[Upstream Deliverable: code/index.html]`  
**Date:** March 2025  
**Audited By:** SEO Specialist, Skynet  

---

## 1. Title Tags & Meta Descriptions Audit

### Current Status
The HTML head currently contains a foundational title tag but is missing a dedicated meta description tag to control search snippets.

```html
<!-- Current -->
<title>Skynet Bakehouse | Artisanal Sourdough & Preorders</title>
```

### Recommendation & Optimized Code
We need to craft a compelling, keyword-rich title tag and meta description that highlights local/artisanal craft, online preorders, and organic ingredients to boost CTR from search engine results pages (SERPs).

*   **Optimal Title Tag Length:** ~50–60 characters.
*   **Optimal Meta Description Length:** ~120–155 characters.

```html
<!-- Recommended Head Additions -->
<title>Skynet Bakehouse | Artisanal Sourdough & Weekly Preorders</title>
<meta name="description" content="Secure your weekly loaf at Skynet Bakehouse. Handcrafted artisanal sourdough, ancient heritage grains, and 36-hour cold fermentation. Preorder for local pickup.">
```

---

## 2. Open Graph (OG) & Social Cards Audit

### Current Status
The page currently lacks Open Graph and Twitter Card tags. When users share the link on platforms like Facebook, Twitter, LinkedIn, or iMessage, the preview defaults to blank or unpredictable metadata scraped from the page.

### Recommendation & Optimized Code
Implement social sharing tags to control how the bakery’s brand, products, and images are displayed across social media feeds.

```html
<!-- Open Graph / Social Sharing Tags -->
<meta property="og:type" property="og:type" content="website">
<meta property="og:url" content="https://skynetbakehouse.com/">
<meta property="og:title" content="Skynet Bakehouse | Artisanal Sourdough & Weekly Preorders">
<meta property="og:description" content="Handcrafted artisanal sourdough baked in micro-batches using ancient heritage grains and 36-hour cold fermentation. Secure your loaf today.">
<meta property="og:image" content="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200">

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Skynet Bakehouse | Artisanal Sourdough & Weekly Preorders">
<meta name="twitter:description" content="Handcrafted artisanal sourdough baked in micro-batches using ancient heritage grains and 36-hour cold fermentation.">
<meta name="twitter:image" content="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200">
```

---

## 3. Structured Data (JSON-LD) Audit

### Current Status
No Schema.org structured data is present in the current markup. Without structured data, Google cannot automatically identify the site as a local food establishment, bakery, or product catalog.

### Recommendation & Optimized Code
Inject a comprehensive JSON-LD script covering `Bakery` (LocalBusiness) and `Product` items to enable rich snippets (such as pricing, availability, and business hours) in SERPs.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Skynet Bakehouse",
  "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
  "@id": "https://skynetbakehouse.com/#bakery",
  "url": "https://skynetbakehouse.com",
  "telephone": "+1-555-867-5309",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "101 Sourdough Lane",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94107",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday", "Saturday"],
      "opens": "08:00",
      "closes": "14:00"
    }
  ],
  "makesOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Product",
      "name": "Country Sourdough Boule",
      "description": "Blistered dark crust, open jelly crumb structure with gentle lactic tang.",
      "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      "offers": {
        "@type": "Offer",
        "price": "14.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  }
}
</script>
```

---

## 4. Heading Hierarchy (H1–H6) Audit

### Current Status
*   **H1:** One H1 element is present (`Wild Ferment. Blistered Crust.`). This is well-optimized and avoids duplicate H1 tags.
*   **H2:** Used appropriately for major structural sections (`Baking Schedule & Available Loaves`, etc.).
*   **H3 / H4:** Used effectively for product names and feature cards.

### Summary Table of Headings
| Level | Tag Content | Audit Status |
| :--- | :--- | :--- |
| **H1** | `Wild Ferment. Blistered Crust.` | **Pass** (Unique, keyword-aligned) |
| **H2** | `Baking Schedule & Available Loaves` | **Pass** (Clear section topic) |
| **H3** | `Signature Country Boule` | **Pass** (Product card heading) |
| **H3** | `Country Sourdough Boule` | **Pass** (Product catalog heading) |

*Recommendation:* Maintain the strict single-H1 rule as frontend components scale or change.

---

## Conclusion

The upstream code provides a robust, highly performant UI foundation. Implementing the meta description, OpenGraph/Twitter social cards, and JSON-LD local bakery schema detailed above will fully optimize the site for search engine crawlers and social share visibility.

**Status: Approved**
```