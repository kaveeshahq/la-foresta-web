import type { Metadata } from "next";
import {
  Geist,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "La Foresta",
    template: "%s | La Foresta",
  },
  description:
    "La Foresta — immersive electronic music experiences in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        geistSans.variable,
        spaceGrotesk.variable,
        jetBrainsMono.variable
      )}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}