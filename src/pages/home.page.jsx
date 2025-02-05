import Hero from "./../Hero";
import Navbar from "./../Navbar";
import Products from "./../Products";

function HomePage() {
  const name = null;
  const cartCount = 0;

  return (
    <div>
      <Navbar name={name} cartCount={cartCount} />
      <Hero />
      <Products />
    </div>
  );
}

export default HomePage;
