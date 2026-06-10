import React from "react";
import Nav from "./Nav";
import Landing from "./Landing";
import ExampleQuestions from "./ExampleQuestions";
import Footer from "./Footer";

const PublicHome = () => {
  return (
    <div>
      <Nav />
      <Landing />
      <ExampleQuestions />
      <Footer />
    </div>
  );
};

export default PublicHome;
