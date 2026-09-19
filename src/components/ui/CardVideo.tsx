"use client";

import { useEffect, useRef } from "react";

/**
 * A demo clip that fades in over a card's image and plays only while the card
 * is hovered. Leaving the card pauses it and rewinds it to the first frame.
 * Put it inside the image frame; the card itself must have the `group` class.
 */
export function CardVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const card = video?.closest(".group");
    if (!video || !card) return;

    const play = () => {
      video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", stop);
    return () => {
      card.removeEventListener("mouseenter", play);
      card.removeEventListener("mouseleave", stop);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      loop
      muted
      playsInline
      preload="auto"
      className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    />
  );
}
