import React, { useEffect, useRef } from 'react';
import { ArrowUp, Play } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAnimationActivity } from '../../hooks/useAnimationActivity';
import { companyInfo } from '../../lib/companyInfo';
import { trackCTAClick } from '../../lib/analytics';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  enabled: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ enabled, className = '', children, style, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element || !enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.translate = `${x * 0.16}px ${y * 0.16}px`;
    };
    const handleLeave = () => { element.style.translate = '0 0'; };
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerleave', handleLeave);
    return () => {
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerleave', handleLeave);
      element.style.removeProperty('translate');
    };
  }, [enabled]);

  return <button ref={buttonRef} className={className} style={{ transitionProperty: 'background, border-color, box-shadow, color, transform, translate', transitionDuration: '350ms', ...style }} {...props}>{children}</button>;
};

export const CinematicFooter: React.FC = () => {
  const { language } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { isActive, prefersReducedMotion } = useAnimationActivity(wrapperRef);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !isActive || prefersReducedMotion) return;
    // A late mount at the page bottom should show content, not restart a hidden reveal.
    if (wrapper.getBoundingClientRect().bottom <= window.innerHeight) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (cancelled) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.fromTo(logoRef.current, { y: '10vh', scale: 0.82, opacity: 0 }, {
          y: 0, scale: 1, opacity: 0.12, ease: 'power1.out',
          scrollTrigger: { trigger: wrapper, start: 'top 80%', end: 'bottom bottom', scrub: 1 },
        });
        gsap.fromTo([headingRef.current, linksRef.current], { y: 42, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: wrapper, start: 'top 40%', end: 'bottom bottom', scrub: 1 },
        });
      }, wrapper);
      ScrollTrigger.refresh();
    }).catch(() => {
      context?.revert();
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [isActive, prefersReducedMotion]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  return (
    <div ref={wrapperRef} className="cinematic-footer-curtain relative h-[100svh] min-h-[620px] w-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
      <footer className="cinematic-footer fixed bottom-0 left-0 flex h-[100svh] min-h-[620px] w-full flex-col justify-between overflow-hidden" style={{ visibility: isActive ? 'visible' : 'hidden' }}>
        {isActive && !prefersReducedMotion && <Spotlight size={620} className="from-brand-300/35 via-brand-200/20 to-transparent blur-3xl" />}
        <div className="cinematic-footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" style={{ animationPlayState: isActive && !prefersReducedMotion ? 'running' : 'paused' }} />
        <div className="cinematic-footer-grid pointer-events-none absolute inset-0 z-0" />

        <img
          ref={logoRef}
          src={language === 'bn' ? '/Somadhan BLW.svg' : '/Somadhan ELW.svg'}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{ opacity: 0.12 }}
          className="cinematic-footer-watermark pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 h-[28vh] w-auto max-w-[90vw] -translate-x-1/2 select-none"
        />

        <div className="relative z-10 mx-auto mt-20 flex w-full max-w-none flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
          <h2 ref={headingRef} className="cinematic-footer-heading mb-8 max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-black tracking-tight md:mb-12">
            {language === 'bn' ? 'আইনি সহায়তা, হাতের মুঠোয়' : <>Legal support,<br />within reach.</>}
          </h2>

          <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href={companyInfo.androidAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick('download_android_app', 'cinematic_footer')}
                className="cinematic-footer-pill flex min-w-[230px] items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-transform hover:scale-[1.03]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  <Play className="h-5 w-5 fill-current text-white" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">{language === 'bn' ? 'ডাউনলোড করুন' : 'Get it on'}</span>
                  <span className="text-base font-semibold">Google Play</span>
                </span>
              </a>
            </div>

          </div>
        </div>

        <div className="relative z-20 flex w-full justify-end px-6 pb-7 sm:px-10 md:px-12">
          <MagneticButton enabled={isActive && !prefersReducedMotion} onClick={scrollToTop} aria-label={language === 'bn' ? 'উপরে যান' : 'Back to top'} className="cinematic-footer-pill flex h-12 w-12 items-center justify-center rounded-full">
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </MagneticButton>
        </div>
      </footer>
    </div>
  );
};

export default CinematicFooter;
