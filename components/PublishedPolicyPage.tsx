import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePublishedPolicy } from '../hooks/usePublishedPolicy';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { companyInfo } from '../lib/companyInfo';
import { getOptimizedImage } from '../lib/optimizedAssets';
import type { PolicySlug } from '../lib/publicPolicies';
import './PublishedPolicyPage.css';

const AccountDeletionModal = lazy(() => import('./AccountDeletionModal'));
const pageInfo = {
  'terms-of-service': { path: '/terms', title: 'Terms and Conditions', titleBn: 'শর্তাবলী', other: 'privacy-policy' },
  'privacy-policy': { path: '/privacy', title: 'Privacy Policy', titleBn: 'গোপনীয়তা নীতি', other: 'terms-of-service' },
} as const;

function policyDate(value: string, bn: boolean, dateOnly = false) {
  return new Intl.DateTimeFormat(bn ? 'bn-BD' : 'en-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
    ...(dateOnly ? {} : { hour: 'numeric', minute: '2-digit' }),
    timeZone: dateOnly ? 'UTC' : 'Asia/Dhaka',
  }).format(new Date(dateOnly ? `${value}T00:00:00Z` : value));
}

export default function PublishedPolicyPage({ slug }: { slug: PolicySlug }) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const info = pageInfo[slug];
  const other = pageInfo[info.other];
  const bn = language === 'bn';
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  const { state, refreshing, retry } = usePublishedPolicy(slug);
  const published = state.status === 'published' ? state : null;
  const toc = published?.body.toc ?? [];
  const [activeSection, setActiveSection] = useState('');
  const [tocOpen, setTocOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const publishedAt = published?.policy.publishedAt;

  useDocumentMeta({
    title: `${bn ? info.titleBn : info.title} | ${bn ? 'সমাধান' : 'Somadhan'}`,
    description: bn ? `সমাধানের প্রকাশিত ${info.titleBn} পড়ুন।` : `Read the published Somadhan ${info.title}.`,
    canonical: `https://somadhan.com${info.path}`,
  });
  useEffect(() => {
    if (requestedLanguage === 'en' || requestedLanguage === 'bn') setLanguage(requestedLanguage);
  }, [requestedLanguage, setLanguage]);
  useEffect(() => {
    setTocOpen(false);
    setDeletionOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  useEffect(() => {
    if (!location.hash) return;
    let id: string;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    let cancelled = false;
    let frame: number | undefined;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        const element = document.getElementById(id);
        const isDeletionUtility = slug === 'privacy-policy' && id === 'deletion' && element?.getAttribute('data-account-deletion-utility') === 'true';
        if (element && (articleRef.current?.contains(element) || isDeletionUtility)) {
          window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - 104), behavior: 'instant' });
        }
      });
    });
    return () => { cancelled = true; if (frame !== undefined) cancelAnimationFrame(frame); };
  }, [location.hash, publishedAt, slug, state.status]);

  useEffect(() => {
    if (!published) return;
    const update = () => {
      const headings = Array.from(articleRef.current?.querySelectorAll('h2[id]') ?? []);
      let current = headings[0]?.id ?? '';
      for (const heading of headings) if (heading.getBoundingClientRect().top <= 128) current = heading.id;
      setActiveSection(current);
    };
    let frame: number | undefined;
    const onScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(() => { frame = undefined; update(); });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame !== undefined) cancelAnimationFrame(frame); };
  }, [published?.body]);

  const toggleLanguage = () => {
    const next = bn ? 'en' : 'bn';
    setLanguage(next);
    const search = new URLSearchParams(location.search);
    search.set('lang', next);
    navigate({ pathname: info.path, search: search.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const homeClick = () => window.scrollTo({ top: 0, behavior: 'instant' });
  const contents = (
    <nav aria-label={bn ? 'সূচিপত্র' : 'Table of contents'} className="space-y-1">
      {toc.map(entry => <Link key={entry.id} to={{ pathname: info.path, search: location.search, hash: `#${entry.id}` }} onClick={() => setTocOpen(false)}
        aria-current={activeSection === entry.id ? 'location' : undefined}
        className={`block min-h-11 rounded-lg border-l-2 px-3 py-2 text-sm leading-relaxed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${activeSection === entry.id ? 'border-brand-600 bg-brand-50 font-medium text-brand-700' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}>
        {entry.title}
      </Link>)}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <nav aria-label={bn ? 'মূল নেভিগেশন' : 'Main navigation'} className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" onClick={homeClick} aria-label={bn ? 'হোমে ফিরুন' : 'Back to home'} className="flex min-h-11 items-center gap-2 text-slate-600 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <img {...getOptimizedImage(bn ? '/Somadhan BLT.svg' : '/Somadhan ELT.svg')} sizes="130px" alt="Somadhan" className="h-4 w-auto sm:h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleLanguage} aria-label={bn ? 'Switch to English' : 'বাংলায় দেখুন'} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-600 hover:bg-slate-200">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />{bn ? 'EN' : 'বাংলা'}
            </button>
            {toc.length > 0 && <button type="button" onClick={() => setTocOpen(open => !open)} aria-label={bn ? 'সূচিপত্র' : 'Contents'} aria-expanded={tocOpen} aria-controls="policy-mobile-contents" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg bg-slate-100 px-2 text-xs font-medium text-slate-600 hover:bg-slate-200 lg:hidden">
              <span className="hidden min-[380px]:inline">{bn ? 'সূচিপত্র' : 'Contents'}</span><ChevronDown className={`h-3.5 w-3.5 ${tocOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>}
          </div>
        </div>
      </nav>
      {toc.length > 0 && <div id="policy-mobile-contents" hidden={!tocOpen} className="fixed inset-x-0 top-16 z-40 max-h-[60vh] overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-lg lg:hidden">{contents}</div>}

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <header className="mb-10">
          <p className="mb-4 inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600">{bn ? 'আইনি দলিল' : 'Legal'}</p>
          <h1 className={`mb-4 font-serif text-3xl text-slate-900 sm:text-4xl md:text-5xl ${bn ? 'leading-[1.3]' : 'leading-[1.15]'}`}>{bn ? info.titleBn : info.title}</h1>
          {published && <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">
            {published.policy.effectiveDate && <div className="flex flex-wrap gap-1.5"><dt>{bn ? 'কার্যকর তারিখ:' : 'Effective date:'}</dt><dd><time dateTime={published.policy.effectiveDate}>{policyDate(published.policy.effectiveDate, bn, true)}</time></dd></div>}
            <div className="flex flex-wrap gap-1.5"><dt>{bn ? 'সর্বশেষ প্রকাশ:' : 'Last published:'}</dt><dd><time dateTime={published.policy.publishedAt} title={published.policy.publishedAt}>{policyDate(published.policy.publishedAt, bn)}</time></dd></div>
          </dl>}
          {bn && published && <p className="mt-4 text-sm leading-relaxed text-slate-600">এই নীতির প্রকাশিত মূল লেখা ইংরেজিতে। অনুমোদিত বাংলা অনুবাদ এখনো প্রকাশিত হয়নি।</p>}
          <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs text-slate-500">{refreshing && published ? (bn ? 'হালনাগাদ তথ্য যাচাই করা হচ্ছে...' : 'Checking for updates...') : ''}</p>
        </header>

        <div className={`grid grid-cols-1 gap-10 ${toc.length > 0 ? 'lg:grid-cols-12' : ''}`}>
          {toc.length > 0 && <aside className="hidden lg:col-span-3 lg:block"><div className="sticky top-24"><p className="mb-3 px-3 text-xs font-bold text-slate-500">{bn ? 'সূচিপত্র' : 'Table of contents'}</p>{contents}</div></aside>}
          <main className={`min-w-0 ${toc.length > 0 ? 'lg:col-span-9' : ''}`}>
            {published ? <article ref={articleRef} lang="en" data-policy-slug={slug} data-policy-published-at={published.policy.publishedAt} className="published-policy-content rounded-lg border border-slate-100 bg-white p-6 text-[15px] leading-7 text-slate-600 shadow-sm sm:p-10">
              {published.body.content}
            </article> : <div role={state.status === 'error' ? 'alert' : 'status'} className="border-y border-slate-200 py-10">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">{state.status === 'loading' ? (bn ? 'প্রকাশিত নীতি লোড হচ্ছে' : 'Loading published policy') : state.status === 'unpublished' ? (bn ? 'কোনো নীতি বর্তমানে প্রকাশিত নেই' : 'No policy is currently published') : (bn ? 'প্রকাশিত নীতি লোড করা যায়নি' : 'Unable to load the published policy')}</h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-600">{state.status === 'loading' ? (bn ? 'অনুগ্রহ করে অপেক্ষা করুন।' : 'Please wait.') : state.status === 'unpublished' ? (bn ? 'এই পাতায় দেখানোর জন্য কোনো প্রকাশিত সংস্করণ পাওয়া যায়নি।' : 'There is no published version available to display on this page.') : (bn ? 'অনুগ্রহ করে আবার চেষ্টা করুন অথবা সাপোর্টে যোগাযোগ করুন।' : 'Please try again or contact support.')}</p>
              {state.status !== 'loading' && <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"><RefreshCw className="h-4 w-4" aria-hidden="true" />{bn ? 'আবার চেষ্টা করুন' : 'Try again'}</button>}
            </div>}

            {slug === 'privacy-policy' && <div data-account-deletion-utility="true" id={toc.some(entry => entry.id === 'deletion') ? 'account-deletion-request' : 'deletion'} className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-6">
              <p className="text-sm font-medium text-slate-700">{bn ? 'আপনার অ্যাকাউন্ট মুছে ফেলতে চান?' : 'Want to delete your account?'}</p>
              <button type="button" onClick={() => setDeletionOpen(true)} className="min-h-11 rounded-lg border border-red-100 bg-red-50 px-4 text-sm font-medium text-red-700 hover:bg-red-100">{bn ? 'অ্যাকাউন্ট মুছে ফেলার অনুরোধ' : 'Request Account Deletion'}</button>
            </div>}
            <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold text-brand-600">
              <Link to={{ pathname: other.path, search: `?lang=${language}` }} className="inline-flex min-h-11 items-center gap-2 hover:underline">{bn ? other.titleBn : other.title}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href={`mailto:${companyInfo.email}`} className="inline-flex min-h-11 items-center hover:underline">{companyInfo.email}</a>
            </div>
          </main>
        </div>
      </div>
      <Suspense fallback={null}>{deletionOpen && <AccountDeletionModal isOpen onClose={() => setDeletionOpen(false)} />}</Suspense>
    </div>
  );
}
