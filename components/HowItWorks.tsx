import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Search, Users, CalendarCheck, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();

  const steps = [
    {
      num: '01',
      label: language === 'bn' ? 'সমস্যা জানান' : 'Describe',
      title: language === 'bn' ? 'আপনার আইনি সমস্যাটি লিখুন' : 'Tell us your problem',
      desc: language === 'bn' 
        ? 'আপনার সমস্যাটি সহজ ভাষায় বর্ণনা করুন। আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে আপনার জন্য উপযুক্ত আইনি বিভাগটি নির্বাচন করবে।'
        : 'Write your problem in simple words. Our system automatically finds the right legal category for you.',
      icon: MessageSquare,
    },
    {
      num: '02',
      label: language === 'bn' ? 'ম্যাচিং' : 'Match',
      title: language === 'bn' ? 'সেরা আইনজীবী খুঁজে নিন' : 'Find the best lawyers',
      desc: language === 'bn'
        ? 'আপনার সমস্যার ধরন ও বাজেট অনুযায়ী যাচাইকৃত আইনজীবীদের একটি তালিকা দেখুন এবং সেরাজনকে বেছে নিন।'
        : 'See a list of verified lawyers based on your problem type and budget.',
      icon: Search,
    },
    {
      num: '03',
      label: language === 'bn' ? 'তুলনা করুন' : 'Compare',
      title: language === 'bn' ? 'অভিজ্ঞতা ও ফি যাচাই করুন' : 'Check experience and price',
      desc: language === 'bn'
        ? 'বিভিন্ন আইনজীবীর অভিজ্ঞতা, রেটিং এবং ফি পাশাপাশি তুলনা করে সঠিক সিদ্ধান্ত নিন।'
        : 'View each lawyer\'s experience, ratings, and fees side by side to decide.',
      icon: Users,
    },
    {
      num: '04',
      label: language === 'bn' ? 'বুকিং' : 'Book',
      title: language === 'bn' ? 'সময় নির্ধারণ করুন' : 'Pick your time',
      desc: language === 'bn'
        ? 'আপনার সুবিধামতো একটি সময় বেছে নিন এবং নিরাপদে পেমেন্ট সম্পন্ন করুন।'
        : 'Choose a time that works for you and pay securely.',
      icon: CalendarCheck,
    },
    {
      num: '05',
      label: language === 'bn' ? 'পরামর্শ' : 'Connect',
      title: language === 'bn' ? 'সরাসরি কথা বলুন' : 'Talk to your lawyer',
      desc: language === 'bn'
        ? 'ভিডিও বা অডিও কলের মাধ্যমে আইনজীবীর সাথে সরাসরি কথা বলুন এবং আইনি পরামর্শ নিন।'
        : 'Connect with your lawyer via video call or audio call.',
      icon: CheckCircle,
    },
  ];

  const StepVisual = ({ stepIndex }: { stepIndex: number }) => {
    if (stepIndex === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5 w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Composer</span>
          </div>
          <p className={`text-slate-800 font-serif text-base leading-snug mb-4 ${language === 'bn' ? 'leading-relaxed' : ''}`}>
            {language === 'bn' ? '"আমার বাড়িওয়ালা অগ্রিম টাকা ফেরত দিচ্ছে না..."' : '"My landlord is refusing to return the advance deposit..."'}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['PROPERTY', 'TENANT', 'DEPOSIT'].map(tag => (
              <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-lg border border-slate-100">
                {tag}
              </span>
            ))}
          </div>
          <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
            {language === 'bn' ? 'পরবর্তী' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5 w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">{language === 'bn' ? 'সেরা মিল খুঁজছি...' : 'Finding best matches...'}</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (stepIndex === 2) {
      const lawyers = [
        { initials: 'FR', name: 'Farzana Rahman', rating: 4.9 },
        { initials: 'KH', name: 'Kamal Hossain', rating: 4.8 },
        { initials: 'SA', name: 'Sarah Ali', rating: 5.0 },
      ];
      return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium">{language === 'bn' ? 'সম্পত্তি আইন' : 'Property Law'}</span>
            <span className="text-xs text-white/60">{language === 'bn' ? '৩ জন' : '3 matches'}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {lawyers.map((lawyer, i) => (
              <div key={i} className="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                  {lawyer.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">{lawyer.name}</div>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {lawyer.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5 w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
              KH
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{language === 'bn' ? 'বুকিং' : 'Booking with'}</div>
              <div className="font-semibold text-slate-900 text-sm">Kamal Hossain</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[{ d: 12, sel: true }, { d: 13 }, { d: 14 }, { d: 15 }].map((item, i) => (
              <div 
                key={i} 
                className={`text-center py-2 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  item.sel 
                    ? 'bg-brand-600 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] uppercase">{language === 'bn' ? 'অক্টো' : 'Oct'}</div>
                <div className="font-bold text-sm">{item.d}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 py-2.5 text-center bg-brand-50 text-brand-700 rounded-lg text-sm font-medium border-2 border-brand-500 cursor-pointer hover:bg-brand-100 transition-colors">4:00 PM</div>
            <div className="flex-1 py-2.5 text-center bg-slate-50 text-slate-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-all">4:30 PM</div>
          </div>
          <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/20">
            {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'} <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (stepIndex === 4) {
      return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-center">
            <CheckCircle className="w-10 h-10 text-white mx-auto mb-2" />
            <div className="text-white font-semibold">{language === 'bn' ? 'বুকিং সম্পন্ন!' : 'Booking Confirmed!'}</div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                KH
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Kamal Hossain</div>
                <div className={`text-xs text-brand-600 ${language === 'bn' ? 'leading-relaxed' : ''}`}>{language === 'bn' ? 'সম্পত্তি আইন বিশেষজ্ঞ' : 'Property Law Expert'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center mb-4">
              <div className="bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{language === 'bn' ? 'তারিখ' : 'Date'}</div>
                <div className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'অক্টো ১২, ৪ PM' : 'Oct 12, 4 PM'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{language === 'bn' ? 'ধরন' : 'Type'}</div>
                <div className="font-bold text-slate-900 text-sm flex items-center justify-center gap-1.5">
                  {/* Filled Video Icon */}
                  <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                  <span className="text-slate-400">/</span>
                  {/* Filled Phone Icon */}
                  <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="process" className="py-16 md:py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
            {t('process.badge')}
          </span>
          <h2 className={`font-serif text-3xl md:text-4xl text-slate-900 ${language === 'bn' ? 'leading-[1.4]' : ''}`}>
            {t('process.title')}
          </h2>
        </div>

        {/* Steps - Desktop */}
        <div className="hidden lg:block">
          {steps.map((step, idx) => (
            <StepRow key={idx} step={step} idx={idx} Visual={<StepVisual stepIndex={idx} />} isLast={idx === steps.length - 1} language={language} />
          ))}
        </div>

        {/* Steps - Mobile */}
        <div className="lg:hidden space-y-10">
          {steps.map((step, idx) => (
            <MobileStep key={idx} step={step} idx={idx} Visual={<StepVisual stepIndex={idx} />} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepRow: React.FC<{ step: any; idx: number; Visual: React.ReactNode; isLast: boolean; language: string }> = ({ step, idx, Visual, isLast, language }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`grid grid-cols-2 gap-8 xl:gap-12 items-center py-8 xl:py-10 ${!isLast ? 'border-b border-slate-200' : ''}`}
    >
      <div className={idx % 2 === 1 ? 'order-2' : ''}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-brand-600 tracking-widest">{step.num}. {step.label}</span>
        </div>
        <h3 className={`font-serif text-xl xl:text-2xl text-slate-900 mb-2 leading-snug ${language === 'bn' ? 'leading-[1.4]' : ''}`}>{step.title}</h3>
        <p className={`text-slate-500 text-sm leading-relaxed ${language === 'bn' ? 'leading-relaxed' : ''}`}>{step.desc}</p>
      </div>
      
      <div className={`flex ${idx % 2 === 1 ? 'order-1 justify-start' : 'justify-end'}`}>
        {Visual}
      </div>
    </motion.div>
  );
};

const MobileStep: React.FC<{ step: any; idx: number; Visual: React.ReactNode; language: string }> = ({ step, idx, Visual, language }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="pl-4 border-l-2 border-brand-500">
        <span className="text-xs font-bold text-brand-600 tracking-widest">{step.num}. {step.label}</span>
        <h3 className={`font-serif text-lg text-slate-900 mt-1 mb-1.5 leading-snug ${language === 'bn' ? 'leading-[1.4]' : ''}`}>{step.title}</h3>
        <p className={`text-slate-500 text-sm leading-relaxed ${language === 'bn' ? 'leading-relaxed' : ''}`}>{step.desc}</p>
      </div>
      <div className="flex justify-center">
        {Visual}
      </div>
    </motion.div>
  );
};

export default HowItWorks;
