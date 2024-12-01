"use client";

import { use } from "react";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../utils/getStripe";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import LocaleSwitcher from "./components/LocaleSwitcher";
import DonationForm from "./components/DonationForm";

const stripePromise = getStripe();

export default function DonationPage({
  params,
}: Readonly<{
  params: Promise<{ locale: "ar" | "en" | "de" }>;
}>) {
  const { locale } = use(params);

  const t = useTranslations("donationPage");

  return (
    <div className="flex justify-center max-h-screen py-10 px-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start lg:w-[620px] md:w-[560px] sm:w-[420px]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <Image
                src="/images/logo.png"
                alt="Mogamaa Logo"
                width={200}
                height={100}
                priority
              />

              <LocaleSwitcher locale={locale} />
            </CardTitle>

            <CardDescription className="text-primary">
              <h1 className="text-xl font-bold tracking-tight">
                {t("makeDonation")}
              </h1>
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Elements
              stripe={stripePromise}
              options={{
                amount: 100,
                appearance: { theme: "stripe" },
                locale: locale,
                currency: "eur",
                mode: "payment",
              }}
            >
              <DonationForm />
            </Elements>
          </CardContent>
        </Card>
      </main>

      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Write Footer Here
      </footer> */}
    </div>
  );
}
