// Authentication API functions

// Helper function to get the backend URL
const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.warn('NEXT_PUBLIC_BACKEND_URL not defined in environment variables');
    return 'http://localhost:5000/api'; // Fallback URL
  }
  return backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
};

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  role: 'user' | 'admin';
  phone?: string;
  isVerified: boolean;
  interests?: string[];
  badges?: string[];
  points: number;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  followedIncidents?: string[];
  reportedIncidents?: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export async function loginUser(identifier: string, password: string): Promise<AuthResponse> {
  const url = `${getBackendUrl()}/auth/login`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: identifier,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(userData: {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  location: string;
  cnic: string;
}): Promise<AuthResponse> {
  const url = `${getBackendUrl()}/auth/register`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register user');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function forgotPassword(cnic: string): Promise<{ success: boolean; message: string }> {
  const url = `${getBackendUrl()}/auth/forgot-password/user`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cnic,
        redirectUrl: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : ''
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to process forgot password request');
    }

    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  const url = `${getBackendUrl()}/auth/reset-password/${token}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        password, 
        confirmPassword 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

// Auth utility functions
export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("auth_token", token);
    
    // Also save it as a cookie for middleware
    document.cookie = `auth_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function saveUserData(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getUserData(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    
    // Also clear the cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
} 