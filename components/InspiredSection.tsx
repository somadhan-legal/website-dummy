import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const logos = [
  { type: 'image', src: '/Logos/draftwise.svg', alt: 'Draftwise', height: 'h-5 sm:h-6', width: 137, imgHeight: 25 },
  { type: 'image', src: '/Logos/paxton.svg', alt: 'Paxton', height: 'h-6 sm:h-7', width: 145, imgHeight: 44 },
  { type: 'image', src: '/Logos/blueshoe.avif', alt: 'Blueshoe', height: 'h-5 sm:h-6', width: 92, imgHeight: 24 },
  { type: 'image', src: '/Logos/logo-off-black.webp', alt: 'Off', height: 'h-5 sm:h-6', width: 50, imgHeight: 24 },
  { type: 'text', text: 'Dench' },
  { type: 'text', text: 'Harvey' },
];

const InspiredSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="border-y border-slate-100 bg-white py-10 md:py-12" aria-label="Inspired from">
      <p className="mb-7 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400 sm:text-xs">
        {language === 'bn' ? 'অনুপ্রাণিত' : 'Inspired from'}
      </p>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex min-w-max items-center gap-14 whitespace-nowrap animate-marquee-smooth sm:gap-20">
            {[...logos, ...logos].map((logo, index) =>
              logo.type === 'image' ? (
                <img
                  key={`${logo.alt}-${index}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.imgHeight}
                  loading="lazy"
                  className={`${logo.height} w-auto flex-shrink-0 opacity-45 grayscale transition-opacity hover:opacity-80`}
                />
              ) : (
                <span key={`${logo.text}-${index}`} className="flex-shrink-0 font-serif text-xl tracking-tight text-slate-400 transition-colors hover:text-brand-600 sm:text-2xl">
                  {logo.text}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspiredSection;