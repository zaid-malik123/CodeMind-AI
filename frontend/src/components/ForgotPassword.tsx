import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";

type ActiveModalType = "login" | "signup" | "forgot-password";

type PropsType = {
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModalType>>;
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForgotPassword = ({
  setActiveModal,
  authModalOpen,
  setAuthModalOpen,
}: PropsType) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onClose = () => {
    setAuthModalOpen(false);
    setActiveModal("login");
    setStep(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] == "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedValue = e.clipboardData.getData("text");

    const cleanedText = pastedValue.replace(/\D/g, "");

    const pastedOtp = cleanedText.split("");

    const otpArray = pastedOtp.slice(0, 6);

    const newOtp = [...otp];

    otpArray.forEach((dig, idx) => {
      newOtp[idx] = dig;
    });

    setOtp(newOtp);

    if (otpArray.length > 0) {
      inputRefs.current[Math.min(otpArray.length, 6) - 1]?.focus();
    }
  };

  useEffect(() => {
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

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
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IoClose size={24} />
              </button>

              {/* Back */}
              {step !== 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="absolute left-4 top-4 rounded-full p-2 hover:bg-muted"
                >
                  <IoArrowBack size={20} />
                </button>
              )}

              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-card-foreground">
                  Forgot Password
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {step === 1 &&
                    "Enter your email to receive a verification code."}

                  {step === 2 && "Enter the 6-digit OTP sent to your email."}

                  {step === 3 && "Create a strong new password."}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8 flex gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      item <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                  />

                  <button
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: 6 }).map((_, index: number) => (
                      <input
                        onChange={(e) => handleChange(e, index)}
                        key={index}
                        maxLength={1}
                        className="h-12 w-12 rounded-xl border border-border bg-background text-center text-lg outline-none focus:border-primary"
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        value={otp[index]}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
                  >
                    Verify OTP
                  </button>

                  <button className="w-full text-sm text-primary hover:underline">
                    Resend OTP
                  </button>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                  />

                  <button className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">
                    Reset Password
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default ForgotPassword;
