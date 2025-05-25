"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  getUserData, 
  saveUserData, 
  getAuthToken, 
  saveAuthToken, 
  clearAuth,
  isAuthenticated as checkIsAuthenticated
} from "./auth";

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const initAuth = () => {
      try {
        const userData = getUserData();
        if (userData && getAuthToken()) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    saveUserData(userData);
    saveAuthToken(token);
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  const value = {
    user,
    isAuthenticated: checkIsAuthenticated(),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 