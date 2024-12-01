"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useTranslations } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import FormSection from "./FormSection";

import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function DonationForm() {
  const t = useTranslations("donationPage");

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, t("required")),
        email: z.string().min(1, t("required")).email(t("invalidEmail")),
        mobile: z.string().min(1, t("required")),
        street: z.string().min(1, t("required")),
        city: z.string().min(1, t("required")),
        country: z.string().min(1, t("required")),
        quantity: z.number().min(1, t("required")),
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
      quantity: 1,
      coverFee: false,
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  async function onSubmit(values: {
    name: string;
    email: string;
    mobile: string;
    street: string;
    city: string;
    country: string;
    quantity: number;
    coverFee: boolean;
  }) {
    const { name, email, mobile, street, city, country, quantity } = values;
    const customer = { name, email, mobile, street, city, country };
    const postReqPayload = { customer, amount: quantity * 100 };

    const cardElement = elements?.getElement("card");

    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post("/api/create-payment-intent", {
        data: postReqPayload,
      });
      const clientSecret = data;

      await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    } catch (error) {
      console.log(error);
    }
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
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel required>{t("quantity")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value || 1))}
                    {...rest}
                  />
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

        <div className="flex justify-between align-bottom">
          <p className="">
            {t("totalDonation")}{" "}
            <span className="text-green-600">
              {"€" + (100 * form.getValues().quantity).toFixed(2)}
            </span>
          </p>

          <Button type="submit">Submit</Button>
        </div>

        {/* STIPE */}
        <CardElement />
      </form>
    </Form>
  );
}
