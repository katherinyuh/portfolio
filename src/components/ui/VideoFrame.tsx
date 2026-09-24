"use client";

import { useLightbox } from "@/components/ui/MediaLightbox";

/** A single looping video in the beige media frame, at the full width of the frame. Click it and it pops out life-size.
    `tightY`: 24px top and bottom at every width, instead of growing to 40px on sm screens and up. */
export default function VideoFrame({ src, alt, ratio, tightY }: { src: string; alt: string; ratio: number; tightY?: boolean }) {
  const openLightbox = useLightbox();
  return (
    <div className={`bg-surface-200 rounded-none px-6 sm:px-10 ${tightY ? "py-6" : "py-6 sm:py-10"}`}>
      <video
        src={src}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        onClick={() => openLightbox({ type: "video", src, alt })}
        className="block w-full cursor-zoom-in"
        style={{ aspectRatio: ratio }}
      />
    </div>
  );
}
