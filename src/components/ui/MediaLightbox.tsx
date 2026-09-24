"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export type LightboxMedia = { type: "image" | "video"; src: string; alt: string };

const LightboxContext = createContext<(media: LightboxMedia) => void>(() => {});

/** Anywhere under this can call useLightbox() to pop an image or video out over the page, life-size. Click the
    dimmed background, or press Escape, to close it. One instance holds whichever piece of media is popped out. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<LightboxMedia | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape closes it, and the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMedia(null);
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [media]);

  return (
    <LightboxContext.Provider value={setMedia}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {media && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-6 sm:p-12"
                onClick={() => setMedia(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-full max-w-full"
                  // The media itself doesn't close the view, only the dimmed background around it does.
                  onClick={(e) => e.stopPropagation()}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      aria-label={media.alt}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="block max-h-[85vh] max-w-[90vw]"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.src} alt={media.alt} className="block max-h-[85vh] max-w-[90vw] object-contain" />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </LightboxContext.Provider>
  );
}

/** Call with `{ type, src, alt }` to pop that image or video out over the page. */
export function useLightbox() {
  return useContext(LightboxContext);
}
