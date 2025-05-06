"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export type TournamentListType = {
  id: string;
  title: string;
  name: string;
  description?: string;
  googleMapsUrl?: string;
  price?: string;
  maxPeople: string;
  registeredPeople: string;
  date: string;
};

interface TournamentsListSectionProps {
  tournaments: TournamentListType[];
}

const seasons = [
  { label: "Alle", value: "all" },
  { label: "Frühling", value: "spring" },
  { label: "Sommer", value: "summer" },
  { label: "Herbst", value: "autumn" },
  { label: "Winter", value: "winter" },
];

function getSeason(dateStr: string) {
  const date = parseISO(dateStr);
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}

export default function TournamentsListSection({ tournaments }: TournamentsListSectionProps) {
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesSeason = season === "all" || getSeason(t.date) === season;
      const matchesDate =
        (!dateRange.start && !dateRange.end) ||
        (dateRange.start && dateRange.end
          ? isWithinInterval(parseISO(t.date), {
              start: parseISO(dateRange.start),
              end: parseISO(dateRange.end),
            })
          : true);
      return matchesSearch && matchesSeason && matchesDate;
    });
  }, [search, season, dateRange, tournaments]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="flex-1 flex flex-col gap-2">
          <label htmlFor="search" className="font-medium text-sm text-muted-foreground">Suche</label>
          <Input
            id="search"
            placeholder="Turniername oder Beschreibung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          {seasons.map((s) => (
            <Button
              key={s.value}
              variant={season === s.value ? "default" : "outline"}
              onClick={() => setSeason(s.value)}
              className="text-sm"
            >
              {s.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4" />Zeitraum</label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((r) => ({ ...r, start: e.target.value }))}
              className="w-32"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((r) => ({ ...r, end: e.target.value }))}
              className="w-32"
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-16"
          >
            Keine Turniere gefunden.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((t) => {
              const registered = parseInt(t.registeredPeople, 10) || 0;
              const max = parseInt(t.maxPeople, 10) || 0;
              const isFull = max > 0 && registered >= max;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-full">
                    <Card className={isFull ? "opacity-60 grayscale pointer-events-none h-full" : "h-full"}>
                      <CardHeader>
                        <CardTitle>{t.title || t.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-sm text-muted-foreground">
                          {format(parseISO(t.date), "dd.MM.yyyy")}
                        </div>
                        <div className="mb-2 text-sm">
                          <span className="font-medium">Ort:</span> {t.name}
                        </div>
                        <div className="mb-4 min-h-[32px] text-muted-foreground">{t.description}</div>
                        <div className="flex items-center justify-between mt-4">
                          <Button asChild variant="outline" size="sm" disabled={isFull}>
                            <Link href={`/tournament/${t.id}`}>Details</Link>
                          </Button>
                          <span className={
                            "ml-2 bg-zinc-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center" +
                            (isFull ? " bg-red-600" : " bg-zinc-900")
                          }>
                            {registered}/{max}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 