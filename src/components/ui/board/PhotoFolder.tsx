"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// After real-folder.framer.website: a folder with three photos tucked in it. Point at it and the folder tips forward
// and settles down while the photos slide out and fan across.
//
// Everything is drawn on the folder's own grid, 348 wide and 231 tall (the folder's width and its height from the top of
// the back tab to the bottom of the front), and turned into shares of the box this fills, so it scales with the board.
const W = 348;
const H = 231;
const x = (v: number) => `${(v / W) * 100}%`;
const y = (v: number) => `${(v / H) * 100}%`;

// The photos are 200 x 242 on that grid; their moves are shares of their own size.
const CARD_W = 200;
const CARD_H = 242;
const closer = (distance: number, basis: number) => {
  const percentage = (distance / basis) * 100;
  return `calc(${percentage}% ${distance < 0 ? "+" : "-"} 4px)`;
};

const SPRING = { type: "spring", stiffness: 210, damping: 20, mass: 0.9 } as const;
const BODY_SPRING = { type: "spring", stiffness: 190, damping: 22 } as const;

const PAPER = "#fcfbf7";

interface Card {
  src: string;
  alt: string;
  /** Left and top of the card on the grid when it is tucked in. */
  left: number;
  top: number;
  width?: number;
  rest: { rotate: number };
  /** How far it moves (on the grid) and how it turns when it slides out. */
  out: { dx: number; dy: number; rotate: number };
  delay: number;
}

const CARDS: Card[] = [
  { src: "/images/board/withMichelle.JPG", alt: "Me with Michelle", left: 48, top: -66, rest: { rotate: -10 }, out: { dx: -230, dy: -147, rotate: -7 }, delay: 0.03 },
  { src: "/images/board/withAlyseNathan.JPG", alt: "Me with Alyse and Nathan", left: 14, top: -73, width: 320, rest: { rotate: -3 }, out: { dx: 0, dy: -197, rotate: 1 }, delay: 0 },
  { src: "/images/board/withKayla.jpeg", alt: "Me with Kayla", left: 100, top: -66, rest: { rotate: 5 }, out: { dx: 230, dy: -130, rotate: 6 }, delay: 0.05 },
];

/**
 * The folder itself, without a place on the board: the Pin around it sets where it sits and how big it is. `scale` is the
 * board units for one unit of the folder's grid, which the little radii and shadows are sized from.
 */
export function PhotoFolder({ scale }: { scale: number }) {
  const [open, setOpen] = useState(false);
  const px = (v: number) => `${(v * scale * 100) / 733}cqw`; // board units to the board's width, like cq() in PinnedBoard

  // The folder tips forward and drops a little; the back and the front move together so they stay joined.
  const body = { rotate: open ? -1 : -4, y: open ? y(70) : "0%" };
  const flapFlatten = open ? 0.82 : 0.978;

  return (
    <motion.div className="absolute inset-0" onHoverStart={() => setOpen(true)} onHoverEnd={() => setOpen(false)}>
      {/* the soft shadow on the floor under it */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{ left: x(0), top: y(236), width: x(W), height: y(20), borderRadius: "50%", background: "rgb(36 41 31)", filter: `blur(${px(15)})` }}
        animate={{ opacity: open ? 0.22 : 0.15, y: open ? y(70) : "0%" }}
        transition={BODY_SPRING}
      />

      {/* back of the folder, with its tab */}
      <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={body} transition={BODY_SPRING}>
        <div
          className="absolute"
          style={{
            left: x(7),
            top: y(25),
            width: x(334),
            height: y(206),
            borderRadius: px(13),
            background: "rgb(var(--red))",
            filter: "brightness(0.82)",
            boxShadow: `inset 0 ${px(1)} ${px(1)} 0 rgb(255 255 255 / 0.25)`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: x(7),
            top: y(0),
            width: x(110),
            height: y(42),
            borderRadius: `${px(11)} ${px(16)} 0 0`,
            background: "rgb(var(--red))",
            filter: "brightness(0.82)",
            boxShadow: `inset 0 ${px(1)} 0 0 rgb(255 255 255 / 0.2)`,
          }}
        />
      </motion.div>

      {/* the photos */}
      {CARDS.map((card) => (
        <motion.div
          key={card.src}
          className="absolute"
          style={{ left: x(card.left), top: y(card.top), width: x(card.width ?? CARD_W), height: y(CARD_H) }}
          initial={false}
          animate={{
            x: open ? closer(card.out.dx, card.width ?? CARD_W) : "0%",
            y: open ? closer(card.out.dy, CARD_H) : "0%",
            rotate: open ? card.out.rotate : card.rest.rotate,
            scale: open ? 0.93 : 1,
          }}
          transition={{ ...SPRING, delay: open ? card.delay : 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: px(8),
              background: PAPER,
              boxShadow: `0 ${px(2)} ${px(3)} 0 rgb(42 39 30 / 0.07), 0 ${px(12)} ${px(24)} ${px(-8)} rgb(42 39 30 / 0.2)`,
            }}
          >
            <div className="absolute overflow-hidden" style={{ inset: px(7), borderRadius: px(3) }}>
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="12vw"
                draggable={false}
                className="select-none object-cover"
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* front of the folder */}
      <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={body} transition={BODY_SPRING}>
        <motion.div
          className="absolute"
          style={{
            left: x(0),
            top: y(55),
            width: x(W),
            height: y(176),
            borderRadius: `${px(11)} ${px(11)} ${px(15)} ${px(15)}`,
            background: "linear-gradient(165deg, rgb(255 255 255 / 0.055), rgb(0 0 0 / 0.09)), rgb(var(--red))",
            boxShadow: `inset 0 ${px(1)} 0 0 rgb(255 255 255 / 0.2), inset 0 ${px(-2)} ${px(2)} 0 rgb(0 0 0 / 0.043)`,
            transformOrigin: "50% 100%",
          }}
          animate={{ scaleY: flapFlatten }}
          transition={BODY_SPRING}
        >
          {/* the small notch at the top */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: px(14), width: px(32), height: px(2), borderRadius: px(1), background: "rgb(0 0 0 / 0.18)", boxShadow: `0 ${px(1)} 0 0 rgb(255 255 255 / 0.18)` }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

