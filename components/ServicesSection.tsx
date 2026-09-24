import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Home, Gavel, Scale, Shield, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackServiceCardHover } from '../lib/analytics';
import ServicesMarquee from './ui/services-marquee';

const services = [
  {
    id: 'corporate', icon: Briefcase, number: '001',
    image: '/images/corporate-business.jpeg',
    title: 'Corporate & Business', titleBn: 'কর্পোরেট ও ব্যবসায়িক আইন',
    description: 'Formation, M&A, contracts, and compliance', descriptionBn: 'কোম্পানি গঠন, মার্জার, চুক্তি ও আইনি কমপ্লায়েন্স',
    examples: ['Business Formation', 'Mergers & Acquisitions', 'Contract Law'],
  },
  {
    id: 'family', icon: Users, number: '002',
    image: '/images/family-personal-law.jpeg',
    title: 'Family & Personal', titleBn: 'পারিবারিক ও ব্যক্তিগত আইন',
    description: 'Divorce, custody, marriage, and inheritance', descriptionBn: 'বিবাহ, তালাক, সন্তানের জিম্মা ও উত্তরাধিকার',
    examples: ['Divorce & Separation', 'Child Custody', 'Marriage Registration'],
  },
  {
    id: 'property', icon: Home, number: '003',
    image: '/images/property-legal-consultation.jpeg',
    title: 'Property & Real Estate', titleBn: 'জমি ও আবাসন',
    description: 'Transactions, disputes, and land matters', descriptionBn: 'জমি ক্রয়-বিক্রয়, বিরোধ নিষ্পত্তি ও নামজারি',
    examples: ['Land Disputes', 'Property Transfer', 'Title Verification'],
  },
  {
    id: 'criminal', icon: Gavel, number: '004',
    image: '/images/criminal-defense.jpeg',
    title: 'Criminal Defense', titleBn: 'ফৌজদারি মামলা',
    description: 'Defense, bail, and criminal matters', descriptionBn: 'জামিন, শুনানি ও ফৌজদারি আইনি সহায়তা',
    examples: ['Bail Applications', 'Criminal Defense', 'FIR/GD Filing'],
  },
  {
    id: 'litigation', icon: Scale, number: '005',
    image: '/images/dispute-resolution.jpeg',
    title: 'Litigation & Disputes', titleBn: 'দেওয়ানি ও বিরোধ নিষ্পত্তি',
    description: 'Civil suits, arbitration, and mediation', descriptionBn: 'দেওয়ানি মামলা, সালিশ ও মধ্যস্থতা',
    examples: ['Civil Litigation', 'Arbitration', 'Mediation'],
  },
  {
    id: 'ip', icon: Shield, number: '006',
    image: '/images/intellectual-property.jpeg',
    title: 'Intellectual Property', titleBn: 'ইন্টেলেকচুয়াল প্রপার্টি',
    description: 'Patents, trademarks, and copyrights', descriptionBn: 'ট্রেডমার্ক, কপিরাইট ও প্যাটেন্ট',
    examples: ['Trademark Registration', 'Patent Filing', 'Copyright'],
  },
  {
    id: 'employment', icon: FileText, number: '007',
    image: '/images/labor-employment.jpeg',
    title: 'Employment & Labor', titleBn: 'শ্রম ও কর্মসংস্থান',
    description: 'Workplace rights, contracts, and disputes', descriptionBn: 'শ্রম আইন, নিয়োগ চুক্তি ও কর্মক্ষেত্রের অধিকার',
    examples: ['Employment Contracts', 'Wrongful Termination', 'Disputes'],
  },
  {
    id: 'immigration', icon: Globe, number: '008',
    image: '/images/immigration.jpeg',
    title: 'Immigration', titleBn: 'ইমিগ্রেশন ও ভিসা',
    description: 'Visas, work permits, and citizenship', descriptionBn: 'ভিসা প্রসেসিং, ওয়ার্ক পারমিট ও নাগরিকত্ব',
    examples: ['Work Visas', 'Green Cards', 'Citizenship'],
  },
];

const ServicesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const carouselItems = services.map((service) => ({
    ...service,
    title: language === 'bn' ? service.titleBn : service.title,
    description: language === 'bn' ? service.descriptionBn : service.description,
    category: language === 'bn' ? 'আইনি সেবা' : 'LEGAL SERVICES',
  }));

  return (
    <section id="services" className="relative overflow-hidden scroll-mt-24 bg-white py-16 md:py-20">
      <div className="pointer-events-none absolute -right-72 -top-72 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-brand-50 to-transparent" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-brand-50/70 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mb-3 font-serif text-3xl tracking-tight text-slate-900 md:text-4xl ${language === 'bn' ? 'leading-[1.4]' : ''}`}
          >
            {t('services.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-slate-500"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        <ServicesMarquee
          items={carouselItems}
          language={language}
          onItemHover={(item) => trackServiceCardHover(item.id, item.title)}
        />
      </div>
    </section>
  );
};

export default ServicesSection;
