"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useTranslations, useLocale } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

import FormSection from "./FormSection";

import axios from "axios";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const i18nCurrency = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export default function DonationForm() {
  const t = useTranslations("donationPage");
  const locale = useLocale();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z
        .object({
          name: z.string().min(1, t("required")),
          email: z.string().min(1, t("required")).email(t("invalidEmail")),
          mobile: z.string().min(1, t("required")),
          street: z.string().min(1, t("required")),
          city: z.string().min(1, t("required")),
          country: z.string().min(1, t("required")),
          amount: z.enum(["50", "100", "200", "other"], {
            message: t("required"),
          }),
          customAmount: z.number().min(1, t("required")),
          coverFee: z.boolean(),
        })
        .superRefine(({ amount, customAmount }, ctx) => {
          if (amount === "other" && !customAmount) {
            ctx.addIssue({
              code: "custom",
              path: ["customAmount"],
              message: t("required"),
            });
          }
        })
    ),
    values: {
      name: "",
      email: "",
      mobile: "",
      street: "",
      city: "",
      country: "",
      amount: "",
      customAmount: 0,
      coverFee: false,
    },
  });
  const watchAmount = form.watch("amount");
  const watchCustomAmount = form.watch("customAmount");

  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: {
    name: string;
    email: string;
    mobile: string;
    street: string;
    city: string;
    country: string;
    amount: string;
    customAmount: number;
    coverFee: boolean;
  }) {
    const { amount, customAmount, ...rest } = values;
    const payload = {
      ...rest,
      amount: amount === "other" ? customAmount : parseInt(amount),
    };

    setIsLoading(true);

    try {
      if (!stripe || !elements) return null;

      // call server action to make a payment intent
      const { data } = await axios.post("/api/create-payment-intent", {
        data: payload,
      });

      elements.submit();

      await stripe?.confirmPayment({
        elements,
        clientSecret: data,
        confirmParams: {
          return_url: `${window.origin}/${locale}/feedback`,
        },
      });
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormSection label={t("donationAmount")}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="mb-5">
                  {t("pleaseSelectAmount")}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0 border rounded-md py-2 px-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <FormControl>
                        <RadioGroupItem value="50" />
                      </FormControl>
                      <FormLabel className="font-normal text-md w-full">
                        {i18nCurrency.format(50)}
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2 space-y-0 border rounded-md py-2 px-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <FormControl>
                        <RadioGroupItem value="100" />
                      </FormControl>
                      <FormLabel className="font-normal text-md w-full">
                        {i18nCurrency.format(100)}
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2 space-y-0 border rounded-md py-2 px-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <FormControl>
                        <RadioGroupItem value="200" />
                      </FormControl>
                      <FormLabel className="font-normal text-md w-full">
                        {i18nCurrency.format(200)}
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2 space-y-0 border rounded-md py-2 px-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal text-md w-full">
                        {t("other")}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchAmount === "other" && (
            <FormField
              control={form.control}
              name="customAmount"
              render={({ field: { value, ...rest } }) => (
                <FormItem>
                  <FormLabel required>{t("customAmount")}</FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      value={value || ""}
                      onChange={(e) =>
                        form.setValue(
                          "customAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormSection>

        <Separator className="my-6" />

        <FormSection label={t("personalInfo")}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("mobile")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("street")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("city")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("country")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <FormSection label={t("feeCoverage")}>
          <FormField
            control={form.control}
            name="coverFee"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="fee"
                      value={field.value.toString()}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="fee"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("feeCoverageAck")}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator className="my-6" />

        <div className="flex flex-col justify-between gap-4">
          <p>
            {t("totalDonation")}{" "}
            <span className="text-green-600">
              {i18nCurrency.format(
                watchAmount === "other"
                  ? watchCustomAmount
                  : parseInt(watchAmount) || 0
              )}
            </span>
          </p>

          {/* STIPE */}
          <div className="flex flex-col">
            <PaymentElement options={{ layout: { type: "auto" } }} />
          </div>

          <Button type="submit" disabled={isLoading || !stripe || !elements}>
            {isLoading && <Loader2 className="animate-spin" />} {t("pay")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
