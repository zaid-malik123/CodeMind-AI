// frontend/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PublicHome from "@/components/PublicHome";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="min-h-screen w-full relative">
      <PublicHome />
    </div>
  );
}