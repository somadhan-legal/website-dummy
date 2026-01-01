import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WaitlistPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistPage: React.FC<WaitlistPageProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    services: [] as string[],
    urgency: '',
    feedback: '',
  });

  const totalSteps = 5;

  const professionOptions = [
    { id: 'individual', label: language === 'bn' ? 'ব্যক্তিগত' : 'Individual', icon: '👤' },
    { id: 'business', label: language === 'bn' ? 'ব্যবসায়ী' : 'Business Owner', icon: '💼' },
    { id: 'startup', label: language === 'bn' ? 'স্টার্টআপ' : 'Startup Founder', icon: '🚀' },
    { id: 'corporate', label: language === 'bn' ? 'কর্পোরেট' : 'Corporate Professional', icon: '🏢' },
    { id: 'student', label: language === 'bn' ? 'শিক্ষার্থী' : 'Student', icon: '🎓' },
    { id: 'other', label: language === 'bn' ? 'অন্যান্য' : 'Other', icon: '✨' },
  ];

  const serviceOptions = [
    { id: 'family', label: language === 'bn' ? 'পারিবারিক আইন' : 'Family Law' },
    { id: 'property', label: language === 'bn' ? 'সম্পত্তি/জমি' : 'Property/Land' },
    { id: 'business', label: language === 'bn' ? 'ব্যবসা/কর্পোরেট' : 'Business/Corporate' },
    { id: 'criminal', label: language === 'bn' ? 'ফৌজদারি' : 'Criminal' },
    { id: 'civil', label: language === 'bn' ? 'দেওয়ানি' : 'Civil Litigation' },
    { id: 'documentation', label: language === 'bn' ? 'ডকুমেন্টেশন' : 'Documentation' },
    { id: 'consultation', label: language === 'bn' ? 'পরামর্শ' : 'Consultation Only' },
    { id: 'other', label: language === 'bn' ? 'অন্যান্য' : 'Other' },
  ];

  const urgencyOptions = [
    { id: 'immediate', label: language === 'bn' ? 'এখনই দরকার' : 'I need help now', icon: '🔴' },
    { id: 'soon', label: language === 'bn' ? 'শীঘ্রই দরকার' : 'Within a week', icon: '🟡' },
    { id: 'exploring', label: language === 'bn' ? 'দেখছি মাত্র' : 'Just exploring', icon: '🟢' },
    { id: 'future', label: language === 'bn' ? 'ভবিষ্যতে দরকার হতে পারে' : 'Might need later', icon: '⏳' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setErrors({});
        setFormData({ fullName: '', email: '', phone: '', profession: '', services: [], urgency: '', feedback: '' });
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true;
    const re = /^(\+?880|0)?1[3-9]\d{8}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = language === 'bn' ? 'নাম দিন' : 'Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = language === 'bn' ? 'ইমেইল দিন' : 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = language === 'bn' ? 'সঠিক ইমেইল দিন' : 'Enter a valid email';
      }
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = language === 'bn' ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number';
      }
    }
    
    if (step === 2 && !formData.profession) {
      newErrors.profession = language === 'bn' ? 'পেশা নির্বাচন করুন' : 'Select your profession';
    }
    
    if (step === 3 && formData.services.length === 0) {
      newErrors.services = language === 'bn' ? 'অন্তত একটি সেবা নির্বাচন করুন' : 'Select at least one service';
    }
    
    if (step === 4 && !formData.urgency) {
      newErrors.urgency = language === 'bn' ? 'জরুরিতা নির্বাচন করুন' : 'Select urgency level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id) 
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id]
    }));
    setErrors(prev => ({ ...prev, services: '' }));
  };

  const stepContent = [
    { 
      title: language === 'bn' ? "চলুন পরিচিত হই" : "Let's get to know you",
      subtitle: language === 'bn' ? "আপনার তথ্য দিন" : "We'll use this to keep you updated"
    },
    { 
      title: language === 'bn' ? "আপনি কে?" : "What describes you best?",
      subtitle: language === 'bn' ? "আপনার পেশা নির্বাচন করুন" : "Select your profession"
    },
    { 
      title: language === 'bn' ? "কোন সেবায় আগ্রহী?" : "What services interest you?",
      subtitle: language === 'bn' ? "প্রযোজ্য সব নির্বাচন করুন" : "Select all that apply"
    },
    { 
      title: language === 'bn' ? "কতটা জরুরি?" : "How urgent is your need?",
      subtitle: language === 'bn' ? "এটি আমাদের প্রস্তুত হতে সাহায্য করে" : "This helps us prioritize"
    },
    { 
      title: language === 'bn' ? "আর কিছু?" : "Anything else?",
      subtitle: language === 'bn' ? "ঐচ্ছিক - আপনার মতামত দিন" : "Optional - share your thoughts"
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          {/* Background */}
          <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-100 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-50 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-20">
            <div className="w-full max-w-md">
              {!isSuccess ? (
                <>
                  {/* Logo */}
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                    <img src="/Logo.svg" alt="Somadhan" className="h-7 mx-auto mb-4" />
                  </motion.div>

                  {/* Progress */}
                  <div className="flex items-center justify-center gap-1.5 mb-6">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i < step ? 'w-6 bg-brand-600' : i === step - 1 ? 'w-6 bg-brand-600' : 'w-1.5 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step Header */}
                  <motion.div key={`header-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-serif text-slate-900 mb-1">{stepContent[step - 1].title}</h2>
                    <p className="text-sm text-slate-500">{stepContent[step - 1].subtitle}</p>
                  </motion.div>

                  {/* Steps */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">{language === 'bn' ? 'আপনার নাম' : 'Your name'} *</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => { setFormData(prev => ({ ...prev, fullName: e.target.value })); setErrors(prev => ({ ...prev, fullName: '' })); }}
                                placeholder={language === 'bn' ? 'আপনার নাম' : 'Full name'}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'} focus:ring-2 outline-none transition-all text-slate-800 placeholder:text-slate-400`}
                              />
                            </div>
                            {errors.fullName && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">{language === 'bn' ? 'ইমেইল' : 'Email'} *</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => { setFormData(prev => ({ ...prev, email: e.target.value })); setErrors(prev => ({ ...prev, email: '' })); }}
                                placeholder="you@example.com"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'} focus:ring-2 outline-none transition-all text-slate-800 placeholder:text-slate-400`}
                              />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">{language === 'bn' ? 'ফোন (ঐচ্ছিক)' : 'Phone (optional)'}</label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => { setFormData(prev => ({ ...prev, phone: e.target.value })); setErrors(prev => ({ ...prev, phone: '' })); }}
                                placeholder="+880 1XXX-XXXXXX"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'} focus:ring-2 outline-none transition-all text-slate-800 placeholder:text-slate-400`}
                              />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-2.5">
                          {professionOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => { setFormData(prev => ({ ...prev, profession: option.id })); setErrors(prev => ({ ...prev, profession: '' })); }}
                              className={`w-full p-4 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3 ${
                                formData.profession === option.id
                                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-xl">{option.icon}</span>
                              <span className="font-medium">{option.label}</span>
                            </button>
                          ))}
                          {errors.profession && <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.profession}</p>}
                        </div>
                      )}

                      {step === 3 && (
                        <div>
                          <div className="grid grid-cols-2 gap-2.5">
                            {serviceOptions.map((service) => (
                              <button
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`p-3.5 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                  formData.services.includes(service.id)
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <span className="font-medium text-sm">{service.label}</span>
                              </button>
                            ))}
                          </div>
                          {errors.services && <p className="mt-3 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.services}</p>}
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-2.5">
                          {urgencyOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => { setFormData(prev => ({ ...prev, urgency: option.id })); setErrors(prev => ({ ...prev, urgency: '' })); }}
                              className={`w-full p-4 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3 ${
                                formData.urgency === option.id
                                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span className="font-medium">{option.label}</span>
                            </button>
                          ))}
                          {errors.urgency && <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.urgency}</p>}
                        </div>
                      )}

                      {step === 5 && (
                        <div>
                          <textarea
                            value={formData.feedback}
                            onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                            placeholder={language === 'bn' 
                              ? 'আপনার কোনো মতামত বা প্রশ্ন থাকলে লিখুন...' 
                              : 'Any feedback, questions, or specific needs you want to share...'}
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none text-sm"
                          />
                          <p className="text-xs text-slate-400 mt-2 text-center">{language === 'bn' ? 'এই ধাপ ঐচ্ছিক' : 'This step is optional'}</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8">
                    {step > 1 ? (
                      <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-all hover:scale-105 active:scale-95">
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'bn' ? 'পেছনে' : 'Back'}
                      </button>
                    ) : <div />}

                    {step < totalSteps ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all text-sm hover:scale-105 active:scale-95"
                      >
                        {language === 'bn' ? 'পরবর্তী' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-semibold rounded-full transition-all text-sm hover:scale-105 active:scale-95"
                      >
                        {isSubmitting ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'জমা দিন' : 'Join Waitlist')}
                        {!isSubmitting && <Sparkles className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-600 text-white mb-6"
                  >
                    <Check className="w-8 h-8" strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">{language === 'bn' ? 'আপনি তালিকায় আছেন!' : "You're on the list!"}</h3>
                  <p className="text-slate-500 mb-8 text-sm">{language === 'bn' ? 'আমরা শীঘ্রই আপডেট নিয়ে যোগাযোগ করব।' : "We'll reach out soon with updates and early access."}</p>
                  <button onClick={onClose} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all text-sm hover:scale-105 active:scale-95">
                    {language === 'bn' ? 'ফিরে যান' : 'Back to Home'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistPage;
