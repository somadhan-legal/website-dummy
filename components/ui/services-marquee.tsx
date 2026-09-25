import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, X, type LucideIcon } from 'lucide-react';

export interface ServiceMarqueeItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  examples: string[];
  icon: LucideIcon;
  image?: string;
}

interface ServicesMarqueeProps {
  items: ServiceMarqueeItem[];
  language: 'en' | 'bn';
  onItemHover?: (item: ServiceMarqueeItem) => void;
}

const cardStyles = [
  'from-brand-900 via-brand-700 to-brand-500',
  'from-brand-800 via-brand-600 to-brand-400',
  'from-brand-700 via-brand-500 to-brand-300',
  'from-brand-900 via-brand-800 to-brand-500',
];

const ServicesMarquee: React.FC<ServicesMarqueeProps> = ({ items, language, onItemHover }) => {
  const [activeItem, setActiveItem] = useState<ServiceMarqueeItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number; didDrag: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const removeDragListenersRef = useRef<(() => void) | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: marqueeRef.current?.scrollLeft ?? 0,
      didDrag: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || moveEvent.pointerId !== drag.pointerId || !marqueeRef.current) return;
      const distance = moveEvent.clientX - drag.startX;
      if (Math.abs(distance) > 5) {
        drag.didDrag = true;
        suppressClickRef.current = true;
        setIsDragging(true);
      }
      if (drag.didDrag) {
        marqueeRef.current.scrollLeft = drag.startScrollLeft - distance;
        moveEvent.preventDefault();
      }
    };

    const finishPointer = (finishEvent: PointerEvent) => {
      if (dragRef.current?.pointerId !== finishEvent.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishPointer);
      window.removeEventListener('pointercancel', finishPointer);
      removeDragListenersRef.current = null;
    };

    removeDragListenersRef.current?.();
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', finishPointer);
    window.addEventListener('pointercancel', finishPointer);
    removeDragListenersRef.current = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishPointer);
      window.removeEventListener('pointercancel', finishPointer);
    };
  };

  useEffect(() => () => removeDragListenersRef.current?.(), []);

  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveItem(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeItem]);

  return (
    <>
      <div
        ref={marqueeRef}
        onPointerDown={handlePointerDown}
        className={`services-marquee relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
        style={{ touchAction: 'pan-y' }}
        aria-label={language === 'bn' ? 'আইনি সেবাসমূহ' : 'Legal services'}
      >
        <div className="services-marquee-track flex w-max" style={{ animationPlayState: isDragging ? 'paused' : undefined }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="services-marquee-group flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={`${copy}-${item.id}`}
                    type="button"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={(event) => {
                      if (suppressClickRef.current) {
                        event.preventDefault();
                        suppressClickRef.current = false;
                        return;
                      }
                      setActiveItem(item);
                    }}
                    onMouseEnter={() => onItemHover?.(item)}
                    aria-label={`${language === 'bn' ? 'বিস্তারিত দেখুন:' : 'View details:'} ${item.title}`}
                    tabIndex={copy === 0 ? 0 : -1}
                    className={`group relative flex h-[360px] w-[min(78vw,280px)] shrink-0 flex-col overflow-hidden rounded-[1.5rem] ${item.image ? 'bg-brand-900' : `bg-gradient-to-br ${cardStyles[index % cardStyles.length]}`} p-5 text-left text-white sm:h-[470px] sm:w-[360px] sm:rounded-[2rem] sm:p-8`}
                  >
                {item.image && <img src={item.image} alt="Lawyers advising clients about property matters" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className={`absolute inset-0 ${item.image ? 'property-service-photo-overlay' : 'bg-[radial-gradient(ellipse_at_75%_20%,rgba(255,255,255,0.22),transparent_42%)]'}`} />
                {!item.image && <Icon className="absolute right-5 top-16 h-40 w-40 text-white/[0.13] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105 sm:right-8 sm:top-24 sm:h-56 sm:w-56" strokeWidth={0.8} aria-hidden="true" />}

                <div className="relative z-10 flex items-start justify-end gap-3">
                  <span className="font-mono text-sm tracking-widest text-white/65">{item.number}</span>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="mb-2 max-w-[18rem] text-xs leading-relaxed text-white/75 sm:mb-3 sm:text-sm">{item.description}</p>
                  <div className="flex items-end justify-between gap-3">
                    <h3 className={`mb-3 text-xl font-semibold leading-tight tracking-tight sm:mb-4 sm:text-3xl ${language === 'bn' ? 'leading-[1.35]' : ''}`}>{item.title}</h3>
                    <span className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-800 transition-transform duration-300 group-hover:rotate-45 sm:mb-4 sm:h-12 sm:w-12">
                      <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </span>
                  </div>
                </div>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {createPortal(<AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-brand-950/70 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveItem(null); }}
          >
            <motion.div
              role="dialog" aria-modal="true" aria-labelledby="service-detail-title"
              initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            >
              <div className={`relative overflow-hidden bg-gradient-to-br ${cardStyles[items.findIndex((item) => item.id === activeItem.id) % cardStyles.length]} px-7 pb-8 pt-10 text-white sm:px-10 sm:pb-10`}>
                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/15" />
                <button type="button" onClick={() => setActiveItem(null)} aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'} className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="relative rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">{activeItem.category}</span>
                <h3 id="service-detail-title" className={`relative mt-12 max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl ${language === 'bn' ? 'leading-[1.35]' : ''}`}>{activeItem.title}</h3>
                <p className="relative mt-4 max-w-xl text-base leading-relaxed text-white/80">{activeItem.description}</p>
              </div>
              <div className="p-7 sm:p-10">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-700">{language === 'bn' ? 'যে বিষয়ে সহায়তা পাবেন' : 'How we can help'}</h4>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {activeItem.examples.map((example) => <li key={example} className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900"><span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />{example}</li>)}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  );
};

export default ServicesMarquee;
