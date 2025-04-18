import Link from 'next/link'
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react'

const tournaments = [
  {
    id: 1,
    title: 'Swiss Kubb Championship 2023',
    date: 'Jun 14, 2023',
    location: 'Zurich, Switzerland',
    description: 'The official Swiss Kubb Championship for 2023. Teams of 3-6 players compete in this prestigious event.',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    registrationOpen: true,
    participants: 24,
    maxParticipants: 32,
  },
  {
    id: 2,
    title: 'Kubb in the Park',
    date: 'Jul 22, 2023',
    location: 'Geneva, Switzerland',
    description: 'A friendly tournament at the beautiful Parc des Bastions. Perfect for families and new players.',
    imageUrl: 'https://images.unsplash.com/photo-1496196614460-48988a57fccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    registrationOpen: true,
    participants: 12,
    maxParticipants: 16,
  },
  {
    id: 3,
    title: 'Alpine Kubb Masters',
    date: 'Aug 05, 2023',
    location: 'Lucerne, Switzerland',
    description: 'Experience Kubb with a mountain backdrop. This tournament combines competition with breathtaking views.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    registrationOpen: false,
    participants: 20,
    maxParticipants: 20,
  },
  {
    id: 4,
    title: 'Kubb Night Challenge',
    date: 'Sep 09, 2023',
    location: 'Basel, Switzerland',
    description: 'A unique tournament played under lights. Experience the thrill of Kubb after the sun goes down.',
    imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    registrationOpen: true,
    participants: 16,
    maxParticipants: 24,
  },
]

export default function TournamentsPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-20 sm:py-24 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Tournaments
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Browse upcoming Kubb tournaments, register your team, and join the fun. From beginner-friendly to competitive championships, we have events for every skill level.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/tournaments/create"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Organize a Tournament
              </Link>
              <Link href="#tournaments" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">
                View all tournaments <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament list */}
      <div id="tournaments" className="bg-white py-12 dark:bg-gray-950 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Upcoming Tournaments</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Join these exciting Kubb tournaments and test your skills against other players.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <article key={tournament.id} className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tournament.imageUrl}
                    alt={tournament.title}
                    className="h-full w-full object-cover"
                  />
                  {tournament.registrationOpen ? (
                    <div className="absolute top-2 right-2 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                      Registration Open
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                      Registration Closed
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white dark:bg-gray-900 p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={tournament.date} className="text-gray-500 dark:text-gray-400">
                        {tournament.date}
                      </time>
                    </div>
                    <div className="mt-4 block">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tournament.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                        {tournament.location}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                        {tournament.date}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UsersIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                        {tournament.participants} / {tournament.maxParticipants} Teams
                      </div>
                      <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                        {tournament.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/tournaments/${tournament.id}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400"
                    >
                      View Details
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 