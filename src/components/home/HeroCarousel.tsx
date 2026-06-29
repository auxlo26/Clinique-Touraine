"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface Slide {
  title: string;
  desc: string;
  href: string;
}

export function HeroCarousel({
  slides,
  icons,
  prevLabel,
  nextLabel,
  goToLabel,
  className,
}: {
  slides: readonly Slide[];
  icons: LucideIcon[];
  prevLabel: string;
  nextLabel: string;
  goToLabel: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function go(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  function pause() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  }

  const current = slides[index];
  const Icon = icons[index];

  return (
    <div onMouseEnter={pause} onFocus={pause} onKeyDown={handleKeyDown} className={clsx("relative", className)}>
      <p aria-live="polite" className="sr-only">
        {current.title}
      </p>

      <div
        key={`card-${index}`}
        className="animate-fade-up rounded-2xl border-t-2 border-terracotta-500 bg-paper p-4 shadow-[0_25px_50px_-25px_rgba(17,32,26,0.35)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-forest-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-terracotta-600">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <Link href={current.href} className="group mt-0.5 flex items-center gap-1 font-display text-sm font-medium text-forest-900">
              <span className="truncate">{current.title}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{current.desc}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5" role="group" aria-label={goToLabel}>
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-current={i === index ? "true" : undefined}
              aria-label={`${goToLabel} ${i + 1}`}
              onClick={() => go(i)}
              className={clsx(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-terracotta-500" : "w-2 bg-border-strong hover:bg-sage-300"
              )}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={prevLabel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-forest-700 transition-colors hover:bg-sage-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={nextLabel}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700 text-cream transition-colors hover:bg-forest-800"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
