import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoArrowBack, IoClose, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordEmailSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "@/validation/auth.validation";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import axios from "axios";

type ActiveModalType = "login" | "signup" | "forgot-password";

type PropsType = {
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModalType>>;
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type EmailFormValues = z.infer<typeof forgotPasswordEmailSchema>;
type OtpFormValues = z.infer<typeof verifyOtpSchema>;
type PasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = ({
  setActiveModal,
  authModalOpen,
  setAuthModalOpen,
}: PropsType) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    setError,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    setValue,
    clearErrors,
    setError: setOtpError,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    setError: setResetPasswordError,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onClose = () => {
    setAuthModalOpen(false);
    setActiveModal("login");
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setEmail("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const fullOtpString = newOtp.join("");
    setValue("otp", fullOtpString);

    if (fullOtpString.length === 6) {
      clearErrors("otp");
    }

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      setValue("otp", newOtp.join(""));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text");
    const cleanedText = pastedValue.replace(/\D/g, "");
    const otpArray = cleanedText.split("").slice(0, 6);

    const newOtp = ["", "", "", "", "", ""];
    otpArray.forEach((dig, idx) => {
      newOtp[idx] = dig;
    });

    setOtp(newOtp);
    const fullOtpString = newOtp.join("");
    setValue("otp", fullOtpString);
    clearErrors("otp");

    if (otpArray.length > 0) {
      inputRefs.current[Math.min(otpArray.length, 6) - 1]?.focus();
    }
  };

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  const onEmailSubmit = async (data: EmailFormValues) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      setLoading(false);
      setEmail(data.email);
      setStep(2);
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError("email", {
          message: error.response?.data.message,
        });
      } else {
        console.log("Something went wrong");
      }
    }
  };

  const onOtpSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      await authService.verifyOtp({
        ...data,
        email,
      });
      setLoading(false);
      setStep(3);
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setOtpError("otp", {
          message: error.response?.data.message,
        });
      } else {
        console.log("Something went wrong");
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    try {
      await authService.resetPassword(email, data.password);
      setLoading(false);
      setActiveModal("login");
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setResetPasswordError("password", {
          message: error.response?.data.message,
        });
      }
    }
  };

  return (
    <>
      {authModalOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IoClose size={24} />
              </button>

              {/* Back Button */}
              {step !== 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="absolute left-4 top-4 rounded-full p-2 hover:bg-muted text-muted-foreground"
                >
                  <IoArrowBack size={20} />
                </button>
              )}

              {/* Header */}
              <div className="mb-8 text-center mt-2">
                <h2 className="text-3xl font-bold text-card-foreground">
                  Forgot Password
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step === 1 && "Enter your email to receive a verification code."}
                  {step === 2 && "Enter the 6-digit OTP sent to your email."}
                  {step === 3 && "Create a strong new password."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 flex gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-2 flex-1 rounded-full transition-all duration-3xl ${
                      item <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* --- STEP 1: EMAIL --- */}
              {step === 1 && (
                <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <input
                        {...emailRegister("email")}
                        type="email"
                        placeholder="Email Address"
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none focus:border-primary transition-all ${
                          emailErrors.email
                            ? "border-destructive focus:border-destructive"
                            : "border-border"
                        }`}
                      />
                      {emailErrors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {emailErrors.email.message as string}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* --- STEP 2: OTP --- */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
                  <div className="space-y-5">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, index: number) => (
                          <input
                            key={index}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            value={otp[index]}
                            maxLength={1}
                            ref={(element) => {
                              inputRefs.current[index] = element;
                            }}
                            className={`h-12 w-12 rounded-xl border text-center text-lg font-semibold bg-background text-foreground outline-none focus:border-primary transition-all ${
                              otpErrors.otp
                                ? "border-destructive focus:border-destructive"
                                : "border-border"
                            }`}
                          />
                        ))}
                      </div>
                      {otpErrors.otp && (
                        <p className="text-xs text-red-500 mt-1">
                          {otpErrors.otp.message as string}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <button
                      type="button"
                      className="w-full text-sm text-primary hover:underline block text-center"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}

              {/* --- STEP 3: RESET PASSWORD --- */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <div className="relative flex items-center">
                        <input
                          {...passwordRegister("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          className={`w-full rounded-xl border bg-background pl-4 pr-12 py-3 text-foreground outline-none focus:border-primary transition-all ${
                            passwordErrors.password
                              ? "border-destructive focus:border-destructive"
                              : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                      </div>
                      {passwordErrors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          {passwordErrors.password.message as string}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative flex items-center">
                        <input
                          {...passwordRegister("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className={`w-full rounded-xl border bg-background pl-4 pr-12 py-3 text-foreground outline-none focus:border-primary transition-all ${
                            passwordErrors.confirmPassword
                              ? "border-destructive focus:border-destructive"
                              : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          {passwordErrors.confirmPassword.message as string}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default ForgotPassword;