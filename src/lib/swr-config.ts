import { SWRConfiguration } from "swr";

// Centralized SWR configuration for consistent data fetching
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  keepPreviousData: true, // Show previous data while loading new data
  onError: (error, key) => {
    console.error("SWR Error:", {
      key,
      message: error.message,
      status: (error as any).status,
      details: (error as any).details,
      url: (error as any).url,
    });
  },
};

// Enhanced fetcher with better error handling
export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      // Add credentials for same-origin requests
      credentials: 'same-origin',
    });
    
    // Try to parse error response for more details
    if (!res.ok) {
      let errorMessage = res.statusText;
      let errorDetails: any = null;
      
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || res.statusText;
        errorDetails = errorData;
      } catch {
        // If JSON parsing fails, use status text
        const text = await res.text();
        if (text) {
          errorMessage = text;
        }
      }
      
      const error = new Error(`An error occurred while fetching the data: ${errorMessage}`);
      // @ts-ignore
      error.status = res.status;
      // @ts-ignore
      error.details = errorDetails;
      // @ts-ignore
      error.url = url;
      
      // Log detailed error (always log to help debug production issues)
      console.error('SWR Fetcher Error:', {
        url,
        status: res.status,
        statusText: res.statusText,
        error: errorMessage,
        details: errorDetails,
        environment: process.env.NODE_ENV,
      });
      
      throw error;
    }
    
    const data = await res.json();
    
    // Validate that we got valid data
    if (data === null || data === undefined) {
      throw new Error("Invalid data received from server");
    }
  
    return data;
  } catch (error: any) {
    // Re-throw with more context
    if (error.status) {
      throw error; // Already processed
    }
    
    // Network or other errors
    const enhancedError = new Error(`Network error: ${error.message}`);
    // @ts-ignore
    enhancedError.url = url;
    // @ts-ignore
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

// Safe array fetcher - ensures we always return an array
export const arrayFetcher = async (url: string) => {
  const data = await fetcher(url);
  return Array.isArray(data) ? data : [];
};

