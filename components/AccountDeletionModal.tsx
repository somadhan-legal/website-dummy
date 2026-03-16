import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_URL = 'https://jlltjzwukpsuykfdixlx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbHRqend1a3BzdXlrZmRpeGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTMwNDIsImV4cCI6MjA4MzE4OTA0Mn0.-HEQ8V4qElOtP4VzuAOS24Oqc9P7wZUvmE7lUoO7HYo';

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const bn = language === 'bn';

  const [form, setForm] = useState({ fullName: '', nidNumber: '', phone: '', reason: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form when closed
      setTimeout(() => {
        setForm({ fullName: '', nidNumber: '', phone: '', reason: '' });
        setErrors({});
        setIsSuccess(false);
        setSubmitError(null);
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = bn ? 'নাম আবশ্যক' : 'Name is required';
    }
    if (!form.nidNumber.trim()) {
      newErrors.nidNumber = bn ? 'NID নম্বর আবশ্যক' : 'NID number is required';
    } else if (!/^\d{10,17}$/.test(form.nidNumber.trim())) {
      newErrors.nidNumber = bn ? 'সঠিক NID নম্বর দিন (১০-১৭ সংখ্যা)' : 'Enter a valid NID number (10-17 digits)';
    }
    if (!form.phone.trim()) {
      newErrors.phone = bn ? 'ফোন নম্বর আবশ্যক' : 'Phone number is required';
    } else if (!/^(\+?880)?0?1[3-9]\d{8}$/.test(form.phone.trim().replace(/[\s-]/g, ''))) {
      newErrors.phone = bn ? 'সঠিক বাংলাদেশি ফোন নম্বর দিন' : 'Enter a valid Bangladeshi phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/account_deletion_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          nid_number: form.nidNumber.trim(),
          phone: form.phone.trim(),
          reason: form.reason.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('submission_failed');
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(bn ? 'জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className={`font-serif text-2xl text-slate-900 mb-3 ${bn ? 'leading-[1.4]' : ''}`}>
                    {bn ? 'অনুরোধ সফলভাবে জমা হয়েছে' : 'Request Submitted Successfully'}
                  </h3>
                  <p className="text-slate-500 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                    {bn
                      ? 'আপনার অ্যাকাউন্ট মুছে ফেলার অনুরোধ গৃহীত হয়েছে। আমরা আপনার পরিচয় যাচাইয়ের পর ৭ কার্যদিবসের মধ্যে প্রক্রিয়া সম্পন্ন করব।'
                      : 'Your account deletion request has been received. We will complete the process within 7 business days after verifying your identity.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                  >
                    {bn ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className={`font-serif text-2xl text-slate-900 mb-2 ${bn ? 'leading-[1.4]' : ''}`}>
                      {bn ? 'অ্যাকাউন্ট মুছে ফেলার অনুরোধ' : 'Account Deletion Request'}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {bn
                        ? 'আপনার অ্যাকাউন্ট মুছে ফেলতে নিচের ফর্মটি পূরণ করুন। আমরা ৭ কার্যদিবসের মধ্যে আপনার অনুরোধ প্রক্রিয়া করব।'
                        : 'Fill out the form below to request account deletion. We will process your request within 7 business days.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {bn ? 'পুরো নাম' : 'Full Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => { setForm(f => ({ ...f, fullName: e.target.value })); setErrors(e2 => ({ ...e2, fullName: '' })); }}
                        placeholder={bn ? 'সরকারি পরিচয়পত্র অনুযায়ী আপনার নাম' : 'Your name as per government ID'}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
                      />
                      {errors.fullName && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* NID Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {bn ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'National ID (NID) Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nidNumber}
                        onChange={(e) => { setForm(f => ({ ...f, nidNumber: e.target.value })); setErrors(e2 => ({ ...e2, nidNumber: '' })); }}
                        placeholder={bn ? 'আপনার ১০ বা ১৭ সংখ্যার NID নম্বর' : 'Your 10 or 17 digit NID number'}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.nidNumber ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
                      />
                      {errors.nidNumber && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.nidNumber}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {bn ? 'ফোন নম্বর' : 'Phone Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(e2 => ({ ...e2, phone: '' })); }}
                        placeholder={bn ? '+৮৮০ ১XXX-XXXXXX' : '+880 1XXX-XXXXXX'}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
                      />
                      {errors.phone && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Reason (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {bn ? 'কারণ (ঐচ্ছিক)' : 'Reason (Optional)'}
                      </label>
                      <textarea
                        value={form.reason}
                        onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
                        placeholder={bn ? 'অ্যাকাউন্ট মুছে ফেলার কারণ (ঐচ্ছিক)' : 'Reason for account deletion (optional)'}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-red-600 text-sm">{submitError}</p>
                      </div>
                    )}

                    {/* Notice */}
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mt-2">
                      <p className="text-red-800 text-xs font-medium">
                        {bn ? 'সতর্কতা: মুছে ফেলা সম্পন্ন হলে তা পূর্বাবস্থায় ফেরানো সম্ভব নয়।' : 'Warning: Deletion is irreversible once completed.'}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-600/20 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {bn ? 'জমা হচ্ছে...' : 'Submitting...'}
                        </>
                      ) : (
                        bn ? 'অনুরোধ জমা দিন' : 'Submit Request'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountDeletionModal;
