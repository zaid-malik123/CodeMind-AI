"use client";
import React, { useState } from "react";

type activeModalType = "login" | "signup";

type propsType = {
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModal = ({ authModalOpen, setAuthModalOpen }: propsType) => {
  const [activeModal, setActiveModal] = useState<activeModalType>("login");

  return <>{activeModal === "login" ? <div className="w-full h-full  bg-black/60 fixed inset-0 z-50 backdrop-blur-sm">

  </div> : <div>
    </div>}</>;
};

export default AuthModal;
