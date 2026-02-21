import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroLandingProps {
  onOpenWaitlist: () => void;
}

const HeroLanding: React.FC<HeroLandingProps> = ({ onOpenWaitlist }) => {
  const { t, language } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  // Delay scroll effects until after LCP to reduce TBT and avoid forced reflows
  useEffect(() => {
    // Wait 500ms before enabling scroll effects to ensure LCP is complete
    const timer = setTimeout(() => setIsScrollEnabled(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Lightweight scroll handler - only runs after delay
  useEffect(() => {
    if (!isScrollEnabled) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollEnabled]);

  // Calculate parallax values - use fixed estimate to avoid forced reflow from window.innerHeight
  // 800px is a reasonable default that works across devices
  const parallaxY = isScrollEnabled ? Math.min(scrollY * 0.3, 240) : 0;
  const contentOpacity = isScrollEnabled ? Math.max(1 - (scrollY / 400), 0) : 1;

  // Logos data - explicit dimensions to prevent CLS (height in CSS, intrinsic for aspect ratio)
  const logos = [
    { type: 'image', src: '/Logos/draftwise.svg', alt: 'Draftwise', height: 'h-5 sm:h-6', width: 137, imgHeight: 25 },
    { type: 'image', src: '/Logos/paxton.svg', alt: 'Paxton', height: 'h-6 sm:h-7', width: 145, imgHeight: 44 },
    { type: 'image', src: '/Logos/blueshoe.avif', alt: 'Blueshoe', height: 'h-5 sm:h-6', width: 92, imgHeight: 24 },
    { type: 'image', src: '/Logos/logo-off-black.webp', alt: 'Off', height: 'h-5 sm:h-6', width: 50, imgHeight: 24 },
    { type: 'text', text: 'Dench' },
    { type: 'text', text: 'Harvey' },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      data-hero
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Image with CSS parallax - no JS on initial load */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        <img
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=30&w=1200&auto=format&fit=crop&fm=webp"
          alt=""
          className="w-full h-[120%] object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          width="1200"
          height="800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/70 via-brand-600/50 to-brand-600/80" />
        <div className="absolute inset-0 bg-brand-600/20" />
      </div>

      {/* Content - renders immediately for LCP */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-32 md:pt-28 pb-56 md:pb-60"
        style={{ opacity: contentOpacity }}
      >
        {/* Badge - CSS animation */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6 animate-[fadeIn_0.4s_ease-out_both]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/90 font-medium tracking-wide">{t('hero.badge')}</span>
        </div>

        {/* Headline - NO animation delay, renders immediately for LCP */}
        <h1
          className={`font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-5 ${language === 'bn' ? 'leading-[1.2]' : 'leading-[1.1]'
            }`}
          style={language === 'bn' ? { wordSpacing: '0.12em' } : undefined}
        >
          {t('hero.headline')}
          {language === 'bn' && (
            <>
              <br />
              {t('hero.headlineNext')}
            </>
          )}
          <br />
          <span className="italic text-white/60">{t('hero.headlineAccent')}</span>
        </h1>

        {/* Subtext - CSS animation */}
        <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          {t('hero.subtext')}
        </p>

        {/* Single CTA - CSS animation */}
        <div className="animate-[fadeInUp_0.5s_ease-out_0.25s_both]">
          <button
            onClick={onOpenWaitlist}
            className="group bg-white text-brand-600 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('hero.joinWaitlist')}
          </button>
        </div>
      </div>

      {/* Inspired From Section - CSS animation */}
      <div className="absolute bottom-16 md:bottom-20 left-0 right-0 z-10 animate-[fadeIn_0.8s_ease-out_0.5s_both]">
        <p className="text-[10px] sm:text-xs text-white/40 mb-8 uppercase tracking-[0.25em] font-medium text-center">
          {language === 'bn' ? 'অনুপ্রাণিত' : 'Inspired from'}
        </p>

        {/* Logo Marquee */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="flex items-center gap-14 sm:gap-20 animate-marquee-smooth whitespace-nowrap">
              {/* First set */}
              {logos.map((logo, i) => (
                logo.type === 'image' ? (
                  <img
                    key={`a-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.imgHeight}
                    loading="lazy"
                    className={`${logo.height} w-auto opacity-50 hover:opacity-80 transition-opacity brightness-0 invert flex-shrink-0`}
                  />
                ) : (
                  <span
                    key={`a-${i}`}
                    className="text-white/50 font-serif text-xl sm:text-2xl tracking-tight hover:text-white/80 transition-colors flex-shrink-0"
                  >
                    {logo.text}
                  </span>
                )
              ))}
              {/* Duplicate set */}
              {logos.map((logo, i) => (
                logo.type === 'image' ? (
                  <img
                    key={`b-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.imgHeight}
                    loading="lazy"
                    className={`${logo.height} w-auto opacity-50 hover:opacity-80 transition-opacity brightness-0 invert flex-shrink-0`}
                  />
                ) : (
                  <span
                    key={`b-${i}`}
                    className="text-white/50 font-serif text-xl sm:text-2xl tracking-tight hover:text-white/80 transition-colors flex-shrink-0"
                  >
                    {logo.text}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;
