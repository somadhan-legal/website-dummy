import React, { Suspense, useEffect, useRef, useState } from 'react';
import { isSectionRequested, SECTION_REVEAL_EVENT } from '../lib/sectionNavigation';

interface DeferredSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  mobileHeight: number;
  desktopHeight: number;
}

export default function DeferredSection({ id, children, className = '', mobileHeight, desktopHeight }: DeferredSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(() => isSectionRequested(id));

  useEffect(() => {
    if (ready) return;
    const reveal = (event: Event) => {
      if ((event as CustomEvent<string>).detail === id) setReady(true);
    };
    window.addEventListener(SECTION_REVEAL_EVENT, reveal);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setReady(true);
    }, { rootMargin: '200px 0px' });
    if (containerRef.current) observer?.observe(containerRef.current);
    if (!observer || isSectionRequested(id)) setReady(true);
    return () => {
      observer?.disconnect();
      window.removeEventListener(SECTION_REVEAL_EVENT, reveal);
    };
  }, [id, ready]);

  const placeholder = <div id={id} data-section-placeholder className="deferred-section-placeholder" aria-hidden="true" />;
  return (
    <div ref={containerRef} data-deferred-section={id} className={className} style={{
      '--section-mobile-height': `${mobileHeight}px`,
      '--section-desktop-height': `${desktopHeight}px`,
    } as React.CSSProperties}>
      {ready ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
}
