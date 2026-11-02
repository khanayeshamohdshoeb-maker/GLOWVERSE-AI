# GLOWVERSE AI
### *Your Skin. Your Style. Your Smarter Beauty Journey.*

GLOWVERSE AI is an international luxury beauty technology, skin intelligence, and smart eCommerce web application. It connects precision non-clinical optical skin diagnostics with verified cosmetic formulation science, personalized routine management, and real-time budget guardianship.

---

## 1. Core Brand & Visual Identity

- **Category:** Luxury Beauty Technology / AI / Smart eCommerce
- **Target Audience:** Discerning individuals seeking science-backed skincare, clean ingredient transparency, and personalized routines.
- **Brand Personality:** Elegant, Intelligent, Premium, Trustworthy, Modern, Minimal, Approachable.
- **Ethical Boundary:** Zero insecurity marketing. Never promotes unrealistic beauty ideals, never fabricates clinical metrics, and never makes medical diagnoses.
- **Color Palette:**
  - **Ivory (`#F8F4ED`):** Dominant canvas background
  - **Warm Sand (`#E8DCCB`):** Structural borders and subtle dividers
  - **Champagne (`#C6A77D`):** Accent highlights and active states
  - **Muted Gold (`#96734C`):** High-intent focus and editorial badges
  - **Espresso (`#302B27`):** High-contrast typography and primary actions
  - **Soft White (`#FFFFFF`):** Elevation cards and modal surfaces
  - **Pale Rose (`#EAD9D2`):** Soft cosmetic washes and undertones
- **Typography:**
  - **Headings:** Playfair Display (Luxury Editorial Serif)
  - **Body Prose:** Plus Jakarta Sans / Inter (Clean Modern Geometric Sans)
  - **Metrics & Pricing:** Tabular Numerals (`tabular-nums`)

---

## 2. Five Connected Experiences

1. **AI Skin Intelligence:** Non-clinical 8-parameter optical cosmetic assessment (Texture, Radiance, Hydration, Fine Lines, Pores, Redness, Firmness, Dark Circles) with scientific scope disclosures.
2. **Personalized Beauty & Skincare Education:** Ingredient encyclopedia featuring 10 peer-reviewed active ingredients with formulation parameters, contraindications, and citations.
3. **Smart eCommerce & Product Discovery:** 16 luxury clean beauty products across 7 categories (Cleansers, Moisturisers, Sunscreens, Serums, Lip Care, Makeup, Accessories) with full INCI declarations and multi-currency support (₹ INR, $ USD, € EUR, £ GBP).
4. **Virtual Beauty Experiences:** Interactive Virtual Studio with interactive split-screen Before/After slider, couture lipstick shades, cheek radiance, and satin/matte/gloss finish toggles.
5. **Personal Beauty Management:** Daily Routine Studio with morning/evening checklists, Beauty Journal for skin progress logs, and the proprietary **Beauty Budget Guardian**.

---

## 3. Distinctive Product Innovations

### A. Skin-to-Shelf Intelligence
Seamlessly bridges diagnostic skin results with verified product formulations:
- Evaluates surface light reflection and hydration markers.
- Identifies matching active ingredients (e.g. Quadruple-weight Hyaluronic Acid, 3:1:1 Ceramides, Niacinamide).
- Explains transparently why specific formulations appear in your recommendations.

### B. Beauty Budget Guardian
Stops beauty overspending before checkout:
- Set personal target monthly budgets.
- Real-time subtotal calculation across active selections.
- Automatically suggests verified, affordable alternative formulations with identical active molecules.
- 1-click formulation swap with immediate calculated savings.

### C. Explain My Skin
Every metric is accompanied by:
- **What It Measures:** Biological and optical surface reflection mechanics.
- **What It Cannot Establish:** Clear boundaries explaining that non-invasive camera optics cannot inspect deep dermal collagen or diagnose clinical skin conditions like rosacea, eczema, or dermatitis.

---

## 4. Complete Application Screens (15 Screens)

| Screen | Name | Description |
| :--- | :--- | :--- |
| **01** | **Landing Page** | Editorial campaign hero, 5 pillars overview, How GLOWVERSE Works, and Privacy charter. |
| **02** | **Authentication** | Sign in, registration, session management, password visibility, and Guest Explorer mode. |
| **03** | **Personal Beauty Profile** | Display name, regional currency switcher, monthly budget limit, skin type, and concerns. |
| **04** | **Main Dashboard** | Personalised greeting, latest scan summary, daily routine progress, budget meter, and journal snippet. |
| **05** | **Skin Analysis Upload** | Drag-and-drop photo upload, sample portraits, file validation, and explicit cosmetic consent. |
| **06** | **Skin Intelligence Results** | 8-parameter breakdown, radar scores, Explain My Skin accordion, and Skin-to-Shelf recommendations. |
| **07** | **Smart Routine Studio** | Morning/evening step builders, checklist completion, product linking, and cosmetic layering rules. |
| **08** | **Product Discovery** | Filterable catalogue across 7 categories, price slider, key ingredient filters, and search. |
| **09** | **Product Details** | High-fidelity product showcase, full INCI list, application ritual, and budget alternative drawer. |
| **10** | **Ingredient Intelligence** | 10 active ingredients with peer-reviewed literature sources, formulation chemistry, and safety precautions. |
| **11** | **Virtual Beauty Studio** | Real-time Before/After split comparison slider, 9 couture lip and cheek shades, and finish controls. |
| **12** | **Beauty Journal** | Personal reflection log entries, skin feel tracking, date and tag search, and saved wishlist items. |
| **13** | **Beauty Budget Guardian** | Dedicated budget calculator, utilization gauge, line-item quantities, and cheaper alternative swaps. |
| **14** | **Beauty Assistant** | Server-side Gemini AI integration with fallback to curated skincare science knowledge base. |
| **15** | **Settings and Privacy** | Ephemeral image processing consent, data archive export (JSON), and permanent account erasure. |

---

## 5. Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend:** Node.js, Express 4, tsx.
- **AI & Integrations:**
  - `@google/genai` (Server-side Gemini 3.8 Flash model for cosmetic assistance).
  - YouCam / Perfect Corp API service layer with automatic fallback to high-fidelity Demo Simulation mode when API keys are unconfigured.
- **State & Data Store:** Full-stack REST API with seeded in-memory store supporting persistent users, profiles, analyses, routines, journals, and wishlists.

---

## 6. Environment Variables (`.env.example`)

```bash
# Gemini AI API Key (server-side only)
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# YouCam / Perfect Corp Skin Analysis API (Optional)
YOUCAM_API_KEY=""
YOUCAM_API_BASE_URL="https://api.perfectcorp.com/v1.0"

# Application URL
APP_URL="http://localhost:3000"
```

---

## 7. Local Development & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   *Launches full-stack Express server on port 3000 with Vite middleware.*

3. **Compile / Lint Check:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Production Run:**
   ```bash
   npm run start
   ```

---

## 8. Privacy, Security & Non-Medical Notice

- **Ephemeral Photo Storage:** Facial images uploaded for analysis are held exclusively in volatile memory for feature extraction and are never permanently archived without explicit, separate consent.
- **Data Deletion:** The Settings & Privacy screen provides an instant "Permanent Data Purge" control (`POST /api/privacy/delete-request`).
- **Non-Medical Cosmetic Disclaimer:** All skin intelligence scans and product pairings are intended for non-clinical cosmetic routine guidance only. They do not constitute dermatological diagnoses, clinical medical assessments, or medical treatments.
