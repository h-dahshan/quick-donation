"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Link } from "@/i18n/routing";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Feedback() {
  const t = useTranslations("donationPage");

  const query = useSearchParams();
  const status = query.get("redirect_status");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-60 h-60">
        <DotLottieReact
          src={
            status === "succeeded"
              ? "/animations/success.lottie"
              : "/animations/failure.lottie"
          }
          autoplay
        />
      </div>

      <h1 className="text-2xl font-extrabold lg:text-3xl">
        {status === "succeeded" ? t("donationSuccess") : t("donationFailure")}
      </h1>
      <p className="mt-2">
        {status === "succeeded" ? t("thankYou") : t("sorry")}
      </p>
      <p>
        {t("youCan")}{" "}
        <Link href="/" className="underline font-semibold text-emerald-500">
          {status === "succeeded" ? t("goHome") : t("tryAgain")}
        </Link>
      </p>
    </div>
  );
}
