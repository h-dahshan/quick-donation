"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import FormSection from "./components/FormSection";
import LocaleSwitcher from "./components/LocaleSwitcher";

export default function DonationPage({
  params: { locale },
}: Readonly<{
  params: { locale: "ar" | "en" | "de" };
}>) {
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
  function onSubmit(values: {
    name: string;
    email: string;
    mobile: string;
    street: string;
    city: string;
    country: string;
    quantity: number;
    coverFee: boolean;
  }) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start lg:w-[620px] md:w-[560px] sm:w-[380px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
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
                <FormSection label={t("donationAmount")}>
                  <p>
                    {t("itemCost")}{" "}
                    <span className="text-green-600">{"€100.00"}</span>
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
                            onChange={(e) =>
                              onChange(Number(e.target.value || 1))
                            }
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
              </CardContent>

              <CardFooter className="flex justify-between align-bottom">
                <p className="">
                  {t("totalDonation")}{" "}
                  <span className="text-green-600">
                    {"€" + (100 * form.getValues().quantity).toFixed(2)}
                  </span>
                </p>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>

      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Write Footer Here
      </footer> */}
    </div>
  );
}
