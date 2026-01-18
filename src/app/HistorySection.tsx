import { History } from "lucide-react";

export function HistorySection() {
  return (
    <section className="py-24 bg-zinc-900 dark:bg-zinc-950 text-white relative overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 dark:bg-brand-red/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-block p-3 rounded-2xl bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-800 mb-8">
          <History className="w-6 h-6 text-brand-red dark:text-brand-red" />
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-8 text-brand-red dark:text-brand-red">Unsere Geschichte</h2>
        <div className="space-y-6 text-lg md:text-xl font-light text-zinc-200 dark:text-zinc-100 leading-relaxed">
          <p>
            Seit <span className="text-white dark:text-white font-medium">2013</span> treffen wir uns unregelmässig, um KUBB zu spielen und unsere Freundschaften zu pflegen.
          </p>
          <p>
            <span className="text-white dark:text-white font-medium">2017</span> entstand unser erstes Turnier, das seither jährlich Ende Juni stattfindet und Spieler aus der ganzen Region Zürich zusammenbringt.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brand-red/60 dark:via-brand-red/80 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
