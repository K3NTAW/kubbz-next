"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

function AdminBadge({ role }: { role?: string }) {
  if (role === "admin") {
    return <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-semibold">admin</span>;
  }
  return <span className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-xs">user</span>;
}

type User = {
  id: string;
  name?: string;
  email?: string;
  user_metadata?: { role?: string };
};
type Tournament = {
  id: string;
  name: string;
  date?: string;
  description?: string;
};

export default function AdminDashboard({ users, tournaments }: { users: User[]; tournaments: Tournament[] }) {
  const [view, setView] = useState<"users" | "tournaments">("users");
  const [userSearch, setUserSearch] = useState("");
  const [userList, setUserList] = useState<User[]>(users);
  const [tournamentList, setTournamentList] = useState<Tournament[]>(tournaments);
  const [editModal, setEditModal] = useState<null | { type: "user" | "tournament"; data: User | Tournament }>(null);
  const [form, setForm] = useState<Record<string, string>>( {} );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((u) =>
      (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [userList, userSearch]);

  // Handlers
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUserList((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTournament = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tournament");
      setTournamentList((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete tournament");
    } finally {
      setLoading(false);
    }
  };
  const openEditModal = (type: "user" | "tournament", data: User | Tournament) => {
    setForm(type === "user" ? {
      name: (data as User).name || "",
      email: (data as User).email || "",
      role: (data as User).user_metadata?.role || "user",
    } : {
      name: (data as Tournament).name || "",
      date: (data as Tournament).date ? new Date((data as Tournament).date!).toISOString().slice(0, 10) : "",
      description: (data as Tournament).description || "",
    });
    setEditModal({ type, data });
    setError(null);
  };
  const closeEditModal = () => {
    setEditModal(null);
    setForm({});
    setError(null);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setLoading(true);
    setError(null);
    try {
      if (editModal.type === "user") {
        const res = await fetch(`/api/users/${(editModal.data as User).id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            user_metadata: { ...(editModal.data as User).user_metadata, role: form.role },
          }),
        });
        if (!res.ok) throw new Error("Failed to update user");
        const { user } = await res.json();
        setUserList((prev) => prev.map((u) => u.id === user.id ? user : u));
      } else {
        const res = await fetch(`/api/tournaments/${(editModal.data as Tournament).id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            date: form.date,
            description: form.description,
          }),
        });
        if (!res.ok) throw new Error("Failed to update tournament");
        const { tournament } = await res.json();
        setTournamentList((prev) => prev.map((t) => t.id === tournament.id ? tournament : t));
      }
      closeEditModal();
    } catch {
      setError("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  // TanStack Table columns
  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: info => info.getValue() || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: info => info.getValue() || "-",
      },
      {
        header: "Role",
        accessorKey: "user_metadata.role",
        cell: info => <AdminBadge role={info.row.original.user_metadata?.role} />,
      },
      {
        header: "Actions",
        id: "actions",
        cell: info => (
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEditModal("user", info.row.original)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => handleDeleteUser(info.row.original.id)} disabled={loading}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    [loading]
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <span className={view === "users" ? "font-bold" : "text-muted-foreground"}>User Management</span>
        <Switch checked={view === "tournaments"} onCheckedChange={v => setView(v ? "tournaments" : "users")}/>
        <span className={view === "tournaments" ? "font-bold" : "text-muted-foreground"}>Tournament Management</span>
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {view === "users" ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Input
              placeholder="Search users..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournamentList.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.date ? new Date(t.date).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" className="mr-2" onClick={() => openEditModal("tournament", t)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteTournament(t.id)} disabled={loading}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Edit Modal */}
      <Sheet open={!!editModal} onOpenChange={v => { if (!v) closeEditModal(); }}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit {editModal?.type === "user" ? "User" : "Tournament"}</SheetTitle>
            <SheetDescription>
              Update the {editModal?.type === "user" ? "user's" : "tournament's"} details below.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 p-4">
            {editModal?.type === "user" ? (
              <>
                <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleFormChange} required />
                <Input name="email" placeholder="Email" value={form.email || ""} onChange={handleFormChange} required />
                <Input name="role" placeholder="Role" value={form.role || ""} onChange={handleFormChange} required />
              </>
            ) : (
              <>
                <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleFormChange} required />
                <Input name="date" type="date" value={form.date || ""} onChange={handleFormChange} required />
                <Input name="description" placeholder="Description" value={form.description || ""} onChange={handleFormChange} />
              </>
            )}
            <SheetFooter>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" onClick={closeEditModal}>Cancel</Button>
              </SheetClose>
            </SheetFooter>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
} 