"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#141619] px-8 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16">
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
          />
        </motion.div>

        {/* Footer bottom - Terms left, Copyright right */}
        <motion.div
          className="flex w-full items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Link
            href="/terms"
            className="font-be-vietnam text-xs text-white/70 transition-colors hover:text-white"
          >
            Terms of Use & Privacy Policy
          </Link>

          <p className="font-be-vietnam text-xs text-white/50">
            ©2025 PaperLab. All Rights Reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
