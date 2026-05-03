import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getWaitlistCount } from '../lib/supabase';

// Animated count-up hook — triggers when element scrolls into view
const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || end === 0) return;

    const startTime = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, end, duration]);

  return { count, ref };
};

const SocialProof: React.FC = () => {
  const { language } = useLanguage();
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    getWaitlistCount().then(setWaitlistCount);
  }, []);

  const counter1 = useCountUp(waitlistCount, 2000);
  const counter2 = useCountUp(8, 1500);
  const counter3 = useCountUp(100, 1200);

  // Don't render until we have real data
  if (waitlistCount === 0) return null;

  const stats = [
    {
      ref: counter1.ref,
      count: counter1.count,
      suffix: '+',
      label: language === 'bn' ? 'ওয়েটলিস্টে যুক্ত' : 'People Joined',
    },
    {
      ref: counter2.ref,
      count: counter2.count,
      suffix: '+',
      label: language === 'bn' ? 'আইনি সেবার ক্ষেত্র' : 'Practice Areas',
    },
    {
      ref: counter3.ref,
      count: counter3.count,
      suffix: '%',
      label: language === 'bn' ? 'সম্পূর্ণ গোপনীয়' : 'Confidential',
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#0F2E2E 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Live pulse indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
            {language === 'bn' ? 'লাইভ ওয়েটলিস্ট' : 'Live Waitlist'}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {stats.map((stat, i) => (
            <div key={i} ref={stat.ref} className="flex flex-col items-center text-center px-3 sm:px-6">
              <div className="flex items-baseline">
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 tabular-nums tracking-tight">
                  {stat.count}
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-brand-600 ml-0.5">
                  {stat.suffix}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 font-medium uppercase tracking-wider ${language === 'bn' ? 'tracking-normal' : ''}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
