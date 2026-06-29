"use client";

import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section, SectionTitle } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { OpenBadge } from "@/components/OpenBadge";
import { CLINIC, EMERGENCY_REFERRAL } from "@/config/clinic";
import { openChatWidget } from "@/lib/openChat";
import urgencesPhoto from "../../../public/images/service-urgences.png";

export default function UrgencesPage() {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-danger-100/60">
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-medium leading-none text-forest-900/[0.06] sm:block"
            style={{ fontSize: "clamp(5rem, 12vw, 9.5rem)" }}
          >
            {locale === "fr" ? "URGENCE" : "EMERGENCY"}
          </p>

          <div>
            <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 text-balance sm:text-5xl">
              {t.urgences.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">{t.urgences.intro}</p>
            <div className="mt-6">
              <OpenBadge />
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(17,32,26,0.45)] ring-1 ring-forest-950/10">
            <Image
              src={urgencesPhoto}
              alt={
                locale === "fr"
                  ? "Vétérinaire posant un bandage bleu sur la patte d'un Jack Russell, devant un moniteur cardiaque actif"
                  : "Veterinarian wrapping a blue bandage on a Jack Russell's paw with an active heart-rate monitor in the background"
              }
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              unoptimized
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-paper p-7">
            <h2 className="font-display text-xl font-medium text-forest-900">{t.urgences.duringHoursTitle}</h2>
            <p className="mt-3 text-ink-500">
              {t.urgences.duringHoursBody.replace("{phone}", CLINIC.phone)}
            </p>
            <a
              href={CLINIC.phoneHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-medium text-cream hover:bg-forest-800"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {CLINIC.phone}
            </a>
          </Reveal>

          <Reveal delay={100} className="rounded-2xl border border-border bg-paper p-7">
            <h2 className="font-display text-xl font-medium text-forest-900">{t.urgences.afterHoursTitle}</h2>
            <p className="mt-3 text-ink-500">
              {t.urgences.afterHoursBody.replace("{name}", EMERGENCY_REFERRAL.name).replace("{phone}", EMERGENCY_REFERRAL.phone)}
            </p>
            <p className="mt-2 text-xs text-ink-300">* {t.urgences.afterHoursNote}</p>
            <Button onClick={openChatWidget} variant="secondary" size="md" className="mt-5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t.urgences.openAssistant}
            </Button>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-sage-100">
        <Container>
          <Reveal>
            <SectionTitle>{t.urgences.signsTitle}</SectionTitle>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {t.urgences.signs.map((sign, i) => (
              <Reveal
                key={sign}
                as="li"
                delay={i * 60}
                direction="none"
                className="flex items-start gap-3 rounded-xl bg-paper p-4 text-sm text-ink-700"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-danger-600" aria-hidden="true" />
                {sign}
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LinkButton href="/rendez-vous" size="lg">
              {t.common.bookNow}
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
