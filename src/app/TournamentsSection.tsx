"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tournaments = [
  {
    title: "KUBB ZÜRI Open",
    desc: "Unser Teamturnier auf dem Dolder findet jedes Jahr im Mai statt. Sei mit deinem Team dabei!"
  },
  {
    title: "Single Turnier",
    desc: "Das Einzelturnier auf der Josefwiese in Zürich findet jeweils Ende Juni statt – für alle, die solo spielen wollen."
  }
];

export default function TournamentsSection() {
  return (
    <section className="py-20 px-6 bg-zinc-100 dark:bg-zinc-900">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-semibold mb-10 text-center"
      >
        Turniere
      </motion.h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {tournaments.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{t.title}</h3>
                <p className="text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold mb-2"
        >
          Mach mit!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-muted-foreground mb-4"
        >
          Egal ob Anfänger oder Profi – KUBB ist für alle da.
        </motion.p>
        <Button size="lg" className="bg-black text-white hover:bg-zinc-700 transition-colors duration-200">
          Zur Anmeldung
        </Button>
      </div>
    </section>
  );
} 