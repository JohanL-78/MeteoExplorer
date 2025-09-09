import { Orbitron } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400","700"] });

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
      <body className={orbitron.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
