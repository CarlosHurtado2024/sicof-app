
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1B2A4A",
};

export const metadata: Metadata = {
  title: "Komi — Familia y Bienestar",
  description: "Gestión para Comisarías de Familia - Ley 2126",
  manifest: "/manifest.json?v=2",
  icons: {
    icon: [
      { url: "/ico_komi.ico?v=2", type: "image/x-icon" },
      { url: "/logo_komi.svg?v=2", type: "image/svg+xml" },
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/ico_komi.ico?v=2",
    apple: "/icon-192.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
