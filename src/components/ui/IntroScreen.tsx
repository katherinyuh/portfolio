"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGrid } from "./BackgroundGrid";

export function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    // 1. Show the grid, then fade it out to a blank, same-colour screen.
    const hideGrid = setTimeout(() => setShowGrid(false), 1700);
    // 2. Hold the blank screen briefly, then fade the whole overlay out
    //    to reveal the portfolio landing page underneath.
    const hideOverlay = setTimeout(() => setVisible(false), 1700 + 500 + 100);
    return () => {
      clearTimeout(hideGrid);
      clearTimeout(hideOverlay);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] bg-slate-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <AnimatePresence>
            {showGrid && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <BackgroundGrid />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
