import { getAuthToken } from './auth';

// Helper function to get the backend URL
const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.warn('NEXT_PUBLIC_BACKEND_URL not defined in environment variables');
    return 'http://localhost:5000/api'; // Fallback URL
  }
  return backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
};

// Generic fetch function with authentication
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${getBackendUrl()}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error(`API error for ${endpoint}:`, error);
    throw error;
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string) => fetchWithAuth<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: any) => 
    fetchWithAuth<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: <T>(endpoint: string, data: any) => 
    fetchWithAuth<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  patch: <T>(endpoint: string, data: any) => 
    fetchWithAuth<T>(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
  
  delete: <T>(endpoint: string) => 
    fetchWithAuth<T>(endpoint, { method: 'DELETE' }),
}; 