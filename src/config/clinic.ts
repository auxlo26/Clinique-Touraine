// Single source of truth for clinic facts, hours, and contact info.
// Every page and component must read from here. Never hardcode hours or
// contact details anywhere else in the app.

export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface DayHours {
  day: Weekday;
  open: string | null; // "HH:MM" 24h, null = closed
  close: string | null;
}

export const CLINIC = {
  name: "Clinique Vétérinaire Touraine",
  // À CONFIRMER: l'ancien site indique 1980 dans le corps du texte mais 1979
  // ailleurs. À valider avec la clinique avant la mise en ligne.
  since: 1979,
  phone: "819-568-1444",
  phoneHref: "tel:+18195681444",
  address: {
    street: "2303, rue Saint-Louis",
    city: "Gatineau",
    province: "QC",
    postal: "J8T 5L8",
  },
  lead: "Dr Gilles Lanthier",
  timezone: "America/Toronto",
  foodBrands: ["Hill's", "Royal Canin"],
} as const;

export const CLINIC_FULL_ADDRESS = `${CLINIC.address.street}, ${CLINIC.address.city} (${CLINIC.address.province}) ${CLINIC.address.postal}`;

// ONE schedule. À CONFIRMER avec la clinique : l'ancien site se contredisait
// (section "Heures d'ouverture" vs section "Pour nous joindre par téléphone").
// Toutes les pages, l'en-tête, le pied de page et l'assistant lisent cette
// même liste : les heures ne peuvent plus jamais se contredire.
export const HOURS: DayHours[] = [
  { day: "sunday", open: null, close: null },
  { day: "monday", open: null, close: null },
  { day: "tuesday", open: "08:00", close: "17:00" },
  { day: "wednesday", open: "08:00", close: "17:00" },
  { day: "thursday", open: "08:00", close: "17:00" },
  { day: "friday", open: "08:00", close: "10:00" },
  { day: "saturday", open: "08:00", close: "10:00" },
];

// À CONFIRMER : la clinique doit nous fournir le nom et le numéro réels
// d'une ressource d'urgence vétérinaire 24 h avant la mise en ligne.
export const EMERGENCY_REFERRAL = {
  name: "[Hôpital vétérinaire d'urgence 24 h, À CONFIRMER]",
  phone: "[À CONFIRMER]",
};

// À CONFIRMER : nom de la personne responsable de la protection des
// renseignements personnels (exigence de la Loi 25).
export const PRIVACY_OFFICER = "[Nom à confirmer], responsable de la protection des renseignements personnels";

const DAY_ORDER: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function nowInClinicTz(): Date {
  const s = new Date().toLocaleString("en-US", { timeZone: CLINIC.timezone });
  return new Date(s);
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenState {
  isOpen: boolean;
  today: DayHours;
  /** Next time the clinic opens, as a Date in the clinic's local wall time. */
  nextOpen: { day: Weekday; open: string; date: Date } | null;
}

/** Computes whether the clinic is open right now, from HOURS, in the clinic's timezone. */
export function isOpenNow(at: Date = nowInClinicTz()): OpenState {
  const dayIndex = at.getDay();
  const today = HOURS[dayIndex];
  const minutesNow = at.getHours() * 60 + at.getMinutes();

  const isOpen =
    today.open !== null &&
    today.close !== null &&
    minutesNow >= toMinutes(today.open) &&
    minutesNow < toMinutes(today.close);

  return {
    isOpen,
    today,
    nextOpen: isOpen ? null : findNextOpen(at),
  };
}

function findNextOpen(at: Date): { day: Weekday; open: string; date: Date } | null {
  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(at);
    candidate.setDate(at.getDate() + offset);
    const dayIndex = candidate.getDay();
    const hours = HOURS[dayIndex];
    if (!hours.open) continue;

    if (offset === 0) {
      const minutesNow = at.getHours() * 60 + at.getMinutes();
      if (minutesNow >= toMinutes(hours.close!)) continue; // already closed for today
    }

    const [h, m] = hours.open.split(":").map(Number);
    const date = new Date(candidate);
    date.setHours(h, m, 0, 0);
    return { day: DAY_ORDER[dayIndex], open: hours.open, date };
  }
  return null;
}

export function dayLabel(day: Weekday, locale: "fr" | "en"): string {
  const labels: Record<Weekday, [string, string]> = {
    sunday: ["dimanche", "Sunday"],
    monday: ["lundi", "Monday"],
    tuesday: ["mardi", "Tuesday"],
    wednesday: ["mercredi", "Wednesday"],
    thursday: ["jeudi", "Thursday"],
    friday: ["vendredi", "Friday"],
    saturday: ["samedi", "Saturday"],
  };
  return labels[day][locale === "fr" ? 0 : 1];
}

export function formatHourLabel(hhmm: string, locale: "fr" | "en"): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (locale === "fr") {
    return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
  }
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Available time slots (HH:MM, every 30 min) for a given date, from HOURS. Empty if closed. */
export function slotsForDate(date: Date): string[] {
  const hours = HOURS[date.getDay()];
  if (!hours.open || !hours.close) return [];
  const start = toMinutes(hours.open);
  const end = toMinutes(hours.close);
  const slots: string[] = [];
  for (let m = start; m < end; m += 30) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}
