# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Somadhan is an AI-powered legal services platform for Bangladesh. This is the marketing/waitlist website built with React 19, TypeScript, Vite, and Tailwind CSS (via CDN).

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

## Architecture

### Component Structure

- `App.tsx` - Main app with routing state (waitlist modal, back-to-top button)
- `components/` - All page sections as standalone components
  - `HeroLanding.tsx` - Hero with parallax and marquee animation
  - `ServicesSection.tsx` - Legal services grid with accordion (mobile)
  - `HowItWorks.tsx` - Multi-step process section
  - `TrustSection.tsx` - Trust badges/features
  - `FAQ.tsx` - Categorized FAQ with accordion
  - `Footer.tsx` - Footer with CTA and social links
  - `WaitlistPage.tsx` - 5-step modal form with validation
  - `Navbar.tsx` - Fixed nav with scroll-based styling and mobile menu

### Context & State

- `contexts/LanguageContext.tsx` - i18n for English/Bengali. Use `useLanguage()` hook to access `language`, `setLanguage`, and `t(key)` for translations.
- Waitlist modal state is lifted to `App.tsx` and passed via props.

### Backend Integration

- **Supabase** (`lib/supabase.ts`) - Waitlist form submissions to `waitlist_submissions` table
- **Google Analytics** (`lib/analytics.ts`) - Event tracking throughout the app; uses `window.gtag`

### Key Files

- `types.ts` - TypeScript interfaces (`Lawyer`, `FaqItem`, etc.)
- `constants.ts` - Static data (FAQs)
- `netlify.toml` - Deployment config with SPA redirects and security headers

## Conventions

### Styling
- Tailwind CSS via CDN (loaded in `index.html`)
- Brand colors: `brand-600` (#0F2E2E) for primary, `brand-50/100` for backgrounds
- Fonts: DM Serif Display (headings), Inter (body), Anek Bangla (Bengali)
- Mobile-first responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints

### Animations
All animations use Framer Motion. Standard pattern:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

### i18n
Add translations to `contexts/LanguageContext.tsx`:
```tsx
const translations = {
  en: { 'key.name': 'English text' },
  bn: { 'key.name': 'বাংলা টেক্সট' }
};
```
Use in components: `const { t } = useLanguage(); <span>{t('key.name')}</span>`

### Validation (WaitlistPage)
- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Bangladesh phone: `/^(\+?880|0)?1[3-9]\d{8}$/`

## Deployment

Hosted in-house. Push to `main` for deployment.
- Build: `npm run build`
- Publish: `dist/`
