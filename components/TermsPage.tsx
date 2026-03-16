import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const sections = [
  { id: 'acceptance', titleEn: 'Acceptance of Terms', titleBn: 'শর্তাবলী গ্রহণ' },
  { id: 'eligibility', titleEn: 'Eligibility', titleBn: 'যোগ্যতা' },
  { id: 'services', titleEn: 'Description of Services', titleBn: 'সেবার বিবরণ' },
  { id: 'account', titleEn: 'Account Registration', titleBn: 'অ্যাকাউন্ট নিবন্ধন' },
  { id: 'fees', titleEn: 'Fees & Payments', titleBn: 'ফি ও পেমেন্ট' },
  { id: 'conduct', titleEn: 'User Conduct', titleBn: 'ব্যবহারকারীর আচরণ' },
  { id: 'ip', titleEn: 'Intellectual Property', titleBn: 'মেধাস্বত্ব' },
  { id: 'disclaimer', titleEn: 'Disclaimers', titleBn: 'দাবিত্যাগ' },
  { id: 'limitation', titleEn: 'Limitation of Liability', titleBn: 'দায় সীমাবদ্ধতা' },
  { id: 'indemnification', titleEn: 'Indemnification', titleBn: 'ক্ষতিপূরণ' },
  { id: 'termination', titleEn: 'Termination', titleBn: 'সমাপ্তি' },
  { id: 'governing', titleEn: 'Governing Law', titleBn: 'প্রযোজ্য আইন' },
  { id: 'changes', titleEn: 'Changes to Terms', titleBn: 'শর্তাবলী পরিবর্তন' },
  { id: 'contact', titleEn: 'Contact Us', titleBn: 'যোগাযোগ' },
];

