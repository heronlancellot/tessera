import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/shared/components/shadcn/sonner";
import { TOAST_CONFIG } from "@/shared/config/toast.config";
import { Urbanist, Be_Vietnam_Pro } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Tessera Dashboard",
  description: "AI agent gateway for paywalled content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${beVietnam.variable}`}>
        <ThirdwebProvider>
          {children}
          <Toaster {...TOAST_CONFIG} closeButton />
        </ThirdwebProvider>
      </body>
    </html>
  );
}
