import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADmyBRAND Insights",
  description: "AI-powered analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 min-h-screen">
        {children}
      </body>
    </html>
  );
}
