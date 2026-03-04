
import type { Metadata, Viewport } from "next";
import { Inter, Public_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '700', '900'],
  variable: '--font-public-sans'
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ['700'],
  variable: '--font-playfair-display'
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#042153",
};

export const metadata: Metadata = {
  title: "Komi — Familia y Bienestar",
  description: "Gestión para Comisarías de Familia - Ley 2126",
  manifest: "/manifest.json?v=2",
  icons: {
    icon: [
      { url: "/ico_komi_azul.ico?v=2", type: "image/x-icon" },
      { url: "/logo_komi_azul.svg?v=2", type: "image/svg+xml" },
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/ico_komi_azul.ico?v=2",
    apple: "/icon-192.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${publicSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
