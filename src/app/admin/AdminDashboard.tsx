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
  xata_id: string;
  name?: string;
  email?: string;
  user_metadata?: { role?: string };
};
type Tournament = {
  xata_id: string;
  title: string;
  name: string;
  description?: string;
  googleMapsUrl?: string;
  price?: string;
  maxPeople: string;
  registeredPeople: string;
  date?: string;
};
type Registration = {
  xata_id: string;
  name?: string;
  user: { xata_id: string; name?: string; email?: string };
  createdAt: string;
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
  const [createModal, setCreateModal] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [detailOverlay, setDetailOverlay] = useState<null | Tournament>(null);
  const [userEditOverlay, setUserEditOverlay] = useState<null | User>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((u) =>
      (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [userList, userSearch]);

  // Handlers
  const handleDeleteUser = async (xata_id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${xata_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUserList((prev) => prev.filter((u) => u.xata_id !== xata_id));
    } catch {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTournament = async (xata_id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tournaments/${xata_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tournament");
      setTournamentList((prev) => prev.filter((t) => t.xata_id !== xata_id));
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
      googleMapsUrl: (data as Tournament).googleMapsUrl || "",
      price: (data as Tournament).price || "",
      maxPeople: (data as Tournament).maxPeople || "",
      registeredPeople: (data as Tournament).registeredPeople || "",
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
        const res = await fetch(`/api/users/${(editModal.data as User).xata_id}`, {
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
        setUserList((prev) => prev.map((u) => u.xata_id === user.xata_id ? user : u));
      } else {
        const res = await fetch(`/api/tournaments/${(editModal.data as Tournament).xata_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            date: form.date,
            description: form.description,
            googleMapsUrl: form.googleMapsUrl,
            price: form.price,
            maxPeople: form.maxPeople,
            registeredPeople: form.registeredPeople,
          }),
        });
        if (!res.ok) throw new Error("Failed to update tournament");
        const { tournament } = await res.json();
        setTournamentList((prev) => prev.map((t) => t.xata_id === tournament.xata_id ? tournament : t));
      }
      closeEditModal();
    } catch {
      setError("Failed to update");
    } finally {
      setLoading(false);
    }
  };
  const openCreateModal = () => {
    setForm({ name: "", date: "", description: "", googleMapsUrl: "", price: "", maxPeople: "", registeredPeople: "0" });
    setCreateModal(true);
    setError(null);
  };
  const closeCreateModal = () => {
    setCreateModal(false);
    setForm({});
    setError(null);
  };
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          date: form.date,
          description: form.description,
          googleMapsUrl: form.googleMapsUrl,
          price: form.price,
          maxPeople: form.maxPeople,
          registeredPeople: form.registeredPeople,
        }),
      });
      if (!res.ok) throw new Error("Failed to create tournament");
      const { tournament } = await res.json();
      setTournamentList((prev) => [tournament, ...prev]);
      closeCreateModal();
    } catch {
      setError("Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };
  const openDetailOverlay = async (t: Tournament) => {
    setDetailOverlay(t);
    setRegLoading(true);
    setRegError(null);
    try {
      const res = await fetch(`/api/tournaments/${t.xata_id}?registrations=1`);
      if (!res.ok) throw new Error("Failed to fetch registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch {
      setRegError("Failed to fetch registrations");
      setRegistrations([]);
    } finally {
      setRegLoading(false);
    }
  };
  const closeDetailOverlay = () => {
    setDetailOverlay(null);
    setRegistrations([]);
    setRegError(null);
  };
  const handleDeleteRegistration = async (regId: string, tournamentId: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    setRegLoading(true);
    setRegError(null);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/register/${regId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete registration");
      setRegistrations((prev) => prev.filter((r) => r.xata_id !== regId));
    } catch {
      setRegError("Failed to delete registration");
    } finally {
      setRegLoading(false);
    }
  };
  const openUserEditOverlay = (user: User) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.user_metadata?.role || "user",
    });
    setUserEditOverlay(user);
    setError(null);
  };
  const closeUserEditOverlay = () => {
    setUserEditOverlay(null);
    setForm({});
    setError(null);
  };
  const handleUserEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEditOverlay) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userEditOverlay.xata_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          user_metadata: { ...userEditOverlay.user_metadata, role: form.role },
        }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const { user } = await res.json();
      setUserList((prev) => prev.map((u) => u.xata_id === user.xata_id ? user : u));
      closeUserEditOverlay();
    } catch {
      setError("Failed to update user");
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
            <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openUserEditOverlay(info.row.original)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => handleDeleteUser(info.row.original.xata_id)} disabled={loading}>
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
        <>
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreateModal}>Create Tournament</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Max People</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournamentList.map((t) => (
                <TableRow key={t.xata_id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.date ? new Date(t.date).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>{t.price ?? "-"}</TableCell>
                  <TableCell>{t.maxPeople}</TableCell>
                  <TableCell>{t.registeredPeople}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="mr-2" onClick={() => openEditModal("tournament", t)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="mr-2" onClick={() => openDetailOverlay(t)}>
                      Detail
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTournament(t.xata_id)} disabled={loading}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Create Tournament Modal */}
          <Sheet open={createModal} onOpenChange={v => { if (!v) closeCreateModal(); }}>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Create Tournament</SheetTitle>
                <SheetDescription>
                  Fill in the details to create a new tournament.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 p-4">
                <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleFormChange} required />
                <Input name="date" type="date" value={form.date || ""} onChange={handleFormChange} required />
                <Input name="description" placeholder="Description" value={form.description || ""} onChange={handleFormChange} />
                <Input name="googleMapsUrl" placeholder="Google Maps Link" value={form.googleMapsUrl || ""} onChange={handleFormChange} />
                {form.googleMapsUrl && (
                  <iframe
                    src={form.googleMapsUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                <Input name="price" placeholder="Price" type="number" value={form.price || ""} onChange={handleFormChange} />
                <Input name="maxPeople" placeholder="Max People" type="number" value={form.maxPeople || ""} onChange={handleFormChange} required />
                <Input name="registeredPeople" placeholder="Registered People" type="number" value={form.registeredPeople || "0"} onChange={handleFormChange} />
                {/* Placeholder for image upload/linking */}
                <div className="text-xs text-muted-foreground">Image linking coming soon</div>
                <SheetFooter>
                  <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                  <SheetClose asChild>
                    <Button type="button" variant="outline" onClick={closeCreateModal}>Cancel</Button>
                  </SheetClose>
                </SheetFooter>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </form>
            </SheetContent>
          </Sheet>
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
                    <Input name="googleMapsUrl" placeholder="Google Maps Link" value={form.googleMapsUrl || ""} onChange={handleFormChange} />
                    {form.googleMapsUrl && (
                      <iframe
                        src={form.googleMapsUrl}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    )}
                    <Input name="price" placeholder="Price" type="number" value={form.price || ""} onChange={handleFormChange} />
                    <Input name="maxPeople" placeholder="Max People" type="number" value={form.maxPeople || ""} onChange={handleFormChange} required />
                    <Input name="registeredPeople" placeholder="Registered People" type="number" value={form.registeredPeople || "0"} onChange={handleFormChange} />
                    {/* Placeholder for image upload/linking */}
                    <div className="text-xs text-muted-foreground">Image linking coming soon</div>
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
        </>
      )}
      {/* Centered Overlay for User Edit (always available) */}
      {userEditOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md mx-auto p-6 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              onClick={closeUserEditOverlay}
              aria-label="Close"
            >
              ×
            </button>
            <div className="font-bold text-lg mb-2">Edit User</div>
            <form onSubmit={handleUserEditSubmit} className="flex flex-col gap-4">
              <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleFormChange} required />
              <Input name="email" placeholder="Email" value={form.email || ""} onChange={handleFormChange} required />
              <Input name="role" placeholder="Role" value={form.role || ""} onChange={handleFormChange} required />
              <div className="flex gap-2 mt-2">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={closeUserEditOverlay}>Cancel</Button>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Centered Overlay for Tournament Detail */}
      {detailOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              onClick={closeDetailOverlay}
              aria-label="Close"
            >
              ×
            </button>
            <div className="font-bold text-lg mb-2">Registrations for <b>{detailOverlay.name}</b></div>
            {regLoading ? (
              <div>Loading...</div>
            ) : regError ? (
              <div className="text-red-500">{regError}</div>
            ) : registrations.length === 0 ? (
              <div>No registrations yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name Registered</TableHead>
                    <TableHead>Registered By (User)</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((r) => (
                    <TableRow key={r.xata_id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.user?.name || r.user?.xata_id}</TableCell>
                      <TableCell>{r.user?.email || "-"}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteRegistration(r.xata_id, detailOverlay.xata_id)} disabled={regLoading}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 