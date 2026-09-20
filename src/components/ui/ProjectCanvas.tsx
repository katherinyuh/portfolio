"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/lib/data";
import { CardVideo } from "@/components/ui/CardVideo";
import { CompanyName } from "@/components/ui/CompanyName";

// "Scroll to explore" is switched off for now. Set this to true to bring it back: the board becomes
// BOARD_SCALE× the visible area in each direction, you start in its middle, and scrolling (wheel,
// trackpad, touch or arrow keys) moves around it. It has edges, so it isn't infinite.
const SCROLL_TO_EXPLORE = false;
const BOARD_SCALE = SCROLL_TO_EXPLORE ? 2 : 1;

// Where each card starts, as a fraction (0–1) of the first visible view, measured from its top-left
// corner, plus its tilt. Keyed by project order. The board is bigger than the view, so these are
// converted to board percentages below; the default view therefore looks the same at any board size.
const layout = [
  { x: 0.139, y: 0.045, rotate: -5 }, // Clubly: top left
  { x: 0.024, y: 0.508, rotate: 3 }, // Laminar: bottom left
  { x: 0.612, y: 0.049, rotate: 3 }, // IBM: top right
  { x: 0.510, y: 0.488, rotate: -2 }, // Delivery Optimizer: bottom right
];

// The first view is the middle of the board: it spans this fraction of it, starting here.
const VIEW_SIZE = 1 / BOARD_SCALE;
const VIEW_START = (BOARD_SCALE - 1) / (2 * BOARD_SCALE);
const boardPercent = (fractionOfView: number) => (VIEW_START + VIEW_SIZE * fractionOfView) * 100;

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const topZ = useRef(1);
  const [zIndex, setZIndex] = useState<Record<string, number>>({});

  // Start in the middle of the board.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, []);

  const bringToFront = (id: string) => {
    topZ.current += 1;
    setZIndex((z) => ({ ...z, [id]: topZ.current }));
  };

  return (
    <div className="relative h-[70vh] min-h-[520px] overflow-hidden lg:h-[calc(100vh-3rem)]">
      {/* With scrolling on, wheel / trackpad / touch / arrow keys move around the board; no scrollbars */}
      <div
        ref={scrollerRef}
        tabIndex={SCROLL_TO_EXPLORE ? 0 : undefined}
        aria-label={SCROLL_TO_EXPLORE ? "Project canvas. Scroll to explore." : "Project canvas"}
        className={`absolute inset-0 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          SCROLL_TO_EXPLORE ? "overflow-auto overscroll-contain" : "overflow-hidden"
        }`}
      >
        <div
          ref={boardRef}
          className="relative"
          style={{ width: `${BOARD_SCALE * 100}%`, height: `${BOARD_SCALE * 100}%` }}
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
                  dragConstraints={boardRef}
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
                  onHoverStart={() => bringToFront(project.id)}
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
                  className="group absolute cursor-grab bg-card p-2 shadow-md dark:border dark:border-slate-200"
                  style={{
                    width: `min(${width}px, calc(100% - 32px))`,
                    left: `max(16px, min(${boardPercent(slot.x)}%, calc(100% - ${width + 16}px)))`,
                    top: `${boardPercent(slot.y)}%`,
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
                          project.video
                            ? "transition-opacity duration-200 group-hover:opacity-0"
                            : ""
                        }`}
                      />
                      {project.video && <CardVideo src={project.video} label={project.title} />}
                    </div>
                  </div>

                  <div className="select-none px-1 pb-1 pt-3">
                    <div className="flex items-baseline justify-between text-xs uppercase tracking-wide text-text-muted">
                      <CompanyName project={project} />
                      <span className="font-mono">{project.year}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-medium leading-snug text-text-primary">
                      {project.title}
                    </h3>
                    {/* Longer description: opens up on hover, between the title and "View case study" */}
                    <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                      <div className="min-h-0 overflow-hidden">
                        <p className="pt-2 text-sm leading-relaxed text-text-muted">
                          {project.description}
                        </p>
                      </div>
                    </div>
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
        </div>
      </div>

      {/* Hint — stays put while the board scrolls */}
      <p className="pointer-events-none absolute bottom-4 right-4 z-[100000] text-xs uppercase tracking-wide text-text-muted">
        {SCROLL_TO_EXPLORE ? "Scroll to explore · Drag cards · Click to open" : "Drag cards · Click to open"}
      </p>
    </div>
  );
}
