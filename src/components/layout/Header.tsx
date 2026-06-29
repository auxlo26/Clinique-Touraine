"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, PawPrint, Globe } from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { OpenBadge } from "@/components/OpenBadge";
import { CLINIC } from "@/config/clinic";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/soins", key: "soins" as const },
  { href: "/chirurgies-routine", key: "chirurgiesRoutine" as const },
  { href: "/urgences", key: "urgences" as const },
  { href: "/pension", key: "pension" as const },
  { href: "/a-propos", key: "aPropos" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const { t, locale, toggleLocale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/90 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-medium text-forest-900"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-cream">
            <PawPrint className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            {CLINIC.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-sage-100 text-forest-800" : "text-ink-700 hover:bg-sage-100 hover:text-forest-800"
                )}
                aria-current={active ? "page" : undefined}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <OpenBadge />
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-sage-100"
            aria-label={locale === "fr" ? "Switch to English" : "Passer au français"}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <LinkButton href="/rendez-vous" size="md">
            {t.common.bookNow}
          </LinkButton>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-forest-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t.nav.closeMenu : t.nav.menu}
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border bg-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <div className="mb-2 flex items-center justify-between">
              <OpenBadge />
              <button
                type="button"
                onClick={toggleLocale}
                className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-sm font-medium text-ink-700"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                {locale === "fr" ? "EN" : "FR"}
              </button>
            </div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-sage-100"
              >
                {t.nav[item.key]}
              </Link>
            ))}
            <LinkButton href="/rendez-vous" size="md" className="mt-3 justify-center" onClick={() => setOpen(false)}>
              {t.common.bookNow}
            </LinkButton>
          </Container>
        </div>
      )}
    </header>
  );
}
