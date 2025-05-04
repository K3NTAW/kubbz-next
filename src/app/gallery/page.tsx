"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex gap-2 mb-6">
              <input type="file" accept="image/*" className="input input-bordered" />
              <Button type="submit">Upload</Button>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Example images, replace with dynamic images from DB */}
              {[1,2,3,4,5,6].map((i) => (
                <img
                  key={i}
                  src={`https://placehold.co/200x200?text=Photo+${i}`}
                  alt={`Photo ${i}`}
                  className="rounded-lg border object-cover w-full h-40"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 