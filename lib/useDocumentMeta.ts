import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
}

/**
 * Client-side hook to update per-route <title>, <meta description>,
 * <link rel="canonical">, and key Open Graph / Twitter tags.
 *
 * This improves:
 *  - Browser tab titles and bookmarked page names
 *  - Share previews (when users share a /terms or /privacy URL)
 *  - JS-executing crawlers (Googlebot, Bingbot, most modern AI crawlers)
 *
 * For non-JS crawlers, a separate prerender step would still be needed;
 * this hook is a best-effort fallback for a pure SPA.
 */
export const useDocumentMeta = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogUrl,
}: DocumentMeta): void => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const previousTitle = document.title;
    document.title = title;

    const setMetaByName = (name: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('content');
      el.setAttribute('content', content);
      return previous;
    };

    const setMetaByProperty = (property: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('content');
      el.setAttribute('content', content);
      return previous;
    };

    const setLinkRel = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('href');
      el.setAttribute('href', href);
      return previous;
    };

    const previousDescription = setMetaByName('description', description);
    const previousTwitterTitle = setMetaByName('twitter:title', ogTitle || title);
    const previousTwitterDescription = setMetaByName('twitter:description', ogDescription || description);

    const previousOgTitle = setMetaByProperty('og:title', ogTitle || title);
    const previousOgDescription = setMetaByProperty('og:description', ogDescription || description);

    let previousOgUrl: string | null = null;
    let previousTwitterUrl: string | null = null;
    let previousCanonical: string | null = null;
    if (canonical) {
      previousCanonical = setLinkRel('canonical', canonical);
      previousOgUrl = setMetaByProperty('og:url', ogUrl || canonical);
      previousTwitterUrl = setMetaByName('twitter:url', ogUrl || canonical);
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) setMetaByName('description', previousDescription);
      if (previousTwitterTitle !== null) setMetaByName('twitter:title', previousTwitterTitle);
      if (previousTwitterDescription !== null) setMetaByName('twitter:description', previousTwitterDescription);
      if (previousOgTitle !== null) setMetaByProperty('og:title', previousOgTitle);
      if (previousOgDescription !== null) setMetaByProperty('og:description', previousOgDescription);
      if (previousCanonical !== null) setLinkRel('canonical', previousCanonical);
      if (previousOgUrl !== null) setMetaByProperty('og:url', previousOgUrl);
      if (previousTwitterUrl !== null) setMetaByName('twitter:url', previousTwitterUrl);
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogUrl]);
};

export default useDocumentMeta;
