import { useEffect, useState, type RefObject } from 'react';

export function useAnimationActivity<T extends Element>(targetRef: RefObject<T | null>) {
  const [isActive, setIsActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isInViewport = false;
    const updateActivity = () => setIsActive(isInViewport && !document.hidden);
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);
    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
        isInViewport = entry.isIntersecting;
        updateActivity();
      });

    if (observer) {
      observer.observe(target);
    } else {
      isInViewport = true;
      updateActivity();
    }
    updateMotionPreference();
    document.addEventListener('visibilitychange', updateActivity);
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', updateActivity);
      motionPreference.removeEventListener('change', updateMotionPreference);
    };
  }, [targetRef]);

  return { isActive, prefersReducedMotion };
}
