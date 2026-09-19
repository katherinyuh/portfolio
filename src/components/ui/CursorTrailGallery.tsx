"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const TRAIL_IMAGES = [
  "/images/grid/rat.jpeg",
  "/images/grid/bts.JPG",
  "/images/grid/clublyeoy.JPG",
  "/images/grid/ghirardelli.JPG",
  "/images/grid/halloween.JPG",
  "/images/grid/honoluluhike.jpeg",
  "/images/grid/mahjong.jpeg",
  "/images/grid/mendocino.JPG",
  "/images/grid/skiing.jpeg",
  "/images/grid/banter.jpeg",
];

const SPAWN_DISTANCE = 100; // px moved before a new stamp spawns
const MAX_STAMPS = 8; // concurrent stamps cap
const STAMP_SIZE = 150; // px, square
const FADE_DURATION = 1.1; // seconds

type Stamp = { id: number; x: number; y: number; src: string };

export function CursorTrailGallery({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnPoint = useRef<{ x: number; y: number } | null>(null);
  const imageIndex = useRef(0);
  const stampId = useRef(0);
  const rafPending = useRef(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafPending.current) return;
    rafPending.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      rafPending.current = false;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const last = lastSpawnPoint.current;
      const dist = last ? Math.hypot(x - last.x, y - last.y) : Infinity;
      if (dist < SPAWN_DISTANCE) return;

      lastSpawnPoint.current = { x, y };
      const src = TRAIL_IMAGES[imageIndex.current % TRAIL_IMAGES.length];
      imageIndex.current += 1;
      const id = stampId.current++;

      setStamps((prev) => {
        const next = [...prev, { id, x, y, src }];
        return next.length > MAX_STAMPS ? next.slice(next.length - MAX_STAMPS) : next;
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    lastSpawnPoint.current = null;
  }, []);

  const removeStamp = useCallback((id: number) => {
    setStamps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <AnimatePresence>
          {stamps.map((stamp) => (
            <motion.div
              key={stamp.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: FADE_DURATION, ease: "easeOut" }}
              onAnimationComplete={() => removeStamp(stamp.id)}
              className="absolute overflow-hidden rounded-lg shadow-md"
              style={{
                width: STAMP_SIZE,
                height: STAMP_SIZE,
                left: stamp.x - STAMP_SIZE / 2,
                top: stamp.y - STAMP_SIZE / 2,
              }}
            >
              <Image src={stamp.src} alt="" fill className="object-cover" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
