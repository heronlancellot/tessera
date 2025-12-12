"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function LandingHero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-4 sm:px-6 md:px-8">
      <div className="text-center">
        <motion.h1
          className="mb-4 sm:mb-6"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.span
            className="block font-besley text-[40px] italic leading-tight text-white sm:text-[52px] md:text-[64px]"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Unlock more.
          </motion.span>
          <motion.span
            className="block font-be-vietnam text-[40px] font-extrabold leading-tight text-white sm:text-[52px] md:text-[64px]"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            build more.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-6 max-w-2xl px-4 font-be-vietnam text-[14px] font-light leading-relaxed text-white/90 sm:mb-8 sm:text-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Paper Lab is the <span className="font-bold">first micropayment gateway built for AI agents</span>,
          enabling instant, automatic access to premium content – articles,
          reports, analyses, and research – for <span className="font-bold">just a few cents per item</span>. No
          subscriptions. No checkout flows. Agents finally operate with complete
          information, and publishers unlock a brand-new revenue stream from an
          audience that today generates zero.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(210, 171, 103, 0.4), 0 0 60px rgba(75, 118, 121, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
            className="inline-block"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(210, 171, 103, 0.2))',
            }}
          >
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 font-be-vietnam text-xs font-medium uppercase tracking-wide text-white transition-all hover:opacity-90 sm:px-8 sm:py-3 sm:text-sm"
              style={{
                background: 'linear-gradient(-73deg, rgba(210, 171, 103, 0.6) 15%, rgba(75, 118, 121, 1) 89%)',
              }}
            >
              GET STARTED
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
