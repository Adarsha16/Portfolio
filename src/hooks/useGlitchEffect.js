import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * A hook that provides a glitch effect trigger and Framer Motion animation controls.
 * It simulates a CRT chromatic aberration / sync loss glitch.
 */
export function useGlitchEffect() {
  const controls = useAnimation();
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef(null);

  const triggerGlitch = useCallback(async () => {
    if (isGlitching) return;
    setIsGlitching(true);

    // Sequence of quick, erratic movements and chromatic aberrations
    await controls.start({
      x: [-4, 4, -2, 2, 0],
      y: [2, -2, 1, -1, 0],
      skewX: [0, -10, 10, -5, 5, 0],
      scale: [1, 1.02, 0.98, 1],
      filter: [
        'drop-shadow(3px 0px 0px rgba(255,0,0,0.8)) drop-shadow(-3px 0px 0px rgba(0,255,255,0.8))',
        'drop-shadow(-4px 0px 0px rgba(255,0,0,0.8)) drop-shadow(4px 0px 0px rgba(0,255,255,0.8))',
        'drop-shadow(0px 0px 0px rgba(255,0,0,0)) drop-shadow(0px 0px 0px rgba(0,255,255,0))'
      ],
      transition: { duration: 0.3, ease: 'easeInOut' }
    });

    setIsGlitching(false);
  }, [controls, isGlitching]);

  // Clean up any timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { controls, triggerGlitch, isGlitching };
}
