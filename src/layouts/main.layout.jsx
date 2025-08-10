import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { fetchWishlist, clearWishlist } from "@/lib/features/wishlistSlice";

function MainLayout() {
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useUser();

  // Fetch wishlist when user is signed in, clear when signed out
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        dispatch(fetchWishlist());
      } else {
        dispatch(clearWishlist());
      }
    }
  }, [dispatch, isSignedIn, isLoaded]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default MainLayout;
