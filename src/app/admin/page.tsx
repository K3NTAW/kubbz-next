"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example users */}
                {[1,2,3].map((i) => (
                  <tr key={i}>
                    <td className="p-2 border">User {i}</td>
                    <td className="p-2 border">user{i}@mail.com</td>
                    <td className="p-2 border">user</td>
                    <td className="p-2 border">Edit | Delete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tournament Management</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example tournaments */}
                {[1,2].map((i) => (
                  <tr key={i}>
                    <td className="p-2 border">Tournament {i}</td>
                    <td className="p-2 border">2024-0{i}-01</td>
                    <td className="p-2 border">Edit | Delete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 