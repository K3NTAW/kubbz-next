"use client";

import { motion } from "framer-motion";
import { Ruler, Crown, ArrowDown, Target } from "lucide-react";

const features = [
  {
    icon: <Ruler className="w-6 h-6 text-primary" />, 
    text: "Das Spielfeld misst 5x8 Meter."
  },
  {
    icon: <Crown className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />, 
    text: "In der Mitte steht der König – das Ziel am Ende des Spiels."
  },
  {
    icon: <ArrowDown className="w-6 h-6 text-blue-500 dark:text-blue-400" />, 
    text: "Die Wurfhölzer müssen von unten nach vorne geworfen werden."
  },
  {
    icon: <Target className="w-6 h-6 text-green-600 dark:text-green-400" />, 
    text: "Wer zuerst alle Kubbs und danach den König trifft, gewinnt."
  },
];

export default function AboutKubbSection() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        viewport={{ once: true }}
        className="text-4xl font-bold mb-6 text-center"
      >
        Was ist KUBB?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-center"
      >
        Kubb, auch bekannt als Wikingerschach, ist ein faszinierendes Outdoor-Spiel, das oft im Garten oder im Park gespielt wird.
        Zwei Teams treten gegeneinander an, um Wurfhölzer zu werfen und die Kubbs des Gegners umzuwerfen.
      </motion.p>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-4 p-5 border border-border rounded-xl bg-card shadow-sm transition-transform duration-200"
          >
            <span>{feature.icon}</span>
            <p className="text-base text-foreground">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 