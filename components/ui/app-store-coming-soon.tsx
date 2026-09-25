import { useLanguage } from "@/contexts/LanguageContext";
import { Spotlight } from "@/components/ui/spotlight";

export default function AppStoreComingSoon({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const { language } = useLanguage();
  const comingSoon = language === "bn" ? "শীঘ্রই আসছে" : "Coming soon";

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
          Less hassle, more results. Get the app today.
        </p>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto sm:gap-4">
          <StoreCard onClick={onOpenWaitlist} label={language === "bn" ? "অ্যাপ স্টোর" : "App Store"} comingSoon={comingSoon} kind="apple" />
          <StoreCard onClick={onOpenWaitlist} label={language === "bn" ? "গুগল প্লে" : "Google Play"} comingSoon={comingSoon} kind="play" />
        </div>
      </div>
    </div>
  );
}

function StoreCard({
  onClick,
  label,
  comingSoon,
  kind,
}: {
  onClick: () => void;
  label: string;
  comingSoon: string;
  kind: "apple" | "play";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shiny-store-button flex min-h-[60px] w-fit items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-transform"
    >
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-900">
          {kind === "apple" ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.67 3.55 1.76-3.13 1.77-2.62 5.92.35 7.14-.65 1.58-1.57 3.1-2.57 4.03zm-3.21-14.7c-.55 1.4-1.89 2.37-3.25 2.28.09-1.5 1.05-2.82 2.38-3.4 1.25-.57 2.66-.41 3.25.04-.15.35-.26.72-.38 1.08z" />
            </svg>
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M6 3.7c0-.9 1-1.45 1.77-.97l11.4 7.1a1.38 1.38 0 0 1 0 2.34l-11.4 7.1A1.15 1.15 0 0 1 6 18.3V3.7Z" />
              </svg>
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{comingSoon}</p>
          <p className="text-base font-semibold text-slate-900">{label}</p>
        </div>
      </div>
    </button>
  );
}
