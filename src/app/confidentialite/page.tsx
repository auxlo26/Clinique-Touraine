"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section } from "@/components/ui/Container";
import { CLINIC } from "@/config/clinic";

export default function ConfidentialitePage() {
  const { t } = useLocale();

  return (
    <>
      <section className="border-b border-border bg-sage-100">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 sm:text-5xl">
            {t.confidentialite.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">{t.confidentialite.intro}</p>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl space-y-8">
          {t.confidentialite.sections.map((section, i) => (
            <div key={section.title}>
              <h2 className="font-display text-xl font-medium text-forest-900">
                {i + 1}. {section.title}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-500">
                {section.body}
                {section.title.toLowerCase().includes("responsable") ||
                section.title.toLowerCase().includes("information") ? (
                  <span className="ml-1 inline-block rounded bg-terracotta-100 px-1.5 py-0.5 text-xs font-medium text-terracotta-700">
                    {t.common.confirmTag}
                  </span>
                ) : null}
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-border bg-sage-100 p-6 text-sm text-ink-700">
            {t.confidentialite.contactNote}{" "}
            <a href={CLINIC.phoneHref} className="font-medium text-forest-700 underline">
              {CLINIC.phone}
            </a>
            .
          </div>
        </Container>
      </Section>
    </>
  );
}
