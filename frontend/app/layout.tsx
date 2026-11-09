import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter es la fuente que usa el Figma
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MatchPlay",
  description: "Encuentra tu próximo partido, cuando quieras, con quien quieras.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
