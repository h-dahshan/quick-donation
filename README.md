# Donation App

## Breif

This is a quick donation app that enables receiving donations through a donation form and Stripe, persisting them in a DB, updating them once transactions are succeeded, and shows progress of what has been raised from targeted donations

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

> Development Tip; you may need to install **`stripe`** locally and use the following command to forward Stripe's webhook calls to your app locally `stripe listen --events payment_intent.succeeded --forward-to localhost:3000/api/webhooks`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment Requirements

This app depends on environment varaibles which are a must to work properly and they are read from `.env` file like these in `.env.example` file which contains keys for the following:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: used in the app's Frontend, obtain this from your Stripe account,
- `STRIPE_SECRET_KEY`: used at server APIs, obtain this from your Stripe account,
- `STRIPE_WEBHOOK_SECRET`: used to handle Stripe events webhooks (currently supporting PaymentIntentSuccess), configure webhook and obtain the key from your Stripe account, webhooks configs should POST to **${domain}**`/api/webhooks`
- `DATABASE_URL`: used to persist app's data, with DB connection pooling, currently connected to Prisma Postgres, obtain this from your Prisma/Provider account.
- `DATABASE_DIRECT_URL`: may be required in some cases like using Supabase instead of PrismaPostgres

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy with Docker

The app has a Docker file which builds the app and handles Prisma DB schema migration and client generation, you can run the following docker commands to try it:

1. Build: `docker build -t my-app .`
2. Running a Container: `docker run -p 3000:3000 my-app`
