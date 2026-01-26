# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Somadhan is a legal services platform landing page for Bangladesh. It's a React 19 + TypeScript single-page application with bilingual support (English/Bengali).

## Development Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server on port 3000
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

### Entry Points
- `index.html` - HTML template with SEO, analytics, and font loading
- `index.tsx` - React entry point, renders `<App />` into `#root`
- `App.tsx` - Main component, wraps everything in `LanguageProvider`

### Component Structure
All components are in `/components/`. The page renders these sections in order:
1. `Navbar` - Fixed nav with scroll-based styling and language toggle
2. `HeroLanding` - Hero with parallax background and marquee
3. `ServicesSection` - Legal services grid (expandable on mobile)
4. `HowItWorks` - Process steps
5. `TrustSection` - Trust badges/features
6. `FAQ` - Categorized accordion FAQ
7. `Footer` - CTA banner, social links, "Coming Soon" modal
8. `WaitlistPage` - Multi-step modal form (5 steps)

### Path Aliases
The `@/` alias maps to the project root (configured in `tsconfig.json` and `vite.config.ts`):
```tsx
import { useLanguage } from '@/contexts/LanguageContext';
```

### Internationalization (i18n)
All user-facing text uses the translation system in `contexts/LanguageContext.tsx`:
```tsx
const { language, setLanguage, t } = useLanguage();
return <h1>{t('hero.headline')}</h1>;
```
To add translations, edit the `translations` object in `LanguageContext.tsx` with both `en` and `bn` keys.

### Backend Integration
- **Supabase** (`lib/supabase.ts`): Waitlist form submissions via REST API
- **Google Analytics** (`lib/analytics.ts`): Event tracking with `trackEvent()` helper functions

## Styling

### Tailwind CSS v4
This project uses **Tailwind v4** with the new CSS-first configuration in `src/index.css`. Custom theme values use `@theme {}` blocks, not `tailwind.config.js`.

### Brand Colors
Primary brand color is `brand-600` (`#0F2E2E`). Use `brand-50` through `brand-900` for the full palette.

### Fonts
- **Headings**: `font-serif` (DM Serif Display)
- **Body**: `font-sans` (Inter)
- **Bengali**: `font-bengali` (Anek Bangla) - auto-applied when `lang="bn"`

### Animation
Uses Framer Motion. Common pattern:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

## Key Patterns

### Waitlist Modal
The waitlist is controlled via `openWaitlist(source)` and `closeWaitlist()` in `App.tsx`. The `source` parameter tracks where users clicked (hero, navbar, footer).

### Mobile Responsiveness
Components adapt at standard Tailwind breakpoints (`sm:`, `md:`, `lg:`). Mobile-specific behaviors:
- Navbar: hamburger menu
- ServicesSection: accordion cards
- FAQ: horizontal scrolling category tabs

## Deployment
Configured for Netlify. Build output is `dist/`. All routes redirect to `/index.html` for SPA routing.

## TypeScript Types
Shared types are in `types.ts` (Lawyer, IssueCategory, FaqItem, ScrollyState).
