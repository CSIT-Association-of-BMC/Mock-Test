import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/client-providers";
import Navbar from "@/components/custom/Navbar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/custom/Footer";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import Clarity from "@microsoft/clarity";
import GoogleAnalytics from "@/components/custom/GoogleAnalytics";
import MicrosoftClarity from "@/components/custom/MicrosoftClarity";

export const metadata: Metadata = {
  metadataBase: new URL("https://mock.csitabmc.com"),
  title: "Mock Test - CSIT Association Of BMC",
  description:
    "Prepare for your CSIT exams with our comprehensive mock test platform. Access a variety of question sets, track your performance, and enhance your knowledge effectively.",
  keywords: [
    "CSIT mock test",
    "CSIT entrance exam",
    "CSIT preparation",
    "mock test platform",
    "CSIT questions",
    "CSIT",
    "Mock Test",
    "CSIT Association of BMC",
    "mock exams",
    "Butwal Multiple Campus",
    "computer science tests",
    "entrance test preparation",
    "BMC",
    "CSITABMC",
    "CSIT ABMC",

    "practice tests",
    "exam simulation",
    "question bank",
    "test your knowledge",
    "entrance exam preparation",
    "Butwal Multiple Campus",
    "CSIT Association BMC",
    "computer science entrance",
    "TU entrance exam",
    "Nepal CSIT exam",
    "online mock test",
    "exam preparation",
    "CSIT question bank",
    "entrance test practice",
    "computer science test",
    "BMC CSIT mock",
    "TU CSIT preparation",
    "engineering entrance",
    "college entrance exam",
  ],
  authors: [
    { name: "CSIT Association of BMC", url: "https://www.csitabmc.com/" },
  ],
  openGraph: {
    images: {
      url: "https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png",
      width: 1200,
      height: 630,
      alt: "CSIT Association of Butwal Multiple Campus",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityProjectId = process.env.CLARITY_PROJECT_ID as string;
  Clarity.init(clarityProjectId);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#283D7A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CSIT MockTest" />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png"
        />
        <link
          rel="apple-touch-icon"
          href="https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png"
        />
        <link rel="manifest" href="/manifest.json" />
        {/* Load Poppins at runtime to avoid build-time download errors from next/font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4150130021078265"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`antialiased`} suppressHydrationWarning={true}>
        <NextTopLoader showSpinner={false} color="red" />
        <Navbar />
        <ClientProviders>{children}</ClientProviders>
        <Footer />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
