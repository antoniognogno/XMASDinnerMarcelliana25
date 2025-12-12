import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Rimuovi import Snowfall da qui!
// Importa SOLO il nostro componente wrapper
import { ChristmasBackground } from "@/components/ui/ChristmasBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xmas Commander",
  description: "Cena di Natale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {/* Usiamo il wrapper che contiene già la neve ed è un Client Component */}
        <ChristmasBackground>
          {children}
        </ChristmasBackground>
      </body>
    </html>
  );
}