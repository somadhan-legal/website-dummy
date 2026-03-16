import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AccountDeletionModal from './AccountDeletionModal';

const SUPABASE_URL = 'https://jlltjzwukpsuykfdixlx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbHRqend1a3BzdXlrZmRpeGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTMwNDIsImV4cCI6MjA4MzE4OTA0Mn0.-HEQ8V4qElOtP4VzuAOS24Oqc9P7wZUvmE7lUoO7HYo';

const sections = [
  { id: 'collection', titleEn: 'Information We Collect', titleBn: 'যে তথ্য আমরা সংগ্রহ করি' },
  { id: 'usage', titleEn: 'How We Use Your Information', titleBn: 'কিভাবে আমরা তথ্য ব্যবহার করি' },
  { id: 'sharing', titleEn: 'Information Sharing', titleBn: 'তথ্য শেয়ারিং' },
  { id: 'security', titleEn: 'Data Security', titleBn: 'ডেটা নিরাপত্তা' },
  { id: 'retention', titleEn: 'Data Retention', titleBn: 'ডেটা সংরক্ষণ' },
  { id: 'rights', titleEn: 'Your Rights', titleBn: 'আপনার অধিকার' },
  { id: 'cookies', titleEn: 'Cookies & Analytics', titleBn: 'কুকিজ ও অ্যানালিটিক্স' },
  { id: 'children', titleEn: 'Children\'s Privacy', titleBn: 'শিশুদের গোপনীয়তা' },
  { id: 'international', titleEn: 'International Data', titleBn: 'আন্তর্জাতিক ডেটা' },
  { id: 'deletion', titleEn: 'Account Deletion', titleBn: 'অ্যাকাউন্ট মুছে ফেলা' },
  { id: 'changes', titleEn: 'Policy Changes', titleBn: 'নীতি পরিবর্তন' },
  { id: 'contact', titleEn: 'Contact Us', titleBn: 'যোগাযোগ' },
];

