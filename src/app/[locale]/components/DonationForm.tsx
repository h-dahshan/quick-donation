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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function DonationForm() {
  const t = useTranslations("donationPage");
  const locale = useLocale();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, t("required")),
        email: z.string().min(1, t("required")).email(t("invalidEmail")),
        mobile: z.string().min(1, t("required")),
        street: z.string().min(1, t("required")),
        city: z.string().min(1, t("required")),
        country: z.string().min(1, t("required")),
        quantity: z.string().min(1, t("required")),
        coverFee: z.boolean(),
      })
    ),
    values: {
      name: "",
      email: "",
      mobile: "",
      street: "",
      city: "",
      country: "",
      quantity: "1",
      coverFee: false,
    },
  });

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
    quantity: string;
    coverFee: boolean;
  }) {
    setIsLoading(true);

    try {
      if (!stripe || !elements) return null;

      // call server action to make a payment intent
      const { data } = await axios.post("/api/create-payment-intent", {
        data: values,
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
          <p>
            {t("itemCost")} <span className="text-green-600">{"€100.00"}</span>
          </p>

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("quantity")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <SelectItem key={idx} value={`${idx + 1}`}>
                          {idx + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              {"€" + (parseInt(form.getValues().quantity) * 100).toFixed(2)}
            </span>
          </p>

          {/* STIPE */}
          <div className="flex flex-col">
            <PaymentElement options={{ layout: { type: "auto" } }} />
          </div>

          <Button type="submit" disabled={isLoading || !stripe || !elements}>
            <Loader2 className="animate-spin" /> {t("pay")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
