// src/context/AuthContext.tsx

"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

import { IUser } from "@/types/user.types";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await authService.getMe();

        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
