import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "LogMate — Work. Learn. Log.",
  description: "Personalised Digital Work Related Learning Logbook for Students. Powered by Gemini AI.",
  icons: {
    icon: "/logmate.webp",
    apple: "/logmate.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
