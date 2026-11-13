---
name: Skynet
description: An emissive black void with one signal amber accent and drifting dust — a no-code website builder that reads as capable software, not as a developer tool.
colors:
  void: "#0A0A0A"
  surface: "#141414"
  surface-hover: "#1F1F1F"
  hairline: "#2E2E2E"
  dust: "#9A9A9A"
  dust-light: "#B5B5B5"
  ivory: "#F0F0F0"
  white: "#FFFFFF"
  signal-amber: "#FFB900"
  signal-amber-deep: "#E0A800"
  signal-amber-bright: "#FFD24D"
  success: "#4ADE80"
  warning: "#FACC15"
  error: "#F87171"
  scrollbar-thumb: "#262626"
  scrollbar-thumb-hover: "#383838"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
rounded:
  control: "6px"
  card: "16px"
  pill: "9999px"
spacing:
  gutter: "1rem"
  container: "64rem"
  stack-xs: "0.75rem"
  stack-sm: "1rem"
  stack-md: "1.25rem"
  stack-lg: "3rem"
  card-pad: "1.5rem"
  panel-pad: "2rem"
  control-pad-y: "0.75rem"
  control-pad-x: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.void}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.signal-amber-deep}"
    textColor: "{colors.void}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
  field-label:
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
  link-primary:
    textColor: "{colors.signal-amber}"
    typography: "{typography.body}"
  status-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dust-light}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
  nav-bar:
    backgroundColor: "{colors.void}"
    textColor: "{colors.dust}"
    height: "4rem"
---

# Design System: Skynet

## Overview

**Creative North Star: "The Signal in the Void"**

Skynet is a black room with the lights off and one amber signal burning in it. Everything else in the system — surfaces, borders, secondary type, icons — is a quiet graphite or off-white. That is the whole idea: a wide, dark, calm field in which a single saturated amber element is the only thing that asks to be touched. The palette was chosen so that the primary action can never be ambiguous, on any screen, at any brightness.

The register is professional and capable rather than swaggering. Skynet is for people who have never written code, so the system refuses the two things that would push them away: the category-default SaaS landing (centred headline over a row of equal feature cards) and the edgy developer-terminal look. Instead the type is a plain, well-set grotesque in two scales, the copy sits left-aligned in a single 1024px column, and the space is generous — the hero alone occupies the top half of the first viewport, and the process steps are set 56px apart.

Depth is tonal. A surface on the void is one brightness step up; the next step up is a hover state or a nested row; a row nested inside a card goes back down to the void. Nothing is outlined, and no card carries a drop shadow. The only ambient motion in the product is a three-depth field of drifting dust behind the hero, rendered entirely in CSS, which gives the black ground texture without ever competing with the content. The confirmed visual rejections are the category-default centred-hero-plus-equal-cards arrangement and the terminal/bitmap type register.

**Key Characteristics:**

- One saturated accent in the whole system, spent on exactly one primary action per screen.
- Depth by brightness step (void → surface → surface-hover) — surfaces are separated by tone, not by an outline or a raised edge.
- One type family, two scales; hierarchy from size and weight contrast.
- A three-depth drifting dust field as the only ambient motion, disabled under `prefers-reduced-motion`.
- Three radii only: 6px controls, 16px cards, full-round pills.
- Browser surfaces (focus ring, caret, selection, scrollbar) themed from the same palette.

## Colors

A single emissive black ground, a three-step graphite ladder, four neutral text tones, and exactly one saturated hue.

### Primary

- **Signal Amber** (`#FFB900`): the only saturated colour in the system. It is the primary button's fill (with void text on top, 11.49:1), the focus ring, the text-selection fill, the caret, the live/building status dot, the brand tile in the nav, and the accent link. Its scarcity is what makes it read as a signal.
- **Deep Signal** (`#E0A800`): the amber fill one step down, used when the primary button is hovered or pressed. Never used as a standalone accent.
- **Bright Signal** (`#FFD24D`): the amber one step up, used only for link hover (`#FFD24D` on hover of an amber link) and for the brightest edge of an amber glow.

### Neutral

- **Void** (`#0A0A0A`): the ground. Every page sits on it; the body, the nav scrim, the scrollbar track, and the inset fill of a row nested inside a card.
- **Surface** (`#141414`): the first step up — cards, panels, the sign-out control, and the nav's loading placeholder.
- **Surface Hover** (`#1F1F1F`): the second step up — card hover, ghost-button hover, small-control hover.
- **Hairline** (`#2E2E2E`): the 1px stroke on inputs and small controls. At 1.46:1 on the void it is an edge, never a text colour.
- **Dust** (`#9A9A9A`): secondary text and icons — hero sub-copy, supporting paragraphs, nav links, the icons beside headings. 7.04:1 on void, 6.55:1 on surface: WCAG AA everywhere it is used.
- **Dust Light** (`#B5B5B5`): the third text tone — placeholders, meta lines, small status copy. 9.66:1 on void.
- **Ivory** (`#F0F0F0`): primary text and every headline. 17.37:1 on void.
- **White** (`#FFFFFF`): the top of the neutral ramp, held for the rare true-white emphasis. The shipped UI sets primary text in ivory, not white.

