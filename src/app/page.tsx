export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        {/* Logo will be added later */}
        {/* <img src="/kubb-logo.png" alt="Kubbz Logo" className="w-32 h-32 mb-4" /> */}
        <h1 className="text-4xl font-bold text-center mb-2">Welcome to Kubbz</h1>
        <p className="text-lg text-center mb-6">
          Kubbz is your home for kubb tournaments, photo galleries, and community fun! Register, join tournaments, upload your best kubb moments, and connect with other players.
        </p>
      </div>
    </div>
  );
}
