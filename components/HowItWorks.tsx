import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { trackSectionView } from '../lib/analytics';
import LegalProcessMarquee from '@/components/ui/legal-process-marquee';

const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-20%" });

  useEffect(() => {
    if (isSectionInView) {
      trackSectionView('process', language === 'bn' ? 'কিভাবে কাজ করে' : 'How It Works');
    }
  }, [isSectionInView, language]);


  return (
    <section ref={sectionRef} id="process" className="py-16 md:py-20 bg-transparent scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
            {t('process.badge')}
          </span>
          <h2 className={`font-serif text-3xl md:text-4xl text-slate-900 ${language === 'bn' ? 'leading-[1.4]' : ''}`}>
            {t('process.title')}
          </h2>
        </div>

        <div className="mt-10 md:mt-14">
          <LegalProcessMarquee />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