### Status

- **Success** (`#4ADE80`): a live, deployed, or approved state — the "Live" pill dot, an approved gate, a passed deploy gate.
- **Warning** (`#FACC15`): a blocked or awaiting-review state.
- **Error** (`#F87171`): the error role — failed requests and error copy in every form, and the blocked status on the project page.

These three are semantic states, never decoration. They appear as a 6px dot, as a 10%-opacity tinted label, or as error text — never as a large field or a filled button. Signal amber doubles as the in-progress marker, which keeps the whole system inside one hue family plus three state colours.

### Browser surfaces

- **Scrollbar thumb** (`#262626`, hover `#383838`): a rounded thumb on a void track, 10px wide with a 2px void border.
- **Caret** (`#FFB900`): the text caret in every field.
- **Selection**: amber fill with void text.
- **Focus ring**: 2px amber with a 2px void offset, applied to every focusable element.

### Named Rules

**The One Signal Rule.** Signal amber is the only saturated hue in the system and it is spent once per screen — on the single primary action. Success, warning and error appear only as state markers. Rarity is the point.

**The Brightness-Step Rule.** A surface separates from the ground by being brighter, never by being outlined: void (`#0A0A0A`) → surface (`#141414`) → surface-hover (`#1F1F1F`). A row nested inside a card goes back down to void.

**The Hairline-Is-A-Control Rule.** The 1px hairline belongs to inputs and small controls. A card is defined by its fill and its radius; its edge is never drawn.

## Typography

**Display Font:** Archivo — one self-hosted variable file pair (`Archivo-latin.woff2` and `Archivo-latin-ext.woff2`, weight axis 100–900) loaded through `next/font/local` and exposed as the `--font-archivo` variable. It is preloaded from the app's own origin, so the face never depends on a third-party request at build time or at run time.
**Body Font:** Archivo — the same variable face, at the lower of the two scales.
**Label/Mono Font:** none. There is no monospace face and no second family.

**Character:** Archivo is a wide, industrial grotesque with a tall x-height: bold at 72px it reads like signage rather than editorial, and regular at 16px it stays plain-spoken. Carrying both scales in one family is what keeps a no-code product from looking like a developer tool — there is no marketing display face shouting over the working text. Because the face is a single variable file, the jump from 400 to 700 costs no extra request: the hierarchy can travel from body to display without a second voice entering the page.

### Hierarchy

- **Display** (700, 48px → 72px at ≥768px, line-height 1.05, tracking -0.03em): the hero headline, balanced across two lines. One per surface; the homepage is the only surface that carries one.
- **Headline** (600, 30px → 36px at ≥768px, line-height 1.2, tracking -0.03em on section titles and -0.02em on page titles): "How Skynet works", "Dashboard", a project id, "Welcome back".
- **Title** (500, 18–24px, tracking -0.02em to -0.01em): card and panel headings, step titles, list-item names.
- **Body** (400, 16px, line-height 1.625, max 65ch): paragraphs and form copy. Hero sub-copy steps up to 18px; meta and helper text sit at 14px.
- **Label** (500, 14px, tracking -0.01em): field labels, button text, nav links, inline controls. Micro-labels are 12px uppercase at 0.025em tracking; the densest metric rows drop to 10px uppercase at 0.05em.

The four weights in use — 400, 500, 600, 700 — are all read off the same 100–900 variable axis. No weight in this system costs a second file or a second request.

### Named Rules

**The One Face Rule.** One family — Archivo — at two scales. Hierarchy comes from size and weight contrast (700/600 against 500/400), never from a second typeface.

**The Tight-Upper Rule.** Every size above 20px is set tight: -0.03em at display, -0.02em at headline, -0.01em at title. Tracking loosens only as the size drops, and turns positive only on uppercase micro-labels.

## Layout

**The Single-Column Rule.** Every surface is one centred column of at most 1024px (64rem) with 16px gutters. The column may contain a grid; the page never runs edge to edge — even the nav's inner content uses the same 1024px measure. The login surface narrows the same rule to 448px (28rem).

