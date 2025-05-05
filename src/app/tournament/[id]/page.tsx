"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

// Same mock data as TournamentsListSection
const tournaments = [
  {
    id: "1",
    name: "KUBB ZÜRI Open",
    description: "Das grosse Teamturnier auf dem Dolder.",
    date: "2024-05-18",
  },
  {
    id: "2",
    name: "Single Turnier",
    description: "Das Einzelturnier auf der Josefwiese.",
    date: "2024-06-29",
  },
  {
    id: "3",
    name: "Herbst Kubb Cup",
    description: "Ein freundschaftliches Turnier im Herbst.",
    date: "2024-09-15",
  },
  {
    id: "4",
    name: "Winter Kubb Gaudi",
    description: "Kubb im Schnee!",
    date: "2024-12-10",
  },
];

export default function TournamentDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-xl font-semibold mb-4">Turnier nicht gefunden</div>
        <Button asChild variant="outline">
          <Link href="/tournament">Zurück zu den Turnieren</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl mb-2">{tournament.name}</CardTitle>
            <div className="text-muted-foreground text-sm">
              {format(parseISO(tournament.date), "dd.MM.yyyy")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-lg text-zinc-700 dark:text-zinc-200">
              {tournament.description}
            </div>
            {/* Registration form (mocked) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Registrierung abgeschickt! (Mock)");
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Dein Name"
                required
                className="input input-bordered px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
              <Button type="submit" size="lg" className="w-full">
                Jetzt registrieren
              </Button>
            </form>
            <Button asChild variant="ghost" className="mt-6 w-full">
              <Link href="/tournament">← Zurück zu den Turnieren</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 