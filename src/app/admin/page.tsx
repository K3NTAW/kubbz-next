// import { getServerSession } from "next-auth";
import { getXataClient } from "@/xata";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  // const session = await getServerSession();
  // if (!session || session.user?.role !== "admin") {
  //   redirect("/");
  // }
  const xata = getXataClient();
  // Fetch users
  const users = await xata.db.users.getAll();
  // Fetch tournaments
  const tournaments = await xata.db.tournaments.getAll();

  return <AdminDashboard
    users={users.map(u => ({
      xata_id: u.xata_id,
      name: u.name ?? undefined,
      email: u.email ?? undefined,
      user_metadata: (u.user_metadata && typeof u.user_metadata === 'object' && !Array.isArray(u.user_metadata))
        ? u.user_metadata as { role?: string }
        : { role: 'user' },
    }))}
    tournaments={tournaments.map(t => ({
      xata_id: t.xata_id,
      title: t.title ?? "",
      name: t.name ?? "",
      description: t.description ?? undefined,
      googleMapsUrl: t.google_maps_url ?? "",
      price: t.price !== undefined && t.price !== null ? String(t.price) : "",
      maxPeople: t.max_people !== undefined && t.max_people !== null ? String(t.max_people) : "",
      registeredPeople: t.registered_people !== undefined && t.registered_people !== null ? String(t.registered_people) : "0",
      date: typeof t.date === "string" ? t.date : (t.date ? String(t.date) : ""),
    }))}
  />;
} 