"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to refresh the session and get the latest user data
 * Call this after updating user data in the database
 */
export function useRefreshSession() {
  const { data: session, update } = useSession();

  const refreshSession = async () => {
    await update();
  };

  return { session, refreshSession };
}

