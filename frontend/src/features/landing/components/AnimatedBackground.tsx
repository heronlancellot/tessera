"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Bubble 1 - Topo esquerdo nas bordas - Teal */}
      <motion.div
        className="absolute -left-32 -top-32 h-[550px] w-[550px] rounded-full bg-[#4B7679] opacity-20"
        style={{ filter: "blur(110px)" }}
        animate={{
          x: [-40, 0, -80, -40],
          y: [-40, 0, -80, -40],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 2 - Topo direito nas bordas - Dourada */}
      <motion.div
        className="absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full bg-[#D2AB67] opacity-18"
        style={{ filter: "blur(100px)" }}
        animate={{
          x: [40, 0, 80, 40],
          y: [-30, 20, -60, -30],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 3 - Meio esquerdo semi-borda - Teal */}
      <motion.div
        className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#4B7679] opacity-15"
        style={{ filter: "blur(105px)" }}
        animate={{
          x: [-60, -20, -100, -60],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 4 - Centro - Grande e sutil - Dourada */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D2AB67] opacity-10"
        style={{ filter: "blur(130px)" }}
        animate={{
          scale: [1, 1.12, 0.92, 1],
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 5 - Meio direito semi-borda - Teal */}
      <motion.div
        className="absolute -right-36 top-2/3 h-[500px] w-[500px] rounded-full bg-[#4B7679] opacity-17"
        style={{ filter: "blur(105px)" }}
        animate={{
          x: [60, 20, 100, 60],
          y: [0, -40, 40, 0],
          scale: [1, 1.06, 0.98, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 6 - Inferior esquerdo nas bordas - Dourada */}
      <motion.div
        className="absolute -bottom-32 -left-32 h-[490px] w-[490px] rounded-full bg-[#D2AB67] opacity-19"
        style={{ filter: "blur(100px)" }}
        animate={{
          x: [-50, -10, -90, -50],
          y: [40, 0, 80, 40],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bubble 7 - Inferior direito nas bordas - Teal */}
      <motion.div
        className="absolute -bottom-36 -right-36 h-[540px] w-[540px] rounded-full bg-[#4B7679] opacity-16"
        style={{ filter: "blur(112px)" }}
        animate={{
          x: [50, 15, 85, 50],
          y: [45, 10, 80, 45],
          scale: [1, 1.07, 0.97, 1],
        }}
        transition={{
          duration: 23,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
