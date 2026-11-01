import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Link as LinkIcon, ChevronDown, PlayCircle, Calendar, CreditCard, Wallet, Clock, FileText, Headphones, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackFAQCategoryChange, trackFAQExpand } from '../lib/analytics';

export const faqCategories = [
  {
    id: 'getting-started',
    icon: PlayCircle,
    labelEn: 'Getting Started',
    labelBn: 'শুরু করবেন যেভাবে',
    faqs: [
      {
        id: 'what-is-somadhan',
        qEn: "What is Somadhan and how does it work?",
        qBn: "সমাধান কী এবং এটি কীভাবে কাজ করে?",
        aEn: "Somadhan is a digital legal services platform that connects you with verified lawyers for consultations, documentation, and case-related services through calls, bookings, and events.",
        aBn: "সমাধান একটি ডিজিটাল আইনি সেবা প্ল্যাটফর্ম, যা আপনাকে যাচাইকৃত আইনজীবীদের সাথে সংযুক্ত করে। এর মাধ্যমে আপনি অডিও বা ভিডিও কলের মাধ্যমে পরামর্শ, ডকুমেন্টেশন এবং মামলা সংক্রান্ত সেবা নিতে পারেন।"
      },
      {
        id: 'create-an-account',
        qEn: "Do I need to create an account to use Somadhan?",
        qBn: "সমাধান ব্যবহার করতে কি অ্যাকাউন্ট থাকা আবশ্যক?",
        aEn: "Yes. You must create an account to book services, make payments, track progress, and communicate with lawyers securely.",
        aBn: "জি, সেবা বুকিং, পেমেন্ট সম্পন্ন করা এবং কাজের অগ্রগতি ট্র্যাক করার জন্য অ্যাকাউন্ট থাকা বাধ্যতামূলক। এটি আপনার তথ্যের নিরাপত্তাও নিশ্চিত করে।"
      },
      {
        id: 'personal-information',
        qEn: "Is my personal information safe on Somadhan?",
        qBn: "আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
        aEn: "Keep your account details private and share only the information needed for your service. Contact Somadhan support if you have concerns about access to your account or documents.",
        aBn: "অ্যাকাউন্টের তথ্য গোপন রাখুন এবং সেবার জন্য প্রয়োজনীয় তথ্যই শেয়ার করুন। আপনার অ্যাকাউন্ট বা নথিপত্রে প্রবেশাধিকার নিয়ে কোনো উদ্বেগ থাকলে সমাধান সাপোর্টে যোগাযোগ করুন।"
      },
      {
        id: 'supported-devices',
        qEn: "Can I access Somadhan from both mobile and desktop?",
        qBn: "মোবাইল ও ডেস্কটপ উভয় থেকেই কি ব্যবহার করা যাবে?",
        aEn: "The Somadhan Android app is available on Google Play. You can browse this website and its FAQs on mobile or desktop; use the Android app to access app services.",
        aBn: "সমাধান অ্যান্ড্রয়েড অ্যাপ গুগল প্লেতে পাওয়া যাচ্ছে। মোবাইল বা ডেস্কটপ থেকে এই ওয়েবসাইট ও সাধারণ জিজ্ঞাসা দেখতে পারবেন; অ্যাপের সেবা নিতে অ্যান্ড্রয়েড অ্যাপ ব্যবহার করুন।"
      },
    ]
  },
  {
    id: 'calls',
    icon: Headphones,
    labelEn: 'Calls & Consultations',
    labelBn: 'কল ও পরামর্শ',
    faqs: [
      {
        id: 'how-calls-work',
        qEn: "How do consultation calls work?",
        qBn: "আইনি পরামর্শের কলগুলো কীভাবে কাজ করে?",
        aEn: "You request a call, maintain the required wallet balance, and once approved, a verified lawyer contacts you for consultation.",
        aBn: "প্রথমে আপনি কলের জন্য অনুরোধ করবেন। আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স থাকলে এবং অনুরোধ অনুমোদিত হলে, একজন যাচাইকৃত আইনজীবী আপনার সাথে যোগাযোগ করবেন।"
      },
      {
        id: 'missed-calls',
        qEn: "Why was my call marked as 'Missed' or 'No Answer'?",
        qBn: "আমার কল কেন 'Missed' বা 'No Answer' দেখাচ্ছে?",
        aEn: "This happens if either you or the lawyer could not answer the call at the scheduled time.",
        aBn: "নির্ধারিত সময়ে আপনি বা আইনজীবী কেউ কল রিসিভ করতে না পারলে এমনটি দেখানো হয়।"
      },
      {
        id: 'retry-a-call',
        qEn: "Can I call the lawyer again if the call fails?",
        qBn: "কল বিচ্ছিন্ন হলে বা ব্যর্থ হলে কি আবার কল করা যাবে?",
        aEn: "Yes. You can use the 'Call Again' option from the call activity card.",
        aBn: "জি, কল অ্যাক্টিভিটি কার্ড থেকে 'Call Again' অপশন ব্যবহার করে পুনরায় কল করতে পারবেন।"
      },
      {
        id: 'call-costs',
        qEn: "How is call cost calculated?",
        qBn: "কলের খরচ কীভাবে হিসাব করা হয়?",
        aEn: "Review the rate and any included consultation time shown in the app before starting a call or buying a service. Charges can depend on the lawyer and the service you choose.",
        aBn: "কল শুরু বা সেবা কেনার আগে অ্যাপে দেখানো রেট এবং অন্তর্ভুক্ত পরামর্শের সময় দেখে নিন। আইনজীবী ও নির্বাচিত সেবা অনুযায়ী খরচ ভিন্ন হতে পারে।"
      },
    ]
  },
  {
    id: 'bookings',
    icon: Calendar,
    labelEn: 'Bookings & Services',
    labelBn: 'বুকিং ও সেবা',
    faqs: [
      {
        id: 'booking-confirmed',
        qEn: "What does 'Booking Confirmed' mean?",
        qBn: "'Booking Confirmed' বলতে কী বোঝায়?",
        aEn: "It means your service request has been accepted and assigned to a lawyer.",
        aBn: "এর অর্থ আপনার সেবার অনুরোধটি গৃহীত হয়েছে এবং একজন আইনজীবীকে দায়িত্ব দেওয়া হয়েছে।"
      },
      {
        id: 'action-required',
        qEn: "What should I do if my booking shows 'Action Required'?",
        qBn: "'Action Required' দেখালে আমাকে কী করতে হবে?",
        aEn: "You need to complete a pending step, such as uploading documents or providing information.",
        aBn: "আপনাকে পরবর্তী ধাপ সম্পন্ন করতে হবে, যেমন—প্রয়োজনীয় নথিপত্র আপলোড করা বা অতিরিক্ত তথ্য প্রদান করা।"
      },
      {
        id: 'cancel-a-booking',
        qEn: "Can I cancel a booking after confirmation?",
        qBn: "বুকিং নিশ্চিত হওয়ার পর কি বাতিল করা যাবে?",
        aEn: "Yes, you can cancel based on service terms. Some services may have partial charges.",
        aBn: "হ্যাঁ, সেবার শর্তাবলী সাপেক্ষে বাতিল করা সম্ভব। তবে কিছু ক্ষেত্রে আংশিক চার্জ প্রযোজ্য হতে পারে।"
      },
      {
        id: 'rebook-a-service',
        qEn: "Can I rebook a cancelled service?",
        qBn: "বাতিল করা সার্ভিস কি পুনরায় বুক করা যায়?",
        aEn: "Yes. You can rebook the service anytime from the booking details screen.",
        aBn: "জি, বুকিং ডিটেইলস স্ক্রিন থেকে যেকোনো সময় পুনরায় বুক করতে পারবেন।"
      },
    ]
  },
  {
    id: 'payments',
    icon: CreditCard,
    labelEn: 'Payments & Bills',
    labelBn: 'পেমেন্ট ও বিল',
    faqs: [
      {
        id: 'payment-methods',
        qEn: "What payment methods are supported?",
        qBn: "কীভাবে পেমেন্ট করা যায়?",
        aEn: "Use the payment options displayed in the app at checkout. Available methods can vary; contact support if your preferred method is not shown.",
        aBn: "চেকআউটের সময় অ্যাপে দেখানো পেমেন্ট অপশন ব্যবহার করুন। উপলভ্য পদ্ধতি ভিন্ন হতে পারে; আপনার পছন্দের পদ্ধতি না দেখালে সাপোর্টে যোগাযোগ করুন।"
      },
      {
        id: 'payment-declined',
        qEn: "What does 'Payment Declined' mean?",
        qBn: "'Payment Declined' মানে কী?",
        aEn: "The payment could not be processed due to bank issues, insufficient balance, or incorrect details.",
        aBn: "ব্যাংকিং সমস্যা, অপর্যাপ্ত ব্যালেন্স বা ভুল তথ্যের কারণে পেমেন্ট সম্পন্ন না হলে এটি দেখায়।"
      },
      {
        id: 'refund-status',
        qEn: "When will I receive my refund?",
        qBn: "রিফান্ড কত দিনের মধ্যে পাবো?",
        aEn: "Contact support with your booking or payment reference to check the status of a refund request. The timing and return method depend on the transaction; do not assume a refund is immediate.",
        aBn: "রিফান্ড অনুরোধের অবস্থা জানতে বুকিং বা পেমেন্ট রেফারেন্সসহ সাপোর্টে যোগাযোগ করুন। সময় ও ফেরতের পদ্ধতি লেনদেনের ওপর নির্ভর করে; তাৎক্ষণিক রিফান্ড ধরে নেবেন না।"
      },
      {
        id: 'payment-history',
        qEn: "Can I see my payment history?",
        qBn: "আমি কি আমার পেমেন্ট ইতিহাস দেখতে পাবো?",
        aEn: "Yes. All your bills, payments, and refunds are available in the Bills section.",
        aBn: "জি, 'Bills' সেকশনে আপনার সকল বিল, পেমেন্ট এবং রিফান্ডের তথ্য সংরক্ষিত থাকে।"
      },
    ]
  },
  {
    id: 'wallet',
    icon: Wallet,
    labelEn: 'Wallet & Balance',
    labelBn: 'ওয়ালেট ও ব্যালেন্স',
    faqs: [
      {
        id: 'minimum-balance',
        qEn: "Why do I need a minimum wallet balance?",
        qBn: "ওয়ালেটে কেন ন্যূনতম ব্যালেন্স রাখতে হয়?",
        aEn: "A minimum balance ensures uninterrupted consultation calls and services.",
        aBn: "কল বা সেবা চলাকালীন যেন সংযোগ বিচ্ছিন্ন না হয়, তা নিশ্চিত করতেই ন্যূনতম ব্যালেন্স রাখা জরুরি।"
      },
      {
        id: 'add-balance',
        qEn: "Can I add more money than required?",
        qBn: "প্রয়োজনের চেয়ে বেশি টাকা যোগ করা যাবে কি?",
        aEn: "Yes. Adding extra balance helps you avoid repeated top-ups in future services.",
        aBn: "হ্যাঁ। ভবিষ্যৎ সেবার জন্য অতিরিক্ত ব্যালেন্স যোগ করতে পারেন।"
      },
      {
        id: 'low-balance',
        qEn: "What happens if my wallet balance is low?",
        qBn: "ব্যালেন্স কমে গেলে কী হবে?",
        aEn: "You will be prompted to add funds before starting paid services.",
        aBn: "যেকোনো পেইড সার্ভিস শুরু করার আগে আপনাকে ব্যালেন্স রিচার্জ বা টপ-আপ করতে বলা হবে।"
      },
      {
        id: 'wallet-refunds',
        qEn: "Are wallet refunds instant?",
        qBn: "রিফান্ড কি সাথে সাথে ওয়ালেটে যোগ হয়?",
        aEn: "Do not assume a refund will be instant or returned to a wallet. Check the transaction details and contact support with the payment reference for confirmation.",
        aBn: "রিফান্ড তাৎক্ষণিক হবে বা ওয়ালেটে ফেরত আসবে, এমন ধরে নেবেন না। লেনদেনের বিস্তারিত দেখুন এবং নিশ্চিত হতে পেমেন্ট রেফারেন্সসহ সাপোর্টে যোগাযোগ করুন।"
      },
    ]
  },
  {
    id: 'events',
    icon: Clock,
    labelEn: 'Events & Reminders',
    labelBn: 'ইভেন্ট ও রিমাইন্ডার',
    faqs: [
      {
        id: 'what-are-events',
        qEn: "What are events in Somadhan?",
        qBn: "সমাধানে 'ইভেন্ট' বলতে কী বোঝায়?",
        aEn: "Events include scheduled consultations, document deadlines, meetings, and legal reminders.",
        aBn: "নির্ধারিত পরামর্শ, ডকুমেন্ট জমা দেওয়ার সময়সীমা, মিটিং বা আইনি নোটিফিকেশনগুলোকেই ইভেন্ট বলা হয়।"
      },
      {
        id: 'reschedule-an-event',
        qEn: "Can I reschedule an event?",
        qBn: "ইভেন্টের সময় পরিবর্তন বা রিশিডিউল করা যায়?",
        aEn: "Yes. Most events allow rescheduling based on lawyer availability.",
        aBn: "জি, আইনজীবীর লভ্যতা সাপেক্ষে বেশিরভাগ ইভেন্ট রিশিডিউল করা সম্ভব।"
      },
      {
        id: 'event-reminders',
        qEn: "Will I receive reminders for upcoming events?",
        qBn: "আসন্ন ইভেন্টের জন্য কি রিমাইন্ডার পাবো?",
        aEn: "Yes. Somadhan sends reminders so you don't miss important sessions.",
        aBn: "অবশ্যই। কোনো গুরুত্বপূর্ণ সেশন বা ডেডলাইন যেন মিস না হয়, সেজন্য আমরা রিমাইন্ডার পাঠাই।"
      },
      {
        id: 'missed-events',
        qEn: "What happens if I miss an event?",
        qBn: "কোনো ইভেন্ট মিস করলে কী করণীয়?",
        aEn: "You can view details and reschedule from the event card.",
        aBn: "ইভেন্ট কার্ড থেকে বিস্তারিত দেখে আপনি সেটি পুনরায় শিডিউল করতে পারবেন।"
      },
    ]
  },
  {
    id: 'documents',
    icon: FileText,
    labelEn: 'Documents',
    labelBn: 'ডকুমেন্ট',
    faqs: [
      {
        id: 'file-types',
        qEn: "What file types can I upload?",
        qBn: "কী ধরনের ফাইল আপলোড করা যাবে?",
        aEn: "Check the accepted formats shown on the app's upload screen before selecting a file. Contact support if your document's format is not accepted.",
        aBn: "ফাইল বেছে নেওয়ার আগে অ্যাপের আপলোড স্ক্রিনে গ্রহণযোগ্য ফরম্যাটগুলো দেখে নিন। আপনার নথির ফরম্যাট গ্রহণ না করলে সাপোর্টে যোগাযোগ করুন।"
      },
      {
        id: 'file-size',
        qEn: "Is there a file size limit?",
        qBn: "ফাইলের সাইজ লিমিট কত?",
        aEn: "Follow the size limit displayed on the upload screen. If a file is rejected, reduce its size while keeping the document readable, or contact support.",
        aBn: "আপলোড স্ক্রিনে দেখানো সাইজ লিমিট অনুসরণ করুন। ফাইল গ্রহণ না করলে নথি পড়ার উপযোগী রেখে সাইজ কমান অথবা সাপোর্টে যোগাযোগ করুন।"
      },
      {
        id: 'document-access',
        qEn: "Are my documents visible to everyone?",
        qBn: "আমার ডকুমেন্ট কি সবাই দেখতে পাবে?",
        aEn: "Share documents only through the intended service or support channel. Ask Somadhan support if you need clarification about who can access a particular upload.",
        aBn: "নির্দিষ্ট সেবা বা সাপোর্ট চ্যানেলের মাধ্যমেই নথি শেয়ার করুন। কোনো আপলোড কে দেখতে পারবেন তা স্পষ্টভাবে জানতে সমাধান সাপোর্টে যোগাযোগ করুন।"
      },
      {
        id: 'replace-documents',
        qEn: "Can I replace uploaded documents?",
        qBn: "আপলোড করা ডকুমেন্ট কি পরিবর্তন করা যায়?",
        aEn: "Yes. You can re-upload or replace documents anytime before service completion.",
        aBn: "জি, সেবা সম্পন্ন হওয়ার আগ পর্যন্ত যেকোনো সময় আপনি ডকুমেন্ট পরিবর্তন বা পুনরায় আপলোড করতে পারবেন।"
      },
    ]
  },
  {
    id: 'support',
    icon: Headphones,
    labelEn: 'Support',
    labelBn: 'সাপোর্ট',
    faqs: [
      {
        id: 'contact-support',
        qEn: "How do I contact Somadhan support?",
        qBn: "সমাধান সাপোর্টে কীভাবে যোগাযোগ করব?",
        aEn: "You can contact support through the app or email us at info@somadhan.com",
        aBn: "অ্যাপের মাধ্যমে অথবা info@somadhan.com-এ ইমেইল করে আমাদের সাথে যোগাযোগ করতে পারেন।"
      },
      {
        id: 'give-feedback',
        qEn: "Can I give feedback on a service?",
        qBn: "সার্ভিস নিয়ে কি ফিডব্যাক দেওয়া যায়?",
        aEn: "Yes. You can rate calls and services after completion.",
        aBn: "জি, সেবা বা কল শেষ হওয়ার পর আপনি রেটিং ও মতামত জানাতে পারবেন।"
      },
      {
        id: 'verified-lawyers',
        qEn: "Are all lawyers verified?",
        qBn: "সমাধানের সব আইনজীবী কি ভেরিফাইড?",
        aEn: "Yes. Somadhan works only with verified and approved legal professionals.",
        aBn: "হ্যাঁ। আমরা শুধুমাত্র যাচাইকৃত এবং অনুমোদিত আইনজীবীদের সাথেই কাজ করি।"
      },
      {
        id: 'track-activities',
        qEn: "Where can I track all my activities?",
        qBn: "আমি আমার সব অ্যাক্টিভিটি কোথায় দেখতে পাবো?",
        aEn: "All calls, bookings, bills, and events are available in the Activity section.",
        aBn: "'Activity' সেকশনে আপনার সব কল, বুকিং, বিল ও ইভেন্টের বিস্তারিত তথ্য পাওয়া যাবে।"
      },
    ]
  },
];

