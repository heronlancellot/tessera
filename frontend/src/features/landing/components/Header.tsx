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
        <div className="pl-4 pt-4 sm:pl-8 md:pl-12">
          <Link href="/">
            <Image
              src="/typography-only-logo.png"
              alt="PaperLab"
              width={180}
              height={90}
              priority
              unoptimized
              className="h-[60px] w-auto sm:h-[75px] md:h-[90px]"
            />
          </Link>
        </div>

        <nav className="pr-4 pt-4 sm:pr-8 md:pr-12">
          <Link
            href={account ? "/dashboard" : "/login"}
            className="group flex items-center gap-1.5 font-be-vietnam text-xs font-medium uppercase tracking-wide text-white transition-all hover:opacity-80 sm:gap-2 sm:text-sm"
          >
            Dashboard
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
