import { Button } from "./components/ui/button";

function Hero() {
  return (
    <section className="p-8 mx-16">
      <div className="grid grid-cols-2 rounded-md min-h-[60vh] bg-[#f4f9f5]">
        <div className="flex flex-col justify-center gap-4 p-16">
          <span className="inline-block rounded-full py-1 px-2 text-xs w-fit bg-[#febc26]">
            WEEKLY DISCOUNT
          </span>
          <h1 className="text-6xl font-semibold">
            Premium Product Online Shop
          </h1>
          <p>
            Discover an exclusive selection of premium products at unbeatable
            weekly discounts. Shop now for quality items that enhance your
            everyday life!
          </p>
          <Button className="w-fit" asChild>
            <a href="/shop">Shop Now</a>
          </Button>
        </div>
        <div className="relative">
          <img
            src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
