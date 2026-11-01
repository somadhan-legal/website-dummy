import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { initializeAnalytics } from '../lib/analytics';
import Navbar from './Navbar';
import FAQ from './FAQ';

const FAQPage = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  const bn = language === 'bn';

  useEffect(() => {
    if (requestedLanguage === 'en' || requestedLanguage === 'bn') setLanguage(requestedLanguage);
  }, [requestedLanguage, setLanguage]);

  useEffect(() => {
    initializeAnalytics();
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({
    title: bn ? 'সাধারণ জিজ্ঞাসা | সমাধান' : 'Frequently Asked Questions | Somadhan',
    description: bn
      ? 'সমাধান অ্যাপ, আইনি পরামর্শ, বুকিং, পেমেন্ট ও সহায়তা সম্পর্কে সাধারণ প্রশ্নের উত্তর জানুন।'
      : 'Find answers about the Somadhan app, legal consultations, bookings, payments, and support.',
    canonical: 'https://somadhan.com/faq',
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar solid />
      <main className="pt-24 sm:pt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {bn ? 'হোমে ফিরুন' : 'Back to home'}
          </Link>
        </div>
        <FAQ standalone />
      </main>
      <SpeedInsights />
    </div>
  );
};

export default FAQPage;
