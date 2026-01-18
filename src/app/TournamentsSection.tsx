"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight, Check, Flame, Plus, List, Grid } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import useSWR from "swr";
import Image from "next/image";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";
import { TournamentCardSkeleton } from "@/components/skeletons/TournamentCardSkeleton";

export function TournamentsSection() {
  const { data: session } = useSession();
  const { data: tournaments, error, isLoading } = useSWR("/api/tournaments", arrayFetcher, swrConfig);
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards");

  if (isLoading) {
    return (
      <section id="tournaments" className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Aktuelle Turniere</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">Melde dich und dein Team für die kommende Saison an.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tournaments" className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-destructive">Fehler beim Laden der Turniere</p>
        </div>
      </section>
    );
  }

  // Ensure tournaments is an array and has valid data before filtering
  const tournamentsArray = Array.isArray(tournaments) ? tournaments : [];
  const upcomingTournaments = tournamentsArray.filter(
    (t: any) => t && t.date && !isNaN(new Date(t.date).getTime()) && new Date(t.date) >= new Date()
  );

  return (
    <section id="tournaments" className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Aktuelle Turniere</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Melde dich und dein Team für die kommende Saison an.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-brand-blue border-brand-blue text-white shadow-md"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <List className="w-4 h-4" />
              Listenansicht
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === "cards"
                  ? "bg-brand-blue border-brand-blue text-white shadow-md"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Grid className="w-4 h-4" />
              Karten
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingTournaments.slice(0, 2).map((tournament: any) => (
              <div key={tournament.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-zinc-900/40 transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  {tournament.imageUrl ? (
                    <Image src={tournament.imageUrl} alt={tournament.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"></div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30">
                      {tournament.type === "TEAM" ? "Team Turnier" : "Einzelturnier"}
                    </Badge>
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
                      className="bg-brand-blue text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                    >
                      Anmelden
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Call to Action Card - Only show when not logged in */}
            {!session && (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl flex flex-col justify-center items-center text-center p-8 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-white/10">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-white mb-3">Mach mit!</h3>
                  <p className="text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
                    Erstelle einen Account, um deine Turnier-Historie zu speichern und dich schneller anzumelden.
                  </p>
                  <Link
                    href="/register"
                    className="w-full bg-white text-zinc-900 text-sm font-medium px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors block"
                  >
                    Kostenlos registrieren
                  </Link>
                  <p className="mt-4 text-xs text-zinc-500">Bereits dabei? <Link href="/login" className="text-white hover:underline">Log in</Link></p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingTournaments.map((tournament: any) => (
              <div
                key={tournament.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex-shrink-0">
                    {tournament.imageUrl ? (
                      <Image
                        src={tournament.imageUrl}
                        alt={tournament.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"></div>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-xl font-medium text-zinc-900 dark:text-zinc-50">{tournament.name}</h3>
                          <Badge className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                            {tournament.type === "TEAM" ? "Team" : "Solo"}
                          </Badge>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                            tournament.status === "OPEN"
                              ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900"
                              : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900"
                          }`}>
                            {tournament.status === "OPEN" ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Flame className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        {tournament.description && (
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">{tournament.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <span className="font-mono">{formatDate(tournament.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <span>{tournament.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Users className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <span>
                          {tournament.registrations?.length || 0} / {tournament.maxParticipants}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-wider font-medium block">Preis</span>
                        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(tournament.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/tournament/${tournament.id}`}
                        className="bg-brand-blue text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                      >
                        Anmelden
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
