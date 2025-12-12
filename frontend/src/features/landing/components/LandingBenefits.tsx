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
    <section className="flex items-center justify-center px-8 py-32">
      <div className="w-full max-w-4xl">
        <motion.h2 className="mb-12" {...fadeInUp} transition={{ duration: 0.6 }}>
          <span className="block text-left text-[64px] leading-tight">
            <span className="font-be-vietnam font-bold text-white">With </span>
            <span className="font-besley italic text-white">paper</span>
            <span className="font-be-vietnam font-extrabold text-white">lab.</span>
          </span>
          <span className="block text-left font-besley text-[64px] font-extrabold leading-tight text-[#4B7679]">
            you unlock more for less
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Card 1 - Access premium articles */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-be-vietnam text-[32px] font-bold leading-tight text-white">
              Access premium articles for under $1
            </h3>
            <p className="font-be-vietnam text-[16px] font-light leading-relaxed text-white/90">
              Forget expensive subscriptions. Pay only for what your agent actually needs
              — high-value content for cents.
            </p>
          </motion.div>

          {/* Card 2 - Infinity symbol with text */}
          <motion.div
            className="relative flex items-center justify-center"
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
            />
            {/* Left circle text */}
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 text-center">
              <p className="font-be-vietnam text-[14px] font-bold leading-tight text-white">
                Instant<br />access to<br />what matters
              </p>
            </div>
            {/* Right circle text */}
            <div className="absolute right-[15%] top-1/2 -translate-y-1/2 text-center">
              <p className="font-be-vietnam text-[14px] font-bold leading-tight text-white">
                Frictionless<br />monetization<br />for publishers
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Get fully personalized intelligence */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <h3 className="font-be-vietnam text-[32px] font-bold leading-tight text-white">
              Get fully personalized intelligence
            </h3>
            <p className="font-be-vietnam text-[16px] font-light leading-relaxed text-white/90">
              Your agents build complete, tailored reports by pulling exactly the right
              premium sources, on demand.
            </p>
          </motion.div>

          {/* Card 4 - Save up to 60% */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <h3 className="font-be-vietnam text-[32px] font-bold leading-tight text-white">
              Save up to 60% on content costs
            </h3>
            <p className="font-be-vietnam text-[16px] font-light leading-relaxed text-white/90">
              Stop paying for unused platforms. PaperLAB brings real efficiency: more
              depth, lower spend, zero waste.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
