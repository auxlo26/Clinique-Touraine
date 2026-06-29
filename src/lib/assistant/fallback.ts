import { CLINIC, CLINIC_FULL_ADDRESS, EMERGENCY_REFERRAL, formatHourLabel, type OpenState } from "@/config/clinic";
import type { Locale } from "@/i18n/LocaleProvider";

/**
 * Built-in bilingual response set used when ANTHROPIC_API_KEY is not configured,
 * so the demo still works when shown offline. See README for how to enable the
 * live model.
 */
export function getFallbackReply(userMessage: string, locale: Locale, openState: OpenState): string {
  const msg = userMessage.toLowerCase();

  const hoursReply =
    locale === "fr"
      ? `Nos heures: ${openState.today.open ? `aujourd'hui de ${formatHourLabel(openState.today.open, "fr")} à ${formatHourLabel(openState.today.close!, "fr")}` : "fermé aujourd'hui"}. En ce moment, la clinique est ${openState.isOpen ? "ouverte" : "fermée"}.`
      : `Our hours: ${openState.today.open ? `today from ${formatHourLabel(openState.today.open, "en")} to ${formatHourLabel(openState.today.close!, "en")}` : "closed today"}. Right now the clinic is ${openState.isOpen ? "open" : "closed"}.`;

  const locationReply =
    locale === "fr"
      ? `Nous sommes situés au ${CLINIC_FULL_ADDRESS}. Téléphone: ${CLINIC.phone}.`
      : `We're located at ${CLINIC_FULL_ADDRESS}. Phone: ${CLINIC.phone}.`;

  const servicesReply =
    locale === "fr"
      ? "Nous offrons le suivi annuel, la vaccination, les traitements, les chirurgies de routine (dont la stérilisation), les chirurgies d'urgence et la pension."
      : "We offer annual checkups, vaccination, treatment, routine surgery (including spay and neuter), emergency surgery, and boarding.";

  const foodReply =
    locale === "fr"
      ? `Nous vendons les marques ${CLINIC.foodBrands.join(" et ")} sur place.`
      : `We carry ${CLINIC.foodBrands.join(" and ")} food on site.`;

  const boardingReply =
    locale === "fr"
      ? "Pour la pension, prévoyez la nourriture habituelle de votre animal, ses médicaments si nécessaire, et son carnet de vaccination à jour. Vous pouvez réserver à la page Pension ou Rendez-vous."
      : "For boarding, please bring your animal's usual food, any medication, and an up-to-date vaccination record. You can book through the Boarding or Appointment page.";

  const bookingReply =
    locale === "fr"
      ? "Vous pouvez réserver en ligne directement à la page Rendez-vous (/rendez-vous), ou me dire ici le service souhaité, le type d'animal, et vos disponibilités, et je note votre demande."
      : "You can book online directly on the Appointment page (/rendez-vous), or tell me here the service you need, your animal type, and your availability, and I will note your request.";

  const emergencyReply =
    locale === "fr"
      ? `Pour une urgence vitale, contactez immédiatement ${EMERGENCY_REFERRAL.name} au ${EMERGENCY_REFERRAL.phone}. Voulez-vous aussi que je note une demande de rappel pour la clinique?`
      : `For a life-threatening emergency, contact ${EMERGENCY_REFERRAL.name} right away at ${EMERGENCY_REFERRAL.phone}. Would you also like me to log a callback request for the clinic?`;

  const defaultReply =
    locale === "fr"
      ? "Je peux vous renseigner sur nos heures, nos services, notre adresse, ou vous aider à prendre rendez-vous. Que souhaitez-vous savoir? (Mode hors ligne: mes réponses sont limitées en ce moment.)"
      : "I can help with our hours, services, address, or booking an appointment. What would you like to know? (Offline mode: my answers are limited right now.)";

  if (/urgen|emergenc|saign|bleed|accident|mort|dying|grave|poison/.test(msg)) return emergencyReply;
  if (/heure|hour|ouvert|ferm|open|closed|schedule|horaire/.test(msg)) return hoursReply;
  if (/adresse|address|locat|où|where|situ/.test(msg)) return locationReply;
  if (/nourritu|food|hill|royal canin|manger|feed/.test(msg)) return foodReply;
  if (/pension|board|garde|voyage|travel/.test(msg)) return boardingReply;
  if (/rendez|appointment|book|réserv|reserve/.test(msg)) return bookingReply;
  if (/service|chirurgie|surgery|vaccin|soin|care|stérilis|neuter|spay/.test(msg)) return servicesReply;

  return defaultReply;
}
