import { Button } from "@/components/ui/button";
import { useCreateOrderMutation } from "@/lib/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import ShippingAddressForm from "@/components/ShippingAddressForm";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value);
  const [createOrder, { isLoading, isError, data }] = useCreateOrderMutation();
  const navigate = useNavigate();

  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">Checkout Page</h2>
      <div className="mt-4">
        <h3 className="text-3xl font-semibold">Order Details</h3>
        <div className="mt-2">
          {cart.map((item, index) => (
            <div key={index}>
              <p>{item.product.name}</p>
              <p>{item.product.price}</p>
              <p>{item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-semibold">Enter Shipping Address</h3>
        <div className="mt-2 w-1/2">
          <ShippingAddressForm cart={cart} />
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
