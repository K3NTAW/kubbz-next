import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getXataClient } from "@/xata";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const rawHeaders = await headers();
  const req = new NextRequest("http://localhost", { headers: rawHeaders });
  const token = await getToken({ req });
  const isAdmin = token?.is_admin === true;
  if (!isAdmin) {
    redirect("/");
  }
  const xata = getXataClient();
  // Fetch users
  const users = await xata.db.users.getAll();
  // Fetch tournaments
  const tournaments = await xata.db.tournaments.getAll();

  return <AdminDashboard
    users={users.map(u => ({
      xata_id: u.id,
      name: u.name ?? undefined,
      email: u.email ?? undefined,
      user_metadata: (u.user_metadata && typeof u.user_metadata === 'object' && !Array.isArray(u.user_metadata))
        ? u.user_metadata as { role?: string }
        : { role: 'user' },
    }))}
    tournaments={tournaments.map(t => ({
      xata_id: t.id,
      name: t.name ?? "",
      description: t.description ?? undefined,
      google_maps_url: t.google_maps_url ?? "",
      price: t.price !== undefined && t.price !== null ? String(t.price) : "",
      max_people: t.max_people !== undefined && t.max_people !== null ? t.max_people : 0,
      registered_people: t.registered_people !== undefined && t.registered_people !== null ? t.registered_people : 0,
      date: typeof t.date === "string" ? t.date : (t.date ? String(t.date) : ""),
    }))}
  />;
} 