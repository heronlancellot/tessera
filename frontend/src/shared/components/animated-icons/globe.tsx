'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { AnimatedIcon, type AnimatedIconHandle } from './AnimatedIcon';

export type GlobeIconHandle = AnimatedIconHandle;

interface GlobeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const variants: Variants = {
  normal: {
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
  animate: {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    },
  },
};

const GlobeIcon = forwardRef<GlobeIconHandle, GlobeIconProps>((props, ref) => {
  return (
    <AnimatedIcon ref={ref} {...props}>
      {(controls) => (
        <>
          {/* Círculo externo do globo */}
          <motion.circle
            variants={variants}
            animate={controls}
            initial="normal"
            cx="12"
            cy="12"
            r="10"
            style={{ originX: 0.5, originY: 0.5 }}
          />
          {/* Linhas horizontais do globo */}
          <motion.path
            variants={variants}
            animate={controls}
            initial="normal"
            d="M2 12h20"
            style={{ originX: 0.5, originY: 0.5 }}
          />
          <motion.path
            variants={variants}
            animate={controls}
            initial="normal"
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            style={{ originX: 0.5, originY: 0.5 }}
          />
        </>
      )}
    </AnimatedIcon>
  );
});

GlobeIcon.displayName = 'GlobeIcon';

export { GlobeIcon };
