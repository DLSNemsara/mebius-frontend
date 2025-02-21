import { Button } from "@/components/ui/button";
import { useCreateOrderMutation } from "@/lib/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value);
  const [createOrder, { isLoading, isError, data }] = useCreateOrderMutation();
  const navigate = useNavigate();

  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">Checkout Page</h2>
      <div></div>

      <Button
        type="button"
        onClick={() => {
          createOrder({
            items: cart,
            userId: "",
          });
          navigate("/shop/payment");
        }}
      >
        Proceed Payment
      </Button>
    </main>
  );
}

export default CheckoutPage;
