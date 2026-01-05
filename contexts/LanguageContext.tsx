import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.faq': 'FAQ',
    'nav.exploreServices': 'Explore Services',
    
    'hero.badge': '#1 AI-Powered Legal Platform',
    'hero.headline': 'Legal support anytime,',
    'hero.headlineAccent': 'anywhere instantly.',
    'hero.subtext': 'AI powered legal support that connects you with certified lawyers, secures your documents, and helps you track every case with full transparency.',
    'hero.joinWaitlist': 'Join Waitlist',
    'hero.trustedBy': 'Trusted by professionals from',
    
    'waitlist.title': 'Join the Waitlist',
    'waitlist.subtitle': 'Be among the first to experience seamless legal services.',
    'waitlist.fullName': 'Full Name',
    'waitlist.fullNamePlaceholder': 'Enter your name',
    'waitlist.phone': 'Phone Number',
    'waitlist.phonePlaceholder': '+880 1XXX-XXXXXX',
    'waitlist.email': 'Email Address',
    'waitlist.emailPlaceholder': 'you@example.com',
    'waitlist.next': 'Continue',
    'waitlist.back': 'Back',
    'waitlist.submit': 'Join Waitlist',
    'waitlist.submitting': 'Submitting...',
    'waitlist.success': "You're on the list!",
    'waitlist.successSubtext': "We'll reach out soon with early access.",
    
    'services.title': 'Legal Services',
    'services.subtitle': 'Comprehensive legal support across all major practice areas.',
    'services.startingFrom': 'Starting from',
    'services.explore': 'Explore',
    
    'process.badge': 'How it Works',
    'process.title': 'Simple. Transparent. Effective.',
    
    'trust.badge': 'Why Somadhan?',
    'trust.title': 'Built for trust.',
    'trust.titleAccent': 'Designed for you.',
    'trust.desc1': 'Legal issues in Bangladesh often feel overwhelming and confusing. We created Somadhan to make legal help simple and clear for everyone.',
    'trust.desc2': 'No confusing legal terms, no running around courts. Just clear, private connections to verified lawyers.',
    'trust.verifiedCounsel': 'Verified Lawyers',
    'trust.verifiedCounselDesc': 'Every lawyer is verified against Bangladesh Bar Council records.',
    'trust.private': '100% Private',
    'trust.privateDesc': 'Encrypted consultations. Your details stay between you and your lawyer.',
    'trust.noHiddenFees': 'No Hidden Fees',
    'trust.noHiddenFeesDesc': 'The price you see is the price you pay. Transparent always.',
    'trust.anywhereAccess': 'Anywhere Access',
    'trust.anywhereAccessDesc': 'Video calls or audio calls. Your choice, your convenience.',
    
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about Somadhan',
    
    'footer.tagline': 'Your trusted partner for legal support in Bangladesh.',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.contact': 'Contact',
    'footer.blog': 'Blog',
    'footer.getApp': 'Get the App',
    'footer.appComingSoon': 'Apps launching soon',
    'footer.notifyMe': 'Notify me at launch',
    'footer.copyright': '© 2026 Somadhan. All rights reserved.',
    'footer.comingSoon': 'Coming Soon',
    'footer.comingSoonText': 'This page is under development. Stay tuned!',
  },
  bn: {
    'nav.services': 'সেবাসমূহ',
    'nav.process': 'প্রক্রিয়া',
    'nav.faq': 'জিজ্ঞাসা',
    'nav.exploreServices': 'সেবা দেখুন',
    
    'hero.badge': '#১ এআই-চালিত আইনি প্ল্যাটফর্ম',
    'hero.headline': 'যেকোনো সময়,',
    'hero.headlineNext': 'যেকোনো জায়গায়',
    'hero.headlineAccent': 'তাৎক্ষণিক আইনি সমাধান',
    'hero.subtext': 'এআই-চালিত আইনি সহায়তা যা আপনাকে অভিজ্ঞ ও যাচাইকৃত আইনজীবীদের সাথে সংযুক্ত করে, আপনার নথিপত্র সুরক্ষিত রাখে এবং প্রতিটি মামলার স্বচ্ছতা নিশ্চিত করে।',
    'hero.joinWaitlist': 'ওয়েটলিস্টে যোগ দিন',
    'hero.trustedBy': 'যাদের আস্থায় আমরা',
    
    'waitlist.title': 'ওয়েটলিস্টে যোগ দিন',
    'waitlist.subtitle': 'স্মার্ট ও সহজ আইনি সেবার অভিজ্ঞতা নিতে আমাদের সাথে থাকুন',
    'waitlist.fullName': 'পুরো নাম',
    'waitlist.fullNamePlaceholder': 'আপনার নাম লিখুন',
    'waitlist.phone': 'ফোন নম্বর',
    'waitlist.phonePlaceholder': '+৮৮০ ১XXX-XXXXXX',
    'waitlist.email': 'ইমেইল ঠিকানা',
    'waitlist.emailPlaceholder': 'you@example.com',
    'waitlist.next': 'পরবর্তী',
    'waitlist.back': 'পেছনে',
    'waitlist.submit': 'যোগ দিন',
    'waitlist.submitting': 'জমা হচ্ছে...',
    'waitlist.success': 'অভিনন্দন! আপনি ওয়েটলিস্টে যুক্ত হয়েছেন',
    'waitlist.successSubtext': "শীঘ্রই আমরা পরবর্তী আপডেট নিয়ে আপনার সাথে যোগাযোগ করব।",
    
    'services.title': 'আইনি সেবাসমূহ',
    'services.subtitle': 'সব ধরনের আইনি প্রয়োজনে নির্ভরযোগ্য সমাধান',
    'services.startingFrom': 'শুরু',
    'services.explore': 'বিস্তারিত',
    
    'process.badge': 'কিভাবে কাজ করে',
    'process.title': 'সহজ। স্বচ্ছ। কার্যকর।',
    
    'trust.badge': 'কেন সমাধান?',
    'trust.title': 'বিশ্বাসের ভিত্তিতে গড়া',
    'trust.titleAccent': 'আপনার জন্যই তৈরি',
    'trust.desc1': 'আইনি সমস্যাগুলো অনেক সময় জটিল ও বিভ্রান্তিকর মনে হয়। সবার জন্য আইনি সাহায্য সহজ ও বোধগম্য করতেই "সমাধান"-এর যাত্রা।',
    'trust.desc2': 'জটিল আইনি ভাষা বা আদালতে ছোটাছুটির ঝামেলা নেই। যাচাইকৃত আইনজীবীদের সাথে নিরাপদে ও সহজে পরামর্শ নিন।',
    'trust.verifiedCounsel': 'যাচাইকৃত আইনজীবী',
    'trust.verifiedCounselDesc': 'প্রতিটি আইনজীবী বাংলাদেশ বার কাউন্সিলের তালিকাভুক্ত ও যাচাইকৃত।',
    'trust.private': '১০০% গোপনীয়',
    'trust.privateDesc': 'এনক্রিপ্টেড ও নিরাপদ। আপনার তথ্য শুধু আপনি ও আপনার আইনজীবীর মধ্যেই সীমাবদ্ধ থাকবে।',
    'trust.noHiddenFees': 'কোনো গোপন চার্জ নেই',
    'trust.noHiddenFeesDesc': 'যে ফি দেখবেন, সেটাই পরিশোধ করবেন। সম্পূর্ণ স্বচ্ছতা বজায় রাখা হয়।',
    'trust.anywhereAccess': 'যেকোনো জায়গা থেকে',
    'trust.anywhereAccessDesc': 'ভিডিও বা অডিও কল—আপনার সুবিধা অনুযায়ী আইনজীবীর সাথে কথা বলুন।',
    
    'faq.title': 'সাধারণ জিজ্ঞাসা',
    'faq.subtitle': 'সমাধান সম্পর্কে আপনার মনে আসা সাধারণ প্রশ্নের উত্তর',
    
    'footer.tagline': 'আইনি সহায়তায় আপনার বিশ্বস্ত সহযোগী',
    'footer.company': 'প্রতিষ্ঠান',
    'footer.about': 'আমাদের সম্পর্কে',
    'footer.careers': 'ক্যারিয়ার',
    'footer.contact': 'যোগাযোগ',
    'footer.blog': 'ব্লগ',
    'footer.getApp': 'অ্যাপ ডাউনলোড',
    'footer.appComingSoon': 'অ্যাপ শীঘ্রই আসছে',
    'footer.notifyMe': 'লঞ্চ হলে আমাকে জানান',
    'footer.copyright': '© ২০২৬ সমাধান। সর্বস্বত্ব সংরক্ষিত।',
    'footer.comingSoon': 'শীঘ্রই আসছে',
    'footer.comingSoonText': 'এই পেজটির কাজ চলছে। সাথে থাকুন!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
