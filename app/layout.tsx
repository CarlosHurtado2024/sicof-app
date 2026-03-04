
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
  themeColor: "#2B463C",
};

export const metadata: Metadata = {
  title: "Komi — Familia y Bienestar",
  description: "Gestión para Comisarías de Familia - Ley 2126",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/komi_logo.ico", type: "image/x-icon" },
    ],
    shortcut: "/komi_logo.ico",
    apple: "/apple-touch-icon.png",
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
