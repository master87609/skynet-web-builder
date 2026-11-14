# Component Specifications: Professional Portfolio Website
**Design System Lead, Skynet**

This document details the functional specifications, anatomy, states, and accessibility requirements for all UI components to be built for the Skynet portfolio website.

---

## 1. Header & Navigation (`Header.tsx`)
* **Purpose:** Provides persistent global navigation, quick resume access, and theme-switching capabilities across all viewports.
* **Anatomy:**
  * Brand Logo / Initials (Links to `#hero`)
  * Navigation Links: *About*, *Projects*, *Experience*, *Contact* (Smooth anchor scroll)
  * Resume Quick Action (Button / Link)
  * Theme Switcher (Icon toggle for Light/Dark mode)
  * Mobile Hamburger Menu Toggle (Visible on screens $< 768\text{px}$)
* **States:**
  * *Default:* Transparent or solid surface background with subtle bottom border.
  * *Scrolled:* Applies `backdrop-blur-md` and shadow elevation.
  * *Mobile Menu Open:* Full-screen overlay displaying stacked navigation links.
* **Accessibility (a11y):** Uses `<header>` and `<nav>` semantic tags with `aria-label="Main Navigation"`.

---

## 2. Hero Section (`Hero.tsx`)
* **Purpose:** Captures recruiter attention within 5 seconds through clear positioning, value proposition, and instant CTAs.
* **Anatomy:**
  * Professional Avatar / Image container with subtle accent ring.
  * Dynamic Headline (e.g., "Full-Stack Engineer building high-performance web systems").
  * Short professional bio.
  * Primary CTA: "View Projects" (Solid accent button, links to `#projects`).
  * Secondary CTA: "Contact Me" (Outline button, links to `#contact`).
* **States:**
  * *Hover:* Buttons elevate slightly with smooth transition ($\le 200\text{ms}$).
* **Accessibility (a11y):** Avatar includes descriptive `alt` text. Headings follow strict hierarchical order (`<h1>` for primary headline).

---

## 3. Project Showcase Grid & Card (`ProjectCard.tsx`)
* **Purpose:** Showcases past work samples with interactive filtering and direct access to code/live deployments.
* **Anatomy:**
  * Category Filter Tabs (*All*, *Web App*, *Mobile*, *Open Source*).
  * Project Card Container:
    * Thumbnail Image (with zoom-on-hover effect).
    * Project Title & Description.
    * Technology Badges (Pills displaying tags like React, TypeScript, Node).
    * Action Links: "Live Demo" (External Link icon) and "GitHub" (Code icon).
* **States:**
  * *Card Hover:* Surface elevates with a border highlight matching the design token accent color.
  * *Filter Active:* Selected category tab displays active background/text styling.
* **Accessibility (a11y):** External links include `rel="noopener noreferrer"` and `aria-label` attributes indicating destination.

---

## 4. Skills Matrix & Experience Timeline (`ExperienceSection.tsx`)
* **Purpose:** Enables technical recruiters to rapidly scan proficiency levels and work history.
* **Anatomy:**
  * Category Sections (*Languages*, *Frameworks & Libraries*, *Tools & Infrastructure*).
  * Skill Badges / Icons.
  * Vertical Timeline component featuring company names, roles, date ranges, and bulleted achievement lists.
* **States:**
  * *Hover:* Timeline nodes or skill cards display subtle shadow enhancement.
* **Accessibility (a11y):** Uses semantic `<section>` and ordered/unordered lists for screen reader clarity.

---

## 5. Resume / CV Section (`ResumeSection.tsx`)
* **Purpose:** Fulfills core recruiter requirement (FR-05) for instant resume review and downloading.
* **Anatomy:**
  * In-Browser PDF Preview Container (Embed/iframe or clean rendered document view).
  * One-Click Secure Download Button with download icon.
* **States:**
  * *Loading:* Skeleton loader while PDF viewer initializes.
  * *Button Hover:* Accent color shift with clear focus ring.

---

## 6. Contact Form (`ContactForm.tsx`)
* **Purpose:** Enables secure, validated project inquiries and direct messaging (FR-04).
* **Anatomy:**
  * Input Fields: Name, Email, Subject, and Message Textarea.
  * Honeypot Spam Prevention field (hidden from human users).
  * Submit Button ("Send Message").
* **States:**
  * *Default:* Clean inputs with placeholder text.
  * *Focus:* Accent border color and subtle ring glow.
  * *Validation Error:* Red border with inline error text beneath invalid input.
  * *Submitting (Loading):* Button disables, spinner replaces text.
  * *Success State:* Form clears, green success banner renders ("Thank you! Your message has been sent.").
* **Accessibility (a11y):** All inputs are explicitly bound to `<label>` elements. Errors are announced via `aria-live="polite"`.

---

## 7. Footer (`Footer.tsx`)
* **Purpose:** Global anchor providing social links, copyright, and return-to-top functionality.
* **Anatomy:**
  * Social Media Icon Links (GitHub, LinkedIn, Twitter/X).
  * Copyright Notice & Skynet Attribution.
  * Back-to-Top Anchor Link.
* **Accessibility (a11y):** Social icons include descriptive `aria-label` attributes. Back-to-top button supports keyboard activation.