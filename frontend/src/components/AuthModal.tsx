"use client";
import React, { useState } from "react";

type activeModalType = "login" | "signup";

type propsType = {
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModal = ({
  authModalOpen,
  setAuthModalOpen,
}: propsType) => {
  const [activeModal, setActiveModal] =
    useState<activeModalType>("login");

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      {activeModal === "login" ? (
        <div>
          Login Modal
        </div>
      ) : (
        <div>
          Signup Modal
        </div>
      )}
    </div>
  );
};

export default AuthModal;