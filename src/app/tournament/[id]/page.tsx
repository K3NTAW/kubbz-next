// src/app/tournament/[id]/page.tsx
import TournamentDetailsClient from './TournamentDetailsClient';

export default async function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: xata_id } = await params;
  return <TournamentDetailsClient xata_id={xata_id} />;
}
