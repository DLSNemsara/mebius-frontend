import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cartSlice";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }
  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">Review Your Order</h2>
      <div className="mt-4">
        {cart.map((item, index) => (
          <div key={index}>
            <p>{item.product.name}</p>
            <p>{item.product.price}</p>
            <p>{item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p>
          Total Price: $
          {cart.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          )}
        </p>
      </div>
      <div className="mt-4">
        <Button
          onClick={() => {
            dispatch(clearCart());
            toast.success("Order Placed Successfully");
          }}
        >
          Place Order
        </Button>
      </div>
    </main>
  );
}

export default PaymentPage;
