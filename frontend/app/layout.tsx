import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import { TOAST_CONFIG } from "@/shared/config/toast.config";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
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
      <body className={urbanist.variable}>
        <ThirdwebProvider>
          {children}
          <Toaster {...TOAST_CONFIG} closeButton />
        </ThirdwebProvider>
      </body>
    </html>
  );
}
