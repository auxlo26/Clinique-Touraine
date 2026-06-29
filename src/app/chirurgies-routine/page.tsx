"use client";

import { Scissors } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";

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
      photoAlt={
        locale === "fr"
          ? "Salle d'opération vétérinaire propre et bien éclairée, prête pour une chirurgie de routine"
          : "Clean, well-lit veterinary operating room, ready for a routine surgery"
      }
    />
  );
}
