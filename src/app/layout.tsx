import type { Metadata } from "next";
import { Poppins, Aleo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DraftModeBanner } from "@/components/DraftModeBanner";
import { config } from "@/lib/config";

// Pantheon brand fonts: Poppins (primary sans) + Aleo (serif accent).
// Poppins is mapped onto the existing --font-geist-sans var so all styles pick it up.
const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const aleo = Aleo({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.site.name,
  description: config.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${aleo.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Navigation />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <DraftModeBanner />
      </body>
    </html>
  );
}
