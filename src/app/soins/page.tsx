"use client";

import { Stethoscope } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import photo from "../../../public/images/service-soins.png";

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
      photo={photo}
      photoAlt={
        locale === "fr"
          ? "Vétérinaire auscultant un Jack Russell calme avec un stéthoscope pendant un suivi de santé annuel"
          : "Veterinarian listening to a calm Jack Russell's heart with a stethoscope during an annual wellness check"
      }
    />
  );
}