Vertical rhythm runs on a 4px base step. Sections separate by 48px; list rows by 12px; form fields by 16px on the dashboard and 20px on login; card padding is 24px; the hero is inset 96px from the top on mobile and 128px from 768px up. The fixed 64px nav pushes all page content down by 64px.

Density is generous. The process list is a 12-column grid per step — the numeral holds 2 columns, the copy 10 — with 56px between steps and 40px between the numeral and its text at desktop.

Responsive behaviour: below 768px the nav links hide (the wordmark and the auth control remain), the display size drops from 72px to 48px, the hero action row stacks, and every multi-column grid (project status and artifacts) collapses to a single column. Alignment is left within the column everywhere except the login panel, the trust row, and the closing footer tag, which are centred.

## Elevation & Depth

This system is flat by default, and depth is tonal. A surface on the void is `#141414`; one step up is `#1F1F1F`; a row nested inside a card drops back to the void `#0A0A0A`. No card carries a drop shadow — a card's edge is defined by its fill and its 16px radius, never by a border.

Five shadows exist in the entire system and they play only two roles: amber emission glow (the primary button, the 28px brand tile in the nav, the 40px brand tile on login) and a dark scrim for floating chrome (the fixed nav, and the login panel).

### Shadow Vocabulary

- **Emission glow — resting** (`box-shadow: 0 0 20px rgba(255,185,0,0.35)`): the primary button's halo, present at all times so the CTA always looks lit.
- **Emission glow — active** (`box-shadow: 0 0 30px rgba(255,185,0,0.55)`): the primary button on hover, widened as the fill deepens.
- **Mark glow** (`box-shadow: 0 0 15px rgba(255,185,0,0.4)` and `0 0 20px rgba(255,185,0,0.5)`): the amber brand tile, smaller in the nav, larger on login.
- **Nav scrim** (`box-shadow: 0 8px 30px rgba(0,0,0,0.55)`): the fixed header, so scrolled content dissolves under it.
- **Floating panel** (`box-shadow: 0 0 40px rgba(0,0,0,0.6)`): the login card only — the one surface in the system that reads as lifted off the void.

### Named Rules

**The Ambient-Only Shadow Rule.** A shadow in this system always means "this is emitting light" or "this is floating above scrolled content". There is no third job for a shadow, and brightness steps do the work that shadows do everywhere else.

## Shapes

Three radii, and nothing else: **6px** (rounded-md) on controls — buttons, inputs, small chips, the brand tile; **16px** (rounded-xl, the project's override of Tailwind's 12px default) on cards and panels; **full-round** (rounded-full) on status pills, status dots, and the loading spinner. Corners are always soft; nothing in the system is square-cornered.

The only stroke in the system is a 1px hairline in `#2E2E2E`, and it appears on inputs and small controls only. There is no clipping, notching, or decorative geometry — the system's shapes are rounded rectangles and pills.

**The Three Radii Rule.** A new element picks one of 6px, 16px, or full-round, and a component family never mixes them. Controls are the tightest thing on screen; containers are the softest.

## Components

### Buttons

- **Shape:** gently rounded (6px).
- **Primary:** signal amber fill (`#FFB900`) with void text (`#0A0A0A`), semibold 14px at -0.02em, padding 12px vertical / 24px horizontal, inline-flex with an 8px gap for the icon. It carries the system's resting glow (`0 0 20px rgba(255,185,0,0.35)`).
- **Hover / Focus:** the fill deepens to `#E0A800`, the glow widens to `0 0 30px rgba(255,185,0,0.55)`, and the button lifts 1px. Pressed, it scales to 95%. Focus-visible draws the global 2px amber ring with a 2px void offset. Disabled: 50% opacity with pointer events off.
- **Ghost:** transparent fill, ivory text, 1px hairline border. On hover the fill becomes surface (`#141414`) and the border and text turn amber. Used for secondary actions ("Build a new site").
- **Small controls:** the sign-out, refresh and gate-check controls use the compact form — 6px vertical / 12px horizontal padding, 6px radius, hairline border, dust text brightening to ivory on hover; the nav's "Log in" link is the same family with 16px of horizontal padding. They are the system's small-control family, distinct from the primary and ghost buttons by size, not by hue.

### Cards / Containers

- **Corner style:** 16px radius.
- **Background:** surface (`#141414`), lifting to surface-hover (`#1F1F1F`) on hover. A row nested inside a card returns to the void (`#0A0A0A`) at 12px radius, which is how the artifact list separates its entries without a rule.
- **Shadow strategy:** none — see Elevation & Depth.
- **Border:** none.
- **Internal padding:** 24px. The login panel uses 32px, widening to 40px from 640px, and is the one container that floats.

