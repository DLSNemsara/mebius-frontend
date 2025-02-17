import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import { store } from "@/lib/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
  // </StrictMode>
);
