import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { routing } from "@/i18n/routing";

import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mogamaa Donation",
  description: "Make a donation to Mogamaa",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: "ar" | "en" | "de" }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex justify-center min-h-screen py-10 px-5 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col items-center gap-8 sm:items-start lg:w-[620px] md:w-[560px] sm:w-[420px]">
              {children}
            </main>
          </div>

          {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            Write Footer Here
          </footer> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
