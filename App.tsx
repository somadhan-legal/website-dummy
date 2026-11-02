import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import InspiredSection from './components/InspiredSection';
import DeferredSection from './components/DeferredSection';
import { cancelSectionNavigation, scrollToSection } from './lib/sectionNavigation';
import { initializeAnalytics } from './lib/analytics';
import { useDocumentMeta } from './lib/useDocumentMeta';

// Load each section only when it is near the viewport or requested by navigation.
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
const CinematicFooter = lazy(() => import('./components/ui/motion-footer').then((module) => ({ default: module.CinematicFooter })));
const TermsPage = lazy(() => import('./components/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const FAQPage = lazy(() => import('./components/FAQPage'));

// Minimal loading placeholder
const SectionLoader = () => <div className="py-20 bg-white" />;

const HashScroller: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    cancelSectionNavigation();
    if (!location.hash || ['/faq', '/terms', '/privacy'].includes(location.pathname)) return;
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
  useDocumentMeta({
    title: 'Somadhan | AI-Powered Legal Support Platform in Bangladesh',
    description: 'Somadhan connects people in Bangladesh with verified lawyers for legal consultations, document support, bookings, calls, and case-related legal services.',
    canonical: 'https://somadhan.com/',
  });
  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      
      <main className="relative z-10">
        <HeroLanding />
        <InspiredSection />
        <DeferredSection id="services" mobileHeight={670} desktopHeight={780} className="bg-white">
          <ServicesSection />
        </DeferredSection>
        <DeferredSection id="process" mobileHeight={1150} desktopHeight={880}>
          <HowItWorks />
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
          <Footer />
        </DeferredSection>
      </div>

      <DeferredSection id="cinematic-footer" mobileHeight={823} desktopHeight={900}>
        <CinematicFooter />
      </DeferredSection>

      <SpeedInsights />
    </div>
  );
};

const AboutRoute: React.FC = () => {
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
          <Footer />
        </DeferredSection>
      </div>

      <DeferredSection id="cinematic-footer" mobileHeight={823} desktopHeight={900}>
        <CinematicFooter />
      </DeferredSection>

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
        <Route path="/faq" element={
          <Suspense fallback={<SectionLoader />}>
            <FAQPage />
          </Suspense>
        } />
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
