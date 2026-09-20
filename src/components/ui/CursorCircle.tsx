"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const SIZE = 18;

// Things that can be clicked or dragged: the circle becomes a square over them.
const INTERACTIVE = 'a, button, [role="button"], summary, [data-cursor="hover"], .cursor-pointer, .cursor-grab';

/**
 * Replaces the mouse pointer with an inverting circle. It follows the mouse a little smoothly, turns into a square
 * of the same size over things you can click or drag, and shrinks while you press. Over anything marked
 * `data-cursor-label="…"` (the case study cards) the circle turns into those words, inverted the same way. Touch screens keep no pointer, so nothing changes for them.
 */
export function CursorCircle() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false); // a mouse is in use on this device
  const [visible, setVisible] = useState(false); // the mouse is over the page
  const [over, setOver] = useState(false); // over something clickable
  const [down, setDown] = useState(false);
  const [label, setLabel] = useState<string | null>(null); // words replacing the circle right now
  const [lastLabel, setLastLabel] = useState(""); // kept so the words can fade out instead of vanishing

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 50, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 50, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setActive(true);
    document.documentElement.classList.add("circle-cursor");

    let seen = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
      if (!seen) {
        // start at the mouse instead of gliding in from the corner
        sx.jump(e.clientX - SIZE / 2);
        sy.jump(e.clientY - SIZE / 2);
        seen = true;
      }
      setVisible(true);
      const el = e.target as Element | null;
      setOver(!!el?.closest?.(INTERACTIVE));
      const words = el?.closest?.("[data-cursor-label]")?.getAttribute("data-cursor-label") ?? null;
      setLabel(words);
      if (words) setLastLabel(words);
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("circle-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    // A box the size of the circle, centred on the mouse; the circle and the words are both centred in it.
    <motion.div
      aria-hidden
      data-cursor-circle
      // The whole cursor blends with the page by difference, so the shape and the words invert what is under them.
      className="pointer-events-none fixed left-0 top-0 z-[100000] mix-blend-difference"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy, width: SIZE, height: SIZE }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={false}
        animate={{
          opacity: visible && !label ? 1 : 0,
          scale: down ? 0.75 : 1,
          // a circle, or a square of the same size over navigation (the site's 0px radius is for boxes)
          borderRadius: over ? "0%" : "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      <motion.span
        data-cursor-words
        className="absolute left-1/2 top-1/2 whitespace-nowrap bg-white px-1 text-sm text-black"
        // the same height as the circle
        style={{ x: "-50%", y: "-50%", height: SIZE, lineHeight: `${SIZE}px` }}
        initial={false}
        animate={{ opacity: visible && label ? 1 : 0, scale: visible && label ? (down ? 0.92 : 1) : 0.8 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {label ?? lastLabel}
      </motion.span>
    </motion.div>
  );
}
