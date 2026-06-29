"use client";

import clsx from "clsx";
import { useOpenState } from "@/hooks/useOpenState";
import { useLocale } from "@/i18n/LocaleProvider";
import { dayLabel, formatHourLabel } from "@/config/clinic";

export function OpenBadge({ className }: { className?: string }) {
  const { isOpen, nextOpen } = useOpenState();
  const { locale, t } = useLocale();

  return (
    <span
      className={clsx(
        "inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-full px-3 py-1.5 text-xs font-semibold leading-tight",
        isOpen ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-600",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span
          className={clsx(
            "h-1.5 w-1.5 rounded-full",
            isOpen ? "bg-success-600" : "bg-danger-600",
            "motion-safe:animate-pulse"
          )}
          aria-hidden="true"
        />
        {isOpen ? t.common.open : t.common.closed}
      </span>
      {!isOpen && nextOpen ? (
        <span className="whitespace-nowrap font-normal text-current/80">
          · {t.common.reopensOn} {dayLabel(nextOpen.day, locale)} {formatHourLabel(nextOpen.open, locale)}
        </span>
      ) : null}
    </span>
  );
}
