'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { AnimatedIcon, type AnimatedIconHandle } from './AnimatedIcon';

export type ActivityIconHandle = AnimatedIconHandle;

interface ActivityIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const variants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: 'linear',
      opacity: { duration: 0.1 },
    },
  },
};

const ActivityIcon = forwardRef<ActivityIconHandle, ActivityIconProps>((props, ref) => {
  return (
    <AnimatedIcon ref={ref} {...props}>
      {(controls) => (
        <motion.path
          variants={variants}
          animate={controls}
          initial="normal"
          d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        />
      )}
    </AnimatedIcon>
  );
});

ActivityIcon.displayName = 'ActivityIcon';

export { ActivityIcon };
