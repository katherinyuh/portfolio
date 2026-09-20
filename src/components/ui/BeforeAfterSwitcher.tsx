"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { BeforeNote } from "@/lib/data";

// Thumbs-up / thumbs-down icons, exactly as supplied (like-m.svg, dislike-m.svg): 24px, filled.
const NOTE_ICON = {
  up: {
    color: "#84CC16",
    path: "M11 3H8.65287L7.65287 9H3.5V21H20.5V9H14.5V6.5C14.5 4.567 12.933 3 11 3ZM9.5 19H18.5V11H12.5V6.5C12.5 5.67157 11.8284 5 11 5H10.3471L9.5 10.0828V19ZM7.5 19V11H5.5V19H7.5Z",
  },
  down: {
    color: "#EF4444",
    path: "M13 21H15.3471L16.3471 15L20.5 15L20.5 3L3.5 3L3.5 15H9.5V17.5C9.5 19.433 11.067 21 13 21ZM14.5 5L5.5 5L5.5 13H11.5L11.5 17.5C11.5 18.3284 12.1716 19 13 19H13.6529L14.5 13.9172L14.5 5ZM16.5 5L16.5 13H18.5L18.5 5L16.5 5Z",
  },
} as const;

function NoteIcon({ kind }: { kind: BeforeNote["icon"] }) {
  const { color, path } = NOTE_ICON[kind];
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d={path} fill={color} />
    </svg>
  );
}

interface BeforeAfterSwitcherProps {
  /** Leave an image out until it is added: the beige frame shows on its own. */
  beforeImage?: string;
  afterImage?: string;
  /** A looping video in place of the image. It restarts from the beginning each time that version is shown. */
  beforeVideo?: string;
  afterVideo?: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  /** Width / height of the Initial image itself, so it can be sized to its real shape and sit exactly 24px from the description. */
  beforeRatio?: number;
  afterRatio?: number;
  /** Pros / cons shown with the Initial version only. */
  beforeNotes?: BeforeNote[];
  /** Inside the image container. "right": beside the image, 24px away, on screens 1280px wide or more (below it on narrower ones). "below": 24px under the image. */
  beforeNotesPosition?: "right" | "below";
}

// The two versions slide past each other like the highlight does: the new one comes in from the side
// you are moving towards while the old one leaves the other way. `dir` is 1 going to Current, -1 back.
const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};
const slideTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

export default function BeforeAfterSwitcher({
  beforeImage,
  afterImage,
  beforeVideo,
  afterVideo,
  beforeLabel = "Initial version",
  afterLabel = "Current version",
  caption,
  beforeRatio = 16 / 9,
  afterRatio = 16 / 9,
  beforeNotes,
  beforeNotesPosition = "below",
}: BeforeAfterSwitcherProps) {
  const [isAfter, setIsAfter] = useState(false);
  const [dir, setDir] = useState(1);
  const choose = (after: boolean) => {
    if (after === isAfter) return;
    setDir(after ? 1 : -1);
    setIsAfter(after);
  };
  const pillId = useId(); // one sliding highlight per switcher on the page
  const showNotes = !isAfter && !!beforeNotes && beforeNotes.length > 0;


  return (
    <div className="w-full mb-12">
      {/* Content switcher: two touching segments, 32px tall, hugging their labels. The selected one is
          solid dark with light text; the other is plain muted text. The dark highlight slides between them. */}
      <div className="mb-6 inline-flex items-stretch" role="group" aria-label="Version">
        {[
          { label: beforeLabel, selected: !isAfter, select: () => choose(false) },
          { label: afterLabel, selected: isAfter, select: () => choose(true) },
        ].map(({ label, selected, select }) => (
          <button
            key={label}
            onClick={select}
            aria-pressed={selected}
            className={`relative rounded-none px-2 py-1 text-base transition-colors duration-300 ${
              selected ? "text-slate-50" : "text-text-muted hover:text-text-primary"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={pillId}
                aria-hidden
                className="absolute inset-0 bg-slate-950"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {/* Image container. Both versions share one fixed-size box (the Current version's shape), so the
          container never changes size when you switch. The Initial version's description lives inside
          it, 24px from the image: below the image, or beside it on wide screens when asked. */}
      <div className="p-6 bg-surface-200 rounded-none">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: afterRatio }}>
          <AnimatePresence initial={false} custom={dir}>
            {isAfter ? (
              <motion.div
                key="after"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-0"
              >
                {afterVideo ? (
                  <video
                    src={afterVideo}
                    aria-label={afterLabel}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : afterImage && (
                  <Image
                    src={afterImage}
                    alt={afterLabel}
                    fill
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-contain"
                  />
                  )}
              </motion.div>
            ) : (
              <motion.div
                key="before"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className={`absolute inset-0 flex flex-col justify-center gap-6 ${
                  showNotes && beforeNotesPosition === "right" ? "xl:flex-row xl:items-center" : ""
                }`}
              >
                {/* The image is sized to its own shape and the image + description are centred as one
                    group, so the gap between the picture and the text is exactly 24px. */}
                <div
                  className={`relative min-h-0 min-w-0 shrink ${
                    showNotes && beforeNotesPosition === "right" ? "w-full xl:h-full xl:w-auto" : "w-full"
                  }`}
                  style={{ aspectRatio: beforeRatio }}
                >
                  {beforeVideo ? (
                    <video
                      src={beforeVideo}
                      aria-label={beforeLabel}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : beforeImage && (
                    <Image
                      src={beforeImage}
                      alt={beforeLabel}
                      fill
                      sizes="(min-width: 1024px) 70vw, 100vw"
                      className="object-contain"
                    />
                    )}
                </div>

                {showNotes && (
                  <ul className="space-y-1 xl:w-max xl:shrink-0 xl:self-start">
                    {beforeNotes.map((note) => (
                      <li key={note.text} className="flex items-start gap-2 text-base text-text-muted">
                        <NoteIcon kind={note.icon} />
                        <span>{note.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {caption && <p className="mt-3 text-xs text-text-muted">{caption}</p>}
    </div>
  );
}
