"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#141619] px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:gap-12 md:gap-16">
        {/* Logo */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/PaperLabLogo-Typograph-white.svg"
            alt="PaperLab"
            width={300}
            height={90}
            unoptimized
            className="h-auto w-[200px] sm:w-[250px] md:w-[300px]"
          />
        </motion.div>

        {/* Footer bottom - Terms left, Copyright right */}
        <motion.div
          className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Link
            href="/terms"
            className="font-be-vietnam text-[11px] text-white/70 transition-colors hover:text-white sm:text-xs"
          >
            Terms of Use & Privacy Policy
          </Link>

          <p className="font-be-vietnam text-[11px] text-white/50 sm:text-xs">
            ©2025 PaperLab. All Rights Reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
