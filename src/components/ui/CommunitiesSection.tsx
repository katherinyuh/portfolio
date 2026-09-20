"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { animate, useReducedMotion } from "framer-motion";

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

// Each window rests at its own angle, so the set looks laid out by hand.
const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5];

// The three photos that peek out of the closed folder, and how each one sits.
const PEEK = [
  { left: 30, rotate: -9 },
  { left: 62, rotate: 3 },
  { left: 94, rotate: 10 },
];

/**
 * A folder of photos. Click it and the polaroids fly out of it, first to its right and then below it;
 * click again and they go back in. Closed, only the folder shows.
 */
export default function CommunitiesSection({ items }: CommunitiesSectionProps) {
  const reduce = useReducedMotion();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState(false); // what the visitor asked for
  const [shown, setShown] = useState(false); // the polaroids are on the page (they stay while closing)
  const busy = useRef(false);
  const art = useRef<HTMLDivElement>(null);
  const figs = useRef<(HTMLElement | null)[]>([]);

  const peekPhotos = items.filter((it) => it.image).slice(0, PEEK.length);

  // How far each polaroid is from the middle of the folder.
  const offsets = () => {
    const f = art.current?.getBoundingClientRect();
    return figs.current.map((el) => {
      if (!el || !f) return { dx: 0, dy: 0 };
      const r = el.getBoundingClientRect();
      return { dx: f.x + f.width / 2 - (r.x + r.width / 2), dy: f.y + f.height / 2 - (r.y + r.height / 2) };
    });
  };

  useLayoutEffect(() => {
    if (!shown) return;
    const list = figs.current.filter(Boolean) as HTMLElement[];
    const off = offsets();

    if (open) {
      busy.current = true;
      const runs = list.map((el, i) =>
        reduce
          ? animate(el, { opacity: 1 }, { duration: 0 })
          : animate(
              el,
              { x: [off[i].dx, 0], y: [off[i].dy, 0], scale: [0.15, 1], opacity: [0, 1] },
              { type: "spring", stiffness: 150, damping: 20, delay: i * 0.07 }
            )
      );
      Promise.all(runs).then(() => (busy.current = false));
    } else {
      busy.current = true;
      const runs = list.map((el, i) =>
        reduce
          ? animate(el, { opacity: 0 }, { duration: 0 })
          : animate(
              el,
              { x: off[i].dx, y: off[i].dy, scale: 0.15, opacity: 0 },
              { duration: 0.35, ease: "easeIn", delay: (list.length - 1 - i) * 0.04 }
            )
      );
      Promise.all(runs).then(() => {
        busy.current = false;
        setShown(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = () => {
    if (busy.current) return;
    if (!open) setShown(true);
    setOpen((o) => !o);
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-text-primary mb-1">
        My work-life balance 😎
      </h2>
      <p className="text-base font-sans text-text-muted mb-8">Here are things I love</p>

      {/* The folder is the first cell; the polaroids fill the rest, to its right and below. Tall ones take
          one column, wide ones two, and every photo in a row is the same height. */}
      <div className="grid grid-flow-dense grid-cols-2 gap-x-6 gap-y-10 px-2 py-2 lg:grid-flow-row lg:grid-cols-5">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="Photo folder"
          className="col-span-2 flex flex-col items-center gap-3 self-start lg:col-span-1"
        >
          <div ref={art} className="relative h-[120px] w-[160px] [perspective:600px]">
            {/* Back panel, with its tab */}
            <div className="absolute inset-0 bg-surface-400 [clip-path:polygon(0_8%,36%_8%,44%_20%,100%_20%,100%_100%,0_100%)]" />
            {/* Photos peeking out; they leave with the polaroids */}
            {PEEK.map((p, i) => (
              <div
                key={i}
                aria-hidden
                className={`absolute top-1 h-[54px] w-[42px] bg-surface-50 p-[3px] transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
                style={{ left: p.left, transform: `rotate(${p.rotate}deg)` }}
              >
                <div className="relative h-full w-full bg-surface-200">
                  {peekPhotos[i] && (
                    <Image src={peekPhotos[i].image!} alt="" fill sizes="48px" className="object-cover" />
                  )}
                </div>
              </div>
            ))}
            {/* Front panel: tips forward a little when open */}
            <div
              className={`absolute inset-x-0 bottom-0 top-[30%] origin-bottom bg-gradient-to-br from-surface-100 to-surface-300 transition-transform duration-300 ${
                open ? "[transform:rotateX(-24deg)]" : "[transform:rotateX(0deg)]"
              }`}
            />
          </div>
          <span className={`${schoolbell.className} whitespace-nowrap text-lg text-text-muted`}>click to open and close</span>
        </button>

        {shown &&
          items.map((item, i) => {
            const tilt = TILTS[i % TILTS.length];
            return (
              <figure
                key={i}
                ref={(el) => {
                  figs.current[i] = el;
                }}
                className={`relative flex flex-col bg-surface-50 rounded-none [rotate:var(--tilt)] transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:[rotate:var(--tilt-hover)] ${
                  item.wide ? "col-span-2" : ""
                }`}
                // starts hidden: the fly-out animation brings it in from the folder
                style={{
                  opacity: 0,
                  ["--tilt" as string]: `${tilt}deg`,
                  ["--tilt-hover" as string]: `${tilt > 0 ? tilt - 4 : tilt + 4}deg`,
                }}
              >
                {/* Title bar: the three window dots and the title */}
                <figcaption className="flex h-[30px] shrink-0 items-center px-3">
                  <svg width="45" height="11" viewBox="0 0 45 11" aria-hidden className="shrink-0">
                    <circle cx="5.5" cy="5.5" r="5.5" fill="#EC6A5E" />
                    <circle cx="22.5" cy="5.5" r="5.5" fill="#F4BF4F" />
                    <circle cx="39.5" cy="5.5" r="5.5" fill="#61C554" />
                  </svg>
                  <span title={item.title} className="ml-2.5 min-w-0 truncate text-xs font-sans text-text-primary">
                    {item.title}
                  </span>
                </figcaption>

                {/* The picture fills the rest of the window */}
                <div
                  className={`relative w-full flex-1 overflow-hidden bg-surface-200 ${
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
                        sizes={item.wide ? "(min-width: 1024px) 35vw, 100vw" : "(min-width: 1024px) 18vw, 45vw"}
                        className="object-cover"
                        style={{ objectPosition: item.position }}
                        onError={() => setImageErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                    )
                  )}
                </div>
              </figure>
            );
          })}
      </div>
    </div>
  );
}
