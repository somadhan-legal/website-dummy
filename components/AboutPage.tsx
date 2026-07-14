import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Lock,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { companyInfo } from '../lib/companyInfo';
import { trackCTAClick, trackNavClick } from '../lib/analytics';

const AboutPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const bn = language === 'bn';
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: bn ? 'আমাদের সম্পর্কে | সমাধান' : 'About Us | Somadhan',
    description: bn
      ? 'সমাধান লিগ্যাল লিমিটেড সম্পর্কে জানুন: বাংলাদেশে সহজ, স্বচ্ছ ও নিরাপদ আইনি সহায়তার জন্য একটি ডিজিটাল প্ল্যাটফর্ম।'
      : 'Learn about Somadhan Legal Limited, a Bangladesh legal-tech platform built to make legal help clearer, safer, and easier to access.',
    canonical: 'https://somadhan.com/about',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsToolsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const principles = [
    {
      icon: ShieldCheck,
      number: '01',
      title: bn ? 'যাচাইকৃত পেশাজীবী' : 'Verified Professionals',
      body: bn
        ? 'ব্যবহারকারীদের যাচাইকৃত আইনজীবীদের সাথে সংযুক্ত করতে আমরা পরিচয়, যোগ্যতা ও পেশাগত তথ্য গুরুত্ব দিয়ে দেখি।'
        : 'We focus on connecting people with verified lawyers and keeping professional information clear before a service begins.',
    },
    {
      icon: Lock,
      number: '02',
      title: bn ? 'গোপনীয়তার প্রতি সম্মান' : 'Privacy By Design',
      body: bn
        ? 'আইনি বিষয় ব্যক্তিগত। তাই তথ্য সুরক্ষা, সীমিত অ্যাক্সেস ও ব্যবহারকারীর নিয়ন্ত্রণ আমাদের পণ্যের কেন্দ্রে থাকে।'
        : 'Legal matters are personal. Data protection, limited access, and user control sit at the center of how we build.',
    },
    {
      icon: CheckCircle2,
      number: '03',
      title: bn ? 'স্বচ্ছ সেবা ও ফি' : 'Clear Services And Fees',
      body: bn
        ? 'সেবা, খরচ, পেমেন্ট এবং পরবর্তী ধাপ যতটা সম্ভব সরল ও বোঝার মতো করে দেখানোই আমাদের লক্ষ্য।'
        : 'We aim to make services, costs, payments, and next steps visible in plain language before users commit.',
    },
  ];

  const heroPoints = [
    {
      icon: ShieldCheck,
      title: bn ? 'যাচাইকৃত আইনজীবী' : 'Verified lawyers',
      body: bn ? 'মানুষকে সঠিক পেশাজীবীর সাথে সংযুক্ত করা' : 'Connecting people with the right professionals',
    },
    {
      icon: FileCheck2,
      title: bn ? 'সহজ নথিপত্র' : 'Simpler documents',
      body: bn ? 'আইনি কাজের কাগজপত্র ও ধাপ সহজ করা' : 'Making legal paperwork easier to follow',
    },
    {
      icon: Sparkles,
      title: bn ? 'স্বচ্ছ অভিজ্ঞতা' : 'Clear experience',
      body: bn ? 'খরচ, বুকিং ও পরবর্তী ধাপ পরিষ্কার রাখা' : 'Keeping costs, bookings, and next steps visible',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center text-slate-600 hover:text-brand-600 transition-colors">
            <img
              src={bn ? '/Somadhan BLT.svg' : '/Somadhan ELT.svg'}
              alt="Somadhan"
              className="h-5 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link
              to="/#services"
              onClick={() => trackNavClick('services', '/#services')}
              className={`text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors ${bn ? 'tracking-wide' : ''}`}
            >
              {t('nav.services')}
            </Link>
            <div ref={toolsMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsToolsOpen((open) => !open)}
                aria-expanded={isToolsOpen}
                aria-haspopup="menu"
                className={`inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors ${bn ? 'tracking-wide' : ''}`}
              >
                {t('nav.tools')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="menu"
                  className="absolute top-full left-1/2 mt-2.5 w-40 -translate-x-1/2 overflow-hidden rounded-md bg-white shadow-[0_10px_30px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5"
                >
                  <a
                    href={companyInfo.somadhanSignUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => {
                      trackNavClick('somadhan_sign', companyInfo.somadhanSignUrl);
                      setIsToolsOpen(false);
                    }}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    <span>Somadhan Sign</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  </a>
                </motion.div>
              )}
            </div>
            <Link
              to="/about"
              onClick={() => trackNavClick('about', '/about')}
              className={`text-sm font-medium text-brand-600 transition-colors ${bn ? 'tracking-wide' : ''}`}
            >
              {t('nav.about')}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(bn ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {bn ? 'EN' : 'বাং'}
            </button>
            <a
              href={companyInfo.somadhanSignUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('get_started', 'about_navbar')}
              className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
            >
              {t('nav.getStarted')}
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-28 pb-18 sm:pt-32 sm:pb-24 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-5xl mx-auto text-center"
            >
              <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-5">
                {bn ? companyInfo.legalNameBn : companyInfo.legalName}
              </p>
              <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 tracking-tight mb-6 mx-auto max-w-4xl ${bn ? 'leading-[1.25]' : 'leading-[1.05]'}`}>
                {bn ? 'বাংলাদেশে আইনি সহায়তা আরও সহজ করার পথে' : 'Legal help, made simpler for Bangladesh'}
              </h1>
              <p className={`text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto ${bn ? 'leading-relaxed' : ''}`}>
                {bn
                  ? 'সমাধান লিগ্যাল লিমিটেড একটি আইনি প্রযুক্তি প্ল্যাটফর্ম, যা মানুষকে যাচাইকৃত আইনজীবীর সাথে সংযুক্ত করে, নথিপত্র ও পরামর্শের অভিজ্ঞতা সহজ করে এবং আইনি সেবা গ্রহণকে আরও স্বচ্ছ করতে কাজ করে।'
                  : 'Somadhan Legal Limited is a legal technology platform built to connect people with verified lawyers, simplify legal documents and consultations, and make access to legal services more transparent.'}
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto border-y border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                {heroPoints.map((item) => (
                  <div key={item.title} className="px-4 py-5 sm:px-6 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-4 h-4 text-brand-600" strokeWidth={1.7} />
                      <p className={`font-semibold text-slate-900 text-sm ${bn ? 'leading-relaxed' : ''}`}>{item.title}</p>
                    </div>
                    <p className={`text-sm text-slate-500 leading-relaxed ${bn ? 'leading-relaxed' : ''}`}>{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className={`font-serif text-3xl sm:text-4xl text-slate-900 mb-4 ${bn ? 'leading-[1.35]' : 'leading-[1.12]'}`}>
                {bn ? 'আমরা কেন কাজটি করছি' : 'Why we are building Somadhan'}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  {bn
                    ? 'বাংলাদেশে আইনি সহায়তা পাওয়া অনেকের জন্য সময়সাপেক্ষ, বিভ্রান্তিকর এবং অস্বস্তিকর হতে পারে। সঠিক আইনজীবী খুঁজে পাওয়া, সেবার খরচ বোঝা এবং পরবর্তী ধাপ জানা অনেক সময় কঠিন হয়ে যায়।'
                    : 'Getting legal help in Bangladesh can feel slow, confusing, and uncomfortable. Finding the right lawyer, understanding fees, and knowing the next step should be easier than it usually is.'}
                </p>
                <p>
                  {bn
                    ? 'সমাধান সেই অভিজ্ঞতাকে ডিজিটাল, স্বচ্ছ ও ব্যবহারকারীবান্ধব করতে তৈরি হচ্ছে। আমরা প্রযুক্তির মাধ্যমে আইনি সহায়তার দরজাটি আরও সহজে খুলতে চাই।'
                    : 'Somadhan is being built to make that experience digital, transparent, and easier to navigate. We want technology to open a clearer path to professional legal support.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                {principles.map((item) => (
                  <div key={item.title} className="grid sm:grid-cols-[88px_1fr] gap-4 p-5 sm:p-6 border-b border-slate-100 last:border-b-0">
                    <div className="flex sm:flex-col items-center sm:items-start gap-3">
                      <span className="text-xs font-bold text-brand-600 tabular-nums">{item.number}</span>
                      <div className="w-11 h-11 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-brand-600" strokeWidth={1.6} />
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-slate-900 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>{item.title}</h3>
                      <p className={`text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl ${bn ? 'leading-relaxed' : ''}`}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-7">
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">
                  {bn ? 'আমাদের সেবা' : 'What We Do'}
                </p>
                <div className="space-y-4">
                  {[
                    bn ? 'যাচাইকৃত আইনজীবীর সাথে অডিও ও ভিডিও পরামর্শ' : 'Audio and video consultations with verified lawyers',
                    bn ? 'আইনি নথিপত্র প্রস্তুতি ও পর্যালোচনার সহায়তা' : 'Support for legal document preparation and review',
                    bn ? 'বুকিং, পেমেন্ট এবং সেবা-সংক্রান্ত আপডেট ব্যবস্থাপনা' : 'Booking, payment, and service update management',
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" strokeWidth={1.7} />
                      <p className={`text-slate-700 ${bn ? 'leading-relaxed' : ''}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className={`font-serif text-3xl sm:text-4xl text-slate-900 mb-4 ${bn ? 'leading-[1.35]' : 'leading-[1.12]'}`}>
                {bn ? 'স্বচ্ছতার সাথে প্রযুক্তি' : 'Technology with a clear boundary'}
              </h2>
              <p className={`text-slate-600 leading-relaxed mb-5 ${bn ? 'leading-relaxed' : ''}`}>
                {bn
                  ? 'সমাধান সরাসরি আইনি পরামর্শ দেয় না এবং আইন সংস্থা হিসেবে কাজ করে না। আমরা একটি প্রযুক্তি প্ল্যাটফর্ম, যা ব্যবহারকারী ও স্বতন্ত্র, লাইসেন্সপ্রাপ্ত আইনজীবীদের মধ্যে সংযোগ তৈরি করে।'
                  : 'Somadhan does not directly provide legal advice and does not operate as a law firm. We are a technology platform that helps users connect with independent, licensed lawyers.'}
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className={`text-sm font-medium text-amber-900 ${bn ? 'leading-relaxed' : ''}`}>
                  {bn
                    ? 'প্ল্যাটফর্মের মাধ্যমে প্রাপ্ত যেকোনো আইনি মতামত সংশ্লিষ্ট আইনজীবীর পেশাগত মতামত।'
                    : 'Any legal opinion received through the Platform is the professional opinion of the respective lawyer.'}
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutPage;
