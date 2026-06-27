// frontend/src/app/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; 

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Nav />
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;