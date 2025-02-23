import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function TermsOfService() {
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <Link
            to="/shop"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to shop
          </Link>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Mebius. These terms and conditions outline the rules
              and regulations for the use of our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2>2. Orders and Payments</h2>
            <p>
              By placing an order through our website, you agree to the
              following:
            </p>
            <ul>
              <li>All orders are subject to product availability</li>
              <li>Cash on Delivery (COD) is our primary payment method</li>
              <li>Prices are listed in USD and are subject to change</li>
              <li>Order confirmation will be sent via email</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>3. Shipping and Delivery</h2>
            <p>Our delivery policy includes:</p>
            <ul>
              <li>Free standard shipping on all orders</li>
              <li>Delivery within 3-5 business days</li>
              <li>Delivery confirmation required upon receipt</li>
              <li>Tracking information provided via email</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>4. Returns and Refunds</h2>
            <p>Our return policy:</p>
            <ul>
              <li>7-day return window from delivery date</li>
              <li>Items must be unused and in original packaging</li>
              <li>Refunds processed within 5-7 business days</li>
              <li>Damaged items must be reported within 24 hours</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>5. Privacy and Data Protection</h2>
            <p>We are committed to protecting your privacy:</p>
            <ul>
              <li>Personal information is securely stored</li>
              <li>Data is never shared with third parties</li>
              <li>Payment information is encrypted</li>
              <li>You can request your data deletion anytime</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>6. Product Information</h2>
            <p>About our products:</p>
            <ul>
              <li>All product descriptions are accurate and up-to-date</li>
              <li>Images are representative of actual products</li>
              <li>Stock availability is updated regularly</li>
              <li>Prices include all applicable taxes</li>
            </ul>
          </section>

          <section>
            <h2>7. Contact Information</h2>
            <p>For any questions or concerns:</p>
            <ul>
              <li>Email: support@mebius.com</li>
              <li>Phone: +94 70 270 0100</li>
              <li>Business Hours: Monday-Friday, 9:00 AM - 5:00 PM</li>
              <li>Address: Colombo, Sri Lanka</li>
            </ul>
          </section>

          <section className="p-4 mt-8 bg-gray-100 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              By using our services, you agree to these terms and conditions. We
              reserve the right to update these terms at any time without
              notice.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default TermsOfService;
