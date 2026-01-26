import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroLandingProps {
  onOpenWaitlist: () => void;
}

const HeroLanding: React.FC<HeroLandingProps> = ({ onOpenWaitlist }) => {
  const { t, language } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrollReady, setIsScrollReady] = useState(false);
  
  // Delay scroll effects until after LCP to reduce TBT and avoid forced reflows
  useEffect(() => {
    // Wait for LCP (headline) to render before enabling scroll effects
    const timer = setTimeout(() => {
      requestAnimationFrame(() => setIsScrollReady(true));
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Logos data - using CSS height classes with auto width to preserve aspect ratio
  const logos = [
    { type: 'image', src: '/Logos/draftwise.svg', alt: 'Draftwise', height: 'h-5 sm:h-6' },
    { type: 'image', src: '/Logos/paxton.svg', alt: 'Paxton', height: 'h-6 sm:h-7' },
    { type: 'image', src: '/Logos/blueshoe.avif', alt: 'Blueshoe', height: 'h-5 sm:h-6' },
    { type: 'image', src: '/Logos/logo-off-black.webp', alt: 'Off', height: 'h-5 sm:h-6' },
    { type: 'text', text: 'Dench' },
    { type: 'text', text: 'Harvey' },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Image with Parallax - only enable after scroll ready to reduce TBT */}
      <motion.div 
        style={isScrollReady ? { y: backgroundY } : undefined}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=30&w=1200&auto=format&fit=crop&fm=webp"
          alt="Legal office background"
          className="w-full h-[120%] object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          width="1200"
          height="800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/70 via-brand-600/50 to-brand-600/80" />
        <div className="absolute inset-0 bg-brand-600/20" />
      </motion.div>

      {/* Grain overlay */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content - Headline renders immediately for LCP, other elements animate */}
      <motion.div style={isScrollReady ? { opacity: contentOpacity } : undefined} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-32 md:pt-28 pb-56 md:pb-60">
        {/* Badge - CSS animation */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6 animate-[fadeIn_0.4s_ease-out_both]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/90 font-medium tracking-wide">{t('hero.badge')}</span>
        </div>

        {/* Headline - NO animation delay, renders immediately for LCP */}
        <h1
          className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-5 ${
            language === 'bn' ? 'leading-[1.2]' : 'leading-[1.1]'
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
      </motion.div>

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
