import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Package,
  Settings,
  LogOut,
  Loader2,
  ShoppingBag,
  Clock,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading account details...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  const accountLinks = [
    {
      title: "Orders",
      description: "View your order history and track current orders",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Addresses",
      description: "Manage your shipping and billing addresses",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Settings",
      description: "Update your account preferences and notifications",
      icon: Settings,
      href: "/account/settings",
    },
  ];

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-4xl px-4 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Account</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {accountLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="p-4 transition-colors border rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <link.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">{link.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>No recent activity to show</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="flex flex-col gap-4 mt-4 sm:flex-row">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/shop" className="flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                /* Add logout logic */
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Account Status */}
          <div className="p-4 text-sm text-center text-muted-foreground">
            <p>
              Account created on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AccountPage;
