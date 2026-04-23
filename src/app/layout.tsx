import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'; // 👈 Importa esto
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "RentVago",
  description: "Base del proyecto RentVago",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900">
        <NuqsAdapter> {/* 👈 Envuelve todo con esto */}
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
