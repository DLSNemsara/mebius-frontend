import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const StripePaymentForm = ({ clientSecret, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (submitError) {
        setError(submitError.message);
        onError(submitError);
        toast.error(`Payment failed: ${submitError.message}`);
      } else if (paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        setError("Payment processing failed. Please try again.");
        onError(new Error("Payment processing failed"));
        toast.error("Payment processing failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
      onError(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Amount Display */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Amount to Pay:</span>
          <span className="text-xl font-bold text-primary">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          <span>Card Information</span>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 w-4 h-4" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By clicking "Pay", you agree to our terms of service and privacy
          policy. Your payment is processed securely by Stripe.
        </p>
      </div>
    </form>
  );
};

export default StripePaymentForm;
