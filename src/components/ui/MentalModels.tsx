"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface MentalModelReference {
  src: string;
  alt: string;
  /** Pixel size of the picture itself. */
  width: number;
  height: number;
  /** How wide it is shown on desktop, in px. */
  displayWidth: number;
  /** Which side of the video it sits on. */
  side: "left" | "right";
}

/**
 * One platform picture. It sits around the video, and as you scroll on past the section it shrinks and moves in
 * until it is hidden behind the video. Scrolling back up brings it out again.
 */
function Floater({
  item,
  index,
  progress,
  frame,
  video,
  still,
}: {
  item: MentalModelReference;
  index: number;
  progress: MotionValue<number>;
  frame: RefObject<HTMLDivElement>;
  video: RefObject<HTMLVideoElement>;
  still: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);

  // How far this picture is from the middle of the video, which is where it ends up.
  // (offsetLeft / offsetTop ignore transforms, so this is right even while it is moving.)
  useLayoutEffect(() => {
    const measure = () => {
      const f = frame.current;
      const v = video.current;
      const me = el.current;
      if (!f || !v || !me) return;
      const centre = (node: HTMLElement) => {
        let x = 0;
        let y = 0;
        for (let e: HTMLElement | null = node; e && e !== f; e = e.offsetParent as HTMLElement | null) {
          x += e.offsetLeft;
          y += e.offsetTop;
        }
        return { x: x + node.offsetWidth / 2, y: y + node.offsetHeight / 2 };
      };
      const a = centre(v);
      const b = centre(me);
      dx.set(a.x - b.x);
      dy.set(a.y - b.y);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (frame.current) ro.observe(frame.current);
    return () => ro.disconnect();
  }, [frame, video, dx, dy]);

  const dir = item.side === "left" ? -1 : 1;
  // Each one starts going in a little after the last.
  const p = useTransform(progress, [index * 0.06, 0.7 + index * 0.06], [0, 1]);
  const x = useTransform([p, dx], ([pv, d]: number[]) => pv * d);
  const y = useTransform([p, dy], ([pv, d]: number[]) => pv * d);
  const scale = useTransform(p, [0, 1], [1, 0.35]);
  const rotate = useTransform(p, [0, 1], [0, dir * 10]);
  const opacity = useTransform(p, [0, 0.75, 1], [1, 1, 0]);

  return (
    <motion.div
      ref={el}
      style={still ? undefined : { x, y, scale, rotate, opacity }}
      className="relative z-0 max-w-full shrink-0"
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes={`${item.displayWidth}px`}
        style={{ width: item.displayWidth }}
        className="block h-auto max-w-full"
      />
    </motion.div>
  );
}

/**
 * "Familiar mental models": the finished design in motion (the video) in the middle, with the platforms it
 * borrowed from around it. They are already out when you reach the section; as you scroll on they shrink and
 * tuck away behind the video, and they come back out as you scroll up.
 */
export default function MentalModels({
  video,
  videoRatio = 16 / 9,
  references = [],
}: {
  video?: string;
  videoRatio?: number;
  references?: MentalModelReference[];
}) {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  // 0 while the section is on its way up the screen (the tools stay out), rising to 1 as its middle climbs
  // from 60% down the screen to 25% down it (the tools are behind the video)
  const { scrollYProgress } = useScroll({ target: frame, offset: ["center 60%", "center 25%"] });

  const column = (side: "left" | "right") => (
    <div className="flex flex-row flex-wrap items-center justify-center gap-6 md:flex-col md:flex-nowrap">
      {references.map((r, i) =>
        r.side === side ? (
          <Floater
            key={r.src}
            item={r}
            index={i}
            progress={scrollYProgress}
            frame={frame}
            video={videoEl}
            still={!!reduce}
          />
        ) : null
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div ref={frame} className="relative overflow-hidden bg-surface-200 p-6 rounded-none sm:p-10">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
          {column("left")}
          {video && (
            <video
              ref={videoEl}
              src={video}
              aria-label="The Clubly events page: switching between Published and Drafts, with Edit, Registration and Delete on each card"
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 block w-full max-md:order-first md:w-[440px] md:min-w-0 md:shrink"
              style={{ aspectRatio: videoRatio }}
            />
          )}
          {column("right")}
        </div>
      </div>
    </div>
  );
}
