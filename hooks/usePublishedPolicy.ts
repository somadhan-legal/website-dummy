import { useCallback, useEffect, useRef, useState } from 'react';
import { readPublishedPolicy, type PolicySlug } from '../lib/publicPolicies';
import { preparePolicyContent } from '../lib/policyHtml';

type PolicyState =
  | { slug: PolicySlug; status: 'loading' | 'unpublished' | 'error' }
  | { slug: PolicySlug; status: 'published'; policy: NonNullable<Awaited<ReturnType<typeof readPublishedPolicy>>>; body: ReturnType<typeof preparePolicyContent> };

export function usePublishedPolicy(slug: PolicySlug) {
  const [state, setState] = useState<PolicyState>({ slug, status: 'loading' });
  const [refreshing, setRefreshing] = useState(false);
  const reloadRef = useRef<(() => void) | null>(null);
  const retry = useCallback(() => reloadRef.current?.(), []);

  useEffect(() => {
    let disposed = false;
    let inFlight = false;
    let controller: AbortController | undefined;
    let timeout: number | undefined;

    const load = async () => {
      if (disposed || inFlight) return;
      inFlight = true;
      setRefreshing(true);
      controller = new AbortController();
      timeout = window.setTimeout(() => controller?.abort(), 12000);
      try {
        const policy = await readPublishedPolicy(slug, controller.signal);
        if (disposed) return;
        if (!policy) setState({ slug, status: 'unpublished' });
        else {
          const body = preparePolicyContent(policy.html, slug);
          setState({ slug, status: 'published', policy, body });
        }
      } catch {
        // Do not substitute obsolete embedded copy or keep a potentially withdrawn policy visible.
        if (!disposed) setState({ slug, status: 'error' });
      } finally {
        window.clearTimeout(timeout);
        inFlight = false;
        if (!disposed) setRefreshing(false);
      }
    };
    const refreshWhenVisible = () => { if (!document.hidden) void load(); };
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) refreshWhenVisible(); };
    reloadRef.current = () => {
      if (inFlight) return;
      setState({ slug, status: 'loading' });
      void load();
    };
    setState({ slug, status: 'loading' });
    void load();
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('pageshow', onPageShow);
    const interval = window.setInterval(refreshWhenVisible, 60000);
    return () => {
      disposed = true;
      reloadRef.current = null;
      controller?.abort();
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [slug]);

  return { state: state.slug === slug ? state : { slug, status: 'loading' as const }, refreshing, retry };
}
