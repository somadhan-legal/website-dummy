import React from 'react';
import { Shield, Lock, CheckCircle2, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      titleKey: 'trust.verifiedCounsel',
      descKey: 'trust.verifiedCounselDesc',
    },
    {
      icon: Lock,
      titleKey: 'trust.private',
      descKey: 'trust.privateDesc',
    },
    {
      icon: CheckCircle2,
      titleKey: 'trust.noHiddenFees',
      descKey: 'trust.noHiddenFeesDesc',
    },
    {
      icon: Video,
      titleKey: 'trust.anywhereAccess',
      descKey: 'trust.anywhereAccessDesc',
    }
  ];

  return (
    <section id="trust" className="py-16 md:py-20 bg-white relative overflow-hidden scroll-mt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0F2E2E 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      {/* Decorative Blurs */}
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-brand-50/60 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-brand-50/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left: Story */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-xs font-bold text-brand-600 uppercase tracking-wider mb-5">
              {t('trust.badge')}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-4 leading-[1.15]">
              {t('trust.title')} <br className="hidden sm:block"/>
              <span className="text-slate-400">{t('trust.titleAccent')}</span>
            </h2>
            <div className="space-y-3 text-base text-slate-600 leading-relaxed font-light">
              <p>{t('trust.desc1')}</p>
              <p>{t('trust.desc2')}</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Feature Cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className={`p-5 rounded-2xl border border-slate-100 bg-white hover:border-brand-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 group cursor-pointer ${i % 2 === 1 ? 'sm:translate-y-4' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-brand-50 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">{t(item.titleKey)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
