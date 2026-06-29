"use client";

import { Stethoscope, Users } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section, Eyebrow, SectionTitle } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/ui/Reveal";

export default function AProposPage() {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-sage-100">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-medium leading-none text-forest-900/[0.06] sm:block"
          style={{ fontSize: "clamp(5rem, 12vw, 9.5rem)" }}
        >
          {locale === "fr" ? "DEPUIS 1979" : "SINCE 1979"}
        </p>
        <Container className="relative py-16 sm:py-20">
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 sm:text-5xl">
            {t.aPropos.title}
          </h1>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>{t.aPropos.historyTitle}</Eyebrow>
            <SectionTitle>{t.aPropos.historyTitle}</SectionTitle>
            <p className="mt-4 leading-relaxed text-ink-500">{t.aPropos.historyBody}</p>
            <p className="mt-3 text-xs text-ink-300">* {t.aPropos.sinceNote}</p>
          </Reveal>
          <PhotoPlaceholder
            alt={
              locale === "fr"
                ? "Façade chaleureuse de la Clinique Vétérinaire Touraine à Gatineau"
                : "Welcoming exterior of Clinique Vétérinaire Touraine in Gatineau"
            }
            icon={Stethoscope}
            palette={1}
            className="aspect-[4/3] w-full"
          />
        </Container>
      </Section>

      <Section className="bg-paper">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <PhotoPlaceholder
            alt={
              locale === "fr"
                ? `Portrait professionnel du ${t.aPropos.leadVetName}, vétérinaire principal de la clinique`
                : `Professional portrait of ${t.aPropos.leadVetName}, the clinic's lead veterinarian`
            }
            icon={Stethoscope}
            palette={0}
            className="aspect-[4/3] w-full lg:order-2"
          />
          <Reveal className="lg:order-1">
            <Eyebrow>{t.aPropos.leadVetTitle}</Eyebrow>
            <SectionTitle>{t.aPropos.leadVetName}</SectionTitle>
            <p className="mt-4 leading-relaxed text-ink-500">{t.aPropos.leadVetBody}</p>
            <p className="mt-3 text-xs text-ink-300">* {t.aPropos.omvqNote}</p>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-sage-100">
        <Container>
          <Reveal className="mx-auto max-w-xl text-center">
            <Eyebrow>{t.aPropos.teamTitle}</Eyebrow>
            <SectionTitle>{t.aPropos.teamTitle}</SectionTitle>
            <p className="mt-3 text-sm text-ink-500">{t.aPropos.teamNote}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.aPropos.teamPlaceholders.map((label, i) => (
              <Reveal key={i} delay={i * 90} className="rounded-2xl border border-border bg-paper p-6 text-center">
                <PhotoPlaceholder
                  alt={
                    locale === "fr"
                      ? "Espace réservé pour la photo d'un membre de l'équipe (à venir)"
                      : "Placeholder for a team member's photo (coming soon)"
                  }
                  icon={Users}
                  palette={(i % 3) as 0 | 1 | 2}
                  className="aspect-square w-full"
                />
                <p className="mt-4 text-sm font-medium text-ink-700">{label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
