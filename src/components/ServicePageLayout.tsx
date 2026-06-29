import type { LucideIcon } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";

interface ServiceSection {
  title: string;
  body: string;
}

export function ServicePageLayout({
  title,
  watermark,
  intro,
  sections,
  ctaTitle,
  icon,
  photoAlt,
  palette = 1,
  children,
}: {
  title: string;
  watermark: string;
  intro: string;
  sections: readonly ServiceSection[];
  ctaTitle: string;
  icon: LucideIcon;
  photoAlt: string;
  palette?: 0 | 1 | 2;
  children?: React.ReactNode;
}) {
  const { t } = useLocale();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-sage-100">
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-medium leading-none text-forest-900/[0.06] sm:block"
            style={{ fontSize: "clamp(5rem, 12vw, 9.5rem)" }}
          >
            {watermark}
          </p>

          <div>
            <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">{intro}</p>
            <div className="mt-7">
              <LinkButton href="/rendez-vous" size="lg">
                {t.common.bookNow}
              </LinkButton>
            </div>
          </div>
          <PhotoPlaceholder alt={photoAlt} icon={icon} palette={palette} className="relative aspect-[4/3] w-full" />
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="rounded-2xl border border-border bg-paper p-6">
                <span className="block h-0.5 w-6 bg-terracotta-500" aria-hidden="true" />
                <h2 className="mt-3 font-display text-lg font-medium text-forest-900">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
              </Reveal>
            ))}
          </div>

          {children}

          <Reveal className="mt-12 rounded-3xl bg-forest-800 px-8 py-12 text-center text-cream sm:px-14">
            <SectionTitle className="text-cream">{ctaTitle}</SectionTitle>
            <div className="mt-7">
              <LinkButton href="/rendez-vous" size="lg" variant="secondary">
                {t.common.bookNow}
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
