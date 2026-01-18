"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, Image as ImageIcon, Video, Upload, X } from "lucide-react";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";

const galleryItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tournamentId: z.string().optional(),
});

type GalleryItemFormData = z.infer<typeof galleryItemSchema>;

export function GalleryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: galleryItems, isLoading } = useSWR("/api/gallery", arrayFetcher, swrConfig);
  const { data: tournaments } = useSWR("/api/tournaments", arrayFetcher, swrConfig);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryItemFormData>({
    resolver: zodResolver(galleryItemSchema),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isVideoFile = (file: File) => {
    return file.type.startsWith("video/");
  };

  const onSubmit = async (data: GalleryItemFormData) => {
    if (selectedFiles.length === 0) {
      alert("Bitte wählen Sie mindestens eine Datei aus");
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.tournamentId) formData.append("tournamentId", data.tournamentId);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: percentComplete,
            }));
          }
        });

        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
              resolve(xhr.response);
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("POST", "/api/gallery/upload");
          xhr.send(formData);
        });
      }

      mutate("/api/gallery");
      setIsDialogOpen(false);
      reset();
      setSelectedFiles([]);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      alert(error.message || "Fehler beim Hochladen der Dateien");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Element löschen möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen");
      }

      mutate("/api/gallery");
    } catch (error) {
      alert("Fehler beim Löschen des Elements");
    }
  };

  const openCreateDialog = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-zinc-900 dark:text-zinc-50">Laden...</div>;
  }

  const galleryItemsArray = Array.isArray(galleryItems) ? galleryItems : [];

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">Galerie verwalten</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Hochladen und verwalten Sie Bilder und Videos für die Galerie
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">
                <Plus className="mr-2 h-4 w-4" />
                Hochladen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background dark:bg-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 dark:text-zinc-50">Medien hochladen</DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  Wählen Sie Bilder oder Videos zum Hochladen
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="files" className="text-zinc-900 dark:text-zinc-50">
                      Dateien auswählen *
                    </Label>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Unterstützte Formate: Bilder (JPG, PNG, GIF) und Videos (MP4, WebM)
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-zinc-900 dark:text-zinc-50">Ausgewählte Dateien</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-md p-3">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isVideoFile(file) ? (
                                <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              <span className="text-sm text-zinc-900 dark:text-zinc-50 truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            {uploadProgress[file.name] !== undefined && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-zinc-900 dark:bg-zinc-50 transition-all"
                                    style={{ width: `${uploadProgress[file.name]}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-600 dark:text-zinc-400 w-10 text-right">
                                  {Math.round(uploadProgress[file.name])}%
                                </span>
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 text-destructive hover:bg-destructive/10 flex-shrink-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-50">Titel (optional)</Label>
                    <Input id="title" {...register("title")} placeholder="z.B. Turnier 2024" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-50">
                      Beschreibung (optional)
                    </Label>
                    <textarea
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("description")}
                      placeholder="Beschreibung des Bildes oder Videos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tournamentId" className="text-zinc-900 dark:text-zinc-50">
                      Turnier zuordnen (optional)
                    </Label>
                    <select
                      id="tournamentId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50"
                      {...register("tournamentId")}
                    >
                      <option value="">Kein Turnier</option>
                      {Array.isArray(tournaments) &&
                        tournaments.map((tournament: any) => (
                          <option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedFiles([]);
                      setUploadProgress({});
                    }}
                    className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || uploading || selectedFiles.length === 0}
                    className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                  >
                    {uploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-pulse" />
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Hochladen
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {galleryItemsArray.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Keine Medien in der Galerie.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryItemsArray.map((item: any) => (
              <div
                key={item.id}
                className="group relative border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800 hover:shadow-lg transition-shadow"
              >
                {item.url.match(/\.(mp4|webm|mov)$/i) ? (
                  <div className="aspect-square relative bg-zinc-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                    />
                  </div>
                ) : (
                  <div className="aspect-square relative">
                    <Image
                      src={item.url}
                      alt={item.title || "Galeriebild"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  {item.title && (
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1 truncate">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">
                      {formatDate(item.createdAt)}
                    </span>
                    <Badge
                      variant={item.url.match(/\.(mp4|webm|mov)$/i) ? "default" : "secondary"}
                      className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    >
                      {item.url.match(/\.(mp4|webm|mov)$/i) ? (
                        <Video className="h-3 w-3 mr-1" />
                      ) : (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      )}
                      {item.url.match(/\.(mp4|webm|mov)$/i) ? "Video" : "Bild"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

