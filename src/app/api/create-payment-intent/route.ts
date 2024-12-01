import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51QQxLtALNhs4eR7SjcvKpunMUItq3B5AECJ8kfyVu7VunitKHeNob8horW9yDw9p6ZwgY4S4wEysmDmGmTBTj8A100mPnytHEC",
  {
    typescript: true,
    apiVersion: "2024-06-20",
  }
);

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { customer, amount } = data;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: Number(amount) * 100,
      automatic_payment_methods: { enabled: true },
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error, {
      status: 400,
    });
  }
}
