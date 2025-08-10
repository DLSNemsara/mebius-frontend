import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/home.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import CartPage from "./pages/cart.page.jsx";
import AccountPage from "./pages/account.page";
import OrdersPage from "./pages/orders.page.jsx";
import AboutPage from "./pages/about.page.jsx";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import MainLayout from "./layouts/main.layout";
import RootLayout from "./layouts/rootLayout/root.layout";
import CheckoutPage from "./pages/checkout.page";
import PaymentPage from "./pages/payment.page";
import PaymentSuccessPage from "./pages/payment-success.page.jsx";
import CompletePage from "./pages/complete.page";
import AdminProductCreatePage from "./pages/admin-product-create.page";
import AdminDashboardPage from "./pages/admin-dashboard.page";
import AdminProductsManagePage from "./pages/admin-products-manage.page";
import AdminProductEditPage from "./pages/admin-product-edit.page";
import AdminCategoriesManagePage from "./pages/admin-categories-manage.page";
import AdminOrdersManagePage from "./pages/admin-orders-manage.page";
import ShopPage from "./pages/shop/shop.page.jsx";
import ProductPage from "./pages/shop/product/product.page";
import WishlistPage from "./pages/wishlist.page.jsx";
import Protected from "@/layouts/Protected";
import AdminProtected from "@/layouts/AdminProtected";
import TermsOfService from "./pages/terms-of-service.jsx";

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
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route
                path="/shop/product/:productId"
                element={<ProductPage />}
              />
              <Route path="/wishlist" element={<WishlistPage />} />

              <Route path="/terms" element={<TermsOfService />} />
              {/* Protected Routes - Requires Authentication */}
              <Route element={<Protected />}>
                <Route path="/shop/cart" element={<CartPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrdersPage />} />
                <Route path="/shop/checkout" element={<CheckoutPage />} />
                <Route path="/shop/payment" element={<PaymentPage />} />
                <Route
                  path="/payment-success"
                  element={<PaymentSuccessPage />}
                />
                <Route path="/shop/complete" element={<CompletePage />} />

                {/* Admin Routes - Requires Admin Authentication */}
                <Route element={<AdminProtected />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route
                    path="/admin/products/create"
                    element={<AdminProductCreatePage />}
                  />
                  <Route
                    path="/admin/products/manage"
                    element={<AdminProductsManagePage />}
                  />
                  <Route
                    path="/admin/products/edit/:productId"
                    element={<AdminProductEditPage />}
                  />
                  <Route
                    path="/admin/categories/manage"
                    element={<AdminCategoriesManagePage />}
                  />
                  <Route
                    path="/admin/orders/manage"
                    element={<AdminOrdersManagePage />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ClerkProvider>
  // </StrictMode>
);
