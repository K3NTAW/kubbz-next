import TournamentsListSection, { TournamentListType } from "./TournamentsListSection";
import { PrismaClient } from "@/generated/prisma";

export default async function TournamentPage() {
  const prisma = new PrismaClient();
  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
      title: true,
      name: true,
      description: true,
      googleMapsUrl: true,
      price: true,
      maxPeople: true,
      registeredPeople: true,
      date: true,
    },
    orderBy: { date: "desc" },
  });
  const mapped: TournamentListType[] = tournaments.map(t => ({
    ...t,
    date: t.date instanceof Date ? t.date.toISOString() : t.date,
    description: t.description ?? undefined,
    title: t.title ?? "",
    googleMapsUrl: t.googleMapsUrl ?? "",
    price: t.price?.toString() ?? "",
    maxPeople: t.maxPeople?.toString() ?? "",
    registeredPeople: t.registeredPeople?.toString() ?? "0",
  }));
  return <TournamentsListSection tournaments={mapped} />;
} 