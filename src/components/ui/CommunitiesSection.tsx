"use client";

import { useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { motion } from "framer-motion";

// The polaroid captions are handwritten, the one place the site does not use Geist.
const schoolbell = localFont({ src: "../../fonts/Schoolbell-Regular.ttf", display: "swap" });

interface Community {
  /** A photo, or leave both out until it is added: the polaroid then shows an empty frame. */
  image?: string;
  /** A looping muted video in place of the photo. */
  video?: string;
  /** CSS object-position, to choose which part of the picture stays in the crop. */
  position?: string;
  /** A wider polaroid, for landscape photos: it takes two columns instead of one. */
  wide?: boolean;
  title: string;
  description: string;
}

interface CommunitiesSectionProps {
  items: Community[];
}

// Each polaroid rests at its own angle, so the set looks laid out by hand.
const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5];

// Frame colours, all from the beige palette (light to dark), mixed so neighbours differ.
const FRAMES = [
  "bg-surface-200",
  "bg-surface-300",
  "bg-surface-400",
  "bg-surface-300",
  "bg-surface-400",
  "bg-surface-200",
];

export default function CommunitiesSection({ items }: CommunitiesSectionProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-text-primary mb-1">
        My work-life balance 😎
      </h2>
      <p className="text-base font-sans text-text-muted mb-8">Here are things I love (not ordered):</p>

      {/* Polaroids on a four-column grid: tall ones take one column, wide ones take two. Every photo in a
          row is the same height, and each polaroid swings a little when you hover it. */}
      <div className="grid grid-flow-dense grid-cols-2 gap-x-6 gap-y-10 px-2 py-2 lg:grid-flow-row lg:grid-cols-4">
        {items.map((item, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <motion.figure
              key={i}
              className={`${FRAMES[i % FRAMES.length]} relative flex flex-col p-2.5 pb-3 shadow-md rounded-none hover:z-10 ${
                item.wide ? "col-span-2" : ""
              }`}
              initial={false}
              animate={{ rotate: tilt }}
              whileHover={{ rotate: tilt > 0 ? tilt - 4 : tilt + 4 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <div
                className={`relative w-full flex-1 overflow-hidden bg-surface-50 ${
                  item.wide ? "max-lg:aspect-[4/3]" : "aspect-[2/3]"
                }`}
              >
                {item.video ? (
                  <video
                    src={item.video}
                    aria-label={item.title}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.position }}
                  />
                ) : (
                  item.image &&
                  !imageErrors[i] && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes={item.wide ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 22vw, 45vw"}
                      className="object-cover"
                      style={{ objectPosition: item.position }}
                      onError={() => setImageErrors((prev) => ({ ...prev, [i]: true }))}
                    />
                  )
                )}
              </div>
              <figcaption className="flex min-h-[3.25rem] flex-col items-center justify-center px-2 pt-3 text-center">
                <span className={`${schoolbell.className} text-lg leading-snug text-text-primary`}>{item.title}</span>
                {item.description && (
                  <span className={`${schoolbell.className} mt-0.5 text-base text-text-secondary`}>{item.description}</span>
                )}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}
