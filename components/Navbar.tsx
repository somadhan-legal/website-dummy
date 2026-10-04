import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackNavClick, trackMobileMenuOpen, trackMobileMenuClose, trackLogoClick, trackLanguageChange, trackCTAClick } from '../lib/analytics';
import { companyInfo } from '../lib/companyInfo';
import { getOptimizedImage } from '../lib/optimizedAssets';
import { cancelSectionNavigation, scrollToSection as navigateToSection } from '../lib/sectionNavigation';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenWaitlist }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t('nav.services'), href: '#services', id: 'services', type: 'section' as const },
    { label: t('nav.tools'), href: companyInfo.somadhanSignUrl, id: 'tools', type: 'tools' as const },
    { label: t('nav.about'), href: '/about', id: 'about', type: 'page' as const },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!isMobileMenuOpen && toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsToolsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string, linkId: string) => {
    e.preventDefault();
    trackNavClick(linkId, href);
    void navigateToSection(href.replace('#', ''));
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    cancelSectionNavigation();
    trackLogoClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    const fromLang = language;
    const toLang = language === 'en' ? 'bn' : 'en';
    trackLanguageChange(fromLang, toLang);
    setLanguage(toLang);
  };

  const handleMobileMenuToggle = () => {
    if (isMobileMenuOpen) {
      trackMobileMenuClose();
      setIsToolsOpen(false);
    } else {
      trackMobileMenuOpen();
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleGetStartedClick = (location: string) => {
    trackCTAClick('get_started', location);
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  };

  const handlePageNavClick = (linkId: string, href: string) => {
    cancelSectionNavigation();
    trackNavClick(linkId, href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        data-nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="#hero" onClick={handleLogoClick} className="flex items-center">
              <img
                {...getOptimizedImage(language === 'bn' ? (isScrolled ? '/Somadhan BLT.svg' : '/Somadhan BLW.svg') : (isScrolled ? '/Somadhan ELT.svg' : '/Somadhan ELW.svg'))}
                sizes="156px"
                decoding="async"
                alt="Somadhan"
                className="h-5 sm:h-6 w-auto transition-all duration-300"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.type === 'tools' ? (
                  <div key={link.id} ref={toolsMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsToolsOpen((open) => !open)}
                      aria-expanded={isToolsOpen}
                      aria-haspopup="menu"
                      className={`inline-flex min-h-12 items-center gap-1 leading-none text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
                        } ${language === 'bn' ? 'tracking-wide' : ''}`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
                    </button>
                      {isToolsOpen && (
                        <div
                          role="menu"
                          className="nav-menu-enter absolute top-full left-1/2 mt-2.5 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white shadow-[0_8px_24px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5"
                        >
                          <a
                            href={companyInfo.somadhanSignUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            role="menuitem"
                            onClick={() => {
                              trackNavClick('somadhan_sign', companyInfo.somadhanSignUrl);
                              setIsToolsOpen(false);
                            }}
                            className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            <span>Somadhan Sign</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                  </div>
                ) : link.type === 'section' ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href, link.id)}
                    className={`inline-flex min-h-12 items-center leading-none text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
                      } ${language === 'bn' ? 'tracking-wide' : ''}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => handlePageNavClick(link.id, link.href)}
                    className={`inline-flex min-h-12 items-center leading-none text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
                      } ${language === 'bn' ? 'tracking-wide' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`hidden sm:flex h-12 items-center gap-1.5 px-3 rounded-full text-xs font-medium transition-all ${isScrolled
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {language === 'en' ? 'বাং' : 'EN'}
              </button>

              {/* Primary action */}
              <a
                href={companyInfo.somadhanSignUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleGetStartedClick('navbar')}
                className={`hidden sm:flex h-12 items-center px-5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${isScrolled
                  ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-[0_0_22px_rgba(5,80,86,0.24)]'
                  : 'bg-white text-brand-600 shadow-[0_0_18px_rgba(93,184,186,0.16)] hover:bg-white/90 hover:shadow-[0_0_26px_rgba(93,184,186,0.3)]'
                  }`}
              >
                {t('nav.getStarted')}
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                  }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Full-Screen Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => { trackMobileMenuClose(); setIsMobileMenuOpen(false); setIsToolsOpen(false); }}
              className="nav-backdrop-enter fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel - Slide from right */}
            <div
              className="nav-drawer-enter fixed top-0 right-0 bottom-0 w-[280px] z-50 bg-white shadow-2xl md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <img
                  {...getOptimizedImage(language === 'bn' ? '/Somadhan BLT.svg' : '/Somadhan ELT.svg')}
                  sizes="156px"
                  decoding="async"
                  alt="Somadhan"
                  className="h-5 sm:h-5 w-auto"
                />
                <button
                  onClick={() => { trackMobileMenuClose(); setIsMobileMenuOpen(false); setIsToolsOpen(false); }}
                  aria-label={language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}
                  className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                  {language === 'bn' ? 'নেভিগেশন' : 'Navigate'}
                </p>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    link.type === 'tools' ? (
                      <div key={link.id}>
                        <button
                          type="button"
                          onClick={() => setIsToolsOpen((open) => !open)}
                          aria-expanded={isToolsOpen}
                          className={`flex w-full items-center justify-between px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors ${language === 'bn' ? 'leading-relaxed' : ''}`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
                        </button>
                          {isToolsOpen && (
                            <div className="nav-menu-enter overflow-hidden">
                              <a
                                href={companyInfo.somadhanSignUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  trackNavClick('somadhan_sign', companyInfo.somadhanSignUrl);
                                  setIsMobileMenuOpen(false);
                                  setIsToolsOpen(false);
                                }}
                                className="mx-3 mb-1 flex items-center justify-between rounded-md py-2.5 pl-4 pr-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                              >
                                <span>Somadhan Sign</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                              </a>
                            </div>
                          )}
                      </div>
                    ) : link.type === 'section' ? (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href, link.id)}
                        className={`flex items-center justify-between px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors ${language === 'bn' ? 'leading-relaxed' : ''}`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => handlePageNavClick(link.id, link.href)}
                        className={`flex items-center justify-between px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors ${language === 'bn' ? 'leading-relaxed' : ''}`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-3 bg-white text-slate-600 rounded-xl font-medium transition-colors hover:bg-slate-100 border border-slate-100"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'বাংলা' : 'English'}
                </button>

                {/* Primary action */}
                <a
                  href={companyInfo.somadhanSignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleGetStartedClick('mobile_menu')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-brand-600 text-white rounded-xl font-semibold transition-colors hover:bg-brand-700"
                >
                  {t('nav.getStarted')}
                </a>
              </div>
            </div>
          </>
        )}
    </>
  );
};

export default Navbar;
