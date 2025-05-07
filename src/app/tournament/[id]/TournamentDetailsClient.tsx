"use client";
import { useState, useTransition, useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TournamentDetailsClient({ xata_id }: { xata_id: string }) {
  const { data: tournament, mutate } = useSWR(`/api/tournaments/${xata_id}`, fetcher);
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<{ xata_id: string; name?: string; email?: string }[]>([]);
  const [userXataId, setUserXataId] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  useEffect(() => {
    async function fetchUserXataId() {
      if (session?.user?.email) {
        const res = await fetch(`/api/users`);
        const allUsers = await res.json();
        const dbUser = allUsers.find((u: { email?: string }) => u.email === session.user.email);
        if (dbUser && dbUser.xata_id) {
          setUserXataId(dbUser.xata_id);
          setName(dbUser.name || dbUser.email || "");
        }
      }
    }
    fetchUserXataId();
  }, [session]);

  const mappedTournament = tournament
    ? {
        ...tournament,
        maxPeople: tournament.max_people,
        registeredPeople: tournament.registered_people,
        googleMapsUrl: tournament.google_maps_url,
      }
    : undefined;

  if (!mappedTournament) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-xl font-semibold mb-4">Turnier nicht gefunden</div>
        <Button asChild variant="outline">
          <Link href="/tournament">Zurück zu den Turnieren</Link>
        </Button>
      </div>
    );
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!session || !session.user) {
      setError("Du musst eingeloggt sein, um dich zu registrieren.");
      return;
    }
    if (!name) {
      setError("Bitte gib deinen Namen ein.");
      return;
    }
    const registrationName = name;
    startTransition(async () => {
      const res = await fetch(`/api/tournaments/${xata_id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: registrationName, xata_id: userXataId }),
      });
      if (res.ok) {
        setSuccess("Erfolgreich registriert!");
        setName(session.user.name || "");
        mutate(); // revalidate data
        setTimeout(() => {
          router.push("/tournament");
        }, 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Fehler bei der Registrierung.");
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl mb-2">{mappedTournament.name}</CardTitle>
          <div className="text-muted-foreground text-sm">
            {mappedTournament.date ? format(new Date(mappedTournament.date), "dd.MM.yyyy") : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-lg text-zinc-700 dark:text-zinc-200">
            {mappedTournament.description}
          </div>
          {mappedTournament.googleMapsUrl && (
            <div className="mb-6">
              <iframe
                src={mappedTournament.googleMapsUrl}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          )}
          <div className="mb-2">
            <span className="font-medium">Preis:</span> {mappedTournament.price ?? "-"} CHF
          </div>
          <div className="mb-2">
            <span className="font-medium">Max. Teilnehmer:</span> {mappedTournament.maxPeople ?? "-"}
          </div>
          <div className="mb-6">
            <span className="font-medium">Bereits angemeldet:</span> {mappedTournament.registeredPeople ?? "0"}
          </div>
          {/* Registration form with user dropdown */}
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            <select
              value={name}
              onChange={e => setName(e.target.value)}
              className="input input-bordered"
              required
            >
              <option value="">Wähle einen Benutzer...</option>
              {users.map(u => (
                <option key={u.xata_id} value={u.name || u.email || u.xata_id}>
                  {u.name || u.email || u.xata_id}
                </option>
              ))}
            </select>
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Registrieren..." : "Jetzt registrieren"}
            </Button>
          </form>
          {success && <div className="text-green-500">{success}</div>}
          {error && <div className="text-red-500">{error}</div>}
          <Button asChild variant="ghost" className="mt-6 w-full">
            <Link href="/tournament">← Zurück zu den Turnieren</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 