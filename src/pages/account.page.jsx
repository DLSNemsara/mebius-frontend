import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <main>
        <h1>My Account</h1>
        <div>Loading...</div>
      </main>
    );
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <main className="px-8">
      <h1 className="text-4xl font-bold">My Account</h1>
      <div className="mt-4">
        <p> {user.fullName} </p>
        <p>{user.emailAddresses[0].emailAddress}</p>
      </div>
    </main>
  );
}

export default AccountPage;
