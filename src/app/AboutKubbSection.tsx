import Link from "next/link";
import { Ruler, Crown, ArrowDown, Target, Download } from "lucide-react";

export function AboutKubbSection() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-4 dark:text-zinc-50">Was ist Kubb?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kubb, auch bekannt als Wikingerschach, ist ein faszinierendes Outdoor-Spiel, das oft im Garten oder im Park gespielt wird. Zwei Teams treten gegeneinander an, um Wurfhölzer zu werfen und die Kubbs des Gegners umzuwerfen.
            </p>
          </div>
          <Link href="#" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-1 hover:border-zinc-900 dark:hover:border-zinc-500 transition-colors flex items-center gap-1 group">
            Regelwerk herunterladen
            <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300">
            <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Ruler className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2 dark:text-zinc-50">Das Spielfeld</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Das Spielfeld misst 5x8 Meter. Präzision ist auf dieser Distanz der Schlüssel zum Erfolg.</p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300">
            <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2 dark:text-zinc-50">Der König</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">In der Mitte steht der König – das ultimative Ziel. Wer ihn zu früh trifft, verliert sofort.</p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300">
            <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ArrowDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2 dark:text-zinc-50">Wurftechnik</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Die Wurfhölzer müssen zwingend von unten nach vorne geworfen werden. Helikopterwürfe sind verboten.</p>
          </div>

          {/* Feature 4 */}
          <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300">
            <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2 dark:text-zinc-50">Das Ziel</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Wer zuerst alle Kubbs des Gegners fällt und danach den König trifft, gewinnt das Spiel.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
