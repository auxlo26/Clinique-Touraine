"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { CheckCircle2, ChevronLeft, ChevronRight, Stethoscope, Dog, CalendarDays, User } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatHourLabel, slotsForDate } from "@/config/clinic";

type Step = 0 | 1 | 2 | 3 | 4;
const STEP_ICONS = [Stethoscope, Dog, CalendarDays, User, CheckCircle2];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function RendezVousPage() {
  const { t, locale } = useLocale();
  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState("");
  const [animal, setAnimal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const stepLabels = [
    t.rendezVous.steps.service,
    t.rendezVous.steps.animal,
    t.rendezVous.steps.datetime,
    t.rendezVous.steps.details,
    t.rendezVous.steps.confirm,
  ];

  const availableSlots = useMemo(() => {
    if (!date) return [];
    const all = slotsForDate(new Date(`${date}T00:00:00`));
    if (date !== todayISO()) return all;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return all.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    });
  }, [date]);

  function goNext() {
    setError("");
    if (step === 0 && !service) return setError(t.rendezVous.errors.required);
    if (step === 1 && !animal) return setError(t.rendezVous.errors.required);
    if (step === 2) {
      if (!date) return setError(t.rendezVous.errors.required);
      if (!time) return setError(t.rendezVous.errors.noSlot);
    }
    setStep((s) => Math.min(4, s + 1) as Step);
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  async function submitBooking() {
    setError("");
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(t.rendezVous.errors.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.rendezVous.errors.invalidEmail);
      return;
    }
    if (!consent) {
      setError(t.rendezVous.consentRequired);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ service, animal, date, time, name, phone, email, notes, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(t.rendezVous.errors.generic);
        return;
      }
      setReference(data.booking.reference);
      setStep(4);
    } catch {
      setError(t.rendezVous.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  const serviceLabel = t.rendezVous.serviceOptions.find((o) => o.value === service)?.label;
  const animalLabel = t.rendezVous.animalOptions.find((o) => o.value === animal)?.label;

  return (
    <>
      <section className="border-b border-border bg-sage-100">
        <Container className="py-14 sm:py-16">
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest-950 sm:text-5xl">
            {t.rendezVous.title}
          </h1>
          <p className="mt-3 max-w-xl text-ink-500">{t.rendezVous.intro}</p>
        </Container>
      </section>

      <Section>
        <Container className="max-w-2xl">
          <ol className="mb-10 flex items-center justify-between" aria-label={t.rendezVous.title}>
            {stepLabels.map((label, i) => {
              const Icon = STEP_ICONS[i];
              const isActive = i === step;
              const isDone = i < step;
              return (
                <li key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <span
                      className={clsx(
                        "flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors",
                        isActive
                          ? "border-terracotta-500 bg-terracotta-500 text-cream"
                          : isDone
                            ? "border-forest-600 bg-forest-600 text-cream"
                            : "border-border-strong bg-paper text-ink-300"
                      )}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className={clsx("hidden text-xs sm:block", isActive ? "font-semibold text-forest-800" : "text-ink-300")}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <span className={clsx("mx-1 h-px flex-1", isDone ? "bg-forest-600" : "bg-border-strong")} aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>

          <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
            {step === 0 && (
              <fieldset>
                <legend className="font-display text-lg font-medium text-forest-900">{t.rendezVous.serviceLabel}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t.rendezVous.serviceOptions.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={service === opt.value}
                      onClick={() => setService(opt.value)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="font-display text-lg font-medium text-forest-900">{t.rendezVous.animalLabel}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t.rendezVous.animalOptions.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={animal === opt.value}
                      onClick={() => setAnimal(opt.value)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="booking-date" className="font-display text-lg font-medium text-forest-900">
                  {t.rendezVous.dateLabel}
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime("");
                  }}
                  className="mt-3 w-full rounded-xl border border-border-strong bg-cream px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                />

                {date && (
                  <div className="mt-6">
                    <p className="font-display text-base font-medium text-forest-900">{t.rendezVous.timeLabel}</p>
                    {availableSlots.length === 0 ? (
                      <p className="mt-2 text-sm text-ink-500">{t.rendezVous.noSlotsMessage}</p>
                    ) : (
                      <>
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={clsx(
                                "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                                time === slot
                                  ? "border-terracotta-500 bg-terracotta-500 text-cream"
                                  : "border-border-strong bg-cream text-ink-700 hover:border-forest-500"
                              )}
                            >
                              {formatHourLabel(slot, locale)}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-ink-300">{t.rendezVous.pastSlotNote}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-lg font-medium text-forest-900">{t.rendezVous.detailsTitle}</h2>
                <div className="mt-4 space-y-4">
                  <TextField label={t.rendezVous.nameLabel} id="name" value={name} onChange={setName} required />
                  <TextField label={t.rendezVous.phoneLabel} id="phone" type="tel" value={phone} onChange={setPhone} required />
                  <TextField label={t.rendezVous.emailLabel} id="email" type="email" value={email} onChange={setEmail} required />
                  <div>
                    <label htmlFor="notes" className="text-sm font-medium text-ink-700">
                      {t.rendezVous.notesLabel}
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t.rendezVous.notesPlaceholder}
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-border-strong bg-cream px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                    />
                  </div>
                  <label className="flex items-start gap-2.5 text-sm text-ink-500">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border-strong text-forest-700 focus-visible:outline-2 focus-visible:outline-terracotta-500"
                    />
                    <span>
                      {t.rendezVous.consentLabel}{" "}
                      <Link href="/confidentialite" className="font-medium text-forest-700 underline">
                        {t.rendezVous.consentLink}
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 4 && reference && (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success-600" aria-hidden="true" />
                <h2 className="mt-4 font-display text-xl font-medium text-forest-900">{t.rendezVous.confirmationTitle}</h2>
                <p className="mt-2 text-ink-500">{t.rendezVous.confirmationBody}</p>

                <dl className="mt-6 space-y-2 rounded-xl bg-sage-100 p-5 text-left text-sm">
                  <Row label={t.rendezVous.referenceLabel} value={reference} strong />
                  <Row label={t.rendezVous.serviceLabel} value={serviceLabel ?? service} />
                  <Row label={t.rendezVous.animalLabel} value={animalLabel ?? animal} />
                  <Row label={t.rendezVous.dateLabel} value={date} />
                  <Row label={t.rendezVous.timeLabel} value={formatHourLabel(time, locale)} />
                  <Row label={t.rendezVous.nameLabel} value={name} />
                </dl>
                <p className="mt-4 text-xs text-ink-300">{t.rendezVous.confirmationNote}</p>

                <Button
                  variant="secondary"
                  size="md"
                  className="mt-6"
                  onClick={() => {
                    setStep(0);
                    setService("");
                    setAnimal("");
                    setDate("");
                    setTime("");
                    setName("");
                    setPhone("");
                    setEmail("");
                    setNotes("");
                    setConsent(false);
                    setReference(null);
                  }}
                >
                  {t.rendezVous.newBooking}
                </Button>
              </div>
            )}

            {error && step !== 4 && (
              <p role="alert" className="mt-5 text-sm text-danger-600">
                {error}
              </p>
            )}

            {step < 4 && (
              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={goBack} disabled={step === 0}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {t.rendezVous.back}
                </Button>
                {step < 3 ? (
                  <Button size="md" onClick={goNext}>
                    {t.rendezVous.next} <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button size="md" onClick={submitBooking} disabled={submitting}>
                    {submitting ? t.rendezVous.submitting : t.rendezVous.confirmBooking}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function OptionCard({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        selected ? "border-terracotta-500 bg-terracotta-100 text-terracotta-700" : "border-border-strong bg-cream text-ink-700 hover:border-forest-500"
      )}
    >
      {label}
    </button>
  );
}

function TextField({
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
        className="mt-1.5 w-full rounded-xl border border-border-strong bg-cream px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
      />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className={clsx(strong && "font-semibold text-forest-800")}>{value}</dd>
    </div>
  );
}
