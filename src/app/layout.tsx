import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: {
      default: `${settings.siteTitle} | ${settings.siteTagline}`,
      template: `%s — ${settings.siteTitle}`,
    },
    description: settings.heroSubheading,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: `${settings.siteTitle} Portfolio`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
    keywords: ["Mana Yahia", "Full-Stack Developer", "Web Designer", "Algeria", "Interactive Web", "Next.js", "React Portfolio"],
    themeColor: "#0B0F1A",
  };
}

import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

import CustomCursor from "@/components/CustomCursor";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.siteTitle,
    jobTitle: settings.siteTagline,
    url: siteUrl,
    sameAs: [
      settings.socialGithub,
      settings.socialLinkedin,
      settings.socialTwitter,
    ].filter(Boolean),
    description: settings.heroSubheading,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteTitle,
    url: siteUrl,
    description: settings.siteTagline,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts: Outfit (Display), Plus Jakarta Sans (Body), Readex Pro (Arabic), JetBrains Mono (Code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Readex+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CustomCursor />
          <LenisProvider>
            <PageTransition>{children}</PageTransition>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
