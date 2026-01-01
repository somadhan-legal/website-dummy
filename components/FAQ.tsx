import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle, Calendar, CreditCard, Wallet, Clock, FileText, Headphones, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const faqCategories = [
  {
    id: 'getting-started',
    icon: PlayCircle,
    labelEn: 'Getting Started',
    labelBn: 'শুরু করা',
    faqs: [
      {
        qEn: "What is Somadhan and how does it work?",
        qBn: "Somadhan কী এবং এটি কীভাবে কাজ করে?",
        aEn: "Somadhan is a digital legal services platform that connects you with verified lawyers for consultations, documentation, and case-related services through calls, bookings, and events.",
        aBn: "Somadhan একটি ডিজিটাল লিগ্যাল সার্ভিস প্ল্যাটফর্ম যেখানে আপনি যাচাইকৃত আইনজীবীদের সঙ্গে কল, বুকিং ও ইভেন্টের মাধ্যমে আইনি সেবা নিতে পারেন।"
      },
      {
        qEn: "Do I need to create an account to use Somadhan?",
        qBn: "Somadhan ব্যবহার করতে কি অ্যাকাউন্ট লাগবে?",
        aEn: "Yes. You must create an account to book services, make payments, track progress, and communicate with lawyers securely.",
        aBn: "হ্যাঁ। সেবা বুক করা, পেমেন্ট করা ও প্রগ্রেস ট্র্যাক করতে অ্যাকাউন্ট থাকা বাধ্যতামূলক।"
      },
      {
        qEn: "Is my personal information safe on Somadhan?",
        qBn: "আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
        aEn: "Yes. Somadhan follows strict data protection and privacy standards to keep your information secure and confidential.",
        aBn: "হ্যাঁ। Somadhan আপনার তথ্য সুরক্ষার জন্য প্রয়োজনীয় নিরাপত্তা ও গোপনীয়তা নীতি অনুসরণ করে।"
      },
      {
        qEn: "Can I access Somadhan from both mobile and desktop?",
        qBn: "মোবাইল ও ডেস্কটপ দুটো থেকেই কি ব্যবহার করা যাবে?",
        aEn: "Yes. Somadhan is designed to work smoothly on mobile phones, tablets, and desktop devices.",
        aBn: "হ্যাঁ। Somadhan মোবাইল ও ডেস্কটপ উভয় ডিভাইসে ব্যবহার করা যায়।"
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
        qEn: "How do consultation calls work?",
        qBn: "লিগ্যাল কনসালটেশন কল কীভাবে কাজ করে?",
        aEn: "You request a call, maintain the required wallet balance, and once approved, a verified lawyer contacts you for consultation.",
        aBn: "আপনি কল রিকোয়েস্ট করেন, প্রয়োজনীয় ওয়ালেট ব্যালেন্স থাকলে আইনজীবী আপনাকে কল করবেন।"
      },
      {
        qEn: "Why was my call marked as 'Missed' or 'No Answer'?",
        qBn: "কল কেন 'Missed' বা 'No Answer' দেখায়?",
        aEn: "This happens if either you or the lawyer could not answer the call at the scheduled time.",
        aBn: "নির্ধারিত সময় কল রিসিভ না হলে এই স্ট্যাটাস দেখানো হয়।"
      },
      {
        qEn: "Can I call the lawyer again if the call fails?",
        qBn: "কল ব্যর্থ হলে কি আবার কল করা যাবে?",
        aEn: "Yes. You can use the 'Call Again' option from the call activity card.",
        aBn: "হ্যাঁ। 'Call Again' অপশন থেকে আবার কল করতে পারবেন।"
      },
      {
        qEn: "How is call cost calculated?",
        qBn: "কলের খরচ কীভাবে হিসাব করা হয়?",
        aEn: "Calls are charged per minute, based on the lawyer's rate. The amount is deducted from your wallet balance. Once you buy a service/package, no fees needed to make calls with that specific lawyer.",
        aBn: "প্রতি মিনিট অনুযায়ী খরচ কাটা হয় এবং তা আপনার ওয়ালেট থেকে ডিডাক্ট হয়। একবার আপনি কোনও পরিষেবা/প্যাকেজ কিনলে, সেই নির্দিষ্ট আইনজীবীর সাথে যোগাযোগ করার জন্য কোনো ফি লাগবে না।"
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
        qEn: "What does 'Booking Confirmed' mean?",
        qBn: "'Booking Confirmed' মানে কী?",
        aEn: "It means your service request has been accepted and assigned to a lawyer.",
        aBn: "আপনার সার্ভিস রিকোয়েস্ট গ্রহণ করা হয়েছে এবং একজন আইনজীবী নিযুক্ত হয়েছেন।"
      },
      {
        qEn: "What should I do if my booking shows 'Action Required'?",
        qBn: "'Action Required' দেখালে কী করতে হবে?",
        aEn: "You need to complete a pending step, such as uploading documents or providing information.",
        aBn: "সার্ভিস চালিয়ে নিতে প্রয়োজনীয় তথ্য বা ডকুমেন্ট দিতে হবে।"
      },
      {
        qEn: "Can I cancel a booking after confirmation?",
        qBn: "বুকিং ক্যানসেল করা যাবে কি?",
        aEn: "Yes, you can cancel based on service terms. Some services may have partial charges.",
        aBn: "হ্যাঁ। নির্দিষ্ট শর্ত অনুযায়ী বুকিং বাতিল করা যায়।"
      },
      {
        qEn: "Can I rebook a cancelled service?",
        qBn: "ক্যানসেল করা সার্ভিস কি আবার বুক করা যাবে?",
        aEn: "Yes. You can rebook the service anytime from the booking details screen.",
        aBn: "হ্যাঁ। যেকোনো সময় পুনরায় বুক করা যাবে।"
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
        qEn: "What payment methods are supported?",
        qBn: "কীভাবে পেমেন্ট করা যাবে?",
        aEn: "Somadhan supports wallet payments and integrated payment gateways (bank, card, or mobile payment).",
        aBn: "ওয়ালেট বা নির্ধারিত পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট করা যায়।"
      },
      {
        qEn: "What does 'Payment Declined' mean?",
        qBn: "'Payment Declined' মানে কী?",
        aEn: "The payment could not be processed due to bank issues, insufficient balance, or incorrect details.",
        aBn: "ব্যাংক সমস্যা, ব্যালেন্স কম থাকা বা তথ্য ভুল হলে পেমেন্ট ব্যর্থ হতে পারে।"
      },
      {
        qEn: "When will I receive my refund?",
        qBn: "রিফান্ড কবে পাবো?",
        aEn: "Refunds are processed according to service policies and are usually credited back to your wallet.",
        aBn: "সার্ভিস পলিসি অনুযায়ী রিফান্ড ওয়ালেটে ফেরত দেওয়া হয়।"
      },
      {
        qEn: "Can I see my payment history?",
        qBn: "আমার পেমেন্ট হিস্ট্রি কোথায় দেখবো?",
        aEn: "Yes. All your bills, payments, and refunds are available in the Bills section.",
        aBn: "Bills সেকশনে সব পেমেন্ট ও রিফান্ডের তথ্য থাকে।"
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
        qEn: "Why do I need a minimum wallet balance?",
        qBn: "কেন ন্যূনতম ওয়ালেট ব্যালেন্স প্রয়োজন?",
        aEn: "A minimum balance ensures uninterrupted consultation calls and services.",
        aBn: "কল ও সার্ভিস চলাকালীন যেন কোনো সমস্যা না হয়, এজন্য মিনিমাম ব্যালেন্স রাখা হয়।"
      },
      {
        qEn: "What is the maximum wallet balance allowed?",
        qBn: "সর্বোচ্চ কত টাকা ওয়ালেটে রাখা যাবে?",
        aEn: "You can maintain a wallet balance of up to 50,000 BDT.",
        aBn: "সর্বোচ্চ ৫০,০০০ টাকা পর্যন্ত রাখা যাবে।"
      },
      {
        qEn: "What happens if my wallet balance is low?",
        qBn: "ওয়ালেটে টাকা কম থাকলে কী হবে?",
        aEn: "You will be prompted to add funds before starting paid services.",
        aBn: "সার্ভিস শুরুর আগে আপনাকে টপ-আপ করতে বলা হবে।"
      },
      {
        qEn: "Are wallet refunds instant?",
        qBn: "রিফান্ড কি সাথে সাথে ওয়ালেটে আসে?",
        aEn: "Most refunds are processed quickly, but timing may vary depending on the payment method.",
        aBn: "সাধারণত দ্রুত আসে, তবে কিছু ক্ষেত্রে সময় লাগতে পারে।"
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
        qEn: "What are events in Somadhan?",
        qBn: "Somadhan-এ ইভেন্ট বলতে কী বোঝায়?",
        aEn: "Events include scheduled consultations, document deadlines, meetings, and legal reminders.",
        aBn: "কনসালটেশন, মিটিং, ডেডলাইন বা লিগ্যাল আপডেটকে ইভেন্ট বলা হয়।"
      },
      {
        qEn: "Can I reschedule an event?",
        qBn: "ইভেন্ট রিশিডিউল করা যাবে কি?",
        aEn: "Yes. Most events allow rescheduling based on lawyer availability.",
        aBn: "হ্যাঁ। আইনজীবীর সময় অনুযায়ী রিশিডিউল করা যায়।"
      },
      {
        qEn: "Will I receive reminders for upcoming events?",
        qBn: "ইভেন্টের জন্য কি রিমাইন্ডার পাবো?",
        aEn: "Yes. Somadhan sends reminders so you don't miss important sessions.",
        aBn: "হ্যাঁ। সময়মতো নোটিফিকেশন দেওয়া হয়।"
      },
      {
        qEn: "What happens if I miss an event?",
        qBn: "ইভেন্ট মিস করলে কী হবে?",
        aEn: "You can view details and reschedule from the event card.",
        aBn: "ইভেন্ট ডিটেইলস দেখে পুনরায় শিডিউল করতে পারবেন।"
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
        qEn: "What file types can I upload?",
        qBn: "কোন ধরনের ফাইল আপলোড করা যাবে?",
        aEn: "You can upload PDF, JPG, PNG, DOC, and DOCX files.",
        aBn: "PDF, JPG, PNG, DOC, DOCX ফাইল আপলোড করা যাবে।"
      },
      {
        qEn: "Is there a file size limit?",
        qBn: "ফাইল সাইজের সীমা কত?",
        aEn: "Yes. Each file must be under 5 MB.",
        aBn: "প্রতি ফাইল সর্বোচ্চ ৫ এমবি।"
      },
      {
        qEn: "Are my documents visible to everyone?",
        qBn: "আমার ডকুমেন্ট কে দেখতে পারবে?",
        aEn: "No. Documents are only accessible to you and your assigned lawyer.",
        aBn: "শুধু আপনি ও আপনার নিযুক্ত আইনজীবী দেখতে পারবেন।"
      },
      {
        qEn: "Can I replace uploaded documents?",
        qBn: "আপলোড করা ফাইল কি পরিবর্তন করা যাবে?",
        aEn: "Yes. You can re-upload or replace documents anytime before service completion.",
        aBn: "হ্যাঁ। প্রয়োজন হলে রিপ্লেস করা যাবে।"
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
        qEn: "How do I contact Somadhan support?",
        qBn: "Somadhan সাপোর্টে কীভাবে যোগাযোগ করবো?",
        aEn: "You can contact support through the app or email us at somadhan.legal@gmail.com",
        aBn: "অ্যাপ বা somadhan.legal@gmail.com এ ইমেইল করে যোগাযোগ করা যাবে।"
      },
      {
        qEn: "Can I give feedback on a service?",
        qBn: "সার্ভিস শেষে ফিডব্যাক দেওয়া যাবে কি?",
        aEn: "Yes. You can rate calls and services after completion.",
        aBn: "হ্যাঁ। কল ও সার্ভিস রেটিং দেওয়া যায়।"
      },
      {
        qEn: "Are all lawyers verified?",
        qBn: "Somadhan-এর সব আইনজীবী কি যাচাইকৃত?",
        aEn: "Yes. Somadhan works only with verified and approved legal professionals.",
        aBn: "হ্যাঁ। সব আইনজীবী যাচাই ও অনুমোদিত।"
      },
      {
        qEn: "Where can I track all my activities?",
        qBn: "আমার সব অ্যাক্টিভিটি কোথায় দেখবো?",
        aEn: "All calls, bookings, bills, and events are available in the Activity section.",
        aBn: "Activity সেকশনে সব কল, বুকিং, বিল ও ইভেন্ট দেখা যাবে।"
      },
    ]
  },
];

