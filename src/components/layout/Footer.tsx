"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, PawPrint } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container } from "@/components/ui/Container";
import { CLINIC, CLINIC_FULL_ADDRESS, HOURS, dayLabel, formatHourLabel } from "@/config/clinic";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/soins", key: "soins" as const },
  { href: "/chirurgies-routine", key: "chirurgiesRoutine" as const },
  { href: "/urgences", key: "urgences" as const },
  { href: "/pension", key: "pension" as const },
  { href: "/a-propos", key: "aPropos" as const },
  { href: "/contact", key: "contact" as const },
  { href: "/rendez-vous", key: "bookCta" as const },
];

export function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer className="border-t border-border bg-forest-950 text-sage-100">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-display text-lg text-cream">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-500">
              <PawPrint className="h-4 w-4" aria-hidden="true" />
            </span>
            {CLINIC.name}
          </div>
          <p className="text-sm text-sage-300">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-300">
            {t.footer.navTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sage-100 hover:text-cream">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sage-300">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {t.footer.addressTitle}
          </h3>
          <address className="text-sm not-italic text-sage-100">{CLINIC_FULL_ADDRESS}</address>
          <h3 className="mb-2 mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sage-300">
            <Phone className="h-4 w-4" aria-hidden="true" /> {t.footer.phoneTitle}
          </h3>
          <a href={CLINIC.phoneHref} className="text-sm text-sage-100 hover:text-cream">
            {CLINIC.phone}
          </a>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sage-300">
            <Clock className="h-4 w-4" aria-hidden="true" /> {t.footer.hoursTitle}
          </h3>
          <ul className="space-y-1 text-sm text-sage-100">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-3">
                <span className="capitalize">{dayLabel(h.day, locale)}</span>
                <span>
                  {h.open && h.close
                    ? `${formatHourLabel(h.open, locale)} - ${formatHourLabel(h.close, locale)}`
                    : t.common.closedToday}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-sage-300">{t.footer.confirmHoursNote}</p>
        </div>
      </Container>

      <div className="border-t border-forest-800">
        <Container className="flex flex-col gap-3 py-6 text-xs text-sage-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.name}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>{t.footer.loi25Note}</span>
            <Link href="/confidentialite" className="font-medium text-sage-100 underline hover:text-cream">
              {t.footer.privacyLink}
            </Link>
            <Link href="/tableau-de-bord" className="text-sage-300/70 underline hover:text-sage-100">
              {t.nav.dashboard} ({locale === "fr" ? "interne" : "internal"})
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
