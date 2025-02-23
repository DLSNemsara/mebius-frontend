import Hero from "./components/Hero";
import Products from "./components/Products";
import { useState } from "react";
import { useSelector } from "react-redux";

function HomePage() {
  return (
    <main>
      <Hero />
      <Products />
    </main>
  );
}

export default HomePage;
