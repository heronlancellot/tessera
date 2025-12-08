'use client';

import type { Transition, Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { AnimatedIcon, type AnimatedIconHandle } from './AnimatedIcon';

export type HomeIconHandle = AnimatedIconHandle;

interface HomeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const defaultTransition: Transition = {
  duration: 0.6,
  opacity: { duration: 0.2 },
};

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
  },
};

const HomeIcon = forwardRef<HomeIconHandle, HomeIconProps>((props, ref) => {
  return (
    <AnimatedIcon ref={ref} {...props}>
      {(controls) => (
        <>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <motion.path
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
            variants={pathVariants}
            transition={defaultTransition}
            animate={controls}
          />
        </>
      )}
    </AnimatedIcon>
  );
});

HomeIcon.displayName = 'HomeIcon';

export { HomeIcon };
