"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { ArrowRight } from "lucide-react";

export function LandingHeader() {
  const account = useActiveAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="pl-12 pt-4">
          <Link href="/">
            <Image
              src="/typography-only-logo.png"
              alt="PaperLab"
              width={180}
              height={90}
              priority
              unoptimized
            />
          </Link>
        </div>

        <nav className="pr-12 pt-4">
          <Link
            href={account ? "/dashboard" : "/login"}
            className="group flex items-center gap-2 font-be-vietnam text-sm font-medium uppercase tracking-wide text-white transition-all hover:opacity-80"
          >
            Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
