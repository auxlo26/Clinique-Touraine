import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

/**
 * Stand-in for real photography: a moody duotone composition with a watermark
 * icon, vignette, and grain, never a flat icon-in-a-box or a blurry stock
 * photo. `alt` describes what the real commissioned photo would show and is
 * exposed to assistive tech via role="img".
 */
const VIGNETTE_POSITIONS = ["30% 20%", "70% 25%", "50% 75%"] as const;
const ACCENT_COLORS = ["bg-terracotta-500 shadow-[0_0_0_4px_rgba(200,112,63,0.25)]",
  "bg-sage-300 shadow-[0_0_0_4px_rgba(167,192,173,0.25)]",
  "bg-cream shadow-[0_0_0_4px_rgba(250,247,241,0.2)]",
] as const;

export function PhotoPlaceholder({
  alt,
  icon: Icon,
  className,
  palette = 0,
  accent = true,
}: {
  alt: string;
  icon: LucideIcon;
  palette?: 0 | 1 | 2;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={clsx(
        "relative isolate flex items-center justify-center overflow-hidden rounded-[1.75rem] bg-forest-900 shadow-[0_30px_60px_-25px_rgba(17,32,26,0.55)] ring-1 ring-forest-950/40 transition-transform duration-300 ease-out group-hover:-translate-y-1",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${VIGNETTE_POSITIONS[palette]}, rgba(231,238,227,0.22), transparent 55%)`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grain opacity-60" aria-hidden="true" />
      <Icon
        className="absolute h-[150%] w-[150%] -rotate-6 text-cream/[0.05]"
        strokeWidth={1}
        aria-hidden="true"
      />
      <Icon
        className="relative h-12 w-12 text-cream/90 drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-110"
        strokeWidth={1.4}
        aria-hidden="true"
      />
      {accent && (
        <span
          className={clsx("absolute right-4 top-4 h-2.5 w-2.5 rounded-full", ACCENT_COLORS[palette])}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-cream/10" aria-hidden="true" />
    </div>
  );
}
