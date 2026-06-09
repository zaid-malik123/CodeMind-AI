import ExampleQuestions from "@/components/ExampleQuestions";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav";
import React from "react";

const page = () => {
  return <div>
    <Nav/>
    <Landing /> 
    <ExampleQuestions />
    <Footer />
  </div>;
};

export default page;
