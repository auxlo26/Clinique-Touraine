"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CLINIC, CLINIC_FULL_ADDRESS, HOURS, dayLabel, formatHourLabel } from "@/config/clinic";

export default function ContactPage() {
  const { t, locale } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_FULL_ADDRESS)}&output=embed`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t.contact.form.requiredField);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.contact.form.invalidEmail);
      return;
    }
    if (!consent) {
      setError(t.contact.form.consentRequired);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, consent }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t.contact.form.error);
    }
  }

  return (
    <>
      <section className="border-b border-border bg-sage-100">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 sm:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-500">{t.contact.intro}</p>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={t.contact.mapAlt}
                src={mapSrc}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-2xl border border-border bg-paper p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-medium text-forest-900">
                <MapPin className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.contact.addressTitle}
              </h2>
              <address className="mt-2 text-ink-500 not-italic">{CLINIC_FULL_ADDRESS}</address>

              <h2 className="mt-6 flex items-center gap-2 font-display text-lg font-medium text-forest-900">
                <Phone className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.contact.phoneTitle}
              </h2>
              <a href={CLINIC.phoneHref} className="mt-2 inline-block text-ink-500 hover:text-forest-700">
                {CLINIC.phone}
              </a>

              <h2 className="mt-6 flex items-center gap-2 font-display text-lg font-medium text-forest-900">
                <Clock className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.contact.hoursTitle}
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-ink-500">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="capitalize">{dayLabel(h.day, locale)}</span>
                    <span>
                      {h.open && h.close
                        ? `${formatHourLabel(h.open, locale)} - ${formatHourLabel(h.close, locale)}`
                        : t.common.closedToday}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-paper p-7">
            <h2 className="font-display text-xl font-medium text-forest-900">{t.contact.formTitle}</h2>

            {status === "success" ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-success-100 p-4 text-success-600">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="text-sm">{t.contact.form.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Field label={t.contact.form.name} id="contact-name" value={name} onChange={setName} required />
                <Field
                  label={t.contact.form.email}
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <Field label={t.contact.form.phone} id="contact-phone" type="tel" value={phone} onChange={setPhone} />
                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-ink-700">
                    {t.contact.form.message} <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border-strong bg-cream px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-sm text-ink-500">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-border-strong text-forest-700 focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  />
                  <span>
                    {t.contact.form.consent}{" "}
                    <Link href="/confidentialite" className="font-medium text-forest-700 underline">
                      {t.contact.form.consentLink}
                    </Link>
                    .
                  </span>
                </label>

                {error && (
                  <p role="alert" className="text-sm text-danger-600">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full justify-center" disabled={status === "sending"}>
                  {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                </Button>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink-700">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "name"}
        className="mt-1.5 w-full rounded-xl border border-border-strong bg-cream px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
      />
    </div>
  );
}
