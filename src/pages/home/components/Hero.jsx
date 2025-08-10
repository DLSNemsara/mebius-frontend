import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Local hero image - much faster loading
  const heroImageUrl = "/hero.jpg";
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="overflow-hidden relative px-4 py-12 xl:px-14">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute left-10 top-20 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute right-10 bottom-20 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-xl opacity-15"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25 blur-lg"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[80vh] bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex relative z-10 flex-col gap-8 justify-center p-10 md:p-16"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="inline-flex gap-2 items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
              variants={pulseVariants}
              animate="animate"
            >
              <Zap className="w-4 h-4" />
              WEEKLY DISCOUNT
            </motion.span>
          </motion.div>

          {/* Animated Title */}
          <motion.h1
            className="text-5xl font-bold leading-tight text-gray-900 md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
              Elevate Your{" "}
            </span>
            <motion.span
              className="inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Tech
              <motion.div
                className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
              Experience
            </span>
          </motion.h1>

          {/* Animated Description */}
          <motion.p
            className="text-xl leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Explore a premium collection of cutting-edge gadgets and
            accessories, available at{" "}
            <span className="font-semibold text-blue-600">
              unbeatable prices
            </span>
            .
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex gap-6 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50K+</div>
              <div className="text-sm text-gray-500">Happy Customers</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.9★</div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
          </motion.div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl transition-all duration-300 group hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl w-fit"
              asChild
            >
              <Link to="/shop" className="flex gap-2 items-center">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative h-full min-h-[600px] perspective-1000"
        >
          {/* Image Container with 3D Effect */}
          <div className="overflow-hidden relative h-full rounded-2xl transform-gpu">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
            )}

            <motion.img
              src={heroImageUrl}
              alt="Tech Products"
              className={`object-cover object-center w-full h-full transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onLoad={() => setImageLoaded(true)}
              loading="eager"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

            {/* Floating Product Cards */}
            <motion.div
              className="absolute top-8 right-8 p-4 rounded-xl border shadow-lg backdrop-blur-sm bg-white/90 border-white/20"
              variants={floatingVariants}
              animate="animate"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">
                  50+ New Arrivals
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-8 p-4 rounded-xl border shadow-lg backdrop-blur-sm bg-white/90 border-white/20"
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: "1.5s" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Free Shipping
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