const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('acceptance');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[sections[i].id];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 100;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
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
                  activeSection === s.id
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
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
            {bn ? 'শর্তাবলী' : 'Terms and Conditions'}
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
                <p className={`text-slate-600 leading-relaxed ${bn ? '' : ''}`}>
                  {bn
                    ? 'সমাধান-এ আপনাকে স্বাগতম। সমাধান টেকনোলজিস লিমিটেড ("সমাধান", "আমরা", "আমাদের") বাংলাদেশে নিবন্ধিত একটি প্রযুক্তি কোম্পানি যা ডিজিটাল আইনি সেবা প্রদান করে। এই শর্তাবলী ("শর্তাবলী") আপনার এবং সমাধান-এর মধ্যে একটি আইনত বাধ্যতামূলক চুক্তি গঠন করে। আমাদের ওয়েবসাইট (somadhan.com), মোবাইল অ্যাপ্লিকেশন এবং সংশ্লিষ্ট সেবাসমূহ (সম্মিলিতভাবে "প্ল্যাটফর্ম") ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।'
                    : 'Welcome to Somadhan. Somadhan Technologies Limited ("Somadhan," "we," "our," "us") is a technology company registered in Bangladesh that provides digital legal services. These Terms and Conditions ("Terms") constitute a legally binding agreement between you and Somadhan. Please read these Terms carefully before using our website (somadhan.com), mobile applications, and related services (collectively, the "Platform").'}
                </p>

                {/* Section 1 */}
                <h2
                  id="acceptance"
                  ref={(el) => { sectionRefs.current['acceptance'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১. শর্তাবলী গ্রহণ' : '1. Acceptance of Terms'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'প্ল্যাটফর্ম অ্যাক্সেস বা ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনি এই শর্তাবলী পড়েছেন, বুঝেছেন এবং মেনে চলতে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলীর যেকোনো অংশের সাথে একমত না হন, তাহলে আপনি আমাদের প্ল্যাটফর্ম ব্যবহার করতে পারবেন না। এই শর্তাবলী আমাদের গোপনীয়তা নীতির সাথে সংযুক্ত, যা এই শর্তাবলীর একটি অবিচ্ছেদ্য অংশ।'
                    : 'By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Platform. These Terms are supplemented by our Privacy Policy, which forms an integral part of this agreement.'}
                </p>

                {/* Section 2 */}
                <h2
                  id="eligibility"
                  ref={(el) => { sectionRefs.current['eligibility'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '২. যোগ্যতা' : '2. Eligibility'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'প্ল্যাটফর্ম ব্যবহার করতে আপনাকে অবশ্যই বাংলাদেশের আইন অনুযায়ী কমপক্ষে ১৮ বছর বয়সী এবং চুক্তি সম্পাদনে সক্ষম হতে হবে। আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনি এই যোগ্যতার মানদণ্ড পূরণ করেন। ১৮ বছরের কম বয়সীদের অভিভাবকের তত্ত্বাবধানে প্ল্যাটফর্ম ব্যবহার করতে হবে।'
                    : 'To use the Platform, you must be at least 18 years of age and legally capable of entering into binding contracts under Bangladeshi law. By using our Platform, you represent and warrant that you meet these eligibility requirements. Users under 18 must use the Platform under the supervision of a legal guardian.'}
                </p>

                {/* Section 3 */}
                <h2
                  id="services"
                  ref={(el) => { sectionRefs.current['services'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৩. সেবার বিবরণ' : '3. Description of Services'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'সমাধান একটি প্রযুক্তি-ভিত্তিক প্ল্যাটফর্ম যা ব্যবহারকারীদের যাচাইকৃত আইনজীবীদের সাথে সংযুক্ত করে। আমাদের সেবাসমূহের মধ্যে রয়েছে:'
                    : 'Somadhan is a technology-enabled platform that connects users with verified lawyers. Our services include:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'যাচাইকৃত আইনজীবীদের সাথে অডিও ও ভিডিও কলের মাধ্যমে পরামর্শ' : 'Audio and video consultations with verified lawyers'}</li>
                  <li>{bn ? 'আইনি বিভাগ অনুযায়ী আইনজীবী অনুসন্ধান ও মিলকরণ' : 'Lawyer search and matching based on legal categories'}</li>
                  <li>{bn ? 'আইনি নথিপত্র পর্যালোচনা ও প্রস্তুতি সহায়তা' : 'Legal document review and preparation assistance'}</li>
                  <li>{bn ? 'অনলাইন বুকিং ও পেমেন্ট ব্যবস্থাপনা' : 'Online booking and payment management'}</li>
                  <li>{bn ? 'মামলা ও ইভেন্ট ট্র্যাকিং' : 'Case and event tracking'}</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                  <p className="text-amber-800 text-sm font-medium mb-1">
                    {bn ? 'গুরুত্বপূর্ণ বিজ্ঞপ্তি' : 'Important Notice'}
                  </p>
                  <p className="text-amber-700 text-sm">
                    {bn
                      ? 'সমাধান একটি আইন সংস্থা নয় এবং সরাসরি আইনি পরামর্শ প্রদান করে না। আমরা একটি প্রযুক্তি প্ল্যাটফর্ম যা ব্যবহারকারীদের স্বতন্ত্র, লাইসেন্সপ্রাপ্ত আইনজীবীদের সাথে সংযুক্ত করে। প্ল্যাটফর্মের মাধ্যমে প্রাপ্ত যেকোনো আইনি পরামর্শ সংশ্লিষ্ট আইনজীবীর নিজস্ব পেশাদার মতামত।'
                      : 'Somadhan is not a law firm and does not provide legal advice directly. We are a technology platform that connects users with independent, licensed lawyers. Any legal advice received through the Platform is the professional opinion of the respective lawyer.'}
                  </p>
                </div>

                {/* Section 4 */}
                <h2
                  id="account"
                  ref={(el) => { sectionRefs.current['account'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৪. অ্যাকাউন্ট নিবন্ধন' : '4. Account Registration'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'আমাদের সেবা ব্যবহার করতে আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হবে। অ্যাকাউন্ট তৈরির সময় আপনাকে সঠিক ও হালনাগাদ তথ্য প্রদান করতে হবে, যার মধ্যে রয়েছে:'
                    : 'To use our services, you must create an account. During registration, you must provide accurate and up-to-date information, including:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'পুরো নাম (সরকারি পরিচয়পত্র অনুযায়ী)' : 'Full name (as per government-issued ID)'}</li>
                  <li>{bn ? 'ইমেইল ঠিকানা' : 'Email address'}</li>
                  <li>{bn ? 'ফোন নম্বর' : 'Phone number'}</li>
                  <li>{bn ? 'জাতীয় পরিচয়পত্র (NID) নম্বর (প্রযোজ্য ক্ষেত্রে)' : 'National ID (NID) number (where applicable)'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'আপনি আপনার অ্যাকাউন্টের লগইন তথ্যের গোপনীয়তা বজায় রাখতে এবং আপনার অ্যাকাউন্টের অধীনে সংঘটিত সমস্ত কার্যকলাপের জন্য দায়ী থাকবেন। কোনো অননুমোদিত ব্যবহার সন্দেহ হলে অবিলম্বে আমাদের জানাবেন।'
                    : 'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately if you suspect any unauthorized use of your account.'}
                </p>

                {/* Section 5 */}
                <h2
                  id="fees"
                  ref={(el) => { sectionRefs.current['fees'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৫. ফি ও পেমেন্ট' : '5. Fees and Payments'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'প্ল্যাটফর্মের মাধ্যমে সেবা গ্রহণের জন্য নির্ধারিত ফি প্রযোজ্য। ফি সম্পর্কিত গুরুত্বপূর্ণ তথ্য:'
                    : 'Fees are applicable for services accessed through the Platform. Important information regarding fees:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'সেবার ফি পরামর্শ বুকিং বা সেবা কেনার পূর্বে স্পষ্টভাবে প্রদর্শিত হবে' : 'Service fees will be clearly displayed before booking a consultation or purchasing a service'}</li>
                  <li>{bn ? 'পেমেন্ট বিকাশ, নগদ, রকেট, ব্যাংক কার্ড বা অন্যান্য অনুমোদিত মাধ্যমে করা যাবে' : 'Payments can be made via bKash, Nagad, Rocket, bank cards, or other approved methods'}</li>
                  <li>{bn ? 'কল-ভিত্তিক পরামর্শে আইনজীবীর নির্ধারিত রেট অনুযায়ী প্রতি মিনিটে চার্জ প্রযোজ্য' : 'Call-based consultations are charged per minute based on the lawyer\'s rate'}</li>
                  <li>{bn ? 'ওয়ালেট ব্যালেন্সের মাধ্যমে পেমেন্ট কাটা হবে' : 'Payments are deducted from your wallet balance'}</li>
                  <li>{bn ? 'রিফান্ড সেবার শর্তাবলী অনুযায়ী প্রসেস করা হবে এবং সাধারণত ওয়ালেটে ফেরত দেওয়া হবে' : 'Refunds are processed according to service terms and are typically credited back to your wallet'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'সমস্ত মূল্য বাংলাদেশি টাকায় (BDT) প্রদর্শিত হবে এবং প্রযোজ্য কর ও ভ্যাট অন্তর্ভুক্ত থাকতে পারে।'
                    : 'All prices are displayed in Bangladeshi Taka (BDT) and may include applicable taxes and VAT.'}
                </p>

                {/* Section 6 */}
                <h2
                  id="conduct"
                  ref={(el) => { sectionRefs.current['conduct'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৬. ব্যবহারকারীর আচরণ' : '6. User Conduct'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn ? 'প্ল্যাটফর্ম ব্যবহারের সময় আপনি নিম্নলিখিত কাজগুলো করবেন না:' : 'While using the Platform, you agree not to:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'মিথ্যা, বিভ্রান্তিকর বা প্রতারণামূলক তথ্য প্রদান' : 'Provide false, misleading, or fraudulent information'}</li>
                  <li>{bn ? 'অন্য কোনো ব্যক্তির পরিচয়ে ছদ্মবেশ ধারণ' : 'Impersonate any other person or entity'}</li>
                  <li>{bn ? 'প্ল্যাটফর্মের নিরাপত্তা ব্যবস্থা লঙ্ঘন বা পরিবর্তনের চেষ্টা' : 'Attempt to breach or circumvent any security measures of the Platform'}</li>
                  <li>{bn ? 'বেআইনি, ক্ষতিকর, হুমকিমূলক বা আপত্তিকর কন্টেন্ট আপলোড বা শেয়ার' : 'Upload or share unlawful, harmful, threatening, or objectionable content'}</li>
                  <li>{bn ? 'প্ল্যাটফর্মের কোনো অংশ রিভার্স ইঞ্জিনিয়ারিং, ডিকম্পাইল বা অনুলিপি করার চেষ্টা' : 'Attempt to reverse engineer, decompile, or copy any part of the Platform'}</li>
                  <li>{bn ? 'স্বয়ংক্রিয় স্ক্রিপ্ট, বট বা ক্রলার ব্যবহার করে প্ল্যাটফর্ম অ্যাক্সেস' : 'Use automated scripts, bots, or crawlers to access the Platform'}</li>
                  <li>{bn ? 'বাংলাদেশের প্রচলিত আইন লঙ্ঘন করে এমন কোনো কাজে প্ল্যাটফর্ম ব্যবহার' : 'Use the Platform for any activity that violates the laws of Bangladesh'}</li>
                </ul>

                {/* Section 7 */}
                <h2
                  id="ip"
                  ref={(el) => { sectionRefs.current['ip'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৭. মেধাস্বত্ব' : '7. Intellectual Property'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'প্ল্যাটফর্মের সমস্ত কন্টেন্ট, ডিজাইন, লোগো, ট্রেডমার্ক, সফটওয়্যার কোড এবং অন্যান্য মেধাস্বত্ব সমাধান টেকনোলজিস লিমিটেড-এর সম্পত্তি এবং বাংলাদেশের কপিরাইট আইন ২০০০, ট্রেডমার্ক আইন ২০০৯ এবং প্রযোজ্য আন্তর্জাতিক আইন দ্বারা সুরক্ষিত। আমাদের পূর্ব লিখিত অনুমতি ব্যতীত প্ল্যাটফর্মের কোনো অংশ পুনরুৎপাদন, বিতরণ, পরিবর্তন বা বাণিজ্যিকভাবে ব্যবহার করা যাবে না।'
                    : 'All content, design, logos, trademarks, software code, and other intellectual property on the Platform are the property of Somadhan Technologies Limited and are protected by the Copyright Act 2000, the Trademarks Act 2009 of Bangladesh, and applicable international laws. No part of the Platform may be reproduced, distributed, modified, or used commercially without our prior written consent.'}
                </p>

                {/* Section 8 */}
                <h2
                  id="disclaimer"
                  ref={(el) => { sectionRefs.current['disclaimer'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৮. দাবিত্যাগ' : '8. Disclaimers'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'প্ল্যাটফর্ম এবং সেবাসমূহ "যেমন আছে" ভিত্তিতে প্রদান করা হয়। সমাধান নিম্নলিখিত বিষয়ে কোনো ওয়ারেন্টি বা গ্যারান্টি প্রদান করে না:'
                    : 'The Platform and services are provided on an "as is" and "as available" basis. Somadhan makes no warranties or guarantees regarding:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'প্ল্যাটফর্মের মাধ্যমে প্রদত্ত আইনি পরামর্শের মান বা ফলাফল' : 'The quality or outcome of legal advice provided through the Platform'}</li>
                  <li>{bn ? 'সেবার নিরবচ্ছিন্নতা, নির্ভুলতা বা ত্রুটিমুক্ততা' : 'Uninterrupted, accurate, or error-free service availability'}</li>
                  <li>{bn ? 'কোনো নির্দিষ্ট আইনি ফলাফল অর্জন' : 'Achievement of any particular legal outcome'}</li>
                  <li>{bn ? 'তৃতীয় পক্ষের সেবা বা পেমেন্ট গেটওয়ের কার্যকারিতা' : 'The functionality of third-party services or payment gateways'}</li>
                </ul>

                {/* Section 9 */}
                <h2
                  id="limitation"
                  ref={(el) => { sectionRefs.current['limitation'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '৯. দায় সীমাবদ্ধতা' : '9. Limitation of Liability'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আইন দ্বারা অনুমোদিত সর্বোচ্চ পরিমাণ পর্যন্ত, সমাধান কোনো পরোক্ষ, আনুষঙ্গিক, বিশেষ, পরিণামগত বা দৃষ্টান্তমূলক ক্ষতির জন্য দায়ী থাকবে না, যার মধ্যে রয়েছে লাভের ক্ষতি, ডেটার ক্ষতি বা ব্যবসায়িক সুযোগের ক্ষতি। দাবি উত্থাপনের আগের ১২ মাসে আপনি সমাধানকে যে পরিমাণ ফি প্রদান করেছেন তার বেশি সমাধানের মোট দায় অতিক্রম করবে না।'
                    : 'To the maximum extent permitted by law, Somadhan shall not be liable for any indirect, incidental, special, consequential, or exemplary damages, including but not limited to loss of profits, loss of data, or loss of business opportunity. Somadhan\'s total aggregate liability shall not exceed the amount of fees paid by you to Somadhan in the 12 months preceding the claim.'}
                </p>

                {/* Section 10 */}
                <h2
                  id="indemnification"
                  ref={(el) => { sectionRefs.current['indemnification'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১০. ক্ষতিপূরণ' : '10. Indemnification'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আপনি সমাধান এবং এর কর্মকর্তা, পরিচালক, কর্মচারী ও এজেন্টদের এমন যেকোনো দাবি, ক্ষতি, দায় এবং ব্যয়ের (আইনি ফি সহ) বিরুদ্ধে ক্ষতিপূরণ দিতে এবং ক্ষতিমুক্ত রাখতে সম্মত হচ্ছেন যা (ক) আপনার শর্তাবলী লঙ্ঘন, (খ) আপনার প্ল্যাটফর্ম ব্যবহার, বা (গ) প্রযোজ্য আইন লঙ্ঘনের কারণে উদ্ভূত হয়।'
                    : 'You agree to indemnify and hold harmless Somadhan and its officers, directors, employees, and agents from any claims, damages, liabilities, and expenses (including legal fees) arising from (a) your breach of these Terms, (b) your use of the Platform, or (c) your violation of any applicable law.'}
                </p>

                {/* Section 11 */}
                <h2
                  id="termination"
                  ref={(el) => { sectionRefs.current['termination'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১১. সমাপ্তি' : '11. Termination'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn ? 'আমরা নিম্নলিখিত পরিস্থিতিতে আপনার অ্যাকাউন্ট স্থগিত বা বন্ধ করার অধিকার সংরক্ষণ করি:' : 'We reserve the right to suspend or terminate your account under the following circumstances:'}
                </p>
                <ul className="text-slate-600 space-y-2">
                  <li>{bn ? 'শর্তাবলী লঙ্ঘন করলে' : 'Violation of these Terms'}</li>
                  <li>{bn ? 'প্রতারণামূলক বা সন্দেহজনক কার্যকলাপ সনাক্ত হলে' : 'Detection of fraudulent or suspicious activity'}</li>
                  <li>{bn ? 'আইন প্রয়োগকারী সংস্থার অনুরোধে' : 'At the request of law enforcement authorities'}</li>
                  <li>{bn ? 'দীর্ঘ সময় নিষ্ক্রিয় থাকলে' : 'Extended period of inactivity'}</li>
                </ul>
                <p className="text-slate-600 mt-3">
                  {bn
                    ? 'আপনি যেকোনো সময় আমাদের গোপনীয়তা নীতিতে উল্লিখিত অ্যাকাউন্ট মুছে ফেলার প্রক্রিয়া অনুসরণ করে আপনার অ্যাকাউন্ট বন্ধ করতে পারেন। অ্যাকাউন্ট বন্ধ হলে আপনার অব্যবহৃত ওয়ালেট ব্যালেন্স রিফান্ড নীতি অনুযায়ী ফেরত দেওয়া হবে।'
                    : 'You may close your account at any time by following the account deletion process outlined in our Privacy Policy. Upon account closure, any unused wallet balance will be refunded according to our refund policy.'}
                </p>

                {/* Section 12 */}
                <h2
                  id="governing"
                  ref={(el) => { sectionRefs.current['governing'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১২. প্রযোজ্য আইন' : '12. Governing Law'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের আইন অনুযায়ী পরিচালিত ও ব্যাখ্যা করা হবে। এই শর্তাবলী সংক্রান্ত যেকোনো বিরোধ ঢাকা, বাংলাদেশের উপযুক্ত আদালতের একচেটিয়া এখতিয়ারের অধীনে থাকবে। বিরোধ নিষ্পত্তির জন্য প্রথমে সালিশি আইন ২০০১ এবং পরবর্তী সংশোধনী অনুযায়ী সালিশি প্রক্রিয়া অনুসরণ করতে সম্মত হবেন।'
                    : 'These Terms shall be governed by and construed in accordance with the laws of the People\'s Republic of Bangladesh. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh. You agree to first pursue arbitration under the Arbitration Act 2001 (as amended) before resorting to litigation.'}
                </p>

                {/* Section 13 */}
                <h2
                  id="changes"
                  ref={(el) => { sectionRefs.current['changes'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১৩. শর্তাবলী পরিবর্তন' : '13. Changes to Terms'}
                </h2>
                <p className="text-slate-600">
                  {bn
                    ? 'আমরা সময়ে সময়ে এই শর্তাবলী আপডেট বা পরিবর্তন করার অধিকার সংরক্ষণ করি। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আমরা প্ল্যাটফর্মে বিজ্ঞপ্তি প্রদান করব বা আপনার নিবন্ধিত ইমেইলে জানাব। পরিবর্তিত শর্তাবলী কার্যকর হওয়ার পরে প্ল্যাটফর্ম ব্যবহার অব্যাহত রাখলে তা পরিবর্তনগুলো গ্রহণ করা হয়েছে বলে গণ্য হবে।'
                    : 'We reserve the right to update or modify these Terms from time to time. For material changes, we will provide notice on the Platform or notify you via your registered email address. Your continued use of the Platform after the updated Terms become effective constitutes acceptance of the changes.'}
                </p>

                {/* Section 14 */}
                <h2
                  id="contact"
                  ref={(el) => { sectionRefs.current['contact'] = el; }}
                  className={`text-xl sm:text-2xl text-slate-900 mt-10 mb-4 scroll-mt-28 ${bn ? 'leading-[1.4]' : ''}`}
                >
                  {bn ? '১৪. যোগাযোগ' : '14. Contact Us'}
                </h2>
                <p className="text-slate-600 mb-3">
                  {bn
                    ? 'এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:'
                    : 'If you have any questions or concerns about these Terms, please contact us:'}
                </p>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <p className="font-semibold text-slate-900 mb-2">
                    {bn ? 'সমাধান টেকনোলজিস লিমিটেড' : 'Somadhan Technologies Limited'}
                  </p>
                  <div className="space-y-1 text-slate-600 text-sm">
                    <p>{bn ? 'ইমেইল: info@somadhan.com' : 'Email: info@somadhan.com'}</p>
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
            to="/privacy"
            className="flex-1 p-5 bg-white border border-slate-100 rounded-xl hover:border-brand-200 hover:shadow-md transition-all group"
          >
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{bn ? 'সম্পর্কিত' : 'Related'}</p>
            <p className={`font-serif text-lg text-slate-900 group-hover:text-brand-600 transition-colors ${bn ? 'leading-[1.4]' : ''}`}>
              {bn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'} →
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
    </div>
  );
};

export default TermsPage;
