import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroLandingProps {
  onOpenWaitlist: () => void;
}

const trustedLogos = ['BUET', 'DU Law', 'BRAC', 'NSU', 'IBA', 'AIUB', 'UIU', 'EWU'];

const HeroLanding: React.FC<HeroLandingProps> = ({ onOpenWaitlist }) => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2940&auto=format&fit=crop"
          alt="Background"
          className="w-full h-[120%] object-cover"
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

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 md:pt-20 pb-40 md:pb-44">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/90 font-medium tracking-wide">{t('hero.badge')}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-5"
        >
          {t('hero.headline')}
          <br />
          <span className="italic text-white/60">{t('hero.headlineAccent')}</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-10"
        >
          {t('hero.subtext')}
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <button
            onClick={onOpenWaitlist}
            className="group bg-white text-brand-600 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('hero.joinWaitlist')}
          </button>
        </motion.div>
      </motion.div>

      {/* Trusted By Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-12 md:bottom-16 left-0 right-0 z-10"
      >
        <p className="text-[10px] sm:text-xs text-white/40 mb-4 uppercase tracking-[0.25em] font-medium text-center">
          {t('hero.trustedBy')}
        </p>
        
        {/* Marquee Container with CSS mask for smooth fade */}
        <div className="relative max-w-3xl mx-auto overflow-hidden marquee-fade-left">
          {/* Scrolling content - duplicated for seamless loop */}
          <div className="flex animate-marquee whitespace-nowrap">
            {[...trustedLogos, ...trustedLogos, ...trustedLogos, ...trustedLogos].map((name, idx) => (
              <span
                key={idx}
                className="inline-block px-6 sm:px-8 text-white/50 font-medium text-sm tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroLanding;
