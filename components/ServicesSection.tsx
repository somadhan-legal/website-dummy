import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, Home, Gavel, Scale, Shield, FileText, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const services = [
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate & Business',
    titleBn: 'কর্পোরেট ও ব্যবসায়িক আইন',
    description: 'Formation, M&A, contracts, and compliance',
    descriptionBn: 'কোম্পানি গঠন, মার্জার, চুক্তি ও আইনি কমপ্লায়েন্স',
    examples: ['Business Formation', 'Mergers & Acquisitions', 'Contract Law'],
  },
  {
    id: 'family',
    icon: Users,
    title: 'Family & Personal',
    titleBn: 'পারিবারিক ও ব্যক্তিগত আইন',
    description: 'Divorce, custody, marriage, and inheritance',
    descriptionBn: 'বিবাহ, তালাক, সন্তানের জিম্মা ও উত্তরাধিকার',
    examples: ['Divorce & Separation', 'Child Custody', 'Marriage Registration'],
  },
  {
    id: 'property',
    icon: Home,
    title: 'Property & Real Estate',
    titleBn: 'জমি ও আবাসন',
    description: 'Transactions, disputes, and land matters',
    descriptionBn: 'জমি ক্রয়-বিক্রয়, বিরোধ নিষ্পত্তি ও নামজারি',
    examples: ['Land Disputes', 'Property Transfer', 'Title Verification'],
  },
  {
    id: 'criminal',
    icon: Gavel,
    title: 'Criminal Defense',
    titleBn: 'ফৌজদারি মামলা',
    description: 'Defense, bail, and criminal matters',
    descriptionBn: 'জামিন, শুনানি ও ফৌজদারি আইনি সহায়তা',
    examples: ['Bail Applications', 'Criminal Defense', 'FIR/GD Filing'],
  },
  {
    id: 'litigation',
    icon: Scale,
    title: 'Litigation & Disputes',
    titleBn: 'দেওয়ানি ও বিরোধ নিষ্পত্তি',
    description: 'Civil suits, arbitration, and mediation',
    descriptionBn: 'দেওয়ানি মামলা, সালিশ ও মধ্যস্থতা',
    examples: ['Civil Litigation', 'Arbitration', 'Mediation'],
  },
  {
    id: 'ip',
    icon: Shield,
    title: 'Intellectual Property',
    titleBn: 'ইন্টেলেকচুয়াল প্রপার্টি',
    description: 'Patents, trademarks, and copyrights',
    descriptionBn: 'ট্রেডমার্ক, কপিরাইট ও প্যাটেন্ট',
    examples: ['Trademark Registration', 'Patent Filing', 'Copyright'],
  },
  {
    id: 'employment',
    icon: FileText,
    title: 'Employment & Labor',
    titleBn: 'শ্রম ও কর্মসংস্থান',
    description: 'Workplace rights, contracts, and disputes',
    descriptionBn: 'শ্রম আইন, নিয়োগ চুক্তি ও কর্মক্ষেত্রের অধিকার',
    examples: ['Employment Contracts', 'Wrongful Termination', 'Disputes'],
  },
  {
    id: 'immigration',
    icon: Globe,
    title: 'Immigration',
    titleBn: 'ইমিগ্রেশন ও ভিসা',
    description: 'Visas, work permits, and citizenship',
    descriptionBn: 'ভিসা প্রসেসিং, ওয়ার্ক পারমিট ও নাগরিকত্ব',
    examples: ['Work Visas', 'Green Cards', 'Citizenship'],
  },
];

const ServicesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  return (
    <section id="services" className="py-16 md:py-20 bg-white relative overflow-hidden scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-slate-50 to-transparent rounded-full -mr-72 -mt-72 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-50/50 to-transparent rounded-full -ml-48 -mb-48 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl text-slate-900 mb-3 tracking-tight"
          >
            {t('services.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 text-base"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* Services Grid - Desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isHovered = hoveredId === service.id;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-100 hover:border-brand-200 transition-all duration-500 hover:shadow-xl hover:shadow-brand-100/50 cursor-pointer overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-slate-500 group-hover:text-brand-600 transition-colors" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-brand-700">
                    {language === 'bn' ? service.titleBn : service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {language === 'bn' ? service.descriptionBn : service.description}
                  </p>

                  {/* Examples - shown on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 group-hover:border-brand-200/50">
                          {service.examples.map((ex) => (
                            <span key={ex} className="text-xs px-2 py-1 bg-white text-slate-600 rounded-md shadow-sm">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Services Grid - Mobile (Expandable Cards) */}
        <div className="sm:hidden space-y-3">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isExpanded = expandedMobile === service.id;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'border-brand-200 shadow-lg shadow-brand-100/50' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => setExpandedMobile(isExpanded ? null : service.id)}
                  className="w-full p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isExpanded ? 'bg-brand-50' : 'bg-slate-50'}`}>
                    <Icon className={`w-5 h-5 ${isExpanded ? 'text-brand-600' : 'text-slate-500'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-sm text-slate-900">
                      {language === 'bn' ? service.titleBn : service.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isExpanded ? 'bg-brand-50' : 'bg-slate-50'}`}
                  >
                    <ChevronDown className={`w-4 h-4 ${isExpanded ? 'text-brand-600' : 'text-slate-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-slate-600 mb-3">
                          {language === 'bn' ? service.descriptionBn : service.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.examples.map((ex) => (
                            <span key={ex} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
