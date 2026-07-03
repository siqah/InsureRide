<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->
---
name: InsureRide Frontend
description: High-contrast, mobile-first dashboards for workers and claim verifiers
---

# Design System: InsureRide Frontend

## 1. Overview

**Creative North Star: "The Kinetic Tarmac"**

The Kinetic Tarmac is a high-visibility, lightweight design system crafted specifically for Boda Boda riders operating on mobile screens in intense outdoor environments (e.g., bright tropical sunlight). It prioritizes absolute visual clarity, high-contrast text, and rapid information scanning. The aesthetic is kinetic and functional, refusing the low-contrast gradients and soft layout elements typical of modern template-based SaaS applications.

**Key Characteristics:**
- **High Glanceability**: Core metrics and statuses can be read in less than a second on a vibrating mobile screen.
- **Pure Color Coding**: Statuses use unambiguous primary tones (green for active, red for suspended) with solid backgrounds rather than subtle border tints.
- **Flat Layouts**: Sharp structure using fine borders instead of heavy, fuzzy drop shadows or nested cards.

## 2. Colors

The color strategy is restrained and highly functional, using deep navy for text and brand weight, backed by stark green and red indicators.

**The Sunlight Legibility Rule.** Background surfaces must remain clean, off-white, or high-lightness cool gray. Text ink must be exceptionally dark navy. Muted body copy text is prohibited; all body content must maintain a contrast ratio of at least 5.5:1 against the background to prevent sunlight washout.

- **Primary Brand/Ink**: Deep Navy `[to be resolved during implementation]`
- **Success Accent**: Active Green `[to be resolved during implementation]`
- **Danger Accent**: Suspended Crimson `[to be resolved during implementation]`
- **Neutral Background**: Cool Light Gray `[to be resolved during implementation]`

## 3. Typography

**Display Font:** System Sans-Serif (with fallbacks)
**Body Font:** System Sans-Serif (with fallbacks)

**Character:** Clean, functional sans-serif typeface emphasizing structure, high contrast, and structural alignment.

### Hierarchy
- **Display**: Bold, size `[to be resolved during implementation]`, line-height (1.1). Used for the countdown timer and status badges.
- **Headline**: Bold, size `[to be resolved during implementation]`. Used for portal titles.
- **Body**: Regular, size `[to be resolved during implementation]`, line-height (1.5). Cap line length at 65ch.
- **Label**: Bold, uppercase with slight letter-spacing. Used for labels and button text.

## 4. Elevation

**The Flat-By-Default Rule.** Surfaces are flat at rest, utilizing sharp 1px borders rather than shadow offsets. Shadows are prohibited for standard layout card separations. They may only be utilized for transient overlays (e.g., dropdowns, slideouts) as a distinct, low-blur structural indicator.

- **Transient Shadow**: Low-blur, sharp container separation `[to be resolved during implementation]`

## 5. Components

*Omitted in seed mode. Components and precise styles will be populated when implementation is written.*

## 6. Do's and Don'ts

### Do:
- **Do** use pure solid background alerts (e.g., solid green or solid red) to highlight coverage status rather than thin border-left strokes.
- **Do** maintain a strict 8px or 12px clean border radius (maximum 12px) on cards and input boxes to prevent a childish, over-rounded appearance.
- **Do** use high-contrast text ratios exceeding 5.5:1 to combat sunlight glare.

### Don't:
- **Don't** use low-contrast gray text on white backgrounds or soft, decorative shadows for cards.
- **Don't** use generic blue-to-purple background gradients or nested cards (e.g., putting a payment form container inside another layout card).
- **Don't** prefix headers with small, wide-tracked uppercase kickoff eyebrows (e.g., "OVERVIEW" or "METRICS").
