"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createCheckoutSession, Product } from "./checkout-session";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentButtonProps {
    product: Product
}

export function PaymentButton({ product }: PaymentButtonProps) {
    const [loading, startTransition] = useTransition();

    function handleBuy() {
        startTransition(async () => {
            const result = await createCheckoutSession(product);

            console.log(result);

            if (!result || result.error || !result.sessionId) {
                alert("Error creating checkout session");
                return;
            }

            const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
            if (!publishableKey) {
                alert("Stripe public key is missing");
                return;
            }
            const stripe = await loadStripe(publishableKey);

            if (!stripe) {
                alert("Error loading stripe");
                return;
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: result.sessionId,
            });

            if (error) {
                alert("Error redirecting to checkout");
            }
        });
    }

    return (
        <Button
            disabled={loading}
            onClick={handleBuy}
            className="w-full rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
            {loading ? "Loading..." : "Buy Now"}
        </Button>
    )
}