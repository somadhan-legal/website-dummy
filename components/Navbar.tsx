import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenWaitlist }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="flex items-center">
              <img 
                src="/Logo.svg" 
                alt="Somadhan" 
                className={`h-6 sm:h-7 transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isScrolled
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {language === 'en' ? 'বাং' : 'EN'}
              </button>

              {/* CTA Button */}
              <button
                onClick={onOpenWaitlist}
                className={`hidden sm:block px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-white text-brand-600 hover:bg-white/90'
                }`}
              >
                {t('hero.joinWaitlist')}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-100 shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl font-medium"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'বাংলা' : 'English'}
                </button>
                <button
                  onClick={() => { onOpenWaitlist(); setIsMobileMenuOpen(false); }}
                  className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-xl font-semibold"
                >
                  {t('hero.joinWaitlist')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
