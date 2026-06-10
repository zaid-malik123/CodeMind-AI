"use client"
import Nav from "./Nav";
import Landing from "./Landing";
import ExampleQuestions from "./ExampleQuestions";
import Footer from "./Footer";
import { useState } from "react";



const PublicHome = () => {
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)

  return (
    <div>
      <Nav authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} />
      <Landing />
      <ExampleQuestions />
      <Footer />
    </div>
  );
};

export default PublicHome;
