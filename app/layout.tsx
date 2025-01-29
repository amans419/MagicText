import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster";
import { fontLinks } from "@/utils/preLoadFonts";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://textbehindimages.vercel.app/"),

  title:
    "Text Behind Image - Free Online Tool for add text behind photo Effects",
  description:
    "Easily create text behind image effects online. Free tool for adding stylish text overlays, transparent text effects, and layered typography on images. No design skills needed.",
  keywords:
    "text behind image, text effect generator, image text editor, text overlay tool, text on image maker, free text effects, online text editor, photo text design, typography effects, transparent text editor, overlay text online, text layering tool, creative text effects, image typography maker, stylish text on photo, text blending editor, background text remover, online text design, text under image effect, text photo editor, graphic text maker, free online text effects, layered text designs, text masking tool, text image composition, artistic text overlays",
  openGraph: {
    title: "Text Behind Image Generator - Free Online Tool for Stunning Text Effects",
    description:
      "Easily create stylish text behind image effects online. Free text overlay and typography tool.",
    type: "website",
    siteName: "Text Behind Image",
    url: "https://textbehindimages.vercel.app/",
    images: [
      {
        url: "/dog.png",
        width: 1200,
        height: 630,
        alt: "Text Behind Image - Free Online Text Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Behind Image - Free Online Text Editor",
    description:
      "Create stunning text effects with text behind image layers. No design skills needed.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
    other: {
    "google-site-verification": "PtREuswKzpLs4lN3-2iYjMJnuGMM4lkYqFPTQVCCA9g",
  },

};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <SupabaseProvider>
          <UserProvider>
            <div>
              {children}
              <Analytics />
              <SpeedInsights />
              <Toaster />
            </div>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
