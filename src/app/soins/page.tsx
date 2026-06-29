"use client";

import { Stethoscope } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export default function SoinsPage() {
  const { t, locale } = useLocale();

  return (
    <ServicePageLayout
      title={t.soins.title}
      watermark={locale === "fr" ? "SANTÉ" : "WELLNESS"}
      intro={t.soins.intro}
      sections={t.soins.sections}
      ctaTitle={t.soins.ctaTitle}
      icon={Stethoscope}
      palette={0}
      photoAlt={
        locale === "fr"
          ? "Vétérinaire procédant à un examen de routine sur un chat calme"
          : "Veterinarian performing a routine checkup on a calm cat"
      }
    />
  );
}
