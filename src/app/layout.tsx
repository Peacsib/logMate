import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://logmate.vercel.app'),
  title: {
    default: "LogMate — Work. Learn. Log.",
    template: "%s | LogMate"
  },
  description: "Personalised Digital Work Related Learning Logbook for Students. Track placements, manage logbooks, and get AI-powered insights. Built for excellence.",
  keywords: [
    "work-related learning",
    "digital logbook",
    "student placement",
    "internship tracker",
    "AI assistant",
    "learning management",
    "education technology",
    "logbook app",
    "placement management"
  ],
  authors: [
    { 
      name: "Peace Sibanda", 
      url: "https://www.linkedin.com/in/peacesibanda/" 
    }
  ],
  creator: "Peace Sibanda",
  publisher: "Peace Sibanda",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logmate.webp",
    apple: "/logmate.webp",
    shortcut: "/logmate.webp"
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logmate.vercel.app",
    siteName: "LogMate",
    title: "LogMate — Work. Learn. Log.",
    description: "Personalised Digital Work Related Learning Logbook for Students. Track placements, manage logbooks, and get AI-powered insights.",
    images: [
      {
        url: "/hero-new.webp",
        width: 1200,
        height: 630,
        alt: "LogMate - Work Related Learning Platform",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LogMate — Work. Learn. Log.",
    description: "Personalised Digital Work Related Learning Logbook for Students. Track placements, manage logbooks, and get AI-powered insights.",
    creator: "@peacesibanda",
    images: ["/hero-new.webp"],
  },
  verification: {
    // Add your verification codes when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "Education",
  applicationName: "LogMate",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LogMate",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional metadata */}
        <meta name="theme-color" content="#003366" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#001a33" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Creator credits */}
        <meta name="author" content="Peace Sibanda" />
        <meta name="designer" content="Peace Sibanda" />
        <meta name="developer" content="Peace Sibanda" />
        <link rel="author" href="https://www.linkedin.com/in/peacesibanda/" />
      </head>
      <body 
        className="antialiased min-h-screen bg-background text-foreground"
        itemScope 
        itemType="https://schema.org/WebApplication"
      >
        {/* Schema.org structured data for better SEO */}
        <meta itemProp="name" content="LogMate" />
        <meta itemProp="description" content="Personalised Digital Work Related Learning Logbook for Students" />
        <meta itemProp="url" content="https://logmate.vercel.app" />
        <meta itemProp="creator" content="Peace Sibanda" />
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
