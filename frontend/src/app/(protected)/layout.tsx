"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

const HomeLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="ml-0 flex-1 lg:ml-72">

        {/* Navbar */}
        <Nav
          onMenuClick={() => setSidebarOpen(true)}
        />

        {children}
      </div>
    </div>
  );
};

export default HomeLayout;