export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Factura Pro - Invoicing System",
  description: "Professional invoicing and expense tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
