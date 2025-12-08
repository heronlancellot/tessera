'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { AnimatedIcon, type AnimatedIconHandle } from './AnimatedIcon';

export type KeyIconHandle = AnimatedIconHandle;

interface KeyIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const KeyIcon = forwardRef<KeyIconHandle, KeyIconProps>((props, ref) => {
  return (
    <AnimatedIcon ref={ref} {...props}>
      {(controls) => (
        <motion.g
          animate={controls}
          initial="normal"
          variants={{
            normal: {
              rotate: 0,
              transition: {
                type: 'spring',
                stiffness: 120,
                damping: 14,
                duration: 0.8,
              },
            },
            animate: {
              rotate: [-3, -33, -25, -28],
              transition: {
                duration: 0.6,
                times: [0, 0.6, 0.8, 1],
                ease: 'easeInOut',
              },
            },
          }}
          style={{ originX: 0.3, originY: 0.7 }}
        >
          <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
          <path d="m21 2-9.6 9.6" />
          <circle cx="7.5" cy="15.5" r="5.5" />
        </motion.g>
      )}
    </AnimatedIcon>
  );
});

KeyIcon.displayName = 'KeyIcon';

export { KeyIcon };
