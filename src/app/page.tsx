import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Ruler, Target, ArrowDown, Download } from "lucide-react";
import { AboutKubbSection } from "@/app/AboutKubbSection";
import { HistorySection } from "@/app/HistorySection";
import { TournamentsSection } from "@/app/TournamentsSection";

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="lg:py-32 overflow-hidden w-full border-zinc-200/60 dark:border-zinc-800/60 border-b pt-8 pb-24 relative">
        <div className="absolute inset-0 hero-pattern -z-10 opacity-60 dark:opacity-20"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-blue/10 dark:from-brand-blue/20 to-transparent blur-3xl -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Season Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
            </span>
            Saison 2026 ist eröffnet
          </div>
          
          {/* Main Headline */}
          <h1 className="font-display font-medium text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 max-w-4xl leading-[1.1]">
            Das Zuhause für <br />
            <span className="text-zinc-400 dark:text-zinc-500">Kubb in Zürich.</span>
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed font-light">
            Willkommen bei der aktivsten Kubb-Community der Stadt. Organisiere Teams, melde dich für Turniere an und werde Teil der Geschichte.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/tournaments"
              className="w-full sm:w-auto bg-brand-blue text-white px-8 py-3 rounded-full font-medium hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-blue/20 group"
            >
              Turniere entdecken
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-8 py-3 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* About Kubb Section */}
      <AboutKubbSection />

      {/* History Section */}
      <HistorySection />

      {/* Tournaments Section */}
      <TournamentsSection />
    </div>
  );
}
