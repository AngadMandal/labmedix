import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LabMedix | Professional Clinic and Lab Platform",
  description: "Public website and multi-panel healthcare workflow system for LabMedix."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
