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
    'nav.faq': 'সাধারণ প্রশ্ন',
    'nav.exploreServices': 'সেবা দেখুন',
    
    'hero.badge': '#১ AI-চালিত আইনি প্ল্যাটফর্ম',
    'hero.headline': 'যেকোনো সময়, যেকোনো জায়গায়',
    'hero.headlineAccent': 'তাৎক্ষণিক আইনি সহায়তা।',
    'hero.subtext': 'AI চালিত আইনি সহায়তা যা আপনাকে প্রমাণিত আইনজীবীদের সাথে সংযুক্ত করে, আপনার নথি সুরক্ষিত রাখে এবং সম্পূর্ণ স্বচ্ছতার সাথে প্রতিটি মামলা ট্র্যাক করতে সাহায্য করে।',
    'hero.joinWaitlist': 'ওয়েটলিস্টে যোগ দিন',
    'hero.trustedBy': 'বিশ্বস্ত পেশাদারদের দ্বারা',
    
    'waitlist.title': 'ওয়েটলিস্টে যোগ দিন',
    'waitlist.subtitle': 'নির্বিঘ্ন আইনি সেবার প্রথম অভিজ্ঞতা নিন।',
    'waitlist.fullName': 'পুরো নাম',
    'waitlist.fullNamePlaceholder': 'আপনার নাম লিখুন',
    'waitlist.phone': 'ফোন নম্বর',
    'waitlist.phonePlaceholder': '+880 1XXX-XXXXXX',
    'waitlist.email': 'ইমেইল ঠিকানা',
    'waitlist.emailPlaceholder': 'you@example.com',
    'waitlist.next': 'পরবর্তী',
    'waitlist.back': 'পেছনে',
    'waitlist.submit': 'যোগ দিন',
    'waitlist.submitting': 'জমা হচ্ছে...',
    'waitlist.success': 'আপনি তালিকায় আছেন!',
    'waitlist.successSubtext': 'আমরা শীঘ্রই আর্লি অ্যাক্সেস নিয়ে যোগাযোগ করব।',
    
    'services.title': 'আইনি সেবাসমূহ',
    'services.subtitle': 'সকল প্রধান আইনি ক্ষেত্রে ব্যাপক সহায়তা।',
    'services.startingFrom': 'শুরু',
    'services.explore': 'দেখুন',
    
    'process.badge': 'কিভাবে কাজ করে',
    'process.title': 'সহজ। স্বচ্ছ। কার্যকর।',
    
    'trust.badge': 'কেন সমাধান?',
    'trust.title': 'বিশ্বাসের জন্য তৈরি।',
    'trust.titleAccent': 'আপনার জন্য ডিজাইন।',
    'trust.desc1': 'বাংলাদেশে আইনি সমস্যা প্রায়ই বিভ্রান্তিকর ও কঠিন মনে হয়। আমরা সমাধান তৈরি করেছি সবার জন্য আইনি সাহায্য সহজ ও স্পষ্ট করতে।',
    'trust.desc2': 'কোনো বিভ্রান্তিকর আইনি ভাষা নেই, আদালতে দৌড়াদৌড়ি নেই। শুধু যাচাইকৃত আইনজীবীদের সাথে স্পষ্ট, ব্যক্তিগত সংযোগ।',
    'trust.verifiedCounsel': 'যাচাইকৃত আইনজীবী',
    'trust.verifiedCounselDesc': 'প্রতিটি আইনজীবী বাংলাদেশ বার কাউন্সিল রেকর্ডের বিপরীতে যাচাই করা।',
    'trust.private': '১০০% গোপনীয়',
    'trust.privateDesc': 'এনক্রিপ্টেড পরামর্শ। আপনার বিবরণ আপনার এবং আপনার আইনজীবীর মধ্যে থাকে।',
    'trust.noHiddenFees': 'কোনো লুকানো ফি নেই',
    'trust.noHiddenFeesDesc': 'যে মূল্য দেখবেন সেটাই দিতে হবে। সর্বদা স্বচ্ছ।',
    'trust.anywhereAccess': 'যেকোনো জায়গা থেকে',
    'trust.anywhereAccessDesc': 'ভিডিও কল বা অডিও কল। আপনার পছন্দ, আপনার সুবিধা।',
    
    'faq.title': 'সাধারণ জিজ্ঞাসা',
    'faq.subtitle': 'সমাধান সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন',
    
    'footer.tagline': 'বাংলাদেশে আইনি সহায়তার জন্য আপনার বিশ্বস্ত অংশীদার।',
    'footer.company': 'কোম্পানি',
    'footer.about': 'আমাদের সম্পর্কে',
    'footer.careers': 'ক্যারিয়ার',
    'footer.contact': 'যোগাযোগ',
    'footer.blog': 'ব্লগ',
    'footer.getApp': 'অ্যাপ ডাউনলোড',
    'footer.appComingSoon': 'অ্যাপ শীঘ্রই আসছে',
    'footer.notifyMe': 'লঞ্চে জানান',
    'footer.copyright': '© ২০২৬ সমাধান। সর্বস্বত্ব সংরক্ষিত।',
    'footer.comingSoon': 'শীঘ্রই আসছে',
    'footer.comingSoonText': 'এই পেজটি তৈরি হচ্ছে। অপেক্ষা করুন!',
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
