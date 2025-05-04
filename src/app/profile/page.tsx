"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 mb-4">
            <Avatar>
              <img
                src="/avatar-placeholder.png"
                alt="Profile"
                className="w-16 h-16 rounded-full border"
              />
            </Avatar>
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          <form className="flex flex-col gap-2">
            <input type="text" placeholder="Name" className="input input-bordered" />
            <input type="email" placeholder="Email" className="input input-bordered" />
            <input type="password" placeholder="New Password" className="input input-bordered" />
            <Button type="submit" className="w-full">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 