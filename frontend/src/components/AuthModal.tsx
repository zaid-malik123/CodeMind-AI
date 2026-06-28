"use client";

import React, { useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { authService } from "@/services/auth.service";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react"; // Loader imported

type ActiveModalType = "login" | "signup" | "forgot-password";

type PropsType = {
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface formData {
  name?: string;
  email: string;
  password: string;
}

const AuthModal = ({ authModalOpen, setAuthModalOpen }: PropsType) => {
  const [activeModal, setActiveModal] = useState<ActiveModalType>("login");
  const { setUser } = useContext(AuthContext)!;
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const schema = activeModal === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<formData>({
    resolver: zodResolver(schema),
  });

  // Centralized close function to keep UI state predictable and high-performing
  const closeModal = () => {
    setAuthModalOpen(false);
    setServerError("");
    reset();
    setActiveModal("login");
  };

  const submit = async (data: formData) => {
    setServerError(""); 

    if (activeModal === "login") {
      try {
        const res = await authService.login(data);
        setUser(res.data);
        closeModal(); // Central function used
        router.push("/dashboard");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setServerError(
            error.response?.data.message || "Login failed. Please try again.",
          );
        } else {
          setServerError("Something went wrong");
        }
      }
    } else {
      try {
        const res = await authService.register(data);
        setUser(res.data);
        closeModal(); // Central function used
        router.push("/dashboard");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setServerError(
            error.response?.data.message || "Registration failed. Please try again.",
          );
        } else {
          setServerError("Something went wrong");
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    setServerError("");
    try {
      const res = await signInWithPopup(auth, provider);
      const name = res.user.displayName;
      const email = res.user.email;
      const imageUrl = res.user.photoURL;

      const payload = { name, email, imageUrl };

      if (payload) {
        const res = await authService.google(payload);
        setUser(res.data);
        closeModal(); // Central function used
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message || "Google sign-in failed.",
        );
      } else {
        setServerError("Google authentication failed.");
      }
    }
  };

  return (
    <>
      {activeModal === "forgot-password" && (
        <ForgotPassword
          setActiveModal={setActiveModal}
          authModalOpen={authModalOpen}
          setAuthModalOpen={setAuthModalOpen}
        />
      )}

      {activeModal !== "forgot-password" && (
        <AnimatePresence>
          {authModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal} // Background click optimized
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={closeModal} // Icon click optimized
                  className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <IoClose size={22} />
                </button>

                {/* Header */}
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-card-foreground">
                    {activeModal === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {activeModal === "login" ? "Sign in to continue" : "Create your account to get started"}
                  </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("login");
                      reset();
                      setServerError("");
                    }}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      activeModal === "login"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("signup");
                      reset();
                      setServerError("");
                    }}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      activeModal === "signup"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* SERVER ERROR DISPLAY */}
                {serverError && (
                  <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-500 font-medium">
                    {serverError.charAt(0).toUpperCase() + serverError.slice(1)}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                  {activeModal === "signup" && (
                    <div>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email Address"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {activeModal === "login" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveModal("forgot-password")}
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button with Loader */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : activeModal === "login" ? (
                      "Login"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </button>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  {activeModal === "login" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal(activeModal === "login" ? "signup" : "login")
                    }
                    className="ml-2 font-semibold text-primary hover:underline"
                  >
                    {activeModal === "login" ? "Sign Up" : "Login"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default AuthModal;