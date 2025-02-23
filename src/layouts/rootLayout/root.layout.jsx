import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export default RootLayout;
