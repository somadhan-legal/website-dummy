import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Bell } from 'lucide-react';
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
      {/* CTA Card Section - Floating on brand background */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-600 rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-3">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Ready to get started?'}
              </h2>
              <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-8">
                {language === 'bn' 
                  ? 'ওয়েটলিস্টে যোগ দিন এবং প্রথম আপডেট পান।' 
                  : 'Join our waitlist and be among the first to experience legal support, simplified.'}
              </p>
              <button
                onClick={onOpenWaitlist}
                className="bg-white text-brand-600 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
              >
                {t('hero.joinWaitlist')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4">
            <img src="/Logo.svg" alt="Somadhan" className="h-7 mb-5" />
            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-[260px]">
              {t('footer.tagline')}
            </p>
            <a 
              href="mailto:somadhan.legal@gmail.com"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 text-sm transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span className="group-hover:underline">somadhan.legal@gmail.com</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{language === 'bn' ? 'লিংক' : 'Links'}</h4>
            <ul className="space-y-3">
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

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              <li className="relative">
                <button
                  onClick={() => handleComingSoonClick('about')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors text-left"
                >
                  {t('footer.about')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'about' && (
                    <motion.span
                      initial={{ opacity: 0, x: -5, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.9 }}
                      className="absolute left-full ml-2 top-0 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-md whitespace-nowrap"
                    >
                      Coming Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
              <li className="relative">
                <button
                  onClick={() => handleComingSoonClick('careers')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors text-left"
                >
                  {t('footer.careers')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'careers' && (
                    <motion.span
                      initial={{ opacity: 0, x: -5, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.9 }}
                      className="absolute left-full ml-2 top-0 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-md whitespace-nowrap"
                    >
                      Coming Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
              <li>
                <a href="mailto:somadhan.legal@gmail.com" className="text-slate-500 hover:text-brand-600 text-sm transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
              <li className="relative">
                <button
                  onClick={() => handleComingSoonClick('blog')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors text-left"
                >
                  {t('footer.blog')}
                </button>
                <AnimatePresence>
                  {showComingSoon === 'blog' && (
                    <motion.span
                      initial={{ opacity: 0, x: -5, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.9 }}
                      className="absolute left-full ml-2 top-0 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-md whitespace-nowrap"
                    >
                      Coming Soon
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* Get the App */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="font-semibold text-sm text-slate-900 mb-4">{t('footer.getApp')}</h4>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t('footer.appComingSoon')}</p>
                  <p className="text-slate-400 text-xs mt-0.5">iOS & Android</p>
                </div>
              </div>
              <button
                onClick={onOpenWaitlist}
                className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                {t('footer.notifyMe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            {t('footer.copyright')}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a href="#" className="w-9 h-9 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
