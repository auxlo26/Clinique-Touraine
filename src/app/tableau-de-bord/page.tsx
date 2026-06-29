"use client";

import { useEffect, useState } from "react";
import { Lock, CalendarCheck, PhoneCall, MessageCircleQuestion } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Container, Section } from "@/components/ui/Container";
import { formatHourLabel } from "@/config/clinic";
import type { Booking, CallbackRequest } from "@/lib/types";

const MOCK_FAQ = [
  { fr: "Quelles sont vos heures d'ouverture?", en: "What are your opening hours?", count: 42 },
  { fr: "Faites-vous la pension pour les chats?", en: "Do you offer boarding for cats?", count: 27 },
  { fr: "Puis-je prendre rendez-vous pour une vaccination?", en: "Can I book a vaccination appointment?", count: 23 },
  { fr: "Acceptez-vous les urgences le soir?", en: "Do you take emergencies in the evening?", count: 18 },
  { fr: "Quelles marques de nourriture vendez-vous?", en: "What food brands do you sell?", count: 11 },
];

export default function TableauDeBordPage() {
  const { t, locale } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/callbacks").then((r) => r.json()),
    ])
      .then(([b, c]) => {
        setBookings(b.bookings ?? []);
        setCallbacks(c.callbacks ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="border-b border-border bg-forest-950 text-cream">
        <Container className="py-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-500">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-medium">{t.dashboard.title}</h1>
              <p className="text-sm text-sage-300">{t.dashboard.privateNote}</p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="space-y-12">
        <Container>
          <h2 className="flex items-center gap-2 font-display text-xl font-medium text-forest-900">
            <CalendarCheck className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.dashboard.upcomingTitle}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            {loading ? (
              <p className="p-6 text-sm text-ink-500">...</p>
            ) : bookings.length === 0 ? (
              <p className="p-6 text-sm text-ink-500">{t.dashboard.noBookings}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-sage-100 text-ink-700">
                  <tr>
                    {[
                      t.dashboard.columns.reference,
                      t.dashboard.columns.name,
                      t.dashboard.columns.service,
                      t.dashboard.columns.animal,
                      t.dashboard.columns.date,
                      t.dashboard.columns.time,
                      t.dashboard.columns.phone,
                    ].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings
                    .slice()
                    .reverse()
                    .map((b) => (
                      <tr key={b.reference}>
                        <td className="px-4 py-3 font-mono text-xs">{b.reference}</td>
                        <td className="px-4 py-3">{b.name}</td>
                        <td className="px-4 py-3">{b.service}</td>
                        <td className="px-4 py-3">{b.animal}</td>
                        <td className="px-4 py-3">{b.date}</td>
                        <td className="px-4 py-3">{formatHourLabel(b.time, locale)}</td>
                        <td className="px-4 py-3">{b.phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Container>

        <Container>
          <h2 className="flex items-center gap-2 font-display text-xl font-medium text-forest-900">
            <PhoneCall className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.dashboard.callbacksTitle}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            {loading ? (
              <p className="p-6 text-sm text-ink-500">...</p>
            ) : callbacks.length === 0 ? (
              <p className="p-6 text-sm text-ink-500">{t.dashboard.noCallbacks}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-sage-100 text-ink-700">
                  <tr>
                    {[
                      t.dashboard.columns.reference,
                      t.dashboard.columns.name,
                      t.dashboard.columns.phone,
                      t.dashboard.columns.reason,
                      t.dashboard.columns.receivedAt,
                    ].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {callbacks
                    .slice()
                    .reverse()
                    .map((c) => (
                      <tr key={c.reference} className={c.isEmergency ? "bg-danger-100/40" : undefined}>
                        <td className="px-4 py-3 font-mono text-xs">{c.reference}</td>
                        <td className="px-4 py-3">{c.name}</td>
                        <td className="px-4 py-3">{c.phone}</td>
                        <td className="px-4 py-3">{c.reason}</td>
                        <td className="px-4 py-3">{new Date(c.createdAt).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Container>

        <Container>
          <h2 className="flex items-center gap-2 font-display text-xl font-medium text-forest-900">
            <MessageCircleQuestion className="h-5 w-5 text-terracotta-600" aria-hidden="true" /> {t.dashboard.faqTitle}
          </h2>
          <p className="mt-1 text-xs text-ink-300">{t.dashboard.faqNote}</p>
          <ul className="mt-4 space-y-2">
            {MOCK_FAQ.map((q) => (
              <li key={q.fr} className="flex items-center justify-between rounded-xl border border-border bg-paper px-4 py-3 text-sm">
                <span className="text-ink-700">{locale === "fr" ? q.fr : q.en}</span>
                <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-semibold text-forest-700">
                  {q.count} {t.dashboard.columns.count}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
