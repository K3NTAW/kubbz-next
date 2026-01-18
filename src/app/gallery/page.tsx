"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import Image from "next/image";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";
import { GallerySkeleton } from "@/components/skeletons/GallerySkeleton";

export default function GalleryPage() {
  const { data: images, error, isLoading } = useSWR("/api/gallery", arrayFetcher, swrConfig);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 mt-4 text-zinc-900 dark:text-zinc-50">Galerie</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Fotos von vergangenen Turnieren und Events
        </p>
        <GallerySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 mt-4">Galerie</h1>
        <p className="text-destructive">Fehler beim Laden der Galerie</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 mt-4">Galerie</h1>
      <p className="text-muted-foreground mb-8">
        Fotos von vergangenen Turnieren und Events
      </p>

      {!images || images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400">Noch keine Bilder in der Galerie.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.filter((image: any) => image && image.url).map((image: any) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.title || "Galeriebild"}
                  fill
                  className="object-cover"
                />
              </div>
              {(image.title || image.description) && (
                <CardContent className="p-4">
                  {image.title && (
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

