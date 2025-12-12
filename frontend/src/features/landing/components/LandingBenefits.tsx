"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

export function LandingBenefits() {
  return (
    <section className="flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32">
      <div className="w-full max-w-4xl">
        <motion.h2 className="mb-8 sm:mb-10 md:mb-12" {...fadeInUp} transition={{ duration: 0.6 }}>
          <span className="block text-left text-[36px] leading-tight sm:text-[48px] md:text-[64px]">
            <span className="font-be-vietnam font-bold text-white">With </span>
            <span className="font-besley italic text-white">paper</span>
            <span className="font-be-vietnam font-extrabold text-white">lab.</span>
          </span>
          <span className="block text-left font-besley text-[36px] font-extrabold leading-tight text-[#6FB5B9] sm:text-[48px] md:text-[64px]">
            you unlock more for less
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {/* Card 1 - Access premium articles */}
          <motion.div
            className="flex flex-col gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-be-vietnam text-[24px] font-bold leading-tight text-white sm:text-[28px] md:text-[32px]">
              Access premium articles for under $1
            </h3>
            <p className="font-be-vietnam text-[14px] font-light leading-relaxed text-white/90 sm:text-[15px] md:text-[16px]">
              Forget expensive subscriptions. Pay only for what your agent actually needs
              — high-value content for cents.
            </p>
          </motion.div>

          {/* Card 2 - Infinity symbol with text */}
          <motion.div
            className="relative flex items-center justify-center py-8 sm:py-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          >
            <Image
              src="/infinite.svg"
              alt="Infinity symbol"
              width={373}
              height={136}
              unoptimized
              className="h-auto w-[280px] sm:w-[320px] md:w-[373px]"
            />
            {/* Left circle text */}
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 text-center">
              <p className="font-be-vietnam text-[11px] font-bold leading-tight text-white sm:text-[12px] md:text-[14px]">
                Instant<br />access to<br />what matters
              </p>
            </div>
            {/* Right circle text */}
            <div className="absolute right-[15%] top-1/2 -translate-y-1/2 text-center">
              <p className="font-be-vietnam text-[11px] font-bold leading-tight text-white sm:text-[12px] md:text-[14px]">
                Frictionless<br />monetization<br />for publishers
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Get fully personalized intelligence */}
          <motion.div
            className="flex flex-col gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <h3 className="font-be-vietnam text-[24px] font-bold leading-tight text-white sm:text-[28px] md:text-[32px]">
              Get fully personalized intelligence
            </h3>
            <p className="font-be-vietnam text-[14px] font-light leading-relaxed text-white/90 sm:text-[15px] md:text-[16px]">
              Your agents build complete, tailored reports by pulling exactly the right
              premium sources, on demand.
            </p>
          </motion.div>

          {/* Card 4 - Save up to 60% */}
          <motion.div
            className="flex flex-col gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <h3 className="font-be-vietnam text-[24px] font-bold leading-tight text-white sm:text-[28px] md:text-[32px]">
              Save up to 60% on content costs
            </h3>
            <p className="font-be-vietnam text-[14px] font-light leading-relaxed text-white/90 sm:text-[15px] md:text-[16px]">
              Stop paying for unused platforms. PaperLAB brings real efficiency: more
              depth, lower spend, zero waste.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
