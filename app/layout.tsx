import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ביסַלֶה - מבצע שוקולד",
  description: "סרוק כדי לקבל את המתנה שלך",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
