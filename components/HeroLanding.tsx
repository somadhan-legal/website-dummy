import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { companyInfo } from '../lib/companyInfo';
import { trackCTAClick } from '../lib/analytics';
import { CrowdCanvas } from './ui/skiper39';
import { useAnimationActivity } from '../hooks/useAnimationActivity';

const HeroLanding: React.FC = () => {
  const { t, language } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isActive, prefersReducedMotion } = useAnimationActivity(heroRef);
  const [headlineSlide, setHeadlineSlide] = useState(0);
  const headlineSlides = language === 'bn'
    ? ['আপনার হাতের মুঠোয়', 'এক ট্যাপেই', 'যেখানেই থাকুন']
    : ['right in your hand.', 'one tap away.', 'wherever you go.'];

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setHeadlineSlide((current) => (current + 1) % headlineSlides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [headlineSlides.length, isActive, prefersReducedMotion]);

  useEffect(() => {
    let frame: number | undefined;
    const update = () => {
      frame = undefined;
      const scrollY = window.scrollY;
      if (backgroundRef.current) backgroundRef.current.style.transform = prefersReducedMotion ? 'none' : `translateY(${Math.min(scrollY * 0.3, 240)}px)`;
      if (contentRef.current) contentRef.current.style.opacity = prefersReducedMotion ? '1' : `${Math.max(1 - scrollY / 400, 0)}`;
    };
    const handleScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-hero
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Full-width canvas layer */}
      <div ref={backgroundRef} className="absolute inset-0 z-0 overflow-hidden bg-brand-900 will-change-transform">
        <CrowdCanvas
          src="/images/optimized/hero-crowd.webp"
          mobileSrc="/images/optimized/hero-crowd-mobile.webp"
          rows={15}
          cols={7}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/75 via-brand-800/45 to-brand-900/90" />
      </div>

      {/* Content - renders immediately for LCP */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-32 md:pt-28 pb-56 md:pb-60"
      >
        {/* Badge - CSS animation */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6 animate-[fadeIn_0.4s_ease-out_both]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/90 font-medium tracking-wide">{t('hero.badge')}</span>
        </div>

        {/* Headline - NO animation delay, renders immediately for LCP */}
        <h1
          className={`font-serif font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-5 ${language === 'bn' ? 'leading-[1.2]' : 'leading-[1.1]'
            }`}
          style={language === 'bn' ? { wordSpacing: '0.12em' } : undefined}
        >
          {t('hero.headline')}
          <br />
          <span
            className="inline-grid max-w-full italic text-white/60"
            aria-live="polite"
          >
            {headlineSlides.map((slide, index) => (
              <span key={`${language}-${index}`} style={{ gridArea: '1 / 1' }} aria-hidden={index !== headlineSlide} className={index === headlineSlide ? (headlineSlide ? 'animate-[fadeIn_0.6s_ease-out]' : '') : 'invisible'}>
                {slide}
              </span>
            ))}
          </span>
        </h1>

        <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-8">
          {t('hero.subtext')}
        </p>

        {/* Single CTA - CSS animation */}
        <div className="animate-[fadeInUp_0.5s_ease-out_0.25s_both] flex flex-col items-center">
          <a
            href={companyInfo.androidAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('download_android_app', 'hero')}
            className="group inline-flex min-h-12 items-center justify-center bg-white text-brand-600 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('hero.downloadApp')}
          </a>
        </div>
      </div>

    </section>
  );
};

export default HeroLanding;
