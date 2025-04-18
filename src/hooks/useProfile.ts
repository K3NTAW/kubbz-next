import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface ProfileStats {
  tournaments: number;
  matches: number;
  wins: number;
  ranking: number;
}

interface ProfileSocial {
  github: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  location: string;
  company: string;
  website: string;
  joinedAt: Date;
  bio: string;
  stats: ProfileStats;
  social: ProfileSocial;
}

export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch('/api/users/profile', data);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setProfile(null);
      setIsLoading(false);
    }
  }, [status, session]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile
  };
} 