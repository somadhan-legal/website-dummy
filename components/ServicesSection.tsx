import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, Users, Home, Gavel, Scale, Shield, FileText, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const services = [
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate & Business',
    titleBn: 'কর্পোরেট ও ব্যবসা',
    description: 'Formation, M&A, contracts, and compliance',
    descriptionBn: 'গঠন, একীভূতকরণ, চুক্তি এবং সম্মতি',
    examples: ['Business Formation', 'Mergers & Acquisitions', 'Contract Law'],
    startPrice: 2000,
  },
  {
    id: 'family',
    icon: Users,
    title: 'Family & Personal',
    titleBn: 'পরিবার ও ব্যক্তিগত',
    description: 'Divorce, custody, marriage, and inheritance',
    descriptionBn: 'বিবাহবিচ্ছেদ, হেফাজত, বিবাহ এবং উত্তরাধিকার',
    examples: ['Divorce & Separation', 'Child Custody', 'Marriage Registration'],
    startPrice: 800,
  },
  {
    id: 'property',
    icon: Home,
    title: 'Property & Real Estate',
    titleBn: 'সম্পত্তি ও রিয়েল এস্টেট',
    description: 'Transactions, disputes, and land matters',
    descriptionBn: 'লেনদেন, বিরোধ এবং জমি সংক্রান্ত বিষয়',
    examples: ['Land Disputes', 'Property Transfer', 'Title Verification'],
    startPrice: 1200,
  },
  {
    id: 'criminal',
    icon: Gavel,
    title: 'Criminal Defense',
    titleBn: 'ফৌজদারি প্রতিরক্ষা',
    description: 'Defense, bail, and criminal matters',
    descriptionBn: 'প্রতিরক্ষা, জামিন এবং ফৌজদারি বিষয়',
    examples: ['Bail Applications', 'Criminal Defense', 'FIR/GD Filing'],
    startPrice: 2500,
  },
  {
    id: 'litigation',
    icon: Scale,
    title: 'Litigation & Disputes',
    titleBn: 'মামলা ও বিরোধ',
    description: 'Civil suits, arbitration, and mediation',
    descriptionBn: 'দেওয়ানী মামলা, সালিশ এবং মধ্যস্থতা',
    examples: ['Civil Litigation', 'Arbitration', 'Mediation'],
    startPrice: 1500,
  },
  {
    id: 'ip',
    icon: Shield,
    title: 'Intellectual Property',
    titleBn: 'বুদ্ধিবৃত্তিক সম্পত্তি',
    description: 'Patents, trademarks, and copyrights',
    descriptionBn: 'পেটেন্ট, ট্রেডমার্ক এবং কপিরাইট',
    examples: ['Trademark Registration', 'Patent Filing', 'Copyright'],
    startPrice: 3000,
  },
  {
    id: 'employment',
    icon: FileText,
    title: 'Employment & Labor',
    titleBn: 'কর্মসংস্থান ও শ্রম',
    description: 'Workplace rights, contracts, and disputes',
    descriptionBn: 'কর্মক্ষেত্রের অধিকার, চুক্তি এবং বিরোধ',
    examples: ['Employment Contracts', 'Wrongful Termination', 'Disputes'],
    startPrice: 1000,
  },
  {
    id: 'immigration',
    icon: Globe,
    title: 'Immigration',
    titleBn: 'অভিবাসন',
    description: 'Visas, work permits, and citizenship',
    descriptionBn: 'ভিসা, ওয়ার্ক পারমিট এবং নাগরিকত্ব',
    examples: ['Work Visas', 'Green Cards', 'Citizenship'],
    startPrice: 2000,
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
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
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
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {service.examples.map((ex) => (
                            <span key={ex} className="text-xs px-2 py-1 bg-white text-slate-600 rounded-md shadow-sm">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 group-hover:border-brand-200/50">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        {t('services.startingFrom')}
                      </span>
                      <div className="font-bold text-slate-900 text-sm">৳{service.startPrice.toLocaleString()}</div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-brand-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
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
                    <p className="text-xs text-slate-500">
                      {t('services.startingFrom')} ৳{service.startPrice.toLocaleString()}
                    </p>
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
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {service.examples.map((ex) => (
                            <span key={ex} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md">
                              {ex}
                            </span>
                          ))}
                        </div>
                        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                          {t('services.explore')}
                          <ArrowRight className="w-4 h-4" />
                        </button>
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
