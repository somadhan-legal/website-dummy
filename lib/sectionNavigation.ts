export const SECTION_REVEAL_EVENT = 'somadhan:reveal-section';
const requestedSections = new Set<string>();
let cancelPendingNavigation: (() => void) | undefined;

export const isSectionRequested = (id: string) => requestedSections.has(id);

export function cancelSectionNavigation() {
  cancelPendingNavigation?.();
}

export async function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth', signal?: AbortSignal) {
  cancelSectionNavigation();
  if (signal?.aborted) return;
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-deferred-section]'));
  const targetIndex = sections.findIndex((section) => section.dataset.deferredSection === id || section.querySelector(`#${CSS.escape(id)}`));
  const preceding = targetIndex < 0 ? [] : sections.slice(0, targetIndex + 1);
  if (targetIndex < 0 && !document.getElementById(id)) return;

  await new Promise<void>((resolve) => {
    let finished = false;
    let measuring = false;
    let frame: number | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      signal?.removeEventListener('abort', finish);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchstart', finish);
      window.removeEventListener('keydown', onKeyDown);
      if (cancelPendingNavigation === finish) cancelPendingNavigation = undefined;
      resolve();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) finish();
    };
    const check = () => {
      if (finished || measuring) return;
      const element = document.getElementById(id) ?? sections[targetIndex];
      if (!element?.isConnected || element.hasAttribute('data-section-placeholder') || preceding.some((section) => section.querySelector('[data-section-placeholder]'))) return;
      measuring = true;
      // Chunk arrival and font swaps can change the position of later sections.
      element.getBoundingClientRect();
      void document.fonts.ready.then(() => {
        if (finished) return;
        frame = requestAnimationFrame(() => {
          if (!element.isConnected) { finish(); return; }
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - 80), behavior: reducedMotion ? 'auto' : behavior });
          finish();
        });
      });
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    cancelPendingNavigation = finish;
    signal?.addEventListener('abort', finish, { once: true });
    window.addEventListener('wheel', finish, { passive: true, once: true });
    window.addEventListener('touchstart', finish, { passive: true, once: true });
    window.addEventListener('keydown', onKeyDown);

    for (const section of preceding) {
      const sectionId = section.dataset.deferredSection!;
      requestedSections.add(sectionId);
      window.dispatchEvent(new CustomEvent(SECTION_REVEAL_EVENT, { detail: sectionId }));
    }
    check();
  });
}
