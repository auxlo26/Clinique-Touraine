"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type RevealDirection = "up" | "none";

/**
 * Real scroll-triggered reveal (IntersectionObserver), not a mount-time fade.
 * prefers-reduced-motion is handled globally in globals.css, which collapses
 * all transition durations, so no extra branching is needed here.
 *
 * `as` lets it render the correct semantic tag (e.g. "li" inside a <ul>)
 * instead of always injecting a <div>.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={clsx(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : direction === "up" ? "opacity-0 translate-y-7" : "opacity-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
