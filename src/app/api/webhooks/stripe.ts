import { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    if (!sig) return;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSercret);
    } catch (err) {
      console.error("Error verifying webhook signature:", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

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
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
