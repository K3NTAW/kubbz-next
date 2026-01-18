"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, Trash2, Trophy, Image as ImageIcon, X, Upload } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";

const tournamentSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string().optional(),
  date: z.string().min(1, "Datum ist erforderlich"),
  location: z.string().min(1, "Ort ist erforderlich"),
  price: z.string().min(1, "Preis ist erforderlich"),
  maxParticipants: z.string().min(1, "Max. Teilnehmer ist erforderlich"),
  status: z.enum(["DRAFT", "UPCOMING", "OPEN", "FULL", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  type: z.enum(["SOLO", "TEAM"]),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

export function TournamentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { data: tournaments, isLoading } = useSWR("/api/tournaments", arrayFetcher, swrConfig);
  const { data: users } = useSWR("/api/users", arrayFetcher, swrConfig);

  // Ensure tournaments is always an array
  const tournamentsArray = Array.isArray(tournaments) ? tournaments : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      status: "DRAFT",
      type: "SOLO",
    },
  });

  const openCreateDialog = () => {
    setEditingTournament(null);
    setSelectedImage(null);
    setImagePreview(null);
    reset();
    setIsDialogOpen(true);
  };

  const openEditDialog = (tournament: any) => {
    setEditingTournament(tournament);
    setSelectedImage(null);
    setImagePreview(tournament.imageUrl || null);
    reset({
      name: tournament.name,
      description: tournament.description || "",
      date: new Date(tournament.date).toISOString().split("T")[0],
      location: tournament.location,
      price: tournament.price.toString(),
      maxParticipants: tournament.maxParticipants.toString(),
      status: tournament.status,
      type: tournament.type || "SOLO",
    });
    setIsDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: TournamentFormData) => {
    try {
      let imageUrl = editingTournament?.imageUrl || null;

      // Upload image if a new one is selected
      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", selectedImage);

        const uploadResponse = await fetch("/api/tournaments/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Fehler beim Hochladen des Bildes");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        setUploadingImage(false);
      }

      const url = editingTournament
        ? `/api/tournaments/${editingTournament.id}`
        : "/api/tournaments";
      const method = editingTournament ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Fehler beim Speichern");
      }

      mutate("/api/tournaments");
      setIsDialogOpen(false);
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error: any) {
      setUploadingImage(false);
      alert(error.message || "Ein Fehler ist aufgetreten");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Turnier löschen möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen");
      }

      mutate("/api/tournaments");
    } catch (error) {
      alert("Fehler beim Löschen des Turniers");
    }
  };

  const handleSetWinner = async (tournamentId: string, winnerId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/winner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Setzen des Gewinners");
      }

      mutate("/api/tournaments");
      setIsWinnerDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
    }
  };

  const openWinnerDialog = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsWinnerDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-6">
          <div className="text-zinc-600 dark:text-zinc-400">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">Turniere verwalten</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Erstellen, bearbeiten und löschen Sie Turniere
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">
                <Plus className="mr-2 h-4 w-4" />
                Neues Turnier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-zinc-50">
                  {editingTournament ? "Turnier bearbeiten" : "Neues Turnier erstellen"}
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Füllen Sie die Details für das Turnier aus
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-zinc-900 dark:text-zinc-50">
                      Turnier-Bild <span className="text-zinc-500 dark:text-zinc-400 text-sm">(optional)</span>
                    </Label>
                    {imagePreview ? (
                      <div className="relative group">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-zinc-400" />
                            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <span className="font-semibold">Klicken Sie zum Hochladen</span> oder ziehen Sie ein Bild hierher
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">PNG, JPG, GIF bis 10MB</p>
                          </div>
                          <input
                            type="file"
                            id="image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-900 dark:text-zinc-50">Name *</Label>
                    <Input id="name" {...register("name")} className="text-zinc-900 dark:text-zinc-50" />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-50">Beschreibung</Label>
                    <textarea
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                      {...register("description")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-zinc-900 dark:text-zinc-50">Datum *</Label>
                      <Input id="date" type="datetime-local" {...register("date")} className="text-zinc-900 dark:text-zinc-50" />
                      {errors.date && (
                        <p className="text-sm text-destructive">{errors.date.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-zinc-900 dark:text-zinc-50">Ort *</Label>
                      <Input id="location" {...register("location")} className="text-zinc-900 dark:text-zinc-50" />
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-zinc-900 dark:text-zinc-50">Preis (CHF) *</Label>
                      <Input id="price" type="number" step="0.01" {...register("price")} className="text-zinc-900 dark:text-zinc-50" />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants" className="text-zinc-900 dark:text-zinc-50">Max. Teilnehmer *</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        {...register("maxParticipants")}
                        className="text-zinc-900 dark:text-zinc-50"
                      />
                      {errors.maxParticipants && (
                        <p className="text-sm text-destructive">
                          {errors.maxParticipants.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="status" className="text-zinc-900 dark:text-zinc-50">Status *</Label>
                    <select
                      id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50"
                      {...register("status")}
                    >
                      <option value="DRAFT">Entwurf</option>
                      <option value="UPCOMING">Bevorstehend</option>
                      <option value="OPEN">Offen</option>
                      <option value="FULL">Voll</option>
                      <option value="IN_PROGRESS">Läuft</option>
                      <option value="COMPLETED">Abgeschlossen</option>
                      <option value="CANCELLED">Abgesagt</option>
                    </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-zinc-900 dark:text-zinc-50">Turnier-Typ *</Label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50"
                        {...register("type")}
                      >
                        <option value="SOLO">Einzelturnier</option>
                        <option value="TEAM">Teamturnier</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isSubmitting || uploadingImage} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
                    {uploadingImage ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-pulse" />
                        Bild wird hochgeladen...
                      </>
                    ) : isSubmitting ? (
                      "Wird gespeichert..."
                    ) : (
                      "Speichern"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="text-zinc-600 dark:text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Datum</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Ort</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Preis</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Teilnehmer</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Gewinner</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-right text-zinc-600 dark:text-zinc-400">Aktionen</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {tournamentsArray.length === 0 ? (
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableCell colSpan={8} className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                  Keine Turniere gefunden
                </TableCell>
              </TableRow>
            ) : (
              tournamentsArray.map((tournament: any) => (
              <TableRow key={tournament.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{tournament.name}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{formatDate(tournament.date)}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{tournament.location}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{formatCurrency(tournament.price)}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {tournament.registrations?.length || 0} / {tournament.maxParticipants}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {tournament.winner ? (
                    <span className="text-sm">{tournament.winner.name || tournament.winner.email}</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openWinnerDialog(tournament)}
                    >
                      <Trophy className="h-3 w-3 mr-1" />
                      Gewinner setzen
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  <Badge variant={tournament.status === "OPEN" ? "default" : "secondary"}>
                    {tournament.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(tournament)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {tournament.winner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openWinnerDialog(tournament)}
                        title="Gewinner ändern"
                      >
                        <Trophy className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tournament.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Winner Selection Dialog */}
        <Dialog open={isWinnerDialogOpen} onOpenChange={setIsWinnerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gewinner auswählen</DialogTitle>
              <DialogDescription>
                Wählen Sie den Gewinner für {selectedTournament?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedTournament?.registrations?.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedTournament.registrations.map((reg: any) => (
                    <Button
                      key={reg.id}
                      variant={selectedTournament.winnerId === reg.userId ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleSetWinner(selectedTournament.id, reg.userId)}
                    >
                      {reg.user.name || reg.user.email}
                      {selectedTournament.winnerId === reg.userId && (
                        <Trophy className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSetWinner(selectedTournament.id, "")}
                  >
                    Gewinner entfernen
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keine Anmeldungen für dieses Turnier
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsWinnerDialogOpen(false)}
              >
                Schließen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

