import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeScript from "@/components/providers/ThemeScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gestify | Painel administrativo",
  description:
    "Sistema administrativo para gestão de loja, estoque, produtos e vendas.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
