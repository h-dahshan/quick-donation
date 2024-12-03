import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

import Stripe from "stripe";
import prisma from "@/lib/prisma";

const webhookSercret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-11-20.acacia",
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    Cors({ methods: ["POST", "GET", "HEAD"] })(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);

  console.log("Webhook Received:", req);

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

    res.status(200).json({ received: true });
  } else {
    console.log("Webhook Rejected");

    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
