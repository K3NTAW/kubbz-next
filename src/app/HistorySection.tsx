"use client";

import { motion } from "framer-motion";

export default function HistorySection() {
  return (
    <section className="py-20 px-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl w-full mx-auto rounded-xl bg-white dark:bg-zinc-900 shadow-lg p-10 flex flex-col items-center border border-zinc-100 dark:border-zinc-800"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-amber-900 dark:text-amber-300">Unsere Geschichte</h2>
        <p className="text-lg text-zinc-700 dark:text-zinc-200 text-center">
          Seit 2013 treffen wir uns unregelmässig, um KUBB zu spielen und unsere Freundschaften zu pflegen. 2017 entstand unser erstes Turnier, das seither jährlich Ende Juni stattfindet.
        </p>
      </motion.div>
    </section>
  );
} 