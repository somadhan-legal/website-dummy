import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Smartphone, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenWaitlist: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenWaitlist }) => {
  const { t, language } = useLanguage();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const ComingSoonBadge = () => (
    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/10 text-white/50 rounded">
      Soon
    </span>
  );

  return (
    <footer className="bg-brand-600 text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-3">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Ready to get started?'}
              </h2>
              <p className="text-white/50 text-sm sm:text-base max-w-md">
                {language === 'bn' 
                  ? 'ওয়েটলিস্টে যোগ দিন এবং প্রথম আপডেট পান।' 
                  : 'Join our waitlist and be among the first to experience legal support, simplified.'}
              </p>
            </div>
            <button
              onClick={onOpenWaitlist}
              className="bg-white text-brand-600 px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
            >
              {t('hero.joinWaitlist')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src="/Logo.svg" alt="Somadhan" className="h-7 mb-5 brightness-0 invert" />
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-[200px]">
              {t('footer.tagline')}
            </p>
            <a 
              href="mailto:somadhan.legal@gmail.com"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span className="group-hover:underline">somadhan.legal@gmail.com</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">{language === 'bn' ? 'দ্রুত লিংক' : 'Navigate'}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
                  {t('nav.process')}
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
                  {t('nav.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">{t('footer.company')}</h4>
            <ul className="space-y-2.5">
              <li
                onMouseEnter={() => setHoveredLink('about')}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative"
              >
                <span className="text-white/40 text-sm cursor-default flex items-center">
                  {t('footer.about')}
                  <ComingSoonBadge />
                </span>
              </li>
              <li
                onMouseEnter={() => setHoveredLink('careers')}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative"
              >
                <span className="text-white/40 text-sm cursor-default flex items-center">
                  {t('footer.careers')}
                  <ComingSoonBadge />
                </span>
              </li>
              <li>
                <a href="mailto:somadhan.legal@gmail.com" className="text-white/40 hover:text-white text-sm transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
              <li
                onMouseEnter={() => setHoveredLink('blog')}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative"
              >
                <span className="text-white/40 text-sm cursor-default flex items-center">
                  {t('footer.blog')}
                  <ComingSoonBadge />
                </span>
              </li>
            </ul>
          </div>

          {/* Get the App */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">{t('footer.getApp')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Smartphone className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white/70 text-xs font-medium">{t('footer.appComingSoon')}</p>
                  <p className="text-white/30 text-[10px]">iOS & Android</p>
                </div>
              </div>
              <button
                onClick={onOpenWaitlist}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                {t('footer.notifyMe')}
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {t('footer.copyright')}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
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
