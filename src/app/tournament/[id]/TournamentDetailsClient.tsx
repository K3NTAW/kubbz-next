"use client";
import { useState, useTransition, useEffect, useRef } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TournamentDetailsClient({ xata_id }: { xata_id: string }) {
  const { data: tournament, mutate } = useSWR(`/api/tournaments/${xata_id}`, fetcher);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.name?.toLowerCase() || "").includes(userInput.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(userInput.toLowerCase())
  );

  if (!tournament) {
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
    if (!selectedUser) {
      setError("Bitte wähle einen Benutzer aus.");
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/tournaments/${xata_id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedUser.name }),
      });
      if (res.ok) {
        setSuccess("Erfolgreich registriert!");
        setSelectedUser(null);
        setUserInput("");
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
          <CardTitle className="text-3xl mb-2">{tournament.title || tournament.name}</CardTitle>
          <div className="text-muted-foreground text-sm">
            {tournament.date ? format(new Date(tournament.date), "dd.MM.yyyy") : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-lg text-zinc-700 dark:text-zinc-200">
            {tournament.description}
          </div>
          {tournament.googleMapsUrl && (
            <div className="mb-6">
              <iframe
                src={tournament.googleMapsUrl}
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
            <span className="font-medium">Preis:</span> {tournament.price ?? "-"} CHF
          </div>
          <div className="mb-2">
            <span className="font-medium">Max. Teilnehmer:</span> {tournament.maxPeople ?? "-"}
          </div>
          <div className="mb-6">
            <span className="font-medium">Bereits angemeldet:</span> {tournament.registeredPeople ?? "0"}
          </div>
          {/* Registration form (mocked) */}
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 relative"
            autoComplete="off"
          >
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Benutzer suchen und auswählen..."
                value={selectedUser ? (selectedUser.name || selectedUser.email) : userInput}
                onChange={e => {
                  setUserInput(e.target.value);
                  setSelectedUser(null);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
                className="input input-bordered px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                autoComplete="off"
              />
              {dropdownOpen && filteredUsers.length > 0 && !selectedUser && (
                <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg max-h-48 overflow-auto">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.id}
                      className="px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onMouseDown={() => {
                        setSelectedUser(u);
                        setUserInput("");
                        setDropdownOpen(false);
                        setTimeout(() => inputRef.current?.blur(), 0);
                      }}
                    >
                      {u.name || u.email} {u.email && u.name ? `(${u.email})` : u.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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