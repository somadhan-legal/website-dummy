import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import InspiredSection from './components/InspiredSection';
import DeferredSection from './components/DeferredSection';
import { cancelSectionNavigation, scrollToSection } from './lib/sectionNavigation';
import { initializeAnalytics, trackWaitlistOpen, trackWaitlistClose, trackJoinWaitlistClick } from './lib/analytics';

// Load each section only when it is near the viewport or requested by navigation.
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
const CinematicFooter = lazy(() => import('./components/ui/motion-footer').then((module) => ({ default: module.CinematicFooter })));
const WaitlistPage = lazy(() => import('./components/WaitlistPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));

// Minimal loading placeholder
const SectionLoader = () => <div className="py-20 bg-white" />;

const HashScroller: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    cancelSectionNavigation();
    if (!location.hash) return;
    const controller = new AbortController();
    try {
      void scrollToSection(decodeURIComponent(location.hash.slice(1)), 'smooth', controller.signal);
    } catch {
      // Ignore malformed URL fragments rather than interrupting page rendering.
    }
    return () => controller.abort();
  }, [location.pathname, location.hash]);

  return null;
};

const AppContent: React.FC = () => {
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

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar onOpenWaitlist={() => openWaitlist('navbar')} />
      
      <main className="relative z-10">
        <HeroLanding onOpenWaitlist={() => openWaitlist('hero')} />
        <InspiredSection />
        <DeferredSection id="services" mobileHeight={670} desktopHeight={780} className="bg-white">
          <ServicesSection />
        </DeferredSection>
        <DeferredSection id="process" mobileHeight={1150} desktopHeight={880}>
          <HowItWorks onOpenWaitlist={() => openWaitlist('how_it_works_app_store')} />
        </DeferredSection>
        <DeferredSection id="trust" mobileHeight={1000} desktopHeight={620} className="bg-white">
          <TrustSection />
        </DeferredSection>
        <DeferredSection id="faq" mobileHeight={950} desktopHeight={800}>
          <FAQ />
        </DeferredSection>
      </main>

      <div className="relative z-10">
        <DeferredSection id="footer" mobileHeight={1500} desktopHeight={850}>
          <Footer onOpenWaitlist={() => openWaitlist('footer')} />
        </DeferredSection>
      </div>

      <DeferredSection id="cinematic-footer" mobileHeight={823} desktopHeight={900}>
        <CinematicFooter onOpenWaitlist={() => openWaitlist('cinematic_footer')} />
      </DeferredSection>
      
      <Suspense fallback={null}>
        {isWaitlistOpen && <WaitlistPage
          isOpen={isWaitlistOpen} 
          onClose={closeWaitlist}
          source={waitlistSource}
        />}
      </Suspense>

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
      <div className="relative z-10">
        <Suspense fallback={<SectionLoader />}>
          <AboutPage />
        </Suspense>
        <DeferredSection id="footer" mobileHeight={1500} desktopHeight={850}>
          <Footer onOpenWaitlist={() => openWaitlist('about_footer')} />
        </DeferredSection>
      </div>

      <DeferredSection id="cinematic-footer" mobileHeight={823} desktopHeight={900}>
        <CinematicFooter onOpenWaitlist={() => openWaitlist('about_cinematic_footer')} />
      </DeferredSection>

      <Suspense fallback={null}>
        {isWaitlistOpen && <WaitlistPage
          isOpen={isWaitlistOpen}
          onClose={closeWaitlist}
          source={waitlistSource}
        />}
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
