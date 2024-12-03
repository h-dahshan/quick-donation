import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";
import prisma from "@/lib/prisma";

const webhookSercret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-11-20.acacia",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  console.log("Webhook Received:", req);

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    return new NextResponse("Couldn't get Stripe signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSercret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  console.log("Event:", event);

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const eventIntentId = event.data.object.id;

    await prisma.donations.updateMany({
      where: {
        intentId: eventIntentId,
      },
      data: {
        paid: true,
      },
    });

    console.log("FINISHED UPDATE");
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse("Webhook Proccessed", { status: 200 });
}
