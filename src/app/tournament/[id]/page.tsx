// src/app/tournament/[id]/page.tsx
import TournamentDetailsClient from './TournamentDetailsClient';

export default async function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: xata_id } = await params;
  if (!xata_id || xata_id === 'null' || xata_id === 'undefined') {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 text-lg font-semibold">Ungültige Turnier-ID.</div>;
  }
  return <TournamentDetailsClient xata_id={xata_id} />;
}
