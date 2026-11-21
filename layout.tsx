import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-display" });
const body = Source_Sans_3({ subsets: ["latin", "latin-ext"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Web, který přináší zakázky, ne jen vizitka",
  description: "Rychlá kontrola vašeho webu a věcný plán úprav, které zvýší počet poptávek.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
