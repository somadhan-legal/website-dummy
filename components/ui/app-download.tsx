import { useLanguage } from "@/contexts/LanguageContext";
import { Spotlight } from "@/components/ui/spotlight";
import { Play } from "lucide-react";
import { companyInfo } from "@/lib/companyInfo";
import { trackCTAClick } from "@/lib/analytics";

export default function AppDownload() {
  const { language } = useLanguage();

  return (
    <div
      className="relative left-1/2 isolate w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
      style={{
        backgroundColor: "#001719",
        backgroundImage:
          "linear-gradient(rgba(72, 151, 151, .12) 1px, transparent 1px), linear-gradient(90deg, rgba(72, 151, 151, .12) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <Spotlight size={520} className="from-brand-300/45 via-brand-200/25 to-transparent blur-3xl" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-6">
        <p className="max-w-xl font-open-sans text-xl font-semibold leading-snug text-white sm:text-2xl">
          {language === "bn" ? "কম ঝামেলা, আরও সহজ সমাধান। আজই অ্যাপ ডাউনলোড করুন।" : "Less hassle, more results. Get the app today."}
        </p>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto sm:gap-4">
          <a
            href={companyInfo.androidAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('download_android_app', 'process')}
            className="shiny-store-button flex min-h-[60px] w-fit items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-transform"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">{language === "bn" ? "ডাউনলোড করুন" : "Get it on"}</span>
                <span className="block text-base font-semibold text-slate-900">Google Play</span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
