"use client";

import Link from "next/link";
import {
  Stethoscope,
  Scissors,
  HeartPulse,
  BedDouble,
  Award,
  Languages,
  MoonStar,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section, Eyebrow, SectionTitle } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { OpenBadge } from "@/components/OpenBadge";
import { Reveal } from "@/components/ui/Reveal";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HeroPhoto } from "@/components/home/HeroPhoto";
import { HOURS, dayLabel, formatHourLabel } from "@/config/clinic";

const SERVICE_ICONS = [Stethoscope, Scissors, HeartPulse, BedDouble];
const TRUST_ICONS = [Award, Languages, MoonStar, PackageCheck];

export default function Home() {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-paper">
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:h-[92vh] lg:min-h-[720px] lg:max-h-[920px] lg:px-12">
          {/* Massive wordmark, anchored in the upper portion of the hero so
              text columns at the bottom don't collide with it. */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[34%] z-0 hidden -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-semibold leading-none text-sage-400 lg:block"
            style={{ fontSize: "clamp(7rem, 13.5vw, 12rem)", letterSpacing: "-0.025em" }}
          >
            TOURAINE
          </p>

          {/* DOM order is text-first so the page reads naturally on mobile
              and for screen readers. On desktop everything below is
              absolutely positioned and the visual order is layered. */}

          {/* Left column: eyebrow, headline, CTAs. */}
          <div className="relative z-20 pt-12 lg:absolute lg:bottom-16 lg:left-12 lg:max-w-xs lg:pt-0">
            <Eyebrow>{t.home.heroEyebrow}</Eyebrow>
            <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 text-balance sm:text-5xl lg:text-[2.15rem] lg:leading-[1.1]">
              {t.home.heroTitle}
            </h1>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LinkButton href="/rendez-vous" size="lg">
                {t.home.heroCtaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="#services" size="lg" variant="ghost">
                {t.home.heroCtaSecondary}
              </LinkButton>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <OpenBadge />
              <span className="text-xs text-ink-300">* {t.home.sinceConfirmNote}</span>
            </div>
          </div>

          {/* Dog photo: in flow between text columns on mobile, absolutely
              centered and full-height on desktop, bleeding vertically
              through the wordmark. */}
          <div className="relative z-10 mx-auto mt-10 aspect-[3/4] w-64 sm:w-80 lg:absolute lg:inset-y-0 lg:left-1/2 lg:mt-0 lg:h-full lg:w-auto lg:max-w-none lg:-translate-x-1/2">
            <HeroPhoto
              alt={
                locale === "fr"
                  ? "Portrait d'un golden retriever au regard doux, photographié en studio"
                  : "Portrait of a golden retriever with a gentle gaze, photographed in studio"
              }
              className="relative h-full w-full"
            />
          </div>

          {/* Right column: subtitle paragraph + service carousel. */}
          <div className="relative z-20 mt-10 pb-12 lg:absolute lg:bottom-16 lg:right-12 lg:mt-0 lg:max-w-xs lg:pb-0">
            <p className="mb-6 text-base leading-relaxed text-ink-500 lg:text-right">{t.home.heroSub}</p>
            <HeroCarousel
              slides={t.home.services}
              icons={SERVICE_ICONS}
              prevLabel={t.common.prevSlide}
              nextLabel={t.common.nextSlide}
              goToLabel={t.common.goToSlide}
            />
          </div>
        </div>
      </section>

      <Section id="services">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{t.home.introTitle}</Eyebrow>
            <SectionTitle>{t.home.servicesTitle}</SectionTitle>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">{t.home.introBody}</p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.services.map((service, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <Reveal key={service.href} delay={i * 80}>
                  <Link
                    href={service.href}
                    className="group block h-full rounded-2xl border border-border bg-paper p-6 transition-all duration-200 hover:-translate-y-1 hover:border-forest-500 hover:shadow-lg"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100 text-forest-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-medium text-forest-900">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{service.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terracotta-600 group-hover:gap-2">
                      {t.common.learnMore}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-forest-900 text-cream">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow className="text-terracotta-400">{t.home.hoursTitle}</Eyebrow>
            <SectionTitle className="text-cream">{t.common.hours}</SectionTitle>
            <ul className="mt-6 divide-y divide-forest-800">
              {HOURS.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-3 text-sm">
                  <span className="capitalize text-sage-200">{dayLabel(h.day, locale)}</span>
                  <span className="font-medium text-cream">
                    {h.open && h.close
                      ? `${formatHourLabel(h.open, locale)} - ${formatHourLabel(h.close, locale)}`
                      : t.common.closedToday}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-sage-300">{t.home.hoursNote}</p>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow className="text-terracotta-400">{t.home.trustTitle}</Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {t.home.trustItems.map((item, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <div key={item.title} className="rounded-2xl bg-forest-800/60 p-5">
                    <Icon className="h-6 w-6 text-terracotta-400" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-base font-medium text-cream">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-sage-200">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="rounded-3xl bg-terracotta-500 px-8 py-14 text-center text-cream sm:px-16">
            <SectionTitle className="text-cream">{t.home.bookingCtaTitle}</SectionTitle>
            <p className="mx-auto mt-3 max-w-xl text-terracotta-100">{t.home.bookingCtaBody}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <LinkButton href="/rendez-vous" size="lg" variant="secondary">
                {t.common.bookNow}
              </LinkButton>
              <LinkButton href="/contact" size="lg" variant="ghost" className="border-cream/40 text-cream hover:bg-cream/10">
                {t.nav.contact}
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
