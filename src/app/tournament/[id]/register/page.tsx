"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import useSWR from "swr";
import Image from "next/image";
import { fetcher, swrConfig } from "@/lib/swr-config";
import { Skeleton } from "@/components/ui/skeleton";

const registrationSchema = z.object({
  teamName: z.string().optional(),
  notes: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function TournamentRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { data: tournament, isLoading } = useSWR(
    id ? `/api/tournaments/${id}` : null,
    fetcher,
    swrConfig
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  if (!session) {
    router.push(`/login?callbackUrl=/tournament/${id}/register`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <Skeleton className="h-64 md:h-80 w-full" />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament || !tournament.id) {
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

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Create Stripe checkout session
      const response = await fetch(`/api/tournaments/${id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Fehler bei der Erstellung der Zahlungssession");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Keine Checkout-URL erhalten");
      }
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
    }
  };

  const registrationsCount = tournament.registrations?.length || 0;
  const spotsLeft = tournament.maxParticipants - registrationsCount;
  const isFull = spotsLeft <= 0;
  const spotsPercentage = (registrationsCount / tournament.maxParticipants) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      {tournament.imageUrl && (
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent z-10" />
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10 backdrop-blur-sm">
                  <Link href={`/tournament/${id}`}>
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
                <p className="text-zinc-200 max-w-2xl">{tournament.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banner for tournaments without image */}
      {!tournament.imageUrl && (
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-amber-600 dark:via-amber-700 dark:to-amber-800">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-zinc-950/30 to-transparent z-10" />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10 backdrop-blur-sm">
        <Link href={`/tournament/${id}`}>
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
                <p className="text-zinc-100 max-w-2xl">{tournament.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tournament Info Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg sticky top-4 overflow-hidden">
              {!tournament.imageUrl && (
                <div className="h-48 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 flex items-center justify-center">
                  <Trophy className="h-20 w-20 text-white/80" />
                </div>
              )}
              <CardHeader className="pb-4">
                {!tournament.imageUrl && (
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-50">{tournament.name}</CardTitle>
                    <Badge 
                      variant={tournament.status === "OPEN" ? "default" : "secondary"}
                      className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                )}
                {tournament.description && !tournament.imageUrl && (
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">
                    {tournament.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Participants Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">Teilnehmer</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {registrationsCount} / {tournament.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
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

                <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-amber-100 dark:bg-zinc-900 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-0.5">Datum & Zeit</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatDate(tournament.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-blue-100 dark:bg-zinc-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-0.5">Ort</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{tournament.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-green-100 dark:bg-zinc-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-0.5">Preis</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(tournament.price)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-xl shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-zinc-900 dark:text-zinc-50">Anmeldung</CardTitle>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
                      Melden Sie sich jetzt für dieses Turnier an
          </CardDescription>
                  </div>
                </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  {isFull && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                            Turnier ist voll
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Dieses Turnier ist bereits vollständig ausgebucht. Sie können sich auf die Warteliste setzen lassen.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isFull && spotsLeft <= 5 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                          Nur noch {spotsLeft} {spotsLeft === 1 ? "Platz" : "Plätze"} verfügbar!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="teamName" className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Team-Name
                      <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
                    </Label>
              <Input
                id="teamName"
                      placeholder="z.B. Die Kubb-Könige"
                      className="h-12 bg-background text-zinc-900 dark:text-zinc-50 text-base border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-50"
                {...register("teamName")}
              />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Geben Sie einen Team-Namen ein, falls Sie als Team antreten
                    </p>
              {errors.teamName && (
                      <p className="text-sm text-red-500 dark:text-red-400">{errors.teamName.message}</p>
              )}
            </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Zusätzliche Informationen
                      <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
                    </Label>
              <textarea
                id="notes"
                      className="flex min-h-[140px] w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-background px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Haben Sie besondere Wünsche oder Anmerkungen? (z.B. Allergien, besondere Anforderungen, etc.)"
                {...register("notes")}
              />
              {errors.notes && (
                      <p className="text-sm text-red-500 dark:text-red-400">{errors.notes.message}</p>
              )}
            </div>

                  <div className="p-5 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          Wichtige Hinweise
                        </p>
                        <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1.5">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Die Zahlung erfolgt sicher über Stripe</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Ihre Anmeldung wird nach erfolgreicher Zahlung bestätigt</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Sie werden nach dem Absenden zur Zahlung weitergeleitet</span>
                          </li>
                        </ul>
                      </div>
                    </div>
            </div>
          </CardContent>
                <CardContent className="pt-0 pb-6">
                  <Button
                    type="submit"
                    className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isFull}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Weiterleitung zur Zahlung...
                      </span>
                    ) : isFull ? (
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Turnier ist voll
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Zur Zahlung ({formatCurrency(tournament.price)})
                      </span>
                    )}
                  </Button>
          </CardContent>
        </form>
      </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
