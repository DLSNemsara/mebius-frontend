import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function AdminProtected() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AdminProtected;
