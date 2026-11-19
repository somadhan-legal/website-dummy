import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { companyInfo } from '../lib/companyInfo';

// Deep link scheme the mobile app registers. Change this if the app uses a different one.
const APP_SCHEME = 'somadhan';
const ANDROID_PACKAGE = 'legal.somadhan.app';

// Build the link that opens the app on this payment result.
// Android: intent link opens the app, or the Play Store if it is not installed.
// Other devices: plain deep link.
function getOpenAppUrl(searchParams: URLSearchParams, purchaseId: string): string {
  // Send every query we got, plus purchaseId for the app.
  const params = new URLSearchParams(searchParams);
  if (purchaseId) params.set('purchaseId', purchaseId);
  const queryString = params.toString();
  const path = `payment/result${queryString ? `?${queryString}` : ''}`;
  const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  if (isAndroid) {
    const fallback = encodeURIComponent(companyInfo.androidAppUrl);
    return `intent://${path}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
  }
  return `${APP_SCHEME}://${path}`;
}

type StatusView = {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: { en: string; bn: string };
  message: { en: string; bn: string };
};

const statusViews: Record<string, StatusView> = {
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: { en: 'Payment Successful', bn: 'পেমেন্ট সফল হয়েছে' },
    message: { en: 'Your payment was completed. You can return to the Somadhan app.', bn: 'আপনার পেমেন্ট সম্পন্ন হয়েছে। আপনি সমাধান অ্যাপে ফিরে যেতে পারেন।' },
  },
  cancelled: {
    icon: Ban,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    title: { en: 'Payment Cancelled', bn: 'পেমেন্ট বাতিল হয়েছে' },
    message: { en: 'You cancelled the payment. No money was charged.', bn: 'আপনি পেমেন্ট বাতিল করেছেন। কোনো টাকা কাটা হয়নি।' },
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    title: { en: 'Payment Failed', bn: 'পেমেন্ট ব্যর্থ হয়েছে' },
    message: { en: 'Your payment could not be completed. Please try again from the app.', bn: 'আপনার পেমেন্ট সম্পন্ন হয়নি। অনুগ্রহ করে অ্যাপ থেকে আবার চেষ্টা করুন।' },
  },
  initiated: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: { en: 'Payment Processing', bn: 'পেমেন্ট প্রক্রিয়াধীন' },
    message: { en: 'Your payment is not confirmed yet. Please check the app in a moment.', bn: 'আপনার পেমেন্ট এখনও নিশ্চিত হয়নি। কিছুক্ষণ পর অ্যাপে দেখুন।' },
  },
  unknown: {
    icon: AlertTriangle,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    title: { en: 'Payment Status Unknown', bn: 'পেমেন্টের অবস্থা অজানা' },
    message: { en: 'We could not read the payment status. Please check the app.', bn: 'পেমেন্টের অবস্থা জানা যায়নি। অনুগ্রহ করে অ্যাপে দেখুন।' },
  },
};

// Map the many status words a gateway may send to one of our views.
function getStatusKey(status: string): string {
  const value = status.toLowerCase();
  if (['success', 'successful', 'completed', 'paid'].includes(value)) return 'success';
  if (['cancelled', 'canceled', 'cancel'].includes(value)) return 'cancelled';
  if (['failed', 'failure', 'fail', 'error', 'expired'].includes(value)) return 'failed';
  if (['initiated', 'pending', 'processing'].includes(value)) return 'initiated';
  return 'unknown';
}

function formatBookingType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const PaymentResultPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language === 'bn' ? 'bn' : 'en';
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('paymentId') || searchParams.get('purchaseId') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const bookingType = searchParams.get('bookingType') || '';
  const amount = searchParams.get('amount') || '';

  const view = statusViews[getStatusKey(paymentStatus)];
  const Icon = view.icon;

  useDocumentMeta({
    title: `${view.title.en} | Somadhan`,
    description: 'Somadhan payment result.',
    canonical: 'https://somadhan.com/payment/result',
  });

  const rows: { label: string; value: string }[] = [];
  if (amount) rows.push({ label: lang === 'bn' ? 'পরিমাণ' : 'Amount', value: `৳${amount}` });
  if (bookingType) rows.push({ label: lang === 'bn' ? 'বুকিং ধরন' : 'Booking Type', value: formatBookingType(bookingType) });
  if (paymentStatus) rows.push({ label: lang === 'bn' ? 'অবস্থা' : 'Status', value: paymentStatus });
  if (paymentId) rows.push({ label: lang === 'bn' ? 'পেমেন্ট আইডি' : 'Payment ID', value: paymentId });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${view.bg}`}>
          <Icon className={`h-9 w-9 ${view.color}`} />
        </div>
        <h1 className="text-2xl font-semibold">{view.title[lang]}</h1>
        <p className="mt-2 text-slate-600">{view.message[lang]}</p>

        {rows.length > 0 && (
          <dl className="mt-6 divide-y divide-slate-100 rounded-xl bg-slate-50 px-4 text-sm text-left">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-3">
                <dt className="text-slate-500 shrink-0">{row.label}</dt>
                <dd className="font-medium text-right break-all">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <a
          href={getOpenAppUrl(searchParams, paymentId)}
          className="mt-6 inline-block w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
        >
          {lang === 'bn' ? 'অ্যাপ খুলুন' : 'Open App'}
        </a>
      </div>
    </div>
  );
};

export default PaymentResultPage;
