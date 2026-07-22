"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const gridItems = [
  { image: "https://picsum.photos/seed/11/104/104", caption: "strength training" },
  { image: "https://picsum.photos/seed/22/104/104", caption: "banter 🐶" },
  { image: "https://picsum.photos/seed/33/104/104", caption: "café hopping" },
  { image: "https://picsum.photos/seed/44/104/104", caption: "candy crush saga" },
  { image: "https://picsum.photos/seed/55/104/104", caption: "half marathons" },
  { image: "https://picsum.photos/seed/66/104/104", caption: "croissants" },
  { image: "https://picsum.photos/seed/77/104/104", caption: "uc davis" },
  { image: "https://picsum.photos/seed/88/104/104", caption: "ibm" },
];

const COLS = 28;
const ROWS = 18;
const TOTAL = COLS * ROWS;
const CELL = 52;
const REVEAL_MS = 5000;

export function BackgroundGrid() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  function handleEnter(i: number) {
    if (timers.current.has(i)) return;

    setRevealed((prev) => new Set(prev).add(i));

    const t = setTimeout(() => {
      setRevealed((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
      timers.current.delete(i);
    }, REVEAL_MS);

    timers.current.set(i, t);
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
          maskImage: "radial-gradient(ellipse 95% 88% at center, black 35%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 88% at center, black 35%, transparent 78%)",
        }}
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          const item = gridItems[i % gridItems.length];
          return (
            <div
              key={i}
              className="aspect-square border-[0.5px] border-surface-300/25 relative overflow-hidden"
              onMouseEnter={() => handleEnter(i)}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed.has(i) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
