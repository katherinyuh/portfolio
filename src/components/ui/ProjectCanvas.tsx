"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/lib/data";
import { CardVideo } from "@/components/ui/CardVideo";

// Scattered starting spots (% of the canvas) and tilt, keyed by project order.
const layout = [
  { left: 4, top: 6, rotate: -5 },
  { left: 34, top: 38, rotate: 3 },
  { left: 56, top: 4, rotate: -2 },
  { left: 12, top: 46, rotate: 4 },
];

const DEFAULT_RATIO = 4 / 3;

// The mock is shown 1.25× bigger than it was at the earlier card widths (320px, or 440px for wide
// images), measured with 24px of side padding. Around the mock sit the card's own 8px border on each
// side and the frame's 40px of side padding on each side; those are added on top so the mock keeps
// that size and is never cropped.
const EARLIER_CHROME_X = 16 + 48;
const CARD_CHROME_X = 16 + 80;
const MOCK_SCALE = 1.25;
const cardWidth = (ratio: number) => {
  const base = ratio > 1.8 ? 440 : 320;
  return Math.round((base - EARLIER_CHROME_X) * MOCK_SCALE + CARD_CHROME_X);
};

export function ProjectCanvas({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const topZ = useRef(1);
  const [zIndex, setZIndex] = useState<Record<string, number>>({});

  const bringToFront = (id: string) => {
    topZ.current += 1;
    setZIndex((z) => ({ ...z, [id]: topZ.current }));
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-[70vh] min-h-[520px] touch-none overflow-hidden lg:h-[calc(100vh-3rem)]"
    >
      <AnimatePresence>
        {projects.map((project, index) => {
          const slot = layout[index % layout.length];
          const ratio = project.thumbnailRatio ?? DEFAULT_RATIO;
          const width = cardWidth(ratio);
          return (
            <motion.div
              key={project.id}
              drag
              dragConstraints={canvasRef}
              dragElastic={0.12}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
              initial={{ opacity: 0, scale: 0.85, rotate: slot.rotate * 3 }}
              animate={{ opacity: 1, scale: 1, rotate: slot.rotate }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              whileHover={{
                scale: 1.04,
                rotate: 0,
                boxShadow: "0 18px 40px -12px rgb(0 0 0 / 0.25)",
              }}
              whileDrag={{
                scale: 1.08,
                rotate: 0,
                boxShadow: "0 28px 60px -14px rgb(0 0 0 / 0.35)",
                cursor: "grabbing",
              }}
              onPointerDown={() => {
                dragged.current = false;
                bringToFront(project.id);
              }}
              onDragStart={() => {
                dragged.current = true;
              }}
              onClick={() => {
                if (!dragged.current) router.push(`/work/${project.slug}`);
              }}
              className="group absolute cursor-grab bg-white p-2 shadow-md"
              style={{
                width: `min(${width}px, calc(100% - 32px))`,
                left: `max(16px, min(${slot.left}%, calc(100% - ${width + 16}px)))`,
                top: `${slot.top}%`,
                zIndex: zIndex[project.id] ?? 0,
              }}
            >
              {/* Frame: 12px top/bottom and 40px left/right around the mock, which always shows in full */}
              <div className="bg-surface-200 px-10 py-3">
                <div className="relative" style={{ aspectRatio: ratio }}>
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes={`${width}px`}
                    draggable={false}
                    className={`pointer-events-none select-none object-contain ${
                      project.video ? "transition-opacity duration-200 group-hover:opacity-0" : ""
                    }`}
                  />
                  {project.video && <CardVideo src={project.video} label={project.title} />}
                </div>
              </div>

              <div className="select-none px-1 pb-1 pt-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-text-muted">
                  <span>{project.company}</span>
                  <span>{project.year}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-medium leading-snug text-text-primary">
                  {project.title}
                </h3>
                <Link
                  href={`/work/${project.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 flex h-5 translate-y-1 items-center gap-1 text-sm text-red-700 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
                >
                  View case study <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Hint */}
      <p className="pointer-events-none absolute bottom-4 right-4 z-[100000] text-xs uppercase tracking-wide text-text-muted">
        Drag cards · click to open
      </p>
    </div>
  );
}
