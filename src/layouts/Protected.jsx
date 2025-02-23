import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Protected() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}

export default Protected;
