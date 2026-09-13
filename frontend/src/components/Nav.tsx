"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

import {
  IoMoonOutline,
  IoSunnyOutline,
  IoLogOutOutline,
  IoCameraOutline,
  IoMenuOutline,
} from "react-icons/io5";

import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import AuthModal from "./AuthModal";
import Image from "next/image";

type PropsType = {
  authModalOpen?: boolean;
  setAuthModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

interface NavProps {
  onMenuClick: () => void;
}

const Nav = ({
  authModalOpen,
  setAuthModalOpen,
  onMenuClick,
}: NavProps & PropsType) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside click handle karne ke liye
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">

          {/* ================= LEFT SECTION ================= */}
          <div className="flex items-center gap-2">

            {/* Hamburger - Mobile Only */}
            <button
              onClick={onMenuClick}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition hover:opacity-80 lg:hidden"
            >
              <IoMenuOutline size={24} />
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <Image
                src={
                  theme === "dark"
                    ? "/darkLogo1.png"
                    : "/lightLogo.png"
                }
                alt="CodeMind AI"
                width={180}
                height={60}
                className="h-12 w-auto object-contain lg:h-15"
                priority
              />
            </div>
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition hover:opacity-80"
            >
              {theme === "dark" ? (
                <IoSunnyOutline
                  color="white"
                  size={18}
                />
              ) : (
                <IoMoonOutline size={18} />
              )}
            </button>

            {/* ================= AUTH SECTION ================= */}

            {user ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                {/* Avatar Button */}
                <button
                  onClick={() =>
                    setDropdownOpen(!dropdownOpen)
                  }
                  aria-label="Open profile menu"
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-primary font-semibold text-primary-foreground transition-all hover:border-primary/50"
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {user.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </button>

                {/* ================= DROPDOWN ================= */}

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: 10,
                      }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
                      }}
                      className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl"
                    >

                      {/* User Info */}
                      <div className="flex flex-col items-center border-b border-border pb-4 text-center">

                        {/* Profile Image */}
                        <div className="group relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-xl font-bold text-primary">

                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {user.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>
                          )}

                          {/* Image Upload Overlay */}
                          <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">

                            <IoCameraOutline size={18} />

                            <span>
                              Update
                            </span>

                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Name */}
                        <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                          {user.name}
                        </h4>

                        {/* Email */}
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Actions */}
                      <div className="mt-3">

                        {/* Logout */}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);

                            if (logout) {
                              logout();
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-destructive/10"
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
              /* Login Button */
              <button
                onClick={() =>
                  setAuthModalOpen?.(true)
                }
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {!user &&
        authModalOpen !== undefined &&
        setAuthModalOpen && (
          <AuthModal
            authModalOpen={authModalOpen}
            setAuthModalOpen={setAuthModalOpen}
          />
        )}
    </>
  );
};

export default Nav;