import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  const { customer, amount } = data;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: Number(amount) * 100,
      met
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error, {
      status: 400,
    });
  }
}
