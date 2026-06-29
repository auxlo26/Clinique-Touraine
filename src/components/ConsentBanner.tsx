"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "touraine-cookie-consent";

export type ConsentChoice = "accepted" | "refused";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "refused" ? v : null;
}

// Loi 25: no non-essential script (analytics, marketing pixels, etc.) is loaded
// anywhere in this app until the visitor explicitly accepts here. This demo
// has no third-party scripts at all, so "accepted" simply unlocks the optional
// (non-essential) UI conveniences a real deployment would gate behind it.
export function ConsentBanner() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reads localStorage, a browser-only API not available during SSR render.
    if (!getStoredConsent()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function choose(choice: ConsentChoice) {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t.consent.title}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] animate-fade-up border-t border-border bg-paper px-5 py-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.25)] sm:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-base font-medium text-forest-900">{t.consent.title}</p>
          <p className="mt-1 text-sm text-ink-500">
            {t.consent.message}{" "}
            <Link href="/confidentialite" className="font-medium text-forest-700 underline">
              {t.consent.privacyLinkText}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" size="md" onClick={() => choose("refused")}>
            {t.consent.refuse}
          </Button>
          <Button variant="primary" size="md" onClick={() => choose("accepted")}>
            {t.consent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
