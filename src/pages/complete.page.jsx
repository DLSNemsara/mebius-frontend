import { Button } from "@/components/ui/button";
import { useGetOrderQuery } from "@/lib/api";
import { Link, useSearchParams } from "react-router";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading } = useGetOrderQuery(orderId);

  if (isLoading) {
    return <main className="px-8">Loading...</main>;
  }

  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">Order Successful</h2>
      <div className="mt-4">
        {data.items.map((item, index) => (
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
          {data.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          )}
        </p>
      </div>

      <div className="mt-4">
        <p>Order ID: {data._id}</p>
        <p>Order Status: {data.paymentStatus}</p>
        <p className="mt-2 text-lg">Shipping Address</p>
        <p>{data.addressId.line_1}</p>
        <p>{data.addressId.line_2}</p>
        <p>{data.addressId.city}</p>
        <p>{data.addressId.state}</p>
        <p>{data.addressId.zip_code}</p>
        <p>{data.addressId.phone}</p>
      </div>

      <div className="mt-4">
        <Button asChild>
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </main>
  );
}

export default CompletePage;
