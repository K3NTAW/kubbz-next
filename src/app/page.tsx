import AboutKubbSection from "./AboutKubbSection";
import HistorySection from "./HistorySection";
import TournamentsSection from "./TournamentsSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 transition-colors duration-700">
      <div className="max-w-full flex flex-col space-y-12">
        <AboutKubbSection />
        <HistorySection />
        <TournamentsSection />
      </div>
    </div>
  );
}
