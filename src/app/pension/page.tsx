"use client";

import { BedDouble } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import photo from "../../../public/images/service-pension.png";

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
      photo={photo}
      photoAlt={
        locale === "fr"
          ? "Jack Russell détendu dans un panier confortable avec ses jouets, dans un enclos de pension lumineux"
          : "Relaxed Jack Russell in a comfortable bed with toys, in a bright boarding enclosure"
      }
    />
  );
}
