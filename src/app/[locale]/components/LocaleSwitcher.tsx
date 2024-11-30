"use client";

import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Languages } from "lucide-react";

export default function LocaleSwitcher({
  locale,
}: {
  locale: "ar" | "en" | "de";
}) {
  const t = useTranslations("donationPage");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(locale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale }
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={locale === "ar"}
          onCheckedChange={() => handleLocaleChange("ar")}
          disabled={locale === "ar"}
        >
          {t("ar")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={locale === "en"}
          onCheckedChange={() => handleLocaleChange("en")}
          disabled={locale === "en"}
        >
          {t("en")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={locale === "de"}
          onCheckedChange={() => handleLocaleChange("de")}
          disabled={locale === "de"}
        >
          {t("de")}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