const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('collection');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      const scrollPosition = window.scrollY + 120;
      let activeId = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        const el = sectionRefs.current[sections[i].id];
        if (el && el.offsetTop <= scrollPosition) {
          activeId = sections[i].id;
        }
      }

      // Check if we're at the very bottom of the document
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (isAtBottom) {
        activeId = sections[sections.length - 1].id;
      }

      setActiveSection(activeId);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
    setIsTocOpen(false);
  };

  const bn = language === 'bn';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <img
              src={bn ? '/Somadhan BLT.svg' : '/Somadhan ELT.svg'}
              alt="Somadhan"
              className="h-5 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {bn ? 'সূচিপত্র' : 'Contents'}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isTocOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile ToC Dropdown */}
      {isTocOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-lg lg:hidden max-h-[60vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {bn ? s.titleBn : s.titleEn}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">
            {bn ? 'আইনি দলিল' : 'Legal'}
          </div>
          <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-4 ${bn ? 'leading-[1.3]' : 'leading-[1.15]'}`}>
            {bn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </h1>
          <p className="text-slate-500 text-sm">
            {bn ? 'সর্বশেষ আপডেট: ১৬ মার্চ, ২০২৬' : 'Last updated: March 16, 2026'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar ToC - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
                {bn ? 'সূচিপত্র' : 'Table of Contents'}
              </p>
              <nav className="space-y-0.5">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === s.id
                        ? 'bg-brand-50 text-brand-700 font-medium border-l-2 border-brand-600'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-l-2 border-transparent'
                    }`}
                  >
                    {bn ? s.titleBn : s.titleEn}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10">
              <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:leading-relaxed prose-li:leading-relaxed">

                {/* Introduction */}
                <p className="text-slate-600 leading-relaxed">
                  {bn
                    ? 'সমাধান লিগ্যাল লিমিটেড ("সমাধান", "আমরা", "আমাদের") আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ("নীতি") ব্যাখ্যা করে কিভাবে আমরা আমাদের ওয়েবসাইট (somadhan.com), মোবাইল অ্যাপ্লিকেশন এবং সংশ্লিষ্ট সেবাসমূহ (সম্মিলিতভাবে "প্ল্যাটফর্ম") ব্যবহারের সময় আপনার তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ এবং সুরক্ষিত রাখি। এই নীতি বাংলাদেশের সাইবার নিরাপত্তা আইন ২০২৩ এবং প্রযোজ্য অন্যান্য ডেটা সুরক্ষা মানদণ্ডের সাথে সামঞ্জস্যপূর্ণ।'
                    : 'Somadhan Legal Limited ("Somadhan," "we," "our," "us") is committed to protecting your privacy. This Privacy Policy ("Policy") explains how we collect, use, store, and protect your information when you use our website (somadhan.com), mobile applications, and related services (collectively, the "Platform"). This Policy is designed in compliance with the Cyber Security Act 2023 of Bangladesh and other applicable data protection standards.'}
                </p>

                {/* Section 1 */}
                <h2
                  id="collection"
                  ref={(el) => { sectionRefs.current['collection'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১. যে তথ্য আমরা সংগ্রহ করি' : '1. Information We Collect'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn ? 'আমরা নিম্নলিখিত ধরনের তথ্য সংগ্রহ করতে পারি:' : 'We may collect the following types of information:'}
                </p>
                <h3 className={`text-lg text-slate-800 mt-4 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>
                  {bn ? 'ক. ব্যক্তিগত তথ্য' : 'a. Personal Information'}
                </h3>
                <ul className="text-slate-600 space-y-2 list-disc list-inside marker:text-slate-400">
                  <li>{bn ? 'পুরো নাম' : 'Full name'}</li>
                  <li>{bn ? 'ইমেইল ঠিকানা' : 'Email address'}</li>
                  <li>{bn ? 'ফোন নম্বর' : 'Phone number'}</li>
                  <li>{bn ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'National ID (NID) number'}</li>
                  <li>{bn ? 'পেশা সংক্রান্ত তথ্য' : 'Professional information'}</li>
                  <li>{bn ? 'পেমেন্ট ও বিলিং তথ্য' : 'Payment and billing information'}</li>
                </ul>
                <h3 className={`text-lg text-slate-800 mt-4 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>
                  {bn ? 'খ. স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য' : 'b. Automatically Collected Information'}
                </h3>
                <ul className="text-slate-600 space-y-2 list-disc list-inside marker:text-slate-400">
                  <li>{bn ? 'IP ঠিকানা ও ডিভাইসের তথ্য' : 'IP address and device information'}</li>
                  <li>{bn ? 'ব্রাউজার ধরন ও অপারেটিং সিস্টেম' : 'Browser type and operating system'}</li>
                  <li>{bn ? 'প্ল্যাটফর্ম ব্যবহারের ধরন ও পরিসংখ্যান' : 'Platform usage patterns and statistics'}</li>
                  <li>{bn ? 'ভৌগোলিক অবস্থান (শহর/অঞ্চল পর্যায়ে)' : 'Geographic location (city/region level)'}</li>
                </ul>
                <h3 className={`text-lg text-slate-800 mt-4 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>
                  {bn ? 'গ. আইনি সেবা সম্পর্কিত তথ্য' : 'c. Legal Service Information'}
                </h3>
                <ul className="text-slate-600 space-y-2 list-disc list-inside marker:text-slate-400">
                  <li>{bn ? 'আইনি সমস্যার বিবরণ' : 'Details of legal issues'}</li>
                  <li>{bn ? 'আইনজীবীর সাথে যোগাযোগের তথ্য' : 'Communication records with lawyers'}</li>
                  <li>{bn ? 'আপলোড করা নথিপত্র' : 'Uploaded documents'}</li>
                  <li>{bn ? 'সেবা বুকিং ও লেনদেনের ইতিহাস' : 'Service booking and transaction history'}</li>
                </ul>

                {/* Section 2 */}
                <h2
                  id="usage"
                  ref={(el) => { sectionRefs.current['usage'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '২. কিভাবে আমরা আপনার তথ্য ব্যবহার করি' : '2. How We Use Your Information'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn ? 'আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:' : 'We use your information for the following purposes:'}
                </p>
                <ul className="text-slate-600 space-y-2 list-disc list-inside marker:text-slate-400">
                  <li>{bn ? 'আপনাকে সেবা প্রদান ও আইনজীবীদের সাথে সংযুক্ত করা' : 'Providing services and connecting you with lawyers'}</li>
                  <li>{bn ? 'আপনার অ্যাকাউন্ট তৈরি, রক্ষণাবেক্ষণ ও যাচাই' : 'Creating, maintaining, and verifying your account'}</li>
                  <li>{bn ? 'পেমেন্ট প্রক্রিয়াকরণ ও লেনদেন ব্যবস্থাপনা' : 'Processing payments and transaction management'}</li>
                  <li>{bn ? 'সেবার মান উন্নয়ন ও ব্যবহারকারীর অভিজ্ঞতা উন্নতি' : 'Improving service quality and user experience'}</li>
                  <li>{bn ? 'নিরাপত্তা নিশ্চিতকরণ ও জালিয়াতি প্রতিরোধ' : 'Ensuring security and preventing fraud'}</li>
                  <li>{bn ? 'আইনি বাধ্যবাধকতা ও নিয়ন্ত্রক প্রয়োজনীয়তা মেনে চলা' : 'Complying with legal obligations and regulatory requirements'}</li>
                  <li>{bn ? 'গুরুত্বপূর্ণ আপডেট ও বিজ্ঞপ্তি প্রেরণ' : 'Sending important updates and notifications'}</li>
                  <li>{bn ? 'বিরোধ নিষ্পত্তি ও গ্রাহক সেবা প্রদান' : 'Resolving disputes and providing customer support'}</li>
                </ul>

                {/* Section 3 */}
                <h2
                  id="sharing"
                  ref={(el) => { sectionRefs.current['sharing'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৩. তথ্য শেয়ারিং' : '3. Information Sharing'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। তবে নিম্নলিখিত ক্ষেত্রে তথ্য শেয়ার করা হতে পারে:'
                    : 'We do not sell your personal information. However, we may share information in the following circumstances:'}
                </p>
                <ul className="text-slate-600 space-y-3">
                  <li className="pl-0"><strong>{bn ? 'আইনজীবীদের সাথে:' : 'With Lawyers:'}</strong> {bn ? 'সেবা প্রদানের জন্য আপনার নির্বাচিত আইনজীবীর সাথে প্রয়োজনীয় তথ্য শেয়ার করা হয়' : 'Necessary information is shared with your selected lawyer to provide services'}</li>
                  <li className="pl-0"><strong>{bn ? 'সেবা প্রদানকারীদের সাথে:' : 'With Service Providers:'}</strong> {bn ? 'পেমেন্ট প্রক্রিয়াকরণ, হোস্টিং, অ্যানালিটিক্স ইত্যাদি তৃতীয় পক্ষের সেবা প্রদানকারীদের সাথে' : 'Payment processing, hosting, analytics, and other third-party service providers'}</li>
                  <li className="pl-0"><strong>{bn ? 'আইনি বাধ্যবাধকতায়:' : 'Legal Obligations:'}</strong> {bn ? 'আদালতের আদেশ, সরকারি নির্দেশনা বা আইন প্রয়োগকারী সংস্থার অনুরোধে' : 'In response to court orders, government directives, or law enforcement requests'}</li>
                  <li className="pl-0"><strong>{bn ? 'ব্যবসায়িক হস্তান্তরে:' : 'Business Transfers:'}</strong> {bn ? 'একীভূতকরণ, অধিগ্রহণ বা সম্পদ বিক্রির ক্ষেত্রে' : 'In the event of a merger, acquisition, or asset sale'}</li>
                  <li className="pl-0"><strong>{bn ? 'সম্মতিক্রমে:' : 'With Consent:'}</strong> {bn ? 'আপনার সুস্পষ্ট সম্মতিতে অন্যান্য ক্ষেত্রে' : 'With your explicit consent in other cases'}</li>
                </ul>

                {/* Section 4 */}
                <h2
                  id="security"
                  ref={(el) => { sectionRefs.current['security'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৪. ডেটা নিরাপত্তা' : '4. Data Security'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'আমরা আপনার তথ্য সুরক্ষিত রাখতে শিল্প-মানের নিরাপত্তা ব্যবস্থা গ্রহণ করেছি:'
                    : 'We implement industry-standard security measures to protect your information:'}
                </p>
                <ul className="text-slate-600 space-y-2 list-disc list-inside marker:text-slate-400">
                  <li>{bn ? 'ট্রান্সমিশন ও স্টোরেজে TLS/SSL এনক্রিপশন' : 'TLS/SSL encryption for data in transit and at rest'}</li>
                  <li>{bn ? 'সুরক্ষিত সার্ভার অবকাঠামো ও ফায়ারওয়াল' : 'Secure server infrastructure with firewalls'}</li>
                  <li>{bn ? 'নিয়মিত নিরাপত্তা অডিট ও মূল্যায়ন' : 'Regular security audits and assessments'}</li>
                  <li>{bn ? 'কর্মীদের ডেটা হ্যান্ডলিং প্রশিক্ষণ' : 'Employee training on data handling practices'}</li>
                  <li>{bn ? 'এনক্রিপ্টেড পরামর্শ চ্যানেল' : 'Encrypted consultation channels'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'তবে কোনো ইন্টারনেট-ভিত্তিক সেবাই ১০০% নিরাপদ নয়। আমরা সম্ভাব্য সর্বোচ্চ নিরাপত্তা নিশ্চিত করার চেষ্টা করি, তবে পরম নিরাপত্তার গ্যারান্টি দিতে পারি না।'
                    : 'However, no internet-based service is 100% secure. While we strive to ensure the highest possible security, we cannot guarantee absolute security.'}
                </p>

                {/* Section 5 */}
                <h2
                  id="retention"
                  ref={(el) => { sectionRefs.current['retention'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৫. ডেটা সংরক্ষণ' : '5. Data Retention'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আমরা আপনার ব্যক্তিগত তথ্য কেবল ততক্ষণ পর্যন্ত সংরক্ষণ করি যতক্ষণ না এই নীতিতে বর্ণিত উদ্দেশ্যগুলো পূরণের জন্য তা প্রয়োজনীয় হয়। আইনি বাধ্যবাধকতা, বিরোধ নিষ্পত্তি এবং আমাদের চুক্তিগুলো কার্যকর করার স্বার্থে আমরা প্রয়োজনীয় তথ্য নির্দিষ্ট সময়ের জন্য সংরক্ষণ করতে পারি। সংরক্ষণকাল শেষ হলে আমরা আপনার ডেটা নিরাপদে মুছে ফেলি বা বেনামী (anonymize) করে ফেলি।'
                    : 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Policy. We may retain certain information for specific periods to comply with our legal obligations, resolve disputes, and enforce our agreements. Once the retention period expires, we securely delete or anonymize your data.'}
                </p>

                {/* Section 6 */}
                <h2
                  id="rights"
                  ref={(el) => { sectionRefs.current['rights'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৬. আপনার অধিকার' : '6. Your Rights'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn ? 'আপনার নিম্নলিখিত অধিকার রয়েছে:' : 'You have the following rights regarding your personal data:'}
                </p>
                <ul className="text-slate-600 space-y-3">
                  <li className="pl-0"><strong>{bn ? 'অ্যাক্সেসের অধিকার:' : 'Right to Access:'}</strong> {bn ? 'আমাদের কাছে সংরক্ষিত আপনার ব্যক্তিগত তথ্যের একটি অনুলিপি অনুরোধ করতে পারেন' : 'Request a copy of your personal data held by us'}</li>
                  <li className="pl-0"><strong>{bn ? 'সংশোধনের অধিকার:' : 'Right to Correction:'}</strong> {bn ? 'ভুল বা অসম্পূর্ণ তথ্য সংশোধন বা হালনাগাদের অনুরোধ করতে পারেন' : 'Request correction or update of inaccurate or incomplete data'}</li>
                  <li className="pl-0"><strong>{bn ? 'মুছে ফেলার অধিকার:' : 'Right to Deletion:'}</strong> {bn ? 'নির্দিষ্ট শর্ত সাপেক্ষে আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন' : 'Request deletion of your data subject to certain conditions'}</li>
                  <li className="pl-0"><strong>{bn ? 'আপত্তির অধিকার:' : 'Right to Object:'}</strong> {bn ? 'মার্কেটিং উদ্দেশ্যে তথ্য ব্যবহারে আপত্তি জানাতে পারেন' : 'Object to the processing of your data for marketing purposes'}</li>
                  <li className="pl-0"><strong>{bn ? 'পোর্টেবিলিটির অধিকার:' : 'Right to Portability:'}</strong> {bn ? 'আপনার তথ্য একটি কাঠামোগত, পঠনযোগ্য ফরম্যাটে পাওয়ার অনুরোধ করতে পারেন' : 'Request your data in a structured, readable format'}</li>
                  <li className="pl-0"><strong>{bn ? 'সম্মতি প্রত্যাহারের অধিকার:' : 'Right to Withdraw Consent:'}</strong> {bn ? 'যেকোনো সময় তথ্য প্রক্রিয়াকরণের জন্য দেওয়া সম্মতি প্রত্যাহার করতে পারেন' : 'Withdraw your consent for data processing at any time'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'এই অধিকারগুলো প্রয়োগ করতে info@somadhan.com-এ ইমেইল করুন। আমরা ১৫ কার্যদিবসের মধ্যে আপনার অনুরোধে সাড়া দেব।'
                    : 'To exercise these rights, email us at info@somadhan.com. We will respond to your request within 15 business days.'}
                </p>

                {/* Section 7 */}
                <h2
                  id="cookies"
                  ref={(el) => { sectionRefs.current['cookies'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৭. কুকিজ ও অ্যানালিটিক্স' : '7. Cookies and Analytics'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'আমরা ওয়েবসাইটের কার্যকারিতা উন্নত করতে এবং ব্যবহারকারীর অভিজ্ঞতা পরিমাপ করতে কুকিজ ও অ্যানালিটিক্স টুল ব্যবহার করি:'
                    : 'We use cookies and analytics tools to improve website functionality and measure user experience:'}
                </p>
                <ul className="text-slate-600 space-y-3">
                  <li className="pl-0"><strong>{bn ? 'অত্যাবশ্যকীয় কুকিজ:' : 'Essential Cookies:'}</strong> {bn ? 'ওয়েবসাইটের মৌলিক কার্যকারিতার জন্য প্রয়োজনীয়' : 'Required for basic website functionality'}</li>
                  <li className="pl-0"><strong>{bn ? 'অ্যানালিটিক্স কুকিজ:' : 'Analytics Cookies:'}</strong> {bn ? 'ওয়েবসাইটের ব্যবহার বুঝতে Google Analytics ব্যবহৃত হয়' : 'Google Analytics is used to understand website usage'}</li>
                  <li className="pl-0"><strong>{bn ? 'পারফরম্যান্স কুকিজ:' : 'Performance Cookies:'}</strong> {bn ? 'ওয়েবসাইটের গতি ও কার্যক্ষমতা পরিমাপ করতে' : 'To measure website speed and performance'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'আপনি আপনার ব্রাউজারের সেটিংস থেকে কুকিজ নিয়ন্ত্রণ বা মুছে ফেলতে পারেন। তবে কুকিজ নিষ্ক্রিয় করলে ওয়েবসাইটের কিছু বৈশিষ্ট্য সঠিকভাবে কাজ নাও করতে পারে।'
                    : 'You can control or delete cookies through your browser settings. However, disabling cookies may affect certain features of the website.'}
                </p>

                {/* Section 8 */}
                <h2
                  id="children"
                  ref={(el) => { sectionRefs.current['children'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৮. শিশুদের গোপনীয়তা' : '8. Children\'s Privacy'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আমাদের প্ল্যাটফর্ম ১৮ বছরের কম বয়সীদের জন্য নয়। আমরা জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের ব্যক্তিগত তথ্য সংগ্রহ করি না। যদি আমরা জানতে পারি যে ১৩ বছরের কম বয়সী কারো তথ্য সংগৃহীত হয়েছে, তাহলে আমরা তা অবিলম্বে মুছে ফেলার ব্যবস্থা নেব। অভিভাবকরা এ ধরনের বিষয়ে info@somadhan.com-এ যোগাযোগ করতে পারেন।'
                    : 'Our Platform is not intended for users under the age of 18. We do not knowingly collect personal information from children under the age of 13. If we become aware that information has been collected from a child under 13, we will take steps to delete it immediately. Parents or guardians can contact us at info@somadhan.com regarding such matters.'}
                </p>

                {/* Section 9 */}
                <h2
                  id="international"
                  ref={(el) => { sectionRefs.current['international'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৯. আন্তর্জাতিক ডেটা স্থানান্তর' : '9. International Data Transfers'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আমাদের সেবাসমূহ বাংলাদেশ থেকে পরিচালিত হয়। আপনি যদি অন্য দেশ থেকে আমাদের প্ল্যাটফর্ম ব্যবহার করেন, তবে আপনার তথ্য বাংলাদেশে স্থানান্তরিত এবং প্রক্রিয়াজাত হতে পারে। আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি এই স্থানান্তরে সম্মতি প্রদান করছেন। আমরা নিশ্চিত করি যে স্থানান্তরিত ডেটা যথাযথ নিরাপত্তা ব্যবস্থার মাধ্যমে সুরক্ষিত থাকে।'
                    : 'Our services are operated from Bangladesh. If you access our Platform from other countries, your information may be transferred to and processed in Bangladesh. By using our Platform, you consent to this transfer. We ensure that transferred data is protected through appropriate security measures.'}
                </p>

                {/* Section 10 - Account Deletion */}
                <h2
                  id="deletion"
                  ref={(el) => { sectionRefs.current['deletion'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১০. অ্যাকাউন্ট মুছে ফেলা' : '10. Account Deletion'}
                </h2>
                <p className="text-slate-600 mb-6">
                  {bn
                    ? 'আপনি যেকোনো সময় আপনার অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারেন। অনুরোধ জমা দেওয়ার পর আমরা আপনার পরিচয় যাচাই করব এবং ৭ কার্যদিবসের মধ্যে আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য মুছে ফেলা শুরু করব। মুছে ফেলার প্রক্রিয়া চলাকালীন আপনি অনুরোধটি প্রত্যাহার করতে পারেন। আইনি বাধ্যবাধকতার জন্য প্রয়োজনীয় কিছু তথ্য নির্ধারিত সময়কাল পর্যন্ত সংরক্ষিত থাকতে পারে।'
                    : 'You may request deletion of your account at any time. After submitting a request, we will verify your identity and begin deleting your account and associated data within 7 business days. You may withdraw the request during the processing period. Certain information required for legal obligations may be retained for the designated retention period.'}
                </p>

                <div className="not-prose bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className={`font-serif text-lg text-slate-900 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>
                      {bn ? 'আপনার অ্যাকাউন্ট মুছে ফেলতে চান?' : 'Want to delete your account?'}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-md">
                      {bn
                        ? 'আপনার অ্যাকাউন্ট ও ব্যক্তিগত তথ্য স্থায়ীভাবে মুছে ফেলার জন্য একটি অনুরোধ জমা দিন।'
                        : 'Submit a request to permanently delete your account and associated personal data.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDeletionModalOpen(true)}
                    className="shrink-0 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm rounded-xl transition-colors border border-red-100"
                  >
                    {bn ? 'অ্যাকাউন্ট মুছে ফেলার অনুরোধ' : 'Request Account Deletion'}
                  </button>
                </div>

                {/* Section 11 */}
                <h2
                  id="changes"
                  ref={(el) => { sectionRefs.current['changes'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১১. নীতি পরিবর্তন' : '11. Policy Changes'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আমরা প্ল্যাটফর্মে বিজ্ঞপ্তি প্রদান করব এবং/অথবা আপনার ইমেইলে জানাব। পরিবর্তিত নীতি কার্যকর হওয়ার পরে প্ল্যাটফর্ম ব্যবহার অব্যাহত রাখলে তা পরিবর্তনগুলো গ্রহণ করা হয়েছে বলে গণ্য হবে। গোপনীয়তা নীতির সর্বশেষ সংস্করণ সবসময় আমাদের ওয়েবসাইটে পাওয়া যাবে।'
                    : 'We may update this Privacy Policy from time to time. For material changes, we will provide notice on the Platform and/or notify you via email. Your continued use of the Platform after the updated Policy becomes effective constitutes acceptance of the changes. The latest version of this Privacy Policy will always be available on our website.'}
                </p>

                {/* Section 12 */}
                <h2
                  id="contact"
                  ref={(el) => { sectionRefs.current['contact'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১২. যোগাযোগ' : '12. Contact Us'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'গোপনীয়তা সম্পর্কিত কোনো প্রশ্ন, উদ্বেগ বা অনুরোধ থাকলে অনুগ্রহ করে যোগাযোগ করুন:'
                    : 'For any privacy-related questions, concerns, or requests, please contact us:'}
                </p>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 not-prose">
                  <p className="font-semibold text-slate-900 mb-2">
                    {bn ? 'সমাধান লিগ্যাল লিমিটেড' : 'Somadhan Legal Limited'}
                  </p>
                  <div className="space-y-1 text-slate-600 text-sm">
                    <p>{bn ? 'ইমেইল: info@somadhan.com' : 'Email: info@somadhan.com'}</p>
                    <p>{bn ? 'গোপনীয়তা বিষয়ক ইমেইল: privacy@somadhan.com' : 'Privacy inquiries: privacy@somadhan.com'}</p>
                    <p>{bn ? 'ওয়েবসাইট: somadhan.com' : 'Website: somadhan.com'}</p>
                    <p>{bn ? 'ঠিকানা: ঢাকা, বাংলাদেশ' : 'Address: Dhaka, Bangladesh'}</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Related Links */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            to="/terms"
            className="flex-1 p-5 bg-white border border-slate-100 rounded-xl hover:border-brand-200 hover:shadow-md transition-all group"
          >
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{bn ? 'সম্পর্কিত' : 'Related'}</p>
            <p className={`font-serif text-lg text-slate-900 group-hover:text-brand-600 transition-colors ${bn ? 'leading-[1.4]' : ''}`}>
              {bn ? 'শর্তাবলী' : 'Terms and Conditions'} →
            </p>
          </Link>
          <Link
            to="/"
            className="flex-1 p-5 bg-white border border-slate-100 rounded-xl hover:border-brand-200 hover:shadow-md transition-all group"
          >
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{bn ? 'প্রধান' : 'Home'}</p>
            <p className={`font-serif text-lg text-slate-900 group-hover:text-brand-600 transition-colors ${bn ? 'leading-[1.4]' : ''}`}>
              {bn ? 'মূল পাতায় ফিরুন' : 'Back to Home'} →
            </p>
          </Link>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-[fadeIn_0.2s_ease-out]"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Account Deletion Modal */}
      <AccountDeletionModal 
        isOpen={isDeletionModalOpen} 
        onClose={() => setIsDeletionModalOpen(false)} 
      />
    </div>
  );
};

export default PrivacyPolicyPage;
