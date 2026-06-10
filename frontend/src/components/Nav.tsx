"use client";

import Link from "next/link";
// import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";

type propsType = {
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

const Nav = ({authModalOpen, setAuthModalOpen}: propsType) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter()

  return (
    <>
    
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            C
          </div>

          <span className="text-lg">CodeMind AI</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition hover:opacity-80"
          >
            
            {theme === "dark" ? <IoSunnyOutline color="white" size={18} /> : <IoMoonOutline size={18} />}
          </button>

          {/* Auth */}
          {user ? (
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
              {user.name?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>

    <AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} />
    </>


  );
};

export default Nav;