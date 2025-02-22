import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import CartPage from "./pages/cart.page.jsx";
import AccountPage from "./pages/account.page";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import RootLayout from "./layouts/root.layout";
import CheckoutPage from "./pages/checkout.page";
import PaymentPage from "./pages/payment.page";
import CompletePage from "./pages/complete.page";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop/cart" element={<CartPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/shop/checkout" element={<CheckoutPage />} />
            <Route path="/shop/payment" element={<PaymentPage />} />
            <Route path="/shop/complete" element={<CompletePage />} />
          </Route>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ClerkProvider>
  // </StrictMode>
);
