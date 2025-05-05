// import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  // const session = await getServerSession();
  // if (!session || session.user?.role !== "admin") {
  //   redirect("/");
  // }
  const prisma = new PrismaClient();
  const users = await prisma.users.findMany({
    select: { id: true, name: true, email: true, user_metadata: true },
    orderBy: { name: "asc" },
  });
  const tournaments = await prisma.tournament.findMany({
    select: { id: true, name: true, description: true, date: true, createdAt: true, updatedAt: true },
    orderBy: { date: "desc" },
  });
  return <AdminDashboard users={users} tournaments={tournaments} />;
} 