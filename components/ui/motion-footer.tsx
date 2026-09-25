import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Play } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface CinematicFooterProps {
  onOpenWaitlist: () => void;
}

const MagneticButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;
    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * 0.16, y: y * 0.16, duration: 0.35, ease: 'power2.out' });
    };
    const handleLeave = () => gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);
    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
      gsap.killTweensOf(element);
    };
  }, []);

  return <button ref={buttonRef} className={className} {...props}>{children}</button>;
};

export const CinematicFooter: React.FC<CinematicFooterProps> = ({ onOpenWaitlist }) => {
  const { language } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const context = gsap.context(() => {
      gsap.fromTo(logoRef.current, { y: '10vh', scale: 0.82, opacity: 0 }, {
        y: 0, scale: 1, opacity: 0.12, ease: 'power1.out',
        scrollTrigger: { trigger: wrapper, start: 'top 80%', end: 'bottom bottom', scrub: 1 },
      });
      gsap.fromTo([headingRef.current, linksRef.current], { y: 42, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: wrapper, start: 'top 40%', end: 'bottom bottom', scrub: 1 },
      });
    }, wrapper);

    return () => context.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div ref={wrapperRef} className="cinematic-footer-curtain relative h-[100svh] min-h-[620px] w-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
      <footer className="cinematic-footer fixed bottom-0 left-0 flex h-[100svh] min-h-[620px] w-full flex-col justify-between overflow-hidden">
        <div className="cinematic-footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
        <div className="cinematic-footer-grid pointer-events-none absolute inset-0 z-0" />

        <img
          ref={logoRef}
          src={language === 'bn' ? '/Somadhan BLW.svg' : '/Somadhan ELW.svg'}
          alt=""
          aria-hidden="true"
          className="cinematic-footer-watermark pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 h-[28vh] w-auto max-w-[90vw] -translate-x-1/2 select-none"
        />

        <div className="relative z-10 mx-auto mt-20 flex w-full max-w-none flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
          <h2 ref={headingRef} className="cinematic-footer-heading mb-8 max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-black tracking-tight md:mb-12">
            {language === 'bn' ? 'আইনি সহায়তা, হাতের মুঠোয়' : <>Legal support,<br />within reach.</>}
          </h2>

          <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-4">
              <MagneticButton onClick={onOpenWaitlist} className="cinematic-footer-pill flex min-w-[230px] items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-transform hover:scale-[1.03]">
                <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.67 3.55 1.76-3.13 1.77-2.62 5.92.35 7.14-.65 1.58-1.57 3.1-2.57 4.03zm-3.21-14.7c-.55 1.4-1.89 2.37-3.25 2.28.09-1.5 1.05-2.82 2.38-3.4 1.25-.57 2.66-.41 3.25.04-.15.35-.26.72-.38 1.08z" />
                </svg>
                <span className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">{language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming soon'}</span>
                  <span className="text-base font-semibold">{language === 'bn' ? 'অ্যাপ স্টোর' : 'App Store'}</span>
                </span>
              </MagneticButton>

              <MagneticButton onClick={onOpenWaitlist} className="cinematic-footer-pill flex min-w-[230px] items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-transform hover:scale-[1.03]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  <Play className="h-5 w-5 fill-current text-white" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">{language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming soon'}</span>
                  <span className="text-base font-semibold">{language === 'bn' ? 'গুগল প্লে' : 'Google Play'}</span>
                </span>
              </MagneticButton>
            </div>

            <div className="flex w-full flex-wrap justify-center gap-3 md:gap-5">
              <a href="/privacy" className="cinematic-footer-pill rounded-full px-5 py-3 text-sm font-medium">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</a>
              <a href="/terms" className="cinematic-footer-pill rounded-full px-5 py-3 text-sm font-medium">{language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}</a>
              <a href="mailto:info@somadhan.com" className="cinematic-footer-pill rounded-full px-5 py-3 text-sm font-medium">{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</a>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex w-full justify-end px-6 pb-7 sm:px-10 md:px-12">
          <MagneticButton onClick={scrollToTop} aria-label={language === 'bn' ? 'উপরে যান' : 'Back to top'} className="cinematic-footer-pill flex h-12 w-12 items-center justify-center rounded-full">
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </MagneticButton>
        </div>
      </footer>
    </div>
  );
};

export default CinematicFooter;
