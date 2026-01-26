import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import { initializeAnalytics, trackWaitlistOpen, trackWaitlistClose, trackBackToTop, trackJoinWaitlistClick } from './lib/analytics';

// Lazy load below-fold components to reduce initial bundle
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
const WaitlistPage = lazy(() => import('./components/WaitlistPage'));

// Minimal loading placeholder
const SectionLoader = () => <div className="py-20 bg-white" />;

const AppContent: React.FC = () => {
  const { language } = useLanguage();
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

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const scrollToTop = () => {
    trackBackToTop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar onOpenWaitlist={() => openWaitlist('navbar')} />
      
      <main>
        <HeroLanding onOpenWaitlist={() => openWaitlist('hero')} />
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
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
