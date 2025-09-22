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
  metadataBase: new URL("https://docs.csitabmc.com"),
  title: "Documents - CSIT Association Of BMC",
  description:
    "CSIT Association of Butwal Multiple Campus is Non profit, Non political association of CSIT Students of Butwal Multiple Campus.",
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
