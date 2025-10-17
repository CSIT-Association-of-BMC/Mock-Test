import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import ClientProviders from "@/components/client-providers";
import Navbar from "@/components/custom/Navbar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/custom/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: "normal",
  display: "swap",
});

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <NextTopLoader showSpinner={false} color="red" />
        <Navbar />
        <ClientProviders>{children}</ClientProviders>
        <Footer />
      </body>
    </html>
  );
}
