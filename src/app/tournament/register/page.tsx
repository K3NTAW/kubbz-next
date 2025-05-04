"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TournamentRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Register a Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2">
            <input type="text" placeholder="Tournament Name" className="input input-bordered" />
            <textarea placeholder="Description" className="input input-bordered" />
            <input type="date" className="input input-bordered" />
            <Button type="submit" className="w-full">Register Tournament</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 