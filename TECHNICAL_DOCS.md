# Somadhan - Technical Documentation

## Project Overview

Somadhan is a digital legal services platform connecting users with verified lawyers in Bangladesh. This documentation covers the technical architecture, design system, and development guidelines.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 with TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS (CDN) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | DM Serif Display (headings), Inter (body), Anek Bangla (Bengali) |

---

## Project Structure

```
somadhan/
├── components/           # React components
│   ├── FAQ.tsx          # FAQ section with categories
│   ├── Footer.tsx       # Footer with CTA and links
│   ├── HeroLanding.tsx  # Hero section with marquee
│   ├── HowItWorks.tsx   # Process/steps section
│   ├── Navbar.tsx       # Navigation bar
│   ├── ServicesSection.tsx  # Legal services grid
│   ├── TrustSection.tsx # Why Somadhan section
│   └── WaitlistPage.tsx # Multi-step waitlist form
├── contexts/
│   └── LanguageContext.tsx  # i18n context (EN/BN)
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── index.html           # HTML template
├── constants.ts         # Static data
├── types.ts             # TypeScript types
└── vite.config.ts       # Vite configuration
```

---

## Design System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Brand Primary | `#0F2E2E` | Buttons, accents, headers |
| Brand 50 | `#E8F0F0` | Light backgrounds |
| Brand 100 | `#D1E1E1` | Hover states |
| Brand 600 | `#0F2E2E` | Primary actions |
| Brand 700 | `#0C2424` | Hover on primary |

### Typography

```css
/* Headings */
font-family: "DM Serif Display", serif;

/* Body */
font-family: "Inter", sans-serif;

/* Bengali Text */
font-family: "Anek Bangla", sans-serif;
```

### Spacing Scale

- Section padding: `py-16 md:py-20` (64px / 80px)
- Container max-width: `max-w-6xl` (1152px)
- Card padding: `p-4 sm:p-5` (16px / 20px)
- Gap between elements: `gap-3` to `gap-8`

### Border Radius

- Buttons: `rounded-full` (pills) or `rounded-xl` (12px)
- Cards: `rounded-2xl` (16px)
- Inputs: `rounded-xl` (12px)

### Shadows

```css
/* Card hover */
shadow-xl shadow-brand-100/50

/* Button hover */
shadow-lg shadow-brand-600/20
```

---

## Components Guide

### Navbar
- Fixed position with scroll-based styling
- Logo changes from white (transparent bg) to colored (white bg)
- Mobile menu with slide-down animation
- Language toggle (EN/BN)

### HeroLanding
- Parallax background image
- CSS mask-based marquee fade (not gradient overlays)
- Smooth infinite loop animation
- Single CTA button (Join Waitlist)

### WaitlistPage
- 5-step form with validation
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Bangladesh phone regex: `/^(\+?880|0)?1[3-9]\d{8}$/`
- Steps: Contact → Profession → Services → Urgency → Feedback (optional)

### FAQ
- 8 categories with horizontal scroll on mobile
- Accordion with expand/collapse animation
- Active state uses brand-600 background
- Contact email CTA at bottom

### Footer
- CTA banner section
- App download preview (grayed out badges)
- Coming Soon modal for unavailable links
- Social links: X (Twitter), Facebook, LinkedIn

---

## Internationalization (i18n)

The app supports English and Bengali via `LanguageContext`.

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const Component = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return <h1>{t('hero.headline')}</h1>;
};
```

Add new translations in `contexts/LanguageContext.tsx`:

```tsx
const translations = {
  en: {
    'key.name': 'English text',
  },
  bn: {
    'key.name': 'বাংলা টেক্সট',
  }
};
```

---

## Animations

Using Framer Motion for:
- Page transitions
- Scroll-triggered animations (`whileInView`)
- Accordion expand/collapse
- Button hover effects
- Modal overlays

Example pattern:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

The project is configured for Netlify deployment via `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Mobile Responsiveness

All components are mobile-first with responsive breakpoints:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

Key mobile adaptations:
- Navbar: Hamburger menu
- Services: Expandable accordion cards
- FAQ: Horizontal scrolling category tabs
- Process: Vertical stack with centered visuals

---

## Performance Considerations

1. **Images**: Use WebP format, lazy loading
2. **Fonts**: Preconnect to Google Fonts
3. **Animations**: Use `will-change` sparingly
4. **Bundle**: Vite handles code splitting automatically

---

## Contact

- Email: info@somadhan.com
- Website: somadhan.com (coming soon)
