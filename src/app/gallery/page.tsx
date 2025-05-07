"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function GalleryPage() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [images, setImages] = useState<any[]>([]);
  const [tournamentId, setTournamentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images from API
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setImages);
  }, []);

  // Handle upload
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    if (fileInputRef.current?.files?.[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    } else {
      setError("Please select a file.");
      setLoading(false);
      return;
    }
    if (tournamentId) {
      formData.append("tournament_id", tournamentId);
    }
    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setTournamentId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Refresh images
      const imgs = await fetch("/api/gallery").then((r) => r.json());
      setImages(imgs);
    } else {
      const data = await res.json();
      setError(data.error || "Upload failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            {session && (
              <form className="flex flex-col sm:flex-row gap-2 mb-6" onSubmit={handleUpload}>
                <input
                  type="file"
                  accept="image/*"
                  className="input input-bordered flex-1 px-2 py-1 rounded border"
                  ref={fileInputRef}
                  required
                />
                <input
                  type="text"
                  placeholder="Tournament ID (optional)"
                  className="input input-bordered flex-1 px-2 py-1 rounded border"
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </form>
            )}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.length === 0 && <div className="col-span-full text-center text-gray-400">No images yet.</div>}
              {images.filter((img) => img.xata_id).map((img) => (
                <Image
                  key={img.xata_id}
                  src={img.image_url}
                  alt={"Gallery image"}
                  width={200}
                  height={200}
                  className="rounded-lg border object-cover w-full h-40"
                  unoptimized
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 