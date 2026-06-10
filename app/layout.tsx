import { Inter_Tight, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';

import { JetBrains_Mono } from "next/font/google";

const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Meteo Explorer - Globe météorologique interactif 3D',
  description: 'Explorez les conditions météorologiques mondiales sur un globe 3D interactif. Données en temps réel, prévisions 7 jours, interface immersive avec Three.js et react-globe.gl.',
  keywords: ['météo', 'globe 3D', 'weather', 'interactive', 'three.js', 'react-globe.gl', 'visualisation météorologique'],
  authors: [{ name: 'Johan Lorck' }],
  creator: 'Johan Lorck',
  publisher: 'Johan Lorck',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Meteo Explorer - Globe météorologique interactif 3D',
    description: 'Explorez les conditions météorologiques mondiales sur un globe 3D interactif. Données en temps réel, prévisions 7 jours.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Meteo Explorer',
  },
  category: 'weather',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="description" content="Explorez les conditions météorologiques mondiales sur un globe 3D interactif. Données en temps réel, prévisions 7 jours, interface immersive avec Three.js et react-globe.gl." />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://nominatim.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-body)]`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
