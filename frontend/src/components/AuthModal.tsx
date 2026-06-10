"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

type ActiveModalType = "login" | "signup";

type PropsType = {
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModal = ({
  authModalOpen,
  setAuthModalOpen,
}: PropsType) => {
  const [activeModal, setActiveModal] =
    useState<ActiveModalType>("login");

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IoClose size={22} />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-card-foreground">
                {activeModal === "login"
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {activeModal === "login"
                  ? "Sign in to continue"
                  : "Create your account to get started"}
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex rounded-xl bg-muted p-1">
              <button
                onClick={() =>
                  setActiveModal("login")
                }
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  activeModal === "login"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>

              <button
                onClick={() =>
                  setActiveModal("signup")
                }
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  activeModal === "signup"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {activeModal === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />

              {activeModal === "login" && (
                <div className="flex justify-end">
                  <button className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                {activeModal === "login"
                  ? "Login"
                  : "Create Account"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Button */}
            <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 font-medium text-foreground transition-colors hover:bg-muted">
              <FcGoogle size={22} />
              Continue with Google
            </button>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {activeModal === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() =>
                  setActiveModal(
                    activeModal === "login"
                      ? "signup"
                      : "login"
                  )
                }
                className="ml-2 font-semibold text-primary hover:underline"
              >
                {activeModal === "login"
                  ? "Sign Up"
                  : "Login"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;