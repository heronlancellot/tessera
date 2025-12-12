"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" },
};

export function LandingAbout() {
  return (
    <section className="flex items-center justify-center px-8 py-8">
      <div className="text-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/PaperLabLogo.png"
            alt="PaperLab Mascot"
            width={200}
            height={200}
            unoptimized
          />
        </motion.div>

        <motion.h2
          className="mb-6 text-[48px] leading-tight"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-be-vietnam font-normal text-white">About </span>
          <span className="font-besley italic text-white">paper</span>
          <span className="font-be-vietnam font-extrabold text-white">lab.</span>
        </motion.h2>

        <motion.p
          className="mx-auto max-w-2xl font-be-vietnam text-[16px] font-light leading-relaxed text-white/90"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          At Paper Lab, we are building the infrastructure that connects
          builders and publishers in the new era of autonomous AI agents. We
          remove the friction of paywalls by turning premium content into
          on-demand, blockchain-powered micropayment units – <span className="font-bold">fast, cheap, and
          fully automated</span>.
        </motion.p>

        <motion.div
          className="mx-auto mt-12 grid max-w-4xl grid-cols-3"
          {...staggerContainer}
        >
          {/* Card 1 - Top Left */}
          <motion.div
            className="border-r border-[#E5E5E5] p-8"
            initial={{ opacity: 0, x: -40, y: -40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              300× cheaper
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              than traditional payment rails, making true micropayments possible.
            </p>
          </motion.div>

          {/* Card 2 - Top Center - Com gradiente */}
          <motion.div
            className="border-r border-[#E5E5E5] p-8"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            style={{
              background: 'linear-gradient(-73deg, rgba(210, 171, 103, 0.6) 15%, rgba(75, 118, 121, 1) 89%)',
            }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              &lt; 4 seconds
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              to unlock premium content after an agent triggers payment.
            </p>
          </motion.div>

          {/* Card 3 - Top Right */}
          <motion.div
            className="p-8"
            initial={{ opacity: 0, x: 40, y: -40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              89% revenue
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              share per transaction for publishers, without cannibalizing subscriptions.
            </p>
          </motion.div>

          {/* Card 4 - Bottom Left */}
          <motion.div
            className="border-r border-t border-[#E5E5E5] p-8"
            initial={{ opacity: 0, x: -40, y: 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              $0.10–$0.50
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              average cost for an agent to unlock a premium article
            </p>
          </motion.div>

          {/* Card 5 - Bottom Center */}
          <motion.div
            className="border-r border-t border-[#E5E5E5] p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              1 simple API
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              to enable pay-per-access content — zero complex integration.
            </p>
          </motion.div>

          {/* Card 6 - Bottom Right */}
          <motion.div
            className="border-t border-[#E5E5E5] p-8"
            initial={{ opacity: 0, x: 40, y: 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <h3 className="mb-4 font-be-vietnam text-[32px] font-bold text-white">
              No Barriers
            </h3>
            <p className="font-be-vietnam text-[14px] font-normal leading-relaxed text-white/90">
              Access exactly what you need, when you need it.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
