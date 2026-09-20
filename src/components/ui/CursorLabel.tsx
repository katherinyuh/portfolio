"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Wraps content that isn't clickable. With a mouse, the pointer is replaced by a small label
 * (e.g. "Coming soon") that follows it while it is over the content. Touch and keyboard see nothing.
 */
export function CursorLabel({ label, children }: { label: string; children: React.ReactNode }) {
  const [over, setOver] = useState(false);
  const [mounted, setMounted] = useState(false); // the label portal only exists in the browser
  useEffect(() => setMounted(true), []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 600, damping: 45 });
  const followY = useSpring(y, { stiffness: 600, damping: 45 });

  return (
    <div
      className="cursor-none"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        x.jump(e.clientX + 14); // start at the mouse instead of sliding in from the last position
        y.jump(e.clientY + 14);
        setOver(true);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX + 14);
        y.set(e.clientY + 14);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOver(false)}
    >
      {children}
      {mounted &&
        createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[70] whitespace-nowrap bg-surface-50 px-2 py-1 text-sm text-text-primary"
            style={{ x: followX, y: followY }}
            initial={false}
            animate={{ opacity: over ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>,
          document.body
        )}
    </div>
  );
}
