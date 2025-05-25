import { createClient } from '@supabase/supabase-js';

// Enhanced Supabase client with retry logic and timeout handling
export function createSupabaseWithRetry(options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 8000, // 8 second timeout
    useServiceRole = false
  } = options;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = useServiceRole 
    ? process.env.SUPABASE_SERVICE_ROLE_KEY 
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: !useServiceRole,
      persistSession: !useServiceRole
    },
    global: {
      fetch: createFetchWithRetry({ maxRetries, retryDelay, timeout })
    }
  });

  return client;
}

// Enhanced fetch with retry logic and timeout
function createFetchWithRetry({ maxRetries, retryDelay, timeout }) {
  return async function fetchWithRetry(url, options = {}) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout to the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // If the request was successful, return the response
        if (response.ok || response.status < 500) {
          return response;
        }

        // If it's a server error (5xx), retry
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        lastError = error;
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry on client errors (4xx) or abort errors from user cancellation
        if (error.name === 'AbortError' && error.message !== 'This operation was aborted') {
          // This is a timeout, so we should retry
          console.warn(`Request timeout (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
        } else if (error.message && error.message.includes('4')) {
          // Client error, don't retry
          throw error;
        } else {
          console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
        }

        // Wait before retrying with exponential backoff
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  };
}

// Utility function to execute Supabase queries with retry logic
export async function executeWithRetry(queryFn, options = {}) {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();
      
      if (result.error) {
        // If it's a network/connection error, retry
        if (result.error.message && (
          result.error.message.includes('fetch') ||
          result.error.message.includes('network') ||
          result.error.message.includes('timeout') ||
          result.error.message.includes('connect')
        )) {
          throw new Error(result.error.message);
        }
        
        // For other Supabase errors, don't retry
        return result;
      }

      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      console.warn(`Query failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
      
      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
