import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster";
import { fontLinks } from "@/utils/preLoadFonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://magictext.tech"),

  title:
    "MagicText - Create Text Behind Image Effects Online | Free Design Tool",
  description:
    "Create stunning text behind image designs in seconds. Free online tool to make text overlay effects, photo text designs, and text-behind-image compositions. No design skills needed.",
  keywords:
    "text behind image, text behind image maker, text behind image generator, text behind photo editor, image text overlay, text overlay maker, text overlay generator, photo text effects, text effect maker, text behind picture, text overlay design tool, free text behind image, online text behind image, image text design, text background remover, text overlay online, text behind image online editor, free text overlay maker, text behind image effects, image text layer editor, text image editor, photo text overlay, text behind photo maker, free text effects, online text editor with images, text overlay app, image text generator, text behind photo online, text overlay photo editor, text behind image free tool",
  openGraph: {
    title: "MagicText - Create Text Behind Image Effects Online",
    description:
      "Create stunning text behind image designs instantly. Free online tool for text overlay effects.",
    type: "website",
    siteName: "MagicText",
    url: "https://magictext.tech",
    images: [
      {
        url: "/pov.png",
        width: 1200,
        height: 630,
        alt: "MagicText - Text Behind Image Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicText - Text Behind Image Editor",
    description: "Create stunning text behind image designs instantly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
