import { SWRConfiguration } from "swr";

// Centralized SWR configuration for consistent data fetching
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  keepPreviousData: true, // Show previous data while loading new data
  onError: (error) => {
    console.error("SWR Error:", error);
  },
};

// Enhanced fetcher with better error handling
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error(`An error occurred while fetching the data: ${res.statusText}`);
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  
  const data = await res.json();
  
  // Validate that we got valid data
  if (data === null || data === undefined) {
    throw new Error("Invalid data received from server");
  }
  
  return data;
};

// Safe array fetcher - ensures we always return an array
export const arrayFetcher = async (url: string) => {
  const data = await fetcher(url);
  return Array.isArray(data) ? data : [];
};

