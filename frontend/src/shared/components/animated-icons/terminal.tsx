'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { AnimatedIcon, type AnimatedIconHandle } from './AnimatedIcon';

export type TerminalIconHandle = AnimatedIconHandle;

interface TerminalIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const lineVariants: Variants = {
  normal: { opacity: 1 },
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const TerminalIcon = forwardRef<TerminalIconHandle, TerminalIconProps>((props, ref) => {
  return (
    <AnimatedIcon ref={ref} {...props}>
      {(controls) => (
        <>
          <polyline points="4 17 10 11 4 5" />
          <motion.line
            x1="12"
            x2="20"
            y1="19"
            y2="19"
            variants={lineVariants}
            animate={controls}
            initial="normal"
          />
        </>
      )}
    </AnimatedIcon>
  );
});

TerminalIcon.displayName = 'TerminalIcon';

export { TerminalIcon };
