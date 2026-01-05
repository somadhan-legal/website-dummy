import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle, Calendar, CreditCard, Wallet, Clock, FileText, Headphones, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const faqCategories = [
  {
    id: 'getting-started',
    icon: PlayCircle,
    labelEn: 'Getting Started',
    labelBn: 'শুরু করবেন যেভাবে',
    faqs: [
      {
        qEn: "What is Somadhan and how does it work?",
        qBn: "Somadhan কী এবং এটি কীভাবে কাজ করে?",
        aEn: "Somadhan is a digital legal services platform that connects you with verified lawyers for consultations, documentation, and case-related services through calls, bookings, and events.",
        aBn: "Somadhan একটি ডিজিটাল আইনি সেবা প্ল্যাটফর্ম, যা আপনাকে যাচাইকৃত আইনজীবীদের সাথে সংযুক্ত করে। এর মাধ্যমে আপনি অডিও/ভিডিও কলের মাধ্যমে পরামর্শ, ডকুমেন্টেশন এবং মামলা সংক্রান্ত সেবা নিতে পারেন।"
      },
      {
        qEn: "Do I need to create an account to use Somadhan?",
        qBn: "Somadhan ব্যবহার করতে কি অ্যাকাউন্ট থাকা আবশ্যক?",
        aEn: "Yes. You must create an account to book services, make payments, track progress, and communicate with lawyers securely.",
        aBn: "জি, সেবা বুকিং, পেমেন্ট সম্পন্ন করা এবং কাজের অগ্রগতি ট্র্যাক করার জন্য অ্যাকাউন্ট থাকা বাধ্যতামূলক। এটি আপনার তথ্যের নিরাপত্তাও নিশ্চিত করে।"
      },
      {
        qEn: "Is my personal information safe on Somadhan?",
        qBn: "আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
        aEn: "Yes. Somadhan follows strict data protection and privacy standards to keep your information secure and confidential.",
        aBn: "অবশ্যই। Somadhan কঠোর ডেটা সুরক্ষা ও গোপনীয়তা নীতি মেনে চলে, যাতে আপনার ব্যক্তিগত তথ্য ও আইনি নথিপত্র সম্পূর্ণ নিরাপদ থাকে।"
      },
      {
        qEn: "Can I access Somadhan from both mobile and desktop?",
        qBn: "মোবাইল ও ডেস্কটপ উভয় থেকেই কি ব্যবহার করা যাবে?",
        aEn: "Yes. Somadhan is designed to work smoothly on mobile phones, tablets, and desktop devices.",
        aBn: "হ্যাঁ, Somadhan মোবাইল, ট্যাবলেট এবং ডেস্কটপ—সব ধরনের ডিভাইসেই স্বাচ্ছন্দ্যে ব্যবহার করা যায়।"
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
        qBn: "আইনি পরামর্শের কলগুলো কীভাবে কাজ করে?",
        aEn: "You request a call, maintain the required wallet balance, and once approved, a verified lawyer contacts you for consultation.",
        aBn: "প্রথমে আপনি কলের জন্য অনুরোধ করবেন। আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স থাকলে এবং অনুরোধ অনুমোদিত হলে, একজন যাচাইকৃত আইনজীবী আপনার সাথে যোগাযোগ করবেন।"
      },
      {
        qEn: "Why was my call marked as 'Missed' or 'No Answer'?",
        qBn: "আমার কল কেন 'Missed' বা 'No Answer' দেখাচ্ছে?",
        aEn: "This happens if either you or the lawyer could not answer the call at the scheduled time.",
        aBn: "নির্ধারিত সময়ে আপনি বা আইনজীবী কেউ কল রিসিভ করতে না পারলে এমনটি দেখানো হয়।"
      },
      {
        qEn: "Can I call the lawyer again if the call fails?",
        qBn: "কল বিচ্ছিন্ন হলে বা ব্যর্থ হলে কি আবার কল করা যাবে?",
        aEn: "Yes. You can use the 'Call Again' option from the call activity card.",
        aBn: "জি, কল অ্যাক্টিভিটি কার্ড থেকে 'Call Again' অপশন ব্যবহার করে পুনরায় কল করতে পারবেন।"
      },
      {
        qEn: "How is call cost calculated?",
        qBn: "কলের খরচ কীভাবে হিসাব করা হয়?",
        aEn: "Calls are charged per minute, based on the lawyer's rate. The amount is deducted from your wallet balance. Once you buy a service/package, no fees needed to make calls with that specific lawyer.",
        aBn: "আইনজীবীর রেট অনুযায়ী প্রতি মিনিটের খরচ হিসাব করে ওয়ালেট থেকে টাকা কাটা হয়। তবে কোনো নির্দিষ্ট সার্ভিস বা প্যাকেজ কিনলে, সেই আইনজীবীর সাথে কথা বলতে আলাদা ফি লাগে না।"
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
        qBn: "'Booking Confirmed' বলতে কী বোঝায়?",
        aEn: "It means your service request has been accepted and assigned to a lawyer.",
        aBn: "এর অর্থ আপনার সেবার অনুরোধটি গৃহীত হয়েছে এবং একজন আইনজীবীকে দায়িত্ব দেওয়া হয়েছে।"
      },
      {
        qEn: "What should I do if my booking shows 'Action Required'?",
        qBn: "'Action Required' দেখালে আমাকে কী করতে হবে?",
        aEn: "You need to complete a pending step, such as uploading documents or providing information.",
        aBn: "আপনাকে পরবর্তী ধাপ সম্পন্ন করতে হবে, যেমন—প্রয়োজনীয় নথিপত্র আপলোড করা বা অতিরিক্ত তথ্য প্রদান করা।"
      },
      {
        qEn: "Can I cancel a booking after confirmation?",
        qBn: "বুকিং নিশ্চিত হওয়ার পর কি বাতিল করা যাবে?",
        aEn: "Yes, you can cancel based on service terms. Some services may have partial charges.",
        aBn: "হ্যাঁ, সেবার শর্তাবলী সাপেক্ষে বাতিল করা সম্ভব। তবে কিছু ক্ষেত্রে আংশিক চার্জ প্রযোজ্য হতে পারে।"
      },
      {
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
        qEn: "What payment methods are supported?",
        qBn: "কীভাবে পেমেন্ট করা যায়?",
        aEn: "Somadhan supports wallet payments and integrated payment gateways (bank, card, or mobile payment).",
        aBn: "Somadhan-এ ওয়ালেট, ব্যাংক কার্ড বা মোবাইল ব্যাংকিংয়ের (বিকাশ, নগদ, রকেট) মাধ্যমে পেমেন্ট করা যায়।"
      },
      {
        qEn: "What does 'Payment Declined' mean?",
        qBn: "'Payment Declined' মানে কী?",
        aEn: "The payment could not be processed due to bank issues, insufficient balance, or incorrect details.",
        aBn: "ব্যাংকিং সমস্যা, অপর্যাপ্ত ব্যালেন্স বা ভুল তথ্যের কারণে পেমেন্ট সম্পন্ন না হলে এটি দেখায়।"
      },
      {
        qEn: "When will I receive my refund?",
        qBn: "রিফান্ড কত দিনের মধ্যে পাবো?",
        aEn: "Refunds are processed according to service policies and are usually credited back to your wallet.",
        aBn: "সেবা নীতি অনুযায়ী রিফান্ড প্রসেস করা হয় এবং সাধারণত তা আপনার Somadhan ওয়ালেটে ফেরত দেওয়া হয়।"
      },
      {
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
        qEn: "Why do I need a minimum wallet balance?",
        qBn: "ওয়ালেটে কেন ন্যূনতম ব্যালেন্স রাখতে হয়?",
        aEn: "A minimum balance ensures uninterrupted consultation calls and services.",
        aBn: "কল বা সেবা চলাকালীন যেন সংযোগ বিচ্ছিন্ন না হয়, তা নিশ্চিত করতেই ন্যূনতম ব্যালেন্স রাখা জরুরি।"
      },
      {
        qEn: "What is the maximum wallet balance allowed?",
        qBn: "ওয়ালেটে সর্বোচ্চ কত টাকা রাখা যায়?",
        aEn: "You can maintain a wallet balance of up to 50,000 BDT.",
        aBn: "আপনি ওয়ালেটে সর্বোচ্চ ৫০,০০০ টাকা পর্যন্ত রাখতে পারবেন।"
      },
      {
        qEn: "What happens if my wallet balance is low?",
        qBn: "ব্যালেন্স কমে গেলে কী হবে?",
        aEn: "You will be prompted to add funds before starting paid services.",
        aBn: "যেকোনো পেইড সার্ভিস শুরু করার আগে আপনাকে ব্যালেন্স রিচার্জ বা টপ-আপ করতে বলা হবে।"
      },
      {
        qEn: "Are wallet refunds instant?",
        qBn: "রিফান্ড কি সাথে সাথে ওয়ালেটে যোগ হয়?",
        aEn: "Most refunds are processed quickly, but timing may vary depending on the payment method.",
        aBn: "বেশিরভাগ রিফান্ড দ্রুত প্রসেস হয়, তবে পেমেন্ট মেথডের ওপর ভিত্তি করে কিছুটা সময় লাগতে পারে।"
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
        qBn: "Somadhan-এ 'ইভেন্ট' বলতে কী বোঝায়?",
        aEn: "Events include scheduled consultations, document deadlines, meetings, and legal reminders.",
        aBn: "নির্ধারিত পরামর্শ, ডকুমেন্ট জমা দেওয়ার সময়সীমা, মিটিং বা আইনি নোটিফিকেশনগুলোকেই ইভেন্ট বলা হয়।"
      },
      {
        qEn: "Can I reschedule an event?",
        qBn: "ইভেন্টের সময় পরিবর্তন বা রিশিডিউল করা যায়?",
        aEn: "Yes. Most events allow rescheduling based on lawyer availability.",
        aBn: "জি, আইনজীবীর লভ্যতা সাপেক্ষে বেশিরভাগ ইভেন্ট রিশিডিউল করা সম্ভব।"
      },
      {
        qEn: "Will I receive reminders for upcoming events?",
        qBn: "আসন্ন ইভেন্টের জন্য কি রিমাইন্ডার পাবো?",
        aEn: "Yes. Somadhan sends reminders so you don't miss important sessions.",
        aBn: "অবশ্যই। কোনো গুরুত্বপূর্ণ সেশন বা ডেডলাইন যেন মিস না হয়, সেজন্য আমরা রিমাইন্ডার পাঠাই।"
      },
      {
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
        qEn: "What file types can I upload?",
        qBn: "কী ধরনের ফাইল আপলোড করা যাবে?",
        aEn: "You can upload PDF, JPG, PNG, DOC, and DOCX files.",
        aBn: "আপনি PDF, JPG, PNG, DOC এবং DOCX ফরম্যাটের ফাইল আপলোড করতে পারবেন।"
      },
      {
        qEn: "Is there a file size limit?",
        qBn: "ফাইলের সাইজ লিমিট কত?",
        aEn: "Yes. Each file must be under 5 MB.",
        aBn: "প্রতিটি ফাইল সর্বোচ্চ ৫ মেগাবাইটের মধ্যে হতে হবে।"
      },
      {
        qEn: "Are my documents visible to everyone?",
        qBn: "আমার ডকুমেন্ট কি সবাই দেখতে পাবে?",
        aEn: "No. Documents are only accessible to you and your assigned lawyer.",
        aBn: "না, আপনার ডকুমেন্ট শুধুমাত্র আপনি এবং আপনার নিযুক্ত আইনজীবী দেখতে পারবেন।"
      },
      {
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
        qEn: "How do I contact Somadhan support?",
        qBn: "Somadhan সাপোর্টে কীভাবে যোগাযোগ করব?",
        aEn: "You can contact support through the app or email us at info@somadhan.com",
        aBn: "অ্যাপের মাধ্যমে অথবা info@somadhan.com-এ ইমেইল করে আমাদের সাথে যোগাযোগ করতে পারেন।"
      },
      {
        qEn: "Can I give feedback on a service?",
        qBn: "সার্ভিস নিয়ে কি ফিডব্যাক দেওয়া যায়?",
        aEn: "Yes. You can rate calls and services after completion.",
        aBn: "জি, সেবা বা কল শেষ হওয়ার পর আপনি রেটিং ও মতামত জানাতে পারবেন।"
      },
      {
        qEn: "Are all lawyers verified?",
        qBn: "Somadhan-এর সব আইনজীবী কি ভেরিফাইড?",
        aEn: "Yes. Somadhan works only with verified and approved legal professionals.",
        aBn: "হ্যাঁ। আমরা শুধুমাত্র যাচাইকৃত এবং অনুমোদিত আইনজীবীদের সাথেই কাজ করি।"
      },
      {
        qEn: "Where can I track all my activities?",
        qBn: "আমি আমার সব অ্যাক্টিভিটি কোথায় দেখতে পাবো?",
        aEn: "All calls, bookings, bills, and events are available in the Activity section.",
        aBn: "'Activity' সেকশনে আপনার সব কল, বুকিং, বিল ও ইভেন্টের বিস্তারিত তথ্য পাওয়া যাবে।"
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
            href="mailto:info@somadhan.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            <Mail className="w-4 h-4" />
            info@somadhan.com
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
