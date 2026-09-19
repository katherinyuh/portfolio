"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/lib/data";

// Scattered starting spots (% of the canvas) and tilt, keyed by project order.
const layout = [
  { left: 4, top: 6, rotate: -5 },
  { left: 34, top: 38, rotate: 3 },
  { left: 56, top: 4, rotate: -2 },
  { left: 12, top: 50, rotate: 4 },
];

const DEFAULT_RATIO = 4 / 3;

// Wide images get a wider card so they stay readable.
const cardWidth = (ratio: number) => (ratio > 1.6 ? 440 : 320);

type Props = {
  projects: Project[];
  /** Every project, so positions stay put when a filter hides some. */
  allProjects: Project[];
};

export function ProjectCanvas({ projects, allProjects }: Props) {
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
        {projects.map((project) => {
          const slot = layout[allProjects.indexOf(project) % layout.length];
          const ratio = project.thumbnailRatio ?? DEFAULT_RATIO;
          const width = cardWidth(ratio);
          return (
            <motion.div
              key={project.id}
              drag
              dragConstraints={canvasRef}
              dragElastic={0.12}
              dragMomentum
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
              <div
                className="relative overflow-hidden bg-surface-200"
                style={{ aspectRatio: ratio }}
              >
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes={`${width}px`}
                  draggable={false}
                  className="pointer-events-none select-none object-cover"
                />
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
