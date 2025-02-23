import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="px-4 py-8 xl:px-14">
      <div className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[75vh] bg-gradient-to-r from-[#f4f9f5] to-[#e6f4ec] rounded-xl shadow-lg overflow-hidden">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center gap-6 p-10 md:p-16"
        >
          <span className="inline-block rounded-full py-1 px-3 text-xs font-medium w-fit bg-[#febc26] text-gray-800">
            WEEKLY DISCOUNT
          </span>
          <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Elevate Your Tech Experience
          </h1>
          <p className="text-lg text-gray-600">
            Explore a premium collection of cutting-edge gadgets and
            accessories, available at unbeatable prices.
          </p>
          <Button
            className="px-6 py-3 text-lg font-medium transition-all shadow-md w-fit bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            asChild
          >
            <Link to="/shop">Shop Now</Link>
          </Button>
          {/* <Button
            className="px-6 py-3 text-lg font-medium transition-all w-fit bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 hover:shadow-xl hover:from-green-500 hover:to-blue-600"
            asChild
          >
            <Link to="/shop">Shop Now</Link>
          </Button> */}
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <img
            src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
            alt="Tech Products"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f4f9f5] opacity-20"></div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// function Hero() {
//   return (
//     <section className="px-8 py-8">
//       <div className="grid grid-cols-2 rounded-md min-h-[60vh] bg-[#f4f9f5]">
//         <div className="flex flex-col justify-center gap-4 p-16">
//           <span className="inline-block rounded-full py-1 px-2 text-xs w-fit bg-[#febc26]">
//             WEEKLY DISCOUNT
//           </span>
//           <h1 className="text-6xl font-semibold">
//             Premium Product Online Shop
//           </h1>
//           <p>
//             Discover an exclusive selection of premium products at unbeatable
//             weekly discounts. Shop now for the latest tech essentials designed
//             to elevate your experience!
//           </p>
//           <Button className="w-fit" asChild>
//             <Link to="/shop">Shop Now</Link>
//           </Button>
//         </div>
//         <div className="relative">
//           <img
//             src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
//             alt=""
//             className="object-cover w-full h-full"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;
