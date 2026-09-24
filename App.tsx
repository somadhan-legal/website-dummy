import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import InspiredSection from './components/InspiredSection';
import { initializeAnalytics, trackWaitlistOpen, trackWaitlistClose, trackBackToTop, trackJoinWaitlistClick } from './lib/analytics';

// Lazy load below-fold components to reduce initial bundle
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
const WaitlistPage = lazy(() => import('./components/WaitlistPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));

// Minimal loading placeholder
const SectionLoader = () => <div className="py-20 bg-white" />;

const HashScroller: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = decodeURIComponent(location.hash.slice(1));
    let attempts = 0;
    let timeoutId: number | undefined;

    const scrollToHash = () => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        timeoutId = window.setTimeout(scrollToHash, 100);
      }
    };

    timeoutId = window.setTimeout(scrollToHash, 0);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  return null;
};

const AppContent: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState<string>('unknown');

  const openWaitlist = (source: string = 'unknown') => {
    setWaitlistSource(source);
    setIsWaitlistOpen(true);
    trackWaitlistOpen(source);
    trackJoinWaitlistClick(source);
  };
  
  const closeWaitlist = (lastStep: number = 1, completed: boolean = false) => {
    setIsWaitlistOpen(false);
    trackWaitlistClose(lastStep, completed);
  };

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    trackBackToTop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar onOpenWaitlist={() => openWaitlist('navbar')} />
      
      <main>
        <HeroLanding onOpenWaitlist={() => openWaitlist('hero')} />
        <InspiredSection />
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
          <HowItWorks />
          <TrustSection />
          <FAQ />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer onOpenWaitlist={() => openWaitlist('footer')} />
      </Suspense>
      
      <Suspense fallback={null}>
        <WaitlistPage 
          isOpen={isWaitlistOpen} 
          onClose={closeWaitlist}
          source={waitlistSource}
        />
      </Suspense>

      {/* Back to Top Button - CSS only, no framer-motion */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-[fadeIn_0.2s_ease-out]"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <SpeedInsights />
    </div>
  );
};

const AboutRoute: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState<string>('unknown');

  const openWaitlist = (source: string = 'unknown') => {
    setWaitlistSource(source);
    setIsWaitlistOpen(true);
    trackWaitlistOpen(source);
    trackJoinWaitlistClick(source);
  };

  const closeWaitlist = (lastStep: number = 1, completed: boolean = false) => {
    setIsWaitlistOpen(false);
    trackWaitlistClose(lastStep, completed);
  };

  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Suspense fallback={<SectionLoader />}>
        <AboutPage />
      </Suspense>

      <Suspense fallback={null}>
        <Footer onOpenWaitlist={() => openWaitlist('about_footer')} />
      </Suspense>

      <Suspense fallback={null}>
        <WaitlistPage
          isOpen={isWaitlistOpen}
          onClose={closeWaitlist}
          source={waitlistSource}
        />
      </Suspense>

      <SpeedInsights />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashScroller />
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/terms" element={
          <Suspense fallback={<SectionLoader />}>
            <TermsPage />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<SectionLoader />}>
            <PrivacyPolicyPage />
          </Suspense>
        } />
      </Routes>
    </LanguageProvider>
  );
};

export default App;
