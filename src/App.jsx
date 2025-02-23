import Hero from "./pages/home/components/Hero";
import Navbar from "./components/Navbar";
import Products from "./pages/home/components/Products";

function App() {
  const name = "Sinel Nemsara";
  const cartCount = 0;

  return (
    <div>
      <Navbar name={name} cartCount={cartCount} />
      <Hero />
      <Products />
    </div>
  );
}

export default App;
