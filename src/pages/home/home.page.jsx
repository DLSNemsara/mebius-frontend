import Hero from "./components/Hero";
import Products from "./components/Products";
import { motion } from "framer-motion";
import { Shield, Truck, RefreshCcw, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% secure payment processing with encryption",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on all orders above $50",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
    },
  ];

  return (
    <main className="relative">
      <Hero />

      {/* Features Section */}
      <motion.section
        className="py-16 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 text-center bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Products />
      </motion.div>

      {/* CTA Section */}
      <motion.section
        className="overflow-hidden relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.h2
            className="mb-6 text-4xl font-bold text-white md:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Upgrade Your Tech?
          </motion.h2>
          <motion.p
            className="mx-auto mb-8 max-w-2xl text-xl text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers and discover the latest in
            technology innovation.
          </motion.p>
          <motion.div
            className="flex flex-col gap-4 justify-center items-center sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="px-8 py-4 font-semibold text-blue-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
                asChild
              >
                <Link to="/shop">Explore Products</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="px-8 py-4 font-semibold text-white bg-transparent rounded-full border-2 border-white transition-all duration-300 hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

export default HomePage;
