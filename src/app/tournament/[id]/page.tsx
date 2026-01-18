"use client";

import { use, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft, Trophy, DollarSign } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import useSWR from "swr";
import Image from "next/image";
import { fetcher, swrConfig } from "@/lib/swr-config";
import { Skeleton } from "@/components/ui/skeleton";

function TournamentContent({ id }: { id: string }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { data: tournament, error, isLoading } = useSWR(
    id ? `/api/tournaments/${id}` : null,
    fetcher,
    swrConfig
  );

  // Show success message if payment was successful
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      // You could show a toast notification here
      console.log("Payment successful!");
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <Skeleton className="h-64 md:h-80 w-full" />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tournament || !tournament.id) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 max-w-md">
          <CardContent className="pt-6">
            <p className="text-zinc-900 dark:text-zinc-50 mb-4">Turnier nicht gefunden</p>
            <Button asChild className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
              <Link href="/tournaments">Zurück zu Turnieren</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRegistered = tournament.registrations?.some(
    (r: any) => r.userId === session?.user?.id
  );
  const isFull = tournament.registrations?.length >= tournament.maxParticipants;
  const canRegister = session && !isRegistered && !isFull && tournament.status === "OPEN";
  const registrationsCount = tournament.registrations?.length || 0;
  const spotsLeft = tournament.maxParticipants - registrationsCount;
  const spotsPercentage = (registrationsCount / tournament.maxParticipants) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Banner */}
      {tournament.imageUrl ? (
        <div className="relative h-80 md:h-96 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent z-10" />
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="container mx-auto px-4 pb-8 w-full">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10 backdrop-blur-sm">
                  <Link href="/tournaments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück
                  </Link>
                </Button>
                <Badge 
                  variant={tournament.status === "OPEN" ? "default" : "secondary"}
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  {tournament.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tournament.name}</h1>
              {tournament.description && (
                <p className="text-zinc-200 max-w-3xl">{tournament.description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-amber-600 dark:via-amber-700 dark:to-amber-800">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent z-10" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Trophy className="h-32 w-32 text-white/20" />
          </div>
          <div className="absolute inset-0 z-30 flex items-end">
            <div className="container mx-auto px-4 pb-8 w-full">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10 backdrop-blur-sm">
                  <Link href="/tournaments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück
                  </Link>
                </Button>
                <Badge 
                  variant={tournament.status === "OPEN" ? "default" : "secondary"}
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  {tournament.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tournament.name}</h1>
              {tournament.description && (
                <p className="text-zinc-100 max-w-3xl">{tournament.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Details Card */}
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-50">Turnier-Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-amber-100 dark:bg-zinc-900 rounded-xl group-hover:bg-amber-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Datum</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{formatDate(tournament.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-blue-100 dark:bg-zinc-900 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Ort</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{tournament.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-green-100 dark:bg-zinc-900 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Teilnehmer</p>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                          {registrationsCount} / {tournament.maxParticipants}
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              spotsPercentage >= 90
                                ? "bg-red-500"
                                : spotsPercentage >= 70
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(spotsPercentage, 100)}%` }}
                          />
                        </div>
                        {!isFull && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium text-green-600 dark:text-green-400">{spotsLeft} Plätze</span> noch verfügbar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-purple-100 dark:bg-zinc-900 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Preis</p>
                      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(tournament.price)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registered Participants Card */}
            {tournament.registrations && tournament.registrations.length > 0 && (
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-50">Registrierte Teilnehmer</CardTitle>
                      <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
                        {tournament.registrations.length} von {tournament.maxParticipants} Plätzen belegt
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tournament.registrations.map((registration: any) => (
                      <div
                        key={registration.id}
                        className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                            {registration.user.name || registration.user.email}
                          </p>
                          {registration.teamName && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Team: {registration.teamName}</p>
                          )}
                        </div>
                        <Badge 
                          variant={registration.status === "CONFIRMED" ? "default" : "secondary"} 
                          className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        >
                          {registration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg sticky top-4">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-zinc-900 dark:text-zinc-50">Anmeldung</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!session ? (
                  <>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Sie müssen sich anmelden, um sich für dieses Turnier anzumelden.
                    </p>
                    <Button asChild className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 h-12 text-base font-semibold">
                      <Link href="/login">Anmelden</Link>
                    </Button>
                  </>
                ) : isRegistered ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <p className="text-sm font-medium text-green-900 dark:text-green-200 mb-1">
                        ✓ Bereits registriert
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Sie sind für dieses Turnier angemeldet.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-700 h-12" disabled>
                      Bereits registriert
                    </Button>
                  </div>
                ) : isFull ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                        Turnier voll
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        Dieses Turnier ist bereits vollständig ausgebucht.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-700 h-12" disabled>
                      Ausgebucht
                    </Button>
                  </div>
                ) : tournament.status !== "OPEN" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                        Anmeldung geschlossen
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Die Anmeldung für dieses Turnier ist noch nicht geöffnet.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-700 h-12" disabled>
                      Anmeldung geschlossen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Preis</span>
                        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(tournament.price)}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {spotsLeft} {spotsLeft === 1 ? "Platz" : "Plätze"} verfügbar
                      </p>
                    </div>
                    <Button asChild className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-50 dark:to-zinc-100 text-white dark:text-zinc-900 hover:from-zinc-800 hover:to-zinc-700 dark:hover:from-zinc-100 dark:hover:to-zinc-200 h-12 text-base font-semibold shadow-lg">
                      <Link href={`/tournament/${tournament.id}/register`}>
                        Jetzt anmelden
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <Skeleton className="h-64 md:h-80 w-full" />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <TournamentContent id={id} />
    </Suspense>
  );
}
