import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const TITLE = "Clinique Vétérinaire Touraine | Gatineau";
const DESCRIPTION =
  "Clinique vétérinaire à Gatineau depuis 1979. Soins de base, chirurgies, pension. Prenez rendez-vous en ligne, en français ou en anglais.";

export const metadata: Metadata = {
  // À CONFIRMER: remplacer par le domaine réel au moment du déploiement.
  metadataBase: new URL("https://clinique-veterinaire-touraine.netlify.app"),
  title: {
    default: TITLE,
    template: "%s | Clinique Vétérinaire Touraine",
  },
  description: DESCRIPTION,
  keywords: [
    "clinique vétérinaire Gatineau",
    "vétérinaire Gatineau",
    "veterinarian Gatineau",
    "rendez-vous vétérinaire",
    "pension animaux Gatineau",
  ],
  authors: [{ name: "Clinique Vétérinaire Touraine" }],
  alternates: {
    canonical: "/",
    languages: { fr: "/", en: "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Clinique Vétérinaire Touraine",
    title: TITLE,
    description: DESCRIPTION,
    locale: "fr_CA",
    alternateLocale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16291f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink-900 font-sans">
        <LocaleProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-forest-700 focus:px-4 focus:py-2 focus:text-cream"
          >
            Aller au contenu principal / Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <ConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
