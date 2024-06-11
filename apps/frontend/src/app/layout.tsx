import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/global/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hikaru",
  description: "A private, independent osu! private server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
      <body className={inter.className} style={{ height: "100%" }}>
        <Navbar />
        <main className="flex flex-col items-center justify-between p-20 min-w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
