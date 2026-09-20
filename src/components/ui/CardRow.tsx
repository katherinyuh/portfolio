"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { CardRowItem } from "@/lib/data";

// Each card rests at its own slight angle, so the row looks laid out by hand rather than on a grid.
const TILTS = [0.8, -1.2, 0.6];

/**
 * A row of cards that pop in from the left, one after another, every time they scroll into view.
 * They pop in once the row is half visible, and reset (unseen) once it has fully left the screen.
 * Each has a bold title and a few short lines under it.
 */
export default function CardRow({ items: allItems }: { items: CardRowItem[] }) {
  const items = allItems.filter((item) => !item.hidden); // hidden cards are skipped, and the rest share the row
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const halfVisible = useInView(ref, { amount: 0.5 });
  const anyVisible = useInView(ref, { amount: 0 });
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (halfVisible) setShown(true);
    else if (!anyVisible) setShown(false);
  }, [halfVisible, anyVisible]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-6 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
      style={{ ["--n" as string]: items.length }}
    >
      {items.map((item, i) => {
        const tilt = TILTS[i % TILTS.length];
        return (
          <motion.div
            key={item.title}
            initial={false}
            animate={
              shown
                ? {
                    opacity: 1,
                    x: 0,
                    rotate: tilt,
                    transition: { type: "spring", stiffness: 140, damping: 18, delay: i * 0.14 },
                  }
                : {
                    opacity: 0,
                    x: reduce ? 0 : -96,
                    rotate: reduce ? tilt : tilt - 6,
                    transition: { duration: 0 }, // reset out of sight, ready for the next time
                  }
            }
            className="bg-surface-200 p-5 rounded-none"
          >
            <h4 className="text-base font-medium text-text-primary">{item.title}</h4>
            <div className="mt-2 space-y-1 text-base text-text-muted">
              {item.points.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </div>
            {item.image && (
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                className="mt-2 block"
                style={{ width: item.image.width / 2, height: item.image.height / 2 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
