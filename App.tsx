import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import HowItWorks from './components/HowItWorks';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import WaitlistPage from './components/WaitlistPage';
import { initializeAnalytics, trackWaitlistOpen, trackWaitlistClose, trackBackToTop, trackJoinWaitlistClick } from './lib/analytics';

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
    <div 
      lang={language} 
      className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900"
    >
      <Navbar onOpenWaitlist={() => openWaitlist('navbar')} />
      
      <main>
        <HeroLanding onOpenWaitlist={() => openWaitlist('hero')} />
        <ServicesSection />
        <HowItWorks />
        <TrustSection />
        <FAQ />
      </main>

      <Footer onOpenWaitlist={() => openWaitlist('footer')} />
      
      <WaitlistPage 
        isOpen={isWaitlistOpen} 
        onClose={closeWaitlist}
        source={waitlistSource}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
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
