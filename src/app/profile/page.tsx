"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, CalendarDays, MapPin, Building } from 'lucide-react'
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { useProfile } from '@/hooks/useProfile'

export default function ProfilePage() {
  const { status: authStatus } = useSession()
  const router = useRouter()
  const { profile, isLoading, error } = useProfile()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [authStatus, router])

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-800 dark:text-red-200">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="mt-2 text-sm">{error}</p>
          <button 
            onClick={() => router.refresh()}
            className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
          <h3 className="text-lg font-medium">Profile not found</h3>
          <p className="mt-2 text-sm">Your profile information could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16">
      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-800 h-32 sm:h-40"></div>
        <div className="px-4 py-5 sm:px-6 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end sm:space-x-5">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-4xl">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="mt-6 sm:mt-0 sm:flex-1 min-w-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {profile.name}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.bio}
            </p>
          </div>
          <div className="mt-6 sm:mt-0 flex-shrink-0">
            <Link
              href="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        
        {/* Profile details */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <dt className="mr-2">
                <Mail className="h-5 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm text-gray-700 dark:text-gray-300">
                {profile.email}
              </dd>
            </div>
            {profile.location && (
              <div className="flex items-center">
                <dt className="mr-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </dt>
                <dd className="text-sm text-gray-700 dark:text-gray-300">
                  {profile.location}
                </dd>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center">
                <dt className="mr-2">
                  <Building className="h-5 w-5 text-gray-400" />
                </dt>
                <dd className="text-sm text-gray-700 dark:text-gray-300">
                  {profile.company}
                </dd>
              </div>
            )}
            <div className="flex items-center">
              <dt className="mr-2">
                <CalendarDays className="h-5 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm text-gray-700 dark:text-gray-300">
                Joined {new Date(profile.joinedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Social links */}
        {profile.social && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <div className="flex space-x-4">
              {profile.social.github && (
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaGithub className="h-6 w-6" />
                </a>
              )}
              {profile.social.twitter && (
                <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaTwitter className="h-6 w-6" />
                </a>
              )}
              {profile.social.linkedin && (
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaLinkedin className="h-6 w-6" />
                </a>
              )}
              {profile.social.instagram && (
                <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaInstagram className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'tournaments'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'achievements'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Player Stats</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournaments</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{profile.stats.tournaments}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Matches</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{profile.stats.matches}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Wins</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{profile.stats.wins}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ranking</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">#{profile.stats.ranking}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No recent activity to display.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tournaments</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your tournament history and upcoming events.
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No tournaments to display yet.
                </p>
                <Link 
                  href="/tournaments" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Tournaments
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Achievements</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Badges and milestones you&apos;ve earned.
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No achievements yet. Join tournaments to earn badges!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your account settings and preferences.
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <Link 
                href="/settings" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 