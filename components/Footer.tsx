import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Bell, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenWaitlist: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenWaitlist }) => {
  const { t, language } = useLanguage();
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleComingSoonClick = (id: string) => {
    setShowComingSoon(id);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  return (
    <footer className="bg-slate-50 relative">
      {/* CTA Section - Compact & Clean */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-brand-600 rounded-2xl px-6 sm:px-10 py-8 sm:py-10 relative overflow-hidden">
          {/* Subtle decorative circle */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-xl sm:text-2xl text-white mb-1.5">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Ready to get started?'}
              </h2>
              <p className="text-white/50 text-sm max-w-sm">
                {language === 'bn' 
                  ? 'ওয়েটলিস্টে যোগ দিন এবং প্রথম আপডেট পান।' 
                  : 'Join our waitlist for early access.'}
              </p>
            </div>
            <button
              onClick={onOpenWaitlist}
              className="bg-white text-brand-600 px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-black/10 flex-shrink-0"
            >
              {t('hero.joinWaitlist')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4">
            <img src="/Logo.svg" alt="Somadhan" className="h-7 mb-4" />
            <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-[260px]">
              {t('footer.tagline')}
            </p>
            <a 
              href="mailto:info@somadhan.com"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 text-sm transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span className="group-hover:underline">info@somadhan.com</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{language === 'bn' ? 'লিংক' : 'Links'}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-slate-500 hover:text-brand-600 text-sm transition-colors">
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-slate-500 hover:text-brand-600 text-sm transition-colors">
                  {t('nav.process')}
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-slate-500 hover:text-brand-600 text-sm transition-colors">
                  {t('nav.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company - With inline Coming Soon */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <button
                  onClick={() => handleComingSoonClick('about')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  {t('footer.about')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'about' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-1.5 py-0.5 bg-brand-600 text-white text-[9px] font-medium rounded whitespace-nowrap"
                    >
                      Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
              <li className="flex items-center gap-2">
                <button
                  onClick={() => handleComingSoonClick('careers')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  {t('footer.careers')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'careers' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-1.5 py-0.5 bg-brand-600 text-white text-[9px] font-medium rounded whitespace-nowrap"
                    >
                      Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
              <li>
                <a href="mailto:info@somadhan.com" className="text-slate-500 hover:text-brand-600 text-sm transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <button
                  onClick={() => handleComingSoonClick('blog')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  {t('footer.blog')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'blog' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-1.5 py-0.5 bg-brand-600 text-white text-[9px] font-medium rounded whitespace-nowrap"
                    >
                      Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* Get the App - Clean Card */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{t('footer.getApp')}</h4>
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t('footer.appComingSoon')}</p>
                  <p className="text-slate-400 text-xs">iOS & Android</p>
                </div>
              </div>
              <button
                onClick={onOpenWaitlist}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                {t('footer.notifyMe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            {t('footer.copyright')}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-1.5">
            <a href="#" className="w-8 h-8 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
