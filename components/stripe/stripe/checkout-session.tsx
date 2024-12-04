"use server";

import Stripe from "stripe";

export type Product = {
    name: string
    price: number
    discount: number
    image: string
    quantity: number
}

export async function createCheckoutSession(product : Product) {

  const quantity = product.quantity;

  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      throw new Error("Stripe secret key is missing!");
    }

    const stripe = new Stripe(apiKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=failed`,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: product.name,
              images: [`${product.image}`],
            },
            unit_amount: (product.price - product.price * (product.discount / 100)) * 100, // Stripe requires the price in cents so we multiply by 100
          },
          quantity,
        },
      ],
    });

    // You do database operations here to save the session.id and other details
    console.log("Session created", session.id);
    return { sessionId: session.id };
  } catch (error) {
    console.log("Error creating checkout session", error);
    return { error: "Error creating checkout session" };
  }
}