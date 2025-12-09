export type UserRole = "admin" | "normal_user" | "store_owner";

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  owner?: User;
  createdAt: string;
  averageRating?: number;
  totalRatings?: number;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  user?: User;
  store?: Store;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}
