import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  const { name, email, mobile, street, city, country, quantity, coverFee } =
    data;
  const totalDonation = parseInt(quantity) * 100; // 100 is donation item price

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: Number(totalDonation) * 100,
      automatic_payment_methods: { enabled: true },
    });

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
        donation: totalDonation,
        intentId: paymentIntent.client_secret,
      },
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error, { status: 500 });
  }
}
