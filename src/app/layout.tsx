import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "D1 Image Converter",
  description: "Simple image converter for personal use",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <main className="relative grid min-h-screen w-full place-items-center bg-slate-950">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
