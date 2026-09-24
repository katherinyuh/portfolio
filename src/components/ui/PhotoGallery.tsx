"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PhotoGalleryItem } from "@/lib/data";
import { useLightbox } from "@/components/ui/MediaLightbox";

/**
 * One photo. With a mouse, hovering tilts the photo slightly and the pointer turns into its caption, which
 * follows the mouse. Without one (touch, keyboard), focusing tilts it and pins the caption. Click (or tap) it
 * and it pops out life-size.
 */
function GalleryTile({ item, tilt }: { item: PhotoGalleryItem; tilt: number }) {
  const [hovered, setHovered] = useState(false); // mouse is over the photo
  const [pinned, setPinned] = useState(false); // focused by keyboard
  const [mounted, setMounted] = useState(false); // the caption portal only exists in the browser
  useEffect(() => setMounted(true), []);
  const openLightbox = useLightbox();

  // The caption trails the mouse a little, so it feels attached rather than glued on.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 600, damping: 45 });
  const followY = useSpring(y, { stiffness: 600, damping: 45 });

  const move = (e: React.PointerEvent) => {
    x.set(e.clientX + 14);
    y.set(e.clientY + 14);
  };

  return (
    <>
      <button
        type="button"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          // Start at the mouse instead of sliding in from wherever the caption last was.
          x.jump(e.clientX + 14);
          y.jump(e.clientY + 14);
          setHovered(true);
        }}
        onPointerMove={(e) => e.pointerType === "mouse" && move(e)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
        onClick={() => item.src && openLightbox({ type: "image", src: item.src, alt: item.alt })}
        onFocus={() => setPinned(true)}
        onBlur={() => setPinned(false)}
        aria-label={item.caption}
        className={`relative block w-full cursor-none text-left ${item.wide ? "sm:col-span-2" : ""} ${
          hovered || pinned ? "z-10" : ""
        }`}
      >
        <motion.div
          className="relative w-full overflow-hidden bg-surface-200"
          style={{ aspectRatio: item.ratio }}
          animate={{ rotate: hovered || pinned ? tilt : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          {item.src && (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={item.wide ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
              className="object-cover"
              style={{ objectPosition: item.position }}
            />
          )}
        </motion.div>

        {/* Caption pinned to the photo for touch and keyboard, where there is no mouse to follow */}
        {pinned && !hovered && (
          <span className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] bg-surface-50 px-2 py-1 text-sm text-text-primary">
            {item.caption}
          </span>
        )}
      </button>

      {/* Caption that replaces the mouse pointer */}
      {mounted &&
        createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[70] whitespace-nowrap bg-surface-50 px-2 py-1 text-sm text-text-primary"
            style={{ x: followX, y: followY }}
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            {item.caption}
          </motion.div>,
          document.body
        )}
    </>
  );
}

/** Photos in a grid: two side by side, and `wide` ones across the full row. No captions until you hover one. */
export default function PhotoGallery({ items }: { items: PhotoGalleryItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item, i) => (
        <GalleryTile key={item.src ?? i} item={item} tilt={item.wide ? -1 : i % 2 === 0 ? -2 : 2} />
      ))}
    </div>
  );
}
