import Link from "next/link"
import { ArrowRight, Award, Calendar, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
                KubbZ Platform
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Manage Kubb Tournaments with Ease
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The premier platform for organizing, managing, and participating in Kubb tournaments. From registration to results, we&apos;ve got you covered.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/tournaments"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600"
                >
                  View Tournaments
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-blue-600 bg-white px-8 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:border-blue-400 dark:bg-gray-950 dark:text-blue-400 dark:hover:bg-gray-900 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-4 dark:from-blue-900/20 dark:to-blue-900/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-full w-full max-h-48 max-w-48 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M17.4 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M6.6 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M17.4 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M6.6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    <path d="M12 8v8"></path>
                    <path d="m9 9 6 6"></path>
                    <path d="m9 15 6-6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                KubbZ provides all the tools you need to run successful Kubb tournaments.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Tournament Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create, schedule, and manage tournaments with an intuitive dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Team Registration</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Seamless registration process for teams with secure payment options.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Rankings & Results</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track tournament results and maintain player/team rankings.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400"
            >
              Learn more about KubbZ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What is Kubb Section */}
      <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  What is Kubb?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Kubb (pronounced koob) is a traditional Swedish outdoor game where the objective is to knock over wooden blocks by throwing wooden batons at them.
                </p>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Often referred to as &quot;Viking chess,&quot; the game combines elements of bowling and horseshoes and can be played by people of all ages.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/learn"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600"
                >
                  Learn to Play
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="rounded-lg bg-gray-100 p-8 dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-bold">Basic Rules</h3>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Teams take turns throwing batons to knock over the opponent&apos;s kubbs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Kubbs that are knocked down are thrown to the opponent&apos;s half and stood up</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Team must knock down field kubbs before targeting baseline kubbs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>The king is knocked down last to win the game</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>If a team knocks down the king before all kubbs, they lose</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-24 bg-blue-600 dark:bg-blue-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Join the KubbZ Community
              </h2>
              <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today to join our growing community of Kubb enthusiasts, organize tournaments, and participate in events.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
