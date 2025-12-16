import "./globals.css";
import type { Metadata } from "next";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/shared/components/shadcn/sonner";
import { TOAST_CONFIG } from "@/shared/config/toast.config";
import { Urbanist, Be_Vietnam_Pro, Besley } from "next/font/google";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { ReactNode } from "react";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const besley = Besley({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "700", "800"],
  variable: "--font-besley",
});

export const metadata: Metadata = {
  title: "Tessera Dashboard",
  description: "AI agent gateway for paywalled content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${urbanist.variable} ${beVietnam.variable} ${besley.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            {children}
            <Toaster {...TOAST_CONFIG} closeButton />
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
