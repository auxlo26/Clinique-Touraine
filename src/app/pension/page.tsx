"use client";

import { BedDouble } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export default function PensionPage() {
  const { t, locale } = useLocale();

  return (
    <ServicePageLayout
      title={t.pension.title}
      watermark={locale === "fr" ? "PENSION" : "BOARDING"}
      intro={t.pension.intro}
      sections={t.pension.sections}
      ctaTitle={t.pension.ctaTitle}
      icon={BedDouble}
      palette={2}
      photoAlt={
        locale === "fr"
          ? "Chien confortablement installé dans un enclos de pension propre et spacieux"
          : "Dog comfortably settled in a clean, spacious boarding kennel"
      }
    />
  );
}
