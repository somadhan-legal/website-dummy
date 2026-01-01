import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenWaitlist: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenWaitlist }) => {
  const { t, language } = useLanguage();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
  };

  return (
    <>
      <footer className="bg-brand-600 text-white">
        {/* CTA Banner */}
        <div className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Ready to get started?'}
              </h2>
              <p className="text-white/60 mb-8 text-sm sm:text-base">
                {language === 'bn' 
                  ? 'ওয়েটলিস্টে যোগ দিন এবং প্রথম আপডেট পান।' 
                  : 'Join our waitlist and be the first to know when we launch.'}
              </p>
              <button
                onClick={onOpenWaitlist}
                className="bg-white text-brand-600 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                {t('hero.joinWaitlist')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <img src="/Logo.svg" alt="Somadhan" className="h-7 mb-4 brightness-0 invert" />
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                {t('footer.tagline')}
              </p>
              
              {/* Contact Email */}
              <a 
                href="mailto:somadhan.legal@gmail.com"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="group-hover:underline">somadhan.legal@gmail.com</span>
              </a>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">{language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('nav.services')}
                  </a>
                </li>
                <li>
                  <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('nav.process')}
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('nav.faq')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm mb-4">{t('footer.company')}</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" onClick={handleComingSoon} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('footer.about')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleComingSoon} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('footer.careers')}
                  </a>
                </li>
                <li>
                  <a href="mailto:somadhan.legal@gmail.com" className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('footer.contact')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleComingSoon} className="text-white/50 hover:text-white text-sm transition-colors">
                    {t('footer.blog')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Get the App */}
            <div className="md:col-span-4">
              <h4 className="font-semibold text-sm mb-4">{t('footer.getApp')}</h4>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium text-sm">{t('footer.appComingSoon')}</p>
                    <p className="text-white/40 text-xs">{language === 'bn' ? 'iOS ও Android' : 'iOS & Android'}</p>
                  </div>
                </div>
                
                {/* App Store Badges (Greyed out) */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-white/5 rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 opacity-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span className="text-xs font-medium">App Store</span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 opacity-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <span className="text-xs font-medium">Play Store</span>
                  </div>
                </div>
                
                <button
                  onClick={onOpenWaitlist}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('footer.notifyMe')}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              {t('footer.copyright')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-serif text-xl text-slate-900 mb-2">{t('footer.comingSoon')}</h3>
              <p className="text-slate-500 text-sm mb-6">{t('footer.comingSoonText')}</p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
