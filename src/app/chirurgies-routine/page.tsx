"use client";

import { Scissors } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import photo from "../../../public/images/service-chirurgies-routine.png";

export default function ChirurgiesRoutinePage() {
  const { t, locale } = useLocale();

  return (
    <ServicePageLayout
      title={t.chirurgiesRoutine.title}
      watermark={locale === "fr" ? "CHIRURGIE" : "SURGERY"}
      intro={t.chirurgiesRoutine.intro}
      sections={t.chirurgiesRoutine.sections}
      ctaTitle={t.chirurgiesRoutine.ctaTitle}
      icon={Scissors}
      palette={1}
      photo={photo}
      photoAlt={
        locale === "fr"
          ? "Vétérinaire vérifiant une fiche de préparation pendant qu'un Jack Russell calme attend sur la table"
          : "Veterinarian reviewing a preparation checklist while a calm Jack Russell waits on the exam table"
      }
    />
  );
}