const defaultSelection = { categoryId: 'getting-started', questionId: 'what-is-somadhan' as string | null };

export function parseFaqHash(hash: string) {
  try {
    const [categoryId, questionId, extra] = decodeURIComponent(hash.replace(/^#/, '')).split('/');
    const category = faqCategories.find(item => item.id === categoryId);
    if (!category || extra !== undefined) return defaultSelection;
    if (!questionId) return { categoryId, questionId: null };
    return category.faqs.some(item => item.id === questionId) ? { categoryId, questionId } : defaultSelection;
  } catch {
    return defaultSelection;
  }
}

const FAQ: React.FC<{ standalone?: boolean }> = ({ standalone = false }) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [localSelection, setLocalSelection] = useState(defaultSelection);
  const [hasHydrated, setHasHydrated] = useState(false);
  // Keep the first client render equal to the pre-rendered page, then let the URL own page state.
  const selection = standalone && hasHydrated ? parseFaqHash(location.hash) : localSelection;
  const bn = language === 'bn';
  const category = faqCategories.find(item => item.id === selection.categoryId) || faqCategories[0];
  const Heading = standalone ? 'h1' : 'h2';
  const QuestionHeading = standalone ? 'h2' : 'h3';

  useEffect(() => { setHasHydrated(true); }, []);

  useEffect(() => {
    if (!standalone || !location.hash) return;
    const target = parseFaqHash(location.hash);
    if (target.categoryId !== selection.categoryId || target.questionId !== selection.questionId) return;
    let cancelled = false;
    let frame: number;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        const id = target.questionId ? `${target.categoryId}/${target.questionId}` : `category-${target.categoryId}`;
        const element = document.getElementById(id);
        if (element) window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - 96), behavior: 'instant' });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [location.hash, selection.categoryId, selection.questionId, standalone]);

  const select = (categoryId: string, questionId: string | null) => {
    if (standalone) {
      navigate({ pathname: '/faq', search: location.search, hash: `#${categoryId}${questionId ? `/${questionId}` : ''}` }, { preventScrollReset: true });
    } else setLocalSelection({ categoryId, questionId });
  };

  return (
    <section id="faq" className={`${standalone ? 'pb-16 pt-8 sm:pt-10' : 'py-16 md:py-20'} bg-slate-50 scroll-mt-20`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center md:mb-10">
          <Heading className={`mb-3 font-serif text-3xl text-slate-900 md:text-4xl ${bn ? 'leading-[1.4]' : ''}`}>{t('faq.title')}</Heading>
          <p className="mx-auto max-w-lg text-sm text-slate-600 sm:text-base">{t('faq.subtitle')}</p>
          {!standalone && (
            <Link to="/faq" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
              {bn ? 'সব প্রশ্ন দেখুন' : 'Visit the FAQ page'}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3" role="group" aria-label={bn ? 'প্রশ্নের বিভাগ' : 'FAQ categories'}>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {faqCategories.map(item => {
                const Icon = item.icon;
                const active = item.id === category.id;
                return (
                  <button key={item.id} type="button" aria-pressed={active}
                    onClick={() => { select(item.id, item.faqs[0].id); trackFAQCategoryChange(item.id); }}
                    className={`flex min-h-12 items-center gap-2.5 rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 break-words">{bn ? item.labelBn : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id={`category-${category.id}`} className="min-w-0 space-y-3 scroll-mt-24 lg:col-span-9">
            {category.faqs.map((item, index) => {
              const open = selection.questionId === item.id;
              const id = `${category.id}/${item.id}`;
              const question = bn ? item.qBn : item.qEn;
              const questionId = `question-${category.id}-${item.id}`;
              const answerId = `answer-${category.id}-${item.id}`;
              return (
                <div key={id} id={id} className={`scroll-mt-24 overflow-hidden rounded-lg border transition-colors ${open ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                  <div className="flex items-start">
                    <QuestionHeading className="min-w-0 flex-1">
                      <button type="button" id={questionId} aria-expanded={open} aria-controls={answerId}
                        onClick={() => { select(category.id, open ? null : item.id); if (!open) trackFAQExpand(category.id, index); }}
                        className="flex min-h-16 w-full items-center gap-3 p-4 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-current sm:p-5 sm:text-base">
                        <span className="min-w-0 flex-1 break-words leading-relaxed">{question}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                    </QuestionHeading>
                    <Link to={{ pathname: '/faq', search: `?lang=${language}`, hash: `#${id}` }}
                      title={bn ? 'এই প্রশ্নের লিংক' : 'Link to this question'} aria-label={`${bn ? 'প্রশ্নের লিংক' : 'Link to question'}: ${question}`}
                      className="mr-1 mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full opacity-75 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-current sm:mt-3">
                      <LinkIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <div id={answerId} role="region" aria-labelledby={questionId} hidden={!open} className="px-4 pb-5 sm:px-5">
                    <p className="text-sm leading-relaxed text-white/90">{bn ? item.aBn : item.aEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="mb-2 text-sm text-slate-600">{bn ? 'আরও প্রশ্ন আছে? আমাদের ইমেইল করুন' : 'Still have questions? Email us'}</p>
          <a href="mailto:info@somadhan.com" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
            <Mail className="h-4 w-4" aria-hidden="true" />info@somadhan.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