const FAQ: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openIndex, setOpenIndex] = useState<number>(0);

  const currentCategory = faqCategories.find(c => c.id === activeCategory) || faqCategories[0];

  return (
    <section id="faq" className="py-16 md:py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3">
            {t('faq.title')}
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Category Tabs - Horizontal scroll on mobile */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => { setActiveCategory(category.id); setOpenIndex(0); }}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                    <span className="font-medium text-sm">
                      {language === 'bn' ? category.labelBn : category.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {currentCategory.faqs.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  const question = language === 'bn' ? item.qBn : item.qEn;
                  const answer = language === 'bn' ? item.aBn : item.aEn;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className={`rounded-xl overflow-hidden transition-all duration-300 ${
                        isOpen 
                          ? 'bg-brand-600 shadow-lg shadow-brand-600/10' 
                          : 'bg-white border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm sm:text-base ${isOpen ? 'text-white' : 'text-slate-900'}`}>
                            {question}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isOpen ? 'bg-white/10' : 'bg-slate-100'
                          }`}
                        >
                          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-5 pt-0">
                              <p className="text-white/80 text-sm leading-relaxed">
                                {answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm mb-3">
            {language === 'bn' ? 'আরও প্রশ্ন আছে? আমাদের ইমেইল করুন' : "Still have questions? Email us"}
          </p>
          <a 
            href="mailto:somadhan.legal@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            <Mail className="w-4 h-4" />
            somadhan.legal@gmail.com
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
