"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, MapPin, Users, ArrowRight, Check, Flame, Plus } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import useSWR from "swr";
import Image from "next/image";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";
import { TournamentCardSkeleton } from "@/components/skeletons/TournamentCardSkeleton";

export default function TournamentsPage() {
  const { data: session } = useSession();
  const { data: tournaments, error, isLoading } = useSWR("/api/tournaments", arrayFetcher, swrConfig);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 mt-4 text-zinc-900 dark:text-zinc-50">Alle Turniere</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TournamentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 mt-4">Alle Turniere</h1>
        <p className="text-destructive">Fehler beim Laden der Turniere</p>
      </div>
    );
  }

  // Ensure tournaments is an array and has valid data before filtering
  const tournamentsArray = Array.isArray(tournaments) ? tournaments : [];
  const upcoming = tournamentsArray.filter(
    (t: any) => t && t.date && !isNaN(new Date(t.date).getTime()) && new Date(t.date) >= new Date()
  );
  const past = tournamentsArray.filter(
    (t: any) => t && t.date && !isNaN(new Date(t.date).getTime()) && new Date(t.date) < new Date()
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 mt-4">Alle Turniere</h1>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 dark:text-zinc-50">Kommende Turniere</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((tournament: any) => (
              <div key={tournament.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-zinc-900/40 transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  {tournament.imageUrl ? (
                    <Image src={tournament.imageUrl} alt={tournament.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"></div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-mono px-2 py-1 rounded border border-white/30">Team Turnier</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-xl font-medium text-zinc-900 dark:text-zinc-50">{tournament.name}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{tournament.description || "Jährliches Hauptevent"}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      tournament.status === "OPEN" 
                        ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900" 
                        : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900"
                    }`}>
                      {tournament.status === "OPEN" ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Flame className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span className="font-mono">{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <Users className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span>
                        {tournament.registrations?.length || 0} / {tournament.maxParticipants} Teilnehmer
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-medium">Preis</span>
                      <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(tournament.price)}</span>
                    </div>
                    <Link
                      href={`/tournament/${tournament.id}`}
                      className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                      Anmelden
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 dark:text-zinc-50">Vergangene Turniere</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {past.map((tournament: any) => (
              <div key={tournament.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden opacity-75 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-zinc-900/40 transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  {tournament.imageUrl ? (
                    <Image src={tournament.imageUrl} alt={tournament.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"></div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-mono px-2 py-1 rounded border border-white/30">Abgeschlossen</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-xl font-medium text-zinc-900 dark:text-zinc-50">{tournament.name}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{tournament.description || "Jährliches Hauptevent"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span className="font-mono">{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tournaments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Derzeit sind keine Turniere verfügbar.</p>
        </div>
      )}
    </div>
  );
}
