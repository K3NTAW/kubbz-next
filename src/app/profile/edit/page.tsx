"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { useProfile } from '@/hooks/useProfile'

export default function EditProfilePage() {
  const { status: authStatus } = useSession()
  const router = useRouter()
  const { profile, isLoading, error, updateProfile } = useProfile()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    company: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  })

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login')
    }

    // Set form data when profile is loaded
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        company: profile.company || '',
        website: profile.website || '',
        github: profile.social?.github || '',
        twitter: profile.social?.twitter || '',
        linkedin: profile.social?.linkedin || '',
        instagram: profile.social?.instagram || ''
      })
    }
  }, [authStatus, router, profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      // Format form data for API
      const updatedProfile = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        company: formData.company,
        website: formData.website,
        social: {
          github: formData.github,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram
        }
      }

      await updateProfile(updatedProfile)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

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
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Profile</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              This information will be displayed publicly so be careful what you share.
            </p>
            
            {profile.image && (
              <div className="mt-6">
                <div className="relative h-40 w-40 rounded-lg overflow-hidden">
                  <Image
                    src={profile.image}
                    alt={profile.name || 'Profile'}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Change avatar
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
                {message && (
                  <div className={`rounded-md p-4 ${
                    message.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                      : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Social Links</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Connect your social accounts.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="github" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaGithub className="h-5 w-5 mr-2" /> 
                      GitHub
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="github"
                        id="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="twitter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaTwitter className="h-5 w-5 mr-2" /> 
                      Twitter
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="twitter"
                        id="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaLinkedin className="h-5 w-5 mr-2" /> 
                      LinkedIn
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="linkedin"
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instagram" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FaInstagram className="h-5 w-5 mr-2" /> 
                      Instagram
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="instagram"
                        id="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 flex justify-end space-x-3">
                <Link
                  href="/profile"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 