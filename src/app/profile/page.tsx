"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Trophy, Edit, Trash2, Camera, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR, { mutate } from "swr";
import { formatDate } from "@/lib/utils";
import { fetcher, swrConfig } from "@/lib/swr-config";
import { Skeleton } from "@/components/ui/skeleton";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: userData, isLoading: userDataLoading } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null,
    fetcher,
    swrConfig
  );
  const { data: registrations, isLoading: registrationsLoading } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}/registrations` : null,
    fetcher,
    swrConfig
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  if (status === "loading" || userDataLoading || registrationsLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-700">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Skeleton className="w-[120px] h-[120px] rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-zinc-900 dark:text-zinc-50">Sie müssen sich anmelden, um Ihr Profil anzuzeigen.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Anmelden</Link>
        </Button>
      </div>
    );
  }

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    if (!session?.user?.id) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Fehler beim Aktualisieren");
      }

      await update(); // Refresh session
      mutate(`/api/users/${session.user.id}`);
      setIsEditDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen des Kontos");
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
      setIsDeleting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // For now, we'll use a URL. In production, you'd upload to a service like Cloudinary, S3, etc.
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`/api/users/${session.user.id}/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Fehler beim Hochladen des Bildes");
      }

      const data = await response.json();
      setImageError(false); // Reset error state on successful upload
      await update(); // Refresh session
      mutate(`/api/users/${session.user.id}`);
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
    }
  };

  const wins = userData?.wins || 0;
  const trophies = userData?.trophies || 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-700">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              {session.user?.image && !imageError && session.user.image.startsWith("https://") ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white dark:border-zinc-900 shadow-xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-zinc-700 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-xl">
                  <User className="h-16 w-16 text-zinc-300" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-full p-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-lg border-2 border-zinc-200 dark:border-zinc-700">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {session.user?.name || "Benutzer"}
                </h1>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => reset({
                        name: session.user?.name || "",
                        email: session.user?.email || "",
                      })}
                      className="text-white hover:bg-white/10 dark:hover:bg-zinc-800/50"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                      <DialogTitle className="text-zinc-900 dark:text-zinc-50">Profil bearbeiten</DialogTitle>
                      <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                        Aktualisieren Sie Ihre Kontoinformationen
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleUpdateProfile)}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-zinc-900 dark:text-zinc-50">Name</Label>
                          <Input id="name" {...register("name")} />
                          {errors.name && (
                            <p className="text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-zinc-900 dark:text-zinc-50">E-Mail</Label>
                          <Input id="email" type="email" {...register("email")} />
                          {errors.email && (
                            <p className="text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                        >
                          Abbrechen
                        </Button>
                        <Button type="submit" disabled={isUpdating} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
                          {isUpdating ? "Wird gespeichert..." : "Speichern"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-zinc-300 dark:text-zinc-400 text-lg mb-6">{session.user?.email}</p>
              
              {/* Stats in Hero */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{wins}</p>
                    <p className="text-sm text-zinc-300 dark:text-zinc-400">Siege</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{trophies}</p>
                    <p className="text-sm text-zinc-300 dark:text-zinc-400">Trophäen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Account Information */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Kontoinformationen</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Ihre persönlichen Daten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Name</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {session.user?.name || "Nicht angegeben"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">E-Mail</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{session.user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registrations */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Meine Anmeldungen</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Ihre Turnier-Anmeldungen und Teilnahmen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!registrations || registrations.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Sie haben sich noch für kein Turnier angemeldet.
                  </p>
                  <Button asChild className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
                    <Link href="/tournaments">Turniere ansehen</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map((registration: any) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">{registration.tournament.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          {formatDate(registration.tournament.date)}
                        </p>
                        {registration.tournament.winnerId === session.user?.id && (
                          <Badge variant="default" className="bg-amber-500 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Gewinner
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={registration.status === "CONFIRMED" ? "default" : "secondary"} className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                          {registration.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild className="text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                          <Link href={`/tournament/${registration.tournamentId}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Account Section */}
        <Card className="mt-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 border-t-2 border-b-2 border-t-red-500/50 border-b-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-500 dark:text-red-400">Gefährlicher Bereich</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Diese Aktionen können nicht rückgängig gemacht werden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting} className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800">
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Wird gelöscht..." : "Konto löschen"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50">Sind Sie sicher?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Diese Aktion kann nicht rückgängig gemacht werden. Ihr Konto wird
                  permanent gelöscht und alle Ihre Daten werden entfernt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
