import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PageLoadTransition } from "@/components/PageLoadTransition";
import { CustomCursor } from "@/components/CustomCursor";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jesse Yuu Laukvik | Frontend Developer & AI Builder",
  description:
    "Dark luxury portfolio. Frontend developer, AI application builder, founder of Athera Intelligence. Based in Norway.",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enable 3D transforms on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-background text-text font-inter antialiased">
        <PageLoadTransition />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
