"use client";

import { Familjen_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const grotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <style
        jsx
        global
      >{`:root { --font-grotesk: ${grotesk.style.fontFamily};}}`}</style>
      <body className={`font-sans ${grotesk.variable}`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
