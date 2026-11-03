import type { Metadata } from "next";
import Script from "next/script";
import { gaId } from "@/lib/analytics";
import { siteName, siteDescription, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl, alternates: { canonical: "/" } } : {}),
  title: { default: `${siteName} — Good games. Great distractions.`, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: { title: siteName, description: siteDescription, type: "website", locale: "en_ZA", siteName, ...(siteUrl ? { url: siteUrl } : {}) },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body>
        <a className="skip-link" href="#games">Skip to games</a>
        {children}
        {gaId && <>
          <Script id="google-analytics-init" strategy="beforeInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        </>}
      </body>
    </html>
  );
}
