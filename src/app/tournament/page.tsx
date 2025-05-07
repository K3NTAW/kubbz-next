import TournamentsListSection, { TournamentListType } from "./TournamentsListSection";
import { getXataClient } from "@/xata";

export default async function TournamentPage() {
  const xata = getXataClient();
  const tournaments = await xata.db.tournaments
    .select([
      "xata_id", "title", "name", "description", "google_maps_url", "price",
      "max_people", "registered_people", "date"
    ])
    .sort("date", "desc")
    .getAll();

  const mapped: TournamentListType[] = tournaments.map(t => ({
    id: t.xata_id,
    title: t.title ?? "",
    name: t.name ?? "",
    description: t.description ?? undefined,
    googleMapsUrl: t.google_maps_url ?? "",
    price: t.price !== undefined && t.price !== null ? String(t.price) : "",
    maxPeople: t.max_people !== undefined && t.max_people !== null ? String(t.max_people) : "",
    registeredPeople: t.registered_people !== undefined && t.registered_people !== null ? String(t.registered_people) : "0",
    date: typeof t.date === "string" ? t.date : (t.date ? String(t.date) : ""),
  }));

  return <TournamentsListSection tournaments={mapped} />;
} 