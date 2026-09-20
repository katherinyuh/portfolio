"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  beforeImage: string;
  afterImage: string;
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

export default function BeforeAfterSwitcher({
  beforeImage,
  afterImage,
  beforeLabel = "Initial version",
  afterLabel = "Current version",
  caption,
  beforeRatio = 16 / 9,
  afterRatio = 16 / 9,
  beforeNotes,
  beforeNotesPosition = "below",
}: BeforeAfterSwitcherProps) {
  const [isAfter, setIsAfter] = useState(false);
  const showNotes = !isAfter && !!beforeNotes && beforeNotes.length > 0;

  const IMAGE_STROKE = [`1px 0`, `-1px 0`, `0 1px`, `0 -1px`]
    .map((offset) => `drop-shadow(${offset} 0 rgb(var(--slate-200)))`)
    .join(" ");

  return (
    <div className="w-full mb-12">
      {/* Content switcher: two touching segments, 32px tall, hugging their labels. The selected one is
          solid dark with light text; the other is plain muted text. */}
      <div className="mb-6 inline-flex items-stretch" role="group" aria-label="Version">
        {[
          { label: beforeLabel, selected: !isAfter, select: () => setIsAfter(false) },
          { label: afterLabel, selected: isAfter, select: () => setIsAfter(true) },
        ].map(({ label, selected, select }) => (
          <button
            key={label}
            onClick={select}
            aria-pressed={selected}
            className={`rounded-none px-2 py-1 text-base transition-colors ${
              selected
                ? "bg-slate-950 text-slate-50"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Image container. Both versions share one fixed-size box (the Current version's shape), so the
          container never changes size when you switch. The Initial version's description lives inside
          it, 24px from the image: below the image, or beside it on wide screens when asked. */}
      <div className="p-6 bg-surface-200 border border-surface-300 rounded-none">
        <div className="relative w-full" style={{ aspectRatio: afterRatio }}>
          {isAfter ? (
            <motion.div
              key="after"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={afterImage}
                alt={afterLabel}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-contain"
                style={{ filter: IMAGE_STROKE }}
              />
            </motion.div>
          ) : (
            <div
              className={`absolute inset-0 flex flex-col justify-center gap-6 ${
                showNotes && beforeNotesPosition === "right"
                  ? "xl:flex-row xl:items-center"
                  : ""
              }`}
            >
              {/* The image is sized to its own shape and the image + description are centred as one
                  group, so the gap between the picture and the text is exactly 24px. */}
              <motion.div
                key="before"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative min-h-0 min-w-0 shrink ${
                  showNotes && beforeNotesPosition === "right" ? "w-full xl:h-full xl:w-auto" : "w-full"
                }`}
                style={{ aspectRatio: beforeRatio }}
              >
                <Image
                  src={beforeImage}
                  alt={beforeLabel}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-contain"
                  style={{ filter: IMAGE_STROKE }}
                />
              </motion.div>

              {showNotes && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1 xl:w-max xl:shrink-0 xl:self-start"
                >
                  {beforeNotes.map((note) => (
                    <li key={note.text} className="flex items-start gap-2 text-base text-text-muted">
                      <NoteIcon kind={note.icon} />
                      <span>{note.text}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          )}
        </div>
      </div>

      {caption && <p className="mt-3 text-xs text-text-muted">{caption}</p>}
    </div>
  );
}
