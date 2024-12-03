import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  const { name, email, mobile, street, city, country, amount, coverFee } = data;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: Number(amount) * 100,
      automatic_payment_methods: { enabled: true },
    });

    console.log(paymentIntent);

    if (!paymentIntent.client_secret) {
      return new NextResponse("Couldn't create Payment Intent", {
        status: 400,
      });
    }

    await prisma.donations.create({
      data: {
        name,
        email,
        mobile,
        street,
        city,
        country,
        coverFee,
        donation: parseInt(amount),
        intentId: paymentIntent.id,
      },
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error, { status: 500 });
  }
}
