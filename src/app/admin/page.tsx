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
      googleMapsUrl: t.googleMapsUrl ?? "",
      price: t.price !== undefined && t.price !== null ? String(t.price) : "",
      maxPeople: t.maxPeople !== undefined && t.maxPeople !== null ? String(t.maxPeople) : "",
      registeredPeople: t.registeredPeople !== undefined && t.registeredPeople !== null ? String(t.registeredPeople) : "0",
      date: typeof t.date === "string" ? t.date : (t.date ? String(t.date) : ""),
    }))}
  />;
} 