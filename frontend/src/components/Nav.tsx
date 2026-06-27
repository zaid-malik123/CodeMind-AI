"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoLogOutOutline,
  IoCameraOutline,
} from "react-icons/io5";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AuthModal from "./AuthModal";

type propsType = {
  authModalOpen?: boolean;
  setAuthModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({ authModalOpen, setAuthModalOpen }: propsType) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside click handle karne ke liye (taaki bahar click karne pr menu close ho jaye)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {theme === "dark" ? (
                <IoSunnyOutline color="white" size={18} />
              ) : (
                <IoMoonOutline size={18} />
              )}
            </button>

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all"
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </button>

                {/* Framer Motion Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl z-50"
                    >
                      {/* User Info Section with Image Update */}
                      <div className="flex flex-col items-center border-b border-border pb-4 text-center">
                        <div className="relative group h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xl text-primary mb-2 overflow-hidden border border-border">
                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{user.name?.charAt(0).toUpperCase()}</span>
                          )}

                          {/* Hover Overlay for image upload */}
                          <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <IoCameraOutline size={18} />
                            <span>Update</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>

                        <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                          {user.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Actions */}
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            if (logout) logout();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium text-red-500"
                        >
                          <IoLogOutOutline size={18} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen?.(true)}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {!user && authModalOpen !== undefined && setAuthModalOpen && (
        <AuthModal
          authModalOpen={authModalOpen}
          setAuthModalOpen={setAuthModalOpen}
        />
      )}
    </>
  );
};

export default Nav;
