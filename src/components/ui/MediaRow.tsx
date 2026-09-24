"use client";

import Image from "next/image";
import type { MediaRowItem } from "@/lib/data";
import { useLightbox } from "@/components/ui/MediaLightbox";

/** Same-size media (looping videos or images), 24px apart. Side by side by default, or stacked one above the
    other with `stacked`. Click any one and it pops out life-size. `tightY`: 24px top and bottom at every width,
    instead of growing to 40px on sm screens and up. */
export default function MediaRow({ items, stacked, tightY }: { items: MediaRowItem[]; stacked?: boolean; tightY?: boolean }) {
  const openLightbox = useLightbox();
  return (
    <div
      className={`flex ${stacked ? "flex-col" : "flex-wrap"} items-center justify-center gap-6 bg-surface-200 rounded-none px-6 sm:px-10 ${
        tightY ? "py-6" : "py-6 sm:py-10"
      }`}
    >
      {items.map((item) => {
        const frame = `${stacked ? "w-full" : "w-[270px] max-w-full"} cursor-zoom-in`;
        return item.kind === "video" ? (
          <video
            key={item.src}
            src={item.src}
            aria-label={item.alt}
            autoPlay
            loop
            muted
            playsInline
            onClick={() => openLightbox({ type: "video", src: item.src, alt: item.alt })}
            className={`block ${frame}`}
            style={{ aspectRatio: item.ratio }}
          />
        ) : (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            onClick={() => openLightbox({ type: "image", src: item.src, alt: item.alt })}
            className={`block h-auto ${frame}`}
            style={{ aspectRatio: item.ratio }}
          />
        );
      })}
    </div>
  );
}
