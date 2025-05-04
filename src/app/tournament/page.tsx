"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TournamentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1,2,3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Tournament {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-gray-500">2024-0{i}-01</div>
              <div className="mb-4">This is a description for tournament {i}.</div>
              <button className="underline text-primary">View Details</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 