### Inputs / Fields

- **Style:** transparent fill on the void, 1px hairline (`#2E2E2E`), 6px radius, 12px vertical / 16px horizontal padding — 40px on the left when a 16px icon sits inside.
- **Focus:** the border turns amber and a 1px amber ring is added; the transition runs 200ms.
- **Placeholder / Label:** placeholder in dust-light (`#B5B5B5`); the label sits above the field in 14px medium ivory at -0.01em with 6px of space beneath it.
- **Error / Disabled:** disabled fields drop to 50% opacity. Error copy is the error token as text on a notice with the same shape as the success notice, which uses signal amber — 6px radius, 16px padding on the home and login surfaces and 12px in the compact dashboard notice, filled with surface on the homepage and with void on the signed-in surfaces.

### Navigation

- **Style:** a fixed 64px bar across the top — void at 80% opacity with a 12px backdrop blur and a soft `0 8px 30px rgba(0,0,0,0.55)` scrim so scrolled content dissolves under it. The blur is fixed-chrome treatment; it is not a card effect and is not reused elsewhere.
- **Wordmark:** a 28px amber tile at 6px radius holding a spark icon in void, lit by a 15px amber glow; the word "Skynet" is Archivo bold 20px in ivory at -0.02em, turning amber on hover while the tile scales to 105%.
- **Links:** 14px medium in dust, brightening to ivory on hover, each with a 16px icon and an 8px gap. They sit left of centre on desktop; below 768px they hide and only the wordmark and the auth control remain.
- **Auth:** exactly one control on the right — a hairline ghost "Log in" when signed out; the user's name, an amber email and a "Sign out" surface button when signed in. The bar never shows a filled amber button and never doubles its auth affordance; the page's primary action owns the single signal.

### Status Indicators

- **Pill:** full-round, 10px horizontal / 2px vertical padding, 12px medium text, carrying a 6px dot. Live = success dot, Building = pulsing amber dot, Queued = dust dot, any other state = warning dot with the state named in the label.
- **Tinted label:** the same states appear on the project page filled with 10% of the state colour and set in the state colour itself — the header's status badge in uppercase at 6px radius, and the artifact chip in 12px at full-round. A default state falls back to a void fill with ivory text. The status reads without adding a second hue to the page.

### Links

- **Accent link:** signal amber with an underline 2px below the baseline in 30%-opacity amber; on hover the text brightens to `#FFD24D` and the underline becomes solid amber. Used for in-page actions ("Sign up", "Sign in", "Back to dashboard").
- **Quiet link:** dust text that brightens to ivory on hover — the "Already have an account? Log in" link in the hero, set beside the CTA rather than inside a button.

### Dust Field (signature)

The world's material, and the only ambient motion in the product. Three stacked layers of radial-gradient dots sit behind the hero content: **far** (1px dots at 14% opacity on a 26px tile, drifting for 96s), **mid** (1.6px dots at 28% on a 44px tile, 54s), **near** (2.6px dots at 50% on a 78px tile, 31s). Each layer's drift distance is an exact multiple of its own tile size, so the loop never jumps. The field is non-interactive, sits beneath the content, and is switched off entirely under `prefers-reduced-motion: reduce` (which also disables smooth scrolling). It is drawn entirely in CSS and makes no image request.

## Do's and Don'ts

### Do:

- **Do** spend the amber signal once per screen on the single primary action, and let every other action be a ghost button or a quiet link.
- **Do** separate a surface from the ground with one brightness step — surface, then surface-hover — rather than with an outline.
- **Do** keep body copy to roughly 65 characters per line, left-aligned, and set anything above 20px tight.
- **Do** give every interactive element the global focus treatment: a 2px amber ring with a 2px void offset.
- **Do** pick from the three radii only — 6px controls, 16px cards, full-round pills — and keep a component family on one radius.
- **Do** keep icons from lucide-react at a single stroke weight — 16px in most places, 14px in the wordmark, 12px on the project page's small action icons.
- **Do** place the dust field behind content, never over it, and switch it off under `prefers-reduced-motion: reduce`.

### Don't:

- **Don't** introduce a second saturated accent; success, warning and error are states, and signal amber stays the one accent.
- **Don't** put a border on a card, or reach for a shadow to separate a card from its neighbour — a brightness step does that.
- **Don't** place more than one filled amber element in a viewport.
- **Don't** mix radii inside one component family, and don't use a radius outside 6px, 16px or full-round.
- **Don't** widen body copy past ~65ch or centre it; the system's voice is left-aligned inside the column.
- **Don't** drop the focus ring, the amber caret, or the amber-on-void selection treatment — the browser surface is part of the system.
