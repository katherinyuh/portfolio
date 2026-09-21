"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";

// How fast the disc turns when it is playing, in degrees a second, and how quickly it gets up to speed or slows down.
const SPIN = 130;
const EASE = 0.0035;

// The site sets every corner radius to nothing, so a round shape has to say so itself.
const ROUND = "50%";

/**
 * A record player in one piece: a round picture with grooves, the black centre dot, and a tone arm on the right. Play it (`playing`)
 * and the disc spins up while the arm swings onto it; stop and the arm lifts off and the disc slows to a halt.
 * After the disc player at discplayer.framer.website. It fills the square box it is put in, arm included.
 */
export function DiscPlayer({ src, alt, playing }: { src: string; alt: string; playing: boolean }) {
  const angle = useMotionValue(0);
  const speed = useRef(0);

  useAnimationFrame((_, delta) => {
    speed.current += ((playing ? SPIN : 0) - speed.current) * Math.min(1, delta * EASE);
    if (Math.abs(speed.current) < 0.05 && !playing) speed.current = 0;
    if (speed.current) angle.set((angle.get() + (speed.current * delta) / 1000) % 360);
  });

  return (
    <div className="relative h-full w-full">
      <motion.div className="absolute inset-0 overflow-hidden bg-surface-300" style={{ rotate: angle, borderRadius: ROUND }}>
        <Image src={src} alt={alt} fill sizes="20vw" draggable={false} className="select-none object-cover" />
        {/* grooves: thin rings from the hub to the edge, and a soft shine that turns with the disc */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 50%, rgb(0 0 0 / 0) 0 5px, rgb(0 0 0 / 0.1) 5px 5.6px), conic-gradient(from 20deg, rgb(255 255 255 / 0) 0deg, rgb(255 255 255 / 0.22) 40deg, rgb(255 255 255 / 0) 90deg, rgb(255 255 255 / 0) 180deg, rgb(255 255 255 / 0.16) 220deg, rgb(255 255 255 / 0) 270deg)",
          }}
        />
      </motion.div>

      {/* the black dot in the middle, drawn in Figma (46 wide on a disc 149 across) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/board/vinyl-center.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[30.8%] -translate-x-1/2 -translate-y-1/2 select-none"
      />

      {/* the tone arm, drawn in Figma (57 by 29, its round knob near the right end). It rests slanting up to the left and
          swings down onto the disc when playing, turning about the knob. */}
      <motion.img
        src="/images/board/vinyl-spinner.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute select-none"
        style={{ left: "68.6%", top: "1.9%", width: "38.2%", transformOrigin: "86.7% 67.6%" }}
        animate={{ rotate: playing ? -15 : 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />
    </div>
  );
}
