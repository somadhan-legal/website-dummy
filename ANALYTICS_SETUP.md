# Analytics Setup Guide for Somadhan Website

This guide covers how to set up comprehensive analytics for the Somadhan website using **free** tools.

---

## Option 1: Google Analytics 4 (GA4) - Recommended

Google Analytics 4 is the most comprehensive free analytics solution.

### Step 1: Create a Google Analytics Account

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Enter account name: `Somadhan`
4. Configure data sharing settings (your preference)
5. Click "Next"

### Step 2: Create a Property

1. Property name: `Somadhan Website`
2. Select your timezone: `(GMT+06:00) Dhaka`
3. Currency: `Bangladeshi Taka (BDT)`
4. Click "Next"
5. Select business size and objectives
6. Click "Create"

### Step 3: Set Up Data Stream

1. Choose platform: **Web**
2. Enter website URL: `https://your-domain.com`
3. Stream name: `Somadhan Main Website`
4. Click "Create stream"
5. **Copy the Measurement ID** (starts with `G-XXXXXXXXXX`)

### Step 4: Add GA4 to Your Website

Add this code to your `index.html` file, right before the closing `</head>` tag:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID.**

### Step 5: Verify Installation

1. Go back to Google Analytics
2. Navigate to "Reports" > "Realtime"
3. Open your website in a new tab
4. You should see 1 active user in the realtime report

---

## Option 2: Plausible Analytics (Privacy-Focused Alternative)

Plausible is a lightweight, privacy-friendly alternative. They offer a **free trial** and affordable pricing.

### Setup

1. Go to [plausible.io](https://plausible.io)
2. Sign up for an account
3. Add your domain
4. Add script to `index.html`:

```html
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
```

---

## Option 3: Umami (Self-Hosted, Completely Free)

Umami is open-source and can be self-hosted for free.

### Quick Deploy to Vercel/Railway

1. Go to [umami.is](https://umami.is)
2. Click "Get Started"
3. Deploy to Vercel or Railway (free tier available)
4. Add tracking script to your website

---

## Recommended Events to Track

### For the Waitlist Form

Add custom events to track user interactions. Create a file `lib/analytics.ts`:

```typescript
// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Waitlist Events
export const trackWaitlistOpen = () => {
  trackEvent('waitlist_opened');
};

export const trackWaitlistStepComplete = (step: number) => {
  trackEvent('waitlist_step_complete', { step_number: step });
};

export const trackWaitlistSubmit = (profession: string) => {
  trackEvent('waitlist_submitted', { profession });
};

export const trackWaitlistClose = (step: number) => {
  trackEvent('waitlist_closed', { last_step: step });
};

// Navigation Events
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_viewed', { section: sectionName });
};

export const trackContactClick = () => {
  trackEvent('contact_clicked');
};

export const trackLanguageChange = (language: string) => {
  trackEvent('language_changed', { language });
};
```

### Using Events in Components

In `WaitlistPage.tsx`, import and use these events:

```typescript
import { trackWaitlistOpen, trackWaitlistStepComplete, trackWaitlistSubmit } from '../lib/analytics';

// When form opens
useEffect(() => {
  if (isOpen) {
    trackWaitlistOpen();
  }
}, [isOpen]);

// When step changes
const handleNext = () => {
  if (validateStep()) {
    trackWaitlistStepComplete(step);
    setStep(s => s + 1);
  }
};

// On submit
const handleSubmit = async () => {
  // ... existing code
  if (result.success) {
    trackWaitlistSubmit(formData.profession);
    setIsSuccess(true);
  }
};
```

---

## GA4 Dashboard Setup

### Create Custom Reports

1. Go to GA4 > "Explore"
2. Create a "Funnel exploration" for waitlist:
   - Step 1: `waitlist_opened`
   - Step 2-5: `waitlist_step_complete` (filter by step_number)
   - Final: `waitlist_submitted`

### Key Metrics to Monitor

| Metric | What It Tells You |
|--------|-------------------|
| Users | Total visitors |
| Sessions | Visit count |
| Engagement rate | Active users percentage |
| Avg engagement time | Time spent on site |
| Waitlist conversion | Form completion rate |

---

## Quick Start Checklist

- [ ] Create Google Analytics account
- [ ] Create GA4 property
- [ ] Copy Measurement ID
- [ ] Add GA4 script to `index.html`
- [ ] Verify installation via Realtime report
- [ ] (Optional) Add custom event tracking
- [ ] (Optional) Create conversion goals

---

## I Can Help You With

1. **Adding the GA4 script** - Just provide me your Measurement ID and I'll add it to `index.html`
2. **Setting up custom events** - I can create the analytics tracking library
3. **Creating conversion funnels** - Guide you through GA4 exploration setup

---

## Supabase Analytics (Bonus)

Your waitlist data in Supabase can also provide insights:

### Query Examples

**Total signups:**
```sql
SELECT COUNT(*) FROM waitlist_submissions;
```

**Signups by profession:**
```sql
SELECT profession, COUNT(*) 
FROM waitlist_submissions 
GROUP BY profession 
ORDER BY COUNT(*) DESC;
```

**Most popular services:**
```sql
SELECT unnest(services) as service, COUNT(*) 
FROM waitlist_submissions 
GROUP BY service 
ORDER BY COUNT(*) DESC;
```

**Daily signups:**
```sql
SELECT DATE(created_at) as date, COUNT(*) 
FROM waitlist_submissions 
GROUP BY DATE(created_at) 
ORDER BY date DESC;
```

You can run these queries in the Supabase dashboard under "SQL Editor".

---

## Contact

For help setting up analytics, contact: somadhan.legal@gmail.com
