import { useEffect, useRef, useState } from "react";
import PhoneMockupBasic from "@/components/ui/phone-mockups-1";
import AppStoreComingSoon from "@/components/ui/app-store-coming-soon";
import { useLanguage } from "@/contexts/LanguageContext";

const messages = {
  en: [
    "Select a verified lawyer",
    "Book your consultation",
    "Talk to your lawyer",
    "Share files securely",
    "Track service updates",
  ],
  bn: [
    "যাচাইকৃত আইনজীবী নির্বাচন করুন",
    "পরামর্শের সময় নির্ধারণ করুন",
    "আইনজীবীর সঙ্গে কথা বলুন",
    "নিরাপদে ফাইল শেয়ার করুন",
    "সেবার অগ্রগতি দেখুন",
  ],
};

export default function LegalProcessMarquee({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const { language } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleStartRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = messages[language];

  useEffect(() => {
    const stepDuration = 3600;
    cycleStartRef.current = performance.now();
    let frame = 0;
    let previousIndex = -1;
    const animate = (now: number) => {
      const elapsed = Math.max(0, now - cycleStartRef.current);
      const cyclePosition = (elapsed / stepDuration) % items.length;
      const currentIndex = Math.floor(cyclePosition);
      const track = trackRef.current;
      if (track) {
        track.style.transform = `translate3d(0, -${cyclePosition * 76 + 38}px, 0)`;
      }
      if (currentIndex !== previousIndex) {
        previousIndex = currentIndex;
        setActiveIndex(currentIndex);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [items.length, language]);

  const selectStep = (index: number) => {
    cycleStartRef.current = performance.now() - index * 3600;
    setActiveIndex(index);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-4 bg-transparent px-0 pt-4 pb-0 lg:grid-cols-[0.85fr_1.15fr] lg:gap-0">
      <div>
        <div className="relative h-[300px] overflow-hidden sm:h-[350px]">
          <div ref={trackRef} className="absolute inset-x-0 top-1/2 will-change-transform">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="h-[380px]">
                {items.map((item, index) => (
                  <button
                    key={`${copy}-${item}`}
                    type="button"
                    onClick={() => selectStep(index)}
                    aria-current={activeIndex === index}
                    tabIndex={copy === 0 ? 0 : -1}
                    className={`flex h-[76px] w-full items-center border-0 text-left font-open-sans font-medium leading-snug transition-[opacity,color] duration-500 ${activeIndex === index ? "text-3xl text-slate-900 sm:text-4xl" : "text-2xl text-slate-500 sm:text-3xl"}`}
                    style={{ opacity: activeIndex === index ? 1 : Math.max(0.3, 1 - Math.abs(activeIndex - index) * 0.22) }}
                  >
                    <span className="mr-4 font-open-sans text-lg font-bold tracking-widest text-brand-500 sm:mr-6 sm:text-xl">
                      {index + 1}
                    </span>
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-0 min-w-0 overflow-hidden">
        <PhoneMockupBasic
          activeIndex={activeIndex}
          onActiveIndexChange={selectStep}
        />
      </div>
      <div className="relative z-20 -mt-24 w-full min-w-0 sm:-mt-32 lg:col-span-2">
        <AppStoreComingSoon onOpenWaitlist={onOpenWaitlist} />
      </div>
    </div>
  );
}
