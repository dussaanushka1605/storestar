import React, { createContext, useContext, useState, useCallback } from "react";
import { Store, Rating, User, DashboardStats } from "@/types";

interface DataContextType {
  stores: Store[];
  ratings: Rating[];
  users: User[];
  stats: DashboardStats;
  addStore: (store: Omit<Store, "id" | "createdAt">) => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  addRating: (rating: Omit<Rating, "id" | "createdAt">) => void;
  updateRating: (ratingId: string, newRating: number) => void;
  getUserRating: (userId: string, storeId: string) => Rating | undefined;
  getStoreRatings: (storeId: string) => Rating[];
  getStoresByOwner: (ownerId: string) => Store[];
  getStoreAverageRating: (storeId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialUsers: User[] = [
  {
    id: "1",
    name: "System Administrator Account",
    email: "admin@storerating.com",
    address: "123 Admin Street, Tech City, TC 12345",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Store Owner Demo Account",
    email: "owner@storerating.com",
    address: "456 Business Avenue, Commerce Town, CT 67890",
    role: "store_owner",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Normal User Demo Account",
    email: "user@storerating.com",
    address: "789 Customer Lane, Shopville, SV 11223",
    role: "normal_user",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Another Normal User Account",
    email: "user2@storerating.com",
    address: "321 Buyer Road, Purchase City, PC 44556",
    role: "normal_user",
    createdAt: new Date().toISOString(),
  },
];

const initialStores: Store[] = [
  {
    id: "1",
    name: "Premium Electronics Store",
    address: "100 Tech Boulevard, Digital City, DC 10001",
    ownerId: "2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Organic Foods Marketplace",
    address: "200 Green Avenue, Healthy Town, HT 20002",
    ownerId: "2",
    createdAt: new Date().toISOString(),
  },
];

const initialRatings: Rating[] = [
  {
    id: "1",
    userId: "3",
    storeId: "1",
    rating: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "4",
    storeId: "1",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "3",
    storeId: "2",
    rating: 3,
    createdAt: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const stats: DashboardStats = {
    totalUsers: users.length,
    totalStores: stores.length,
    totalRatings: ratings.length,
  };

  const addStore = useCallback((store: Omit<Store, "id" | "createdAt">) => {
    const newStore: Store = {
      ...store,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setStores((prev) => [...prev, newStore]);
  }, []);

  const addUser = useCallback((user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  const addRating = useCallback((rating: Omit<Rating, "id" | "createdAt">) => {
    const newRating: Rating = {
      ...rating,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setRatings((prev) => [...prev, newRating]);
  }, []);

  const updateRating = useCallback((ratingId: string, newRating: number) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === ratingId ? { ...r, rating: newRating } : r))
    );
  }, []);

  const getUserRating = useCallback(
    (userId: string, storeId: string) => {
      return ratings.find((r) => r.userId === userId && r.storeId === storeId);
    },
    [ratings]
  );

  const getStoreRatings = useCallback(
    (storeId: string) => {
      return ratings
        .filter((r) => r.storeId === storeId)
        .map((r) => ({
          ...r,
          user: users.find((u) => u.id === r.userId),
        }));
    },
    [ratings, users]
  );

  const getStoresByOwner = useCallback(
    (ownerId: string) => {
      return stores.filter((s) => s.ownerId === ownerId);
    },
    [stores]
  );

  const getStoreAverageRating = useCallback(
    (storeId: string) => {
      const storeRatings = ratings.filter((r) => r.storeId === storeId);
      if (storeRatings.length === 0) return 0;
      const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
      return sum / storeRatings.length;
    },
    [ratings]
  );

  return (
    <DataContext.Provider
      value={{
        stores,
        ratings,
        users,
        stats,
        addStore,
        addUser,
        addRating,
        updateRating,
        getUserRating,
        getStoreRatings,
        getStoresByOwner,
        getStoreAverageRating,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
