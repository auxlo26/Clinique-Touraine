# Clinique Vétérinaire Touraine — site mockup

Sales demo mockup of a new bilingual website for Clinique Vétérinaire Touraine
(Gatineau, QC). Built with Next.js (App Router), TypeScript, and Tailwind CSS.

This is a functional demo, not a wireframe: booking, the AI assistant, and the
privacy consent flow all work end to end.

## What's inside

- Bilingual (FR-CA / EN) marketing site: Accueil, Soins de base, Chirurgies de
  routine, Urgences, Pension, À propos, Contact.
- A single source of truth for hours and contact info at
  [`src/config/clinic.ts`](src/config/clinic.ts). Every page, the header, the
  footer, and the AI assistant read from this one file, so the hours can never
  contradict each other again.
- A real multi-step booking flow at `/rendez-vous`, with slots computed from
  the hours above, persisted to a local JSON file.
- A floating bilingual AI assistant that answers logistics questions, helps
  book appointments, and switches to an after-hours mode (with emergency
  triage and callback capture) when the clinic is closed.
- Loi 25 compliance: a real Accept/Decline cookie banner, a privacy policy
  page, and consent checkboxes on the booking and contact forms.
- A demo dashboard at `/tableau-de-bord` that reads back real bookings and
  callback requests, so the clinic can see what they keep after the project.

### About the homepage photo

[`public/images/hero-dog.jpg`](public/images/hero-dog.jpg) is a stand-in
photo (free Unsplash license, no attribution required) used to show what the
hero looks like with real photography instead of a placeholder. Swap it for
an actual photo of one of the clinic's patients before launch.

### Items still marked "À CONFIRMER"

A few facts from the old site were contradictory or unverifiable and are
marked `À CONFIRMER` (or `to confirm`) directly in the code and, where they
appear on the page, with a small note for the visitor. These need sign-off
from the clinic before launch:

- The founding year (1979 vs. 1980, see [`src/config/clinic.ts`](src/config/clinic.ts)).
- The weekly opening hours (the old site's footer and header contradicted
  each other; the values here are a best guess that needs the clinic's
  confirmation).
- The 24-hour emergency referral name and phone number (`EMERGENCY_REFERRAL`
  in the same file) — currently a placeholder.
- The name of the person responsible for the protection of personal
  information (`PRIVACY_OFFICER`), required for the privacy policy page.
- OMVQ membership, mentioned on the About page.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Enabling the live AI assistant

The assistant works out of the box with no setup: without an API key it
automatically falls back to a small built-in bilingual response set (see
[`src/lib/assistant/fallback.ts`](src/lib/assistant/fallback.ts)), so the demo
still works fully offline.

To enable the live model:

1. Copy `.env.example` to `.env.local`.
2. Set `ANTHROPIC_API_KEY` to a valid Anthropic API key.
3. Restart the dev server.

The key is only ever read server-side, inside the `/api/chat` route handler.
It is never sent to the browser.

## Where demo data is stored

Bookings, after-hours callback requests, and contact form submissions are
written to JSON files under `/data` (gitignored, created automatically on
first write). The dashboard at `/tableau-de-bord` reads this data back. To
reset the demo, delete the `/data` folder.

## Project structure

```
src/config/clinic.ts        Single source of truth: hours, contact, isOpenNow()
src/i18n/                   Locale context + FR/EN dictionaries
src/components/             Header, footer, consent banner, chat widget, UI kit
src/lib/assistant/          System prompt + offline fallback responses
src/lib/store.ts            Tiny JSON-file persistence helper
src/app/api/chat            AI assistant proxy (Anthropic Messages API)
src/app/api/bookings        Booking persistence + validation
src/app/api/callbacks       After-hours callback request persistence
src/app/rendez-vous         Multi-step booking flow
src/app/tableau-de-bord     Internal demo dashboard
```

## Deploying to Netlify

1. Push this repository to GitHub (or connect it directly from your machine
   with the Netlify CLI).
2. In Netlify, create a new site from the repository. The official Next.js
   runtime plugin (`@netlify/plugin-nextjs`) is auto-detected, no extra config
   needed for build command or publish directory.
3. Under Site settings → Environment variables, add `ANTHROPIC_API_KEY` if you
   want the live assistant in production.
4. Deploy. Note that `/data` is local-disk storage meant for this demo only;
   on Netlify's serverless functions it will not persist between requests. For
   a real deployment, swap `src/lib/store.ts` for a real database before
   relying on the booking/callback history in production.

## Quality checklist

- Responsive from 375px mobile up to desktop.
- Visible keyboard focus on all interactive elements, full keyboard
  navigation (forms, booking steps, chat widget, mobile menu).
- `prefers-reduced-motion` is respected globally (see `globals.css`).
- Semantic HTML, labelled form fields, alt text (or `role="img"` + `aria-label`
  for the illustrative photo placeholders) throughout.
- No em dashes or en dashes anywhere in the copy.
