import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; address: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - in production, this would come from Supabase
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "System Administrator Account",
    email: "admin@storerating.com",
    address: "123 Admin Street, Tech City, TC 12345",
    role: "admin",
    password: "Admin@123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Store Owner Demo Account",
    email: "owner@storerating.com",
    address: "456 Business Avenue, Commerce Town, CT 67890",
    role: "store_owner",
    password: "Owner@123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Normal User Demo Account",
    email: "user@storerating.com",
    address: "789 Customer Lane, Shopville, SV 11223",
    role: "normal_user",
    password: "User@1234",
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        return { success: true };
      }
      
      return { success: false, error: "Invalid email or password" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; address: string; password: string }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const existingUser = mockUsers.find((u) => u.email === data.email);
      if (existingUser) {
        return { success: false, error: "Email already registered" };
      }
      
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name: data.name,
        email: data.email,
        address: data.address,
        role: "normal_user",
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push({ ...newUser, password: data.password });
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("currentUser");
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const userIndex = mockUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
      }
      return { success: true };
    } catch {
      return { success: false, error: "Failed to update password" };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
