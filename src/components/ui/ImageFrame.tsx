"use client";

import Image from "next/image";
import { useLightbox } from "@/components/ui/MediaLightbox";

/** A single image in the beige media frame, at the full width of the frame. Click it and it pops out life-size. */
export default function ImageFrame({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const openLightbox = useLightbox();
  return (
    <div className="bg-surface-200 p-6 rounded-none">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 70vw, 100vw"
        onClick={() => openLightbox({ type: "image", src, alt })}
        className="block h-auto w-full cursor-zoom-in"
      />
    </div>
  );
}
