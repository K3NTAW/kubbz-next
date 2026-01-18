"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Trash2, Trophy, Crown } from "lucide-react";
import useSWR, { mutate } from "swr";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";

const userSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
  wins: z.number().int().min(0).optional(),
  trophies: z.number().int().min(0).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { data: users, isLoading } = useSWR("/api/users", arrayFetcher, swrConfig);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    reset({
      name: user.name || "",
      email: user.email,
      role: user.role,
      wins: user.wins || 0,
      trophies: user.trophies || 0,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Fehler beim Speichern");
      }

      mutate("/api/users");
      setIsDialogOpen(false);
      reset();
    } catch (error: any) {
      alert(error.message || "Ein Fehler ist aufgetreten");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen");
      }

      mutate("/api/users");
    } catch (error) {
      alert("Fehler beim Löschen des Benutzers");
    }
  };

  if (isLoading) {
    return <div className="text-zinc-900 dark:text-zinc-50">Laden...</div>;
  }

  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-50">Benutzer verwalten</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">
          Verwalten Sie Benutzer und deren Rollen
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!users || users.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Keine Benutzer gefunden.</p>
        ) : (
        <Table>
          <TableHeader>
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="text-zinc-600 dark:text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">E-Mail</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Rolle</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Siege</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Trophäen</TableHead>
                <TableHead className="text-zinc-600 dark:text-zinc-400">Anmeldungen</TableHead>
                <TableHead className="text-right text-zinc-600 dark:text-zinc-400">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {users.map((user: any) => (
              <TableRow key={user.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{user.name || "N/A"}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    {user.wins || 0}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    {user.trophies || 0}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{user._count?.registrations || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(user)}
                      className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background dark:bg-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-zinc-50">Benutzer bearbeiten</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                Aktualisieren Sie die Benutzerinformationen
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-900 dark:text-zinc-50">Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-900 dark:text-zinc-50">E-Mail *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-zinc-900 dark:text-zinc-50">Rolle *</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50"
                    {...register("role")}
                  >
                    <option value="USER">Benutzer</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wins" className="text-zinc-900 dark:text-zinc-50">Siege</Label>
                    <Input
                      id="wins"
                      type="number"
                      min="0"
                      {...register("wins", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trophies" className="text-zinc-900 dark:text-zinc-50">Trophäen</Label>
                    <Input
                      id="trophies"
                      type="number"
                      min="0"
                      {...register("trophies", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100">
                  {isSubmitting ? "Wird gespeichert..." : "Speichern"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

