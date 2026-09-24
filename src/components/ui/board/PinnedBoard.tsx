"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import localFont from "next/font/local";
import { motion, useMotionValue, useSpring, type TargetAndTransition } from "framer-motion";
import { DiscPlayer } from "./DiscPlayer";
import { PhotoFolder } from "./PhotoFolder";

// Handwriting for the note on the back of the polaroid: the one place on the board, besides the captions baked
// into the Figma art, where the site doesn't use Geist.
const schoolbell = localFont({ src: "../../../fonts/Schoolbell-Regular.ttf", display: "swap" });

// Everything is laid out on a board 733 wide and 366 tall, and every size and position is turned into a share of the
// board's width, so the whole thing scales with the page.
const BOARD_W = 733;
const BOARD_H = 366;
const cq = (px: number) => `${(px / BOARD_W) * 100}cqw`;

const SHADOW = "drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.2)) drop-shadow(0 5px 8px rgb(0 0 0 / 0.13))";

// The fortune flower's two shapes are different proportions (the closed bud is almost square, the open bloom is
// wide and flat), so it doesn't just scale up — the board unit box grows to the bloom's own shape, kept centred
// on where the bud was.
const FORTUNE_CLOSED = { w: 52.4, h: 56.2 }; // 477 x 437
const FORTUNE_OPEN = { w: 130, h: 49.4 }; // 863 x 328
const FORTUNE_CENTER = { x: 590 + FORTUNE_CLOSED.w / 2, y: 12 + FORTUNE_CLOSED.h / 2 };

// Layout mode: open the About page with ?layout on the end (/about?layout). Pieces then stay where you drop them instead
// of springing back, and a panel lists where each moved piece ended up, in the same numbers the pieces use below.
const LayoutContext = createContext<{ active: boolean; boardPx: () => number; report: (label: string, x: number, y: number) => void }>({
  active: false,
  boardPx: () => BOARD_W,
  report: () => {},
});

interface PinProps {
  /** What this piece is called in layout mode. */
  label?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  z?: number;
  children: ReactNode;
  /** Words that replace the mouse circle while it is over this piece. */
  cursor?: string;
  onTap?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  externalHover?: boolean;
  animate?: TargetAndTransition;
  /** No shadow around the shape (for things that are already see-through or have their own). */
  flat?: boolean;
  proportional?: boolean;
  className?: string;
  style?: CSSProperties;
  /** What it does when the mouse is over it, instead of the usual small lift. */
  hover?: TargetAndTransition;
}

/**
 * One thing on the board. You can pick it up and drag it about; let go and it springs back to where it was pinned,
 * like the pieces on pinned-board.framer.website.
 */
function Pin({ label, x, y, w, h, rotate = 0, z = 1, children, cursor, onTap, onHoverStart, onHoverEnd, externalHover = false, animate: animateTarget, flat, proportional = false, className = "", style, hover }: PinProps) {
  // With a mouse you can pick pieces up. On a touch screen they stay put, so a finger on the board scrolls it instead.
  const [mouse, setMouse] = useState(false);
  useEffect(() => setMouse(window.matchMedia("(pointer: fine)").matches), []);
  const layout = useContext(LayoutContext);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      className={`absolute select-none ${mouse ? "cursor-grab touch-none" : ""} ${className}`}
      style={{ left: cq(x), top: cq(y), width: cq(w), height: proportional ? "auto" : cq(h), aspectRatio: proportional ? `${w} / ${h}` : undefined, zIndex: z, rotate, x: dragX, y: dragY, filter: flat ? undefined : SHADOW, ...style }}
      drag={mouse}
      dragSnapToOrigin={!layout.active}
      dragMomentum={!layout.active}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 22 }}
      whileHover={layout.active ? undefined : hover ?? { scale: 1.03 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      whileDrag={{ scale: 1.07, zIndex: 60, cursor: "grabbing" }}
      onTap={onTap}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      animate={externalHover ? hover : animateTarget}
      onDragEnd={() => {
        if (!layout.active || !label) return;
        const unit = BOARD_W / layout.boardPx(); // board units for each pixel on the screen
        layout.report(label, x + dragX.get() * unit, y + dragY.get() * unit);
      }}
      data-cursor-label={cursor}
    >
      {children}
    </motion.div>
  );
}

// A photo that fills the box it is in.
function Photo({ src, alt, position, sizes = "20vw", unoptimized = false }: { src: string; alt: string; position?: string; sizes?: string; unoptimized?: boolean }) {
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={unoptimized} draggable={false} className="select-none object-cover" style={{ objectPosition: position }} />;
}

// A caption that follows the mouse near the pointer, the same effect as the captions on the photos at the end of
// the Clubly case study: it trails the cursor with a little spring lag and fades in while hovering, instead of
// replacing the cursor circle with words. `side`: which side of the pointer it sits on — "left" for a piece near
// the right edge of the board, so a long caption doesn't run off the screen.
function FollowCaption({ text, children, side = "right" }: { text: string; children: ReactNode; side?: "left" | "right" }) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const caption = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 600, damping: 45 });
  const followY = useSpring(y, { stiffness: 600, damping: 45 });

  // On the right it starts 14px past the pointer; on the left it ends 14px short of it, so it needs its own
  // width (already rendered, just invisible until hovered) to place its left edge.
  const placeX = (clientX: number) => (side === "left" ? clientX - 14 - (caption.current?.offsetWidth ?? 0) : clientX + 14);

  return (
    <div
      className="absolute inset-0 cursor-none"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        // Start at the mouse instead of sliding in from wherever the caption last was.
        x.jump(placeX(e.clientX));
        y.jump(e.clientY + 14);
        setHovered(true);
      }}
      onPointerMove={(e) => e.pointerType === "mouse" && (x.set(placeX(e.clientX)), y.set(e.clientY + 14))}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
    >
      {children}
      {mounted &&
        createPortal(
          <motion.div
            ref={caption}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[70] whitespace-nowrap bg-surface-50 px-2 py-1 text-sm text-text-primary"
            style={{ x: followX, y: followY }}
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.div>,
          document.body
        )}
    </div>
  );
}

// The small pieces of art, drawn in Figma and exported as SVG (in public/images/board). Each fills the width of the
// box it is put in and keeps its own shape.
function Art({ name, alt = "", className = "", style }: { name: string; alt?: string; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/board/${name}.svg`} alt={alt} draggable={false} className={`pointer-events-none absolute select-none ${className}`} style={style} />
  );
}

// The note on the back of the polaroid, in the same hand as the photo strip's and to-do note's captions.
const POLAROID_NOTE = "Bay Bridge Half 5/4/26";

/**
 * The Bay Bridge Half polaroid: tap it and it flips over, like a real photo, to a handwritten note on the back;
 * tap again to flip it back. Still drags and springs back like everything else on the board.
 */
function FlipPolaroid({ x, y, w, h, rotate, z }: { x: number; y: number; w: number; h: number; rotate?: number; z?: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Pin
      label="Polaroid"
      x={x}
      y={y}
      w={w}
      h={h}
      rotate={rotate}
      z={z}
      flat
      proportional
      cursor={flipped ? "Flip back" : "Flip"}
      onTap={() => setFlipped((f) => !f)}
    >
      <div className="relative h-full w-full" style={{ perspective: cq(1000) }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.45, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <Art name="half-marathon-polaroid" alt="Bay Bridge Half: running the Bay Bridge half marathon" className="inset-0 h-full w-full" />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center bg-surface-50 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: cq(2), padding: cq(10), filter: SHADOW }}
          >
            <p className={`${schoolbell.className} leading-snug text-text-primary`} style={{ fontSize: cq(8.5) }}>
              {POLAROID_NOTE}
            </p>
          </div>
        </motion.div>
      </div>
    </Pin>
  );
}

/**
 * A pinboard of the things I love, after pinned-board.framer.website: photos, a photo strip, a to-do note, a record
 * player, books, stickers and a keychain. Drag any of it about (it springs back), tap the record to play it, and point
 * at a book, Banter or the keychain to see them move. On a narrow screen it scrolls sideways so the pieces stay a
 * readable size.
 */
export function PinnedBoard() {
  const [playing, setPlaying] = useState(false);
  const [nameTagHovered, setNameTagHovered] = useState(false);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState(false);
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({});
  useEffect(() => setLayoutMode(new URLSearchParams(window.location.search).has("layout")), []);

  return (
    <LayoutContext.Provider
      value={{
        active: layoutMode,
        boardPx: () => board.current?.getBoundingClientRect().width ?? BOARD_W,
        report: (label, x, y) => setMoved((m) => ({ ...m, [label]: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } })),
      }}
    >
    <div className="-mb-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div ref={board} className="relative w-full min-w-[42rem] [container-type:inline-size]" style={{ aspectRatio: `${BOARD_W} / ${BOARD_H}` }}>
        {/* polaroid: the half marathon, one piece of art. (FlipPolaroid below has a tap-to-flip version of this,
            parked for later.) */}
        <Pin label="Polaroid" x={26.4} y={8.5} w={87} h={154.8} rotate={-1} z={2} flat proportional hover={{ scale: 1 }}>
          <Art name="half-marathon-polaroid" alt="Bay Bridge Half: running the Bay Bridge half marathon" className="inset-0 h-full w-full" />
        </Pin>

        {/* photo strip: communities. One piece of art, a tilted black strip with three photos, a silver pin and a label. */}
        <Pin label="Photo strip" x={120} y={10} w={103.2} h={233.3} z={3} flat proportional hover={{ scale: 1 }}>
          <Art name="photo-strip" alt="A photo strip of my communities: Design Interactive and the AggieWorks team" className="inset-0 h-full w-full" />
        </Pin>

        {/* Tetris logo, in the gap above the to-do note */}
        <Pin label="Tetris logo" x={230} y={16} w={104} h={72.2} rotate={-3} z={4} proportional hover={{ scale: 1 }}>
          <Art name="tetris-logo" alt="The Tetris logo" className="inset-0 h-full w-full" />
        </Pin>

        {/* to-do note: one piece of art, with the binder clip and the list */}
        <Pin label="To-do list" x={228} y={90} w={129.4} h={183.3} z={5} proportional hover={{ scale: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/board/to-do-list.svg"
            alt="A yellow to-do note: run half marathon (done), sky dive, do 8 pull ups, bake rat cookies (done)"
            draggable={false}
            className="h-full w-full select-none"
          />
        </Pin>

        {/* keychain: the green card holder with the real rats photo behind its window, a star hooked through the top, and a chain
            that hangs from the star's ring and swings when you point at it */}
        <Pin label="Keychain" x={364} y={20} w={86.1} h={160.6} rotate={1} z={3} proportional>
          <div className="absolute inset-x-0 bottom-0 top-[20.5%]" style={{ transform: "translateY(-4px)" }}>
            {/* the photo shows through the window in the holder */}
            <div className="absolute left-[15.3%] top-[11.7%] h-[78.5%] w-[69.6%] overflow-hidden">
              <Photo src="/images/about/real-rats.jpg" alt="Real rats" position="50% 30%" sizes="10vw" />
            </div>
            <Art name="green-card-holder" className="inset-0 h-full w-full" />
          </div>
          <Art name="keychain-top" className="left-[31.1%] top-0 w-[32.1%]" />
          <motion.div
            className="absolute"
            style={{ left: "calc(22.7% - 20px)", top: "calc(23.2% - 8px)", width: "49.2%", transformOrigin: "47% 2%", rotate: 8 }}
            whileHover={{ rotate: [-14, 9, -25, 1, -20, -9, -14], transition: { duration: 1.7, ease: "easeInOut" } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/board/keychain-bottom.svg" alt="" draggable={false} className="block w-full select-none" />
          </motion.div>
        </Pin>

        {/* the record player: tap it to play */}
        <Pin label="Record" x={455} y={28} w={115} h={115} z={2} cursor={playing ? "Pause" : "Play"} onTap={() => setPlaying((p) => !p)} flat proportional className="[&>div]:drop-shadow-[0_5px_8px_rgb(0_0_0/0.25)]" style={{ top: `calc(${cq(32)} - 4px)` }}>
          <DiscPlayer src="/images/board/noahkahan.webp" alt="Noah Kahan" playing={playing} />
        </Pin>

        {/* fortune flower: tap to open it up to a bigger bloom, tap again to close it back to a bud */}
        <Pin
          label={fortuneOpen ? "Fortune open" : "Fortune closed"}
          x={FORTUNE_CENTER.x - FORTUNE_OPEN.w / 2}
          y={FORTUNE_CENTER.y - FORTUNE_OPEN.h / 2}
          w={FORTUNE_OPEN.w}
          h={FORTUNE_OPEN.h}
          rotate={8}
          z={fortuneOpen ? 8 : 2}
          flat
          onTap={() => setFortuneOpen((open) => !open)}
        >
          <motion.img
            src={`/images/board/${fortuneOpen ? "openfortune" : "fortuneclosed"}.svg`}
            alt={fortuneOpen ? "An open fortune flower" : "A closed fortune flower"}
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-1/2 select-none"
            style={{ filter: SHADOW }}
            animate={{
              width: fortuneOpen ? "100%" : `${(FORTUNE_CLOSED.w / FORTUNE_OPEN.w) * 100}%`,
              height: fortuneOpen ? "100%" : `${(FORTUNE_CLOSED.h / FORTUNE_OPEN.h) * 100}%`,
              x: "-50%",
              y: "-50%",
            }}
            transition={{ type: "spring", stiffness: 210, damping: 20 }}
          />
        </Pin>
        <Pin label="Orchid" x={656} y={10} w={58} h={57} rotate={-6} z={2} flat proportional hover={{ scale: 1 }}>
          <Art name="Orchid" alt="An orchid" className="inset-0 h-full w-full" />
        </Pin>

        {/* name tag */}
        <Pin
          label="Name tag"
          x={585}
          y={71}
          w={131}
          h={74.7}
          rotate={1}
          z={3}
          flat
          proportional
          onHoverStart={() => setNameTagHovered(true)}
          onHoverEnd={() => setNameTagHovered(false)}
        >
          <Art name="name-tag" alt="A name tag that says I love my dog" className="inset-0 w-full" />
        </Pin>

        {/* hamburger cat */}
        <Pin label="Hamburger cat" x={378} y={198} w={61} h={59} rotate={-4} z={4} proportional hover={{ scale: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/board/hamburger-cat.png" alt="A cat sticker shaped like a hamburger" draggable={false} className="h-full w-full select-none object-contain" />
        </Pin>

        {/* photo folder, below the cat: point at it and the photos slide out */}
        <Pin label="Photo folder" x={330} y={283} w={80} h={(80 * 231) / 348} z={8} flat proportional hover={{ scale: 1 }}>
          <PhotoFolder scale={80 / 348} />
        </Pin>

        {/* Banter: tips to the left when you point at him */}
        <Pin
          label="Banter"
          x={221.5}
          y={270}
          w={65}
          h={75}
          rotate={-2}
          z={6}
          hover={{ rotate: -16, scale: 1.06 }}
          externalHover={nameTagHovered}
          proportional
          style={{
            left: `calc(${cq(221.5)} - 8px)`,
            top: `calc(${cq(270)} - 8px)`,
            width: `calc(${cq(65)} + 16px)`,
            height: `calc(${cq(75)} + 16px)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/board/banter-sticker.svg" alt="Banter, my dog" draggable={false} className="h-full w-full select-none object-contain" />
        </Pin>

        {/* the books, spaced evenly across the folder: point at one and it slides up out of the stack, straightens and shows its whole cover; move away and it slips back */}
        <Pin
          label="Crazy Rich Asians"
          x={456}
          y={154}
          w={100}
          h={154}
          rotate={-2}
          z={1}
          hover={{ y: -56, rotate: 0, scale: 1.03, zIndex: 4 }}
        >
          <FollowCaption text="Read 1x, watched the movie 4x">
            <Photo src="/images/board/crazy-rich-asians.jpg" alt="Crazy Rich Asians" sizes="12vw" />
          </FollowCaption>
        </Pin>
        <Pin
          label="A Ticket to the Boneyard"
          x={604}
          y={158}
          w={98}
          h={150}
          rotate={2}
          z={2}
          hover={{ y: -58, rotate: 0, scale: 1.03, zIndex: 4 }}
        >
          <FollowCaption text="I've been reading this since 2 summers ago…" side="left">
            <Photo src="/images/board/a-ticket-to-the-boneyard.jpg" alt="A Ticket to the Boneyard" sizes="12vw" />
          </FollowCaption>
        </Pin>
        <Pin label="Strange Pictures" x={525} y={163} w={108} h={166} rotate={1} z={3} hover={{ y: -80, rotate: 0, scale: 1.03, zIndex: 4 }}>
          <Photo src="/images/board/strange-pictures.jpg" alt="Strange Pictures" sizes="12vw" />
        </Pin>

        {/* clear folder, with Hawaii and a sun pin on it */}
        <Pin label="Clear folder" x={443} y={260} w={271} h={74} z={6} flat hover={{ scale: 1 }}>
          <div
            className="h-full w-full"
            style={{
              borderRadius: cq(6),
              background: "linear-gradient(180deg, rgb(226 236 250 / 0.55), rgb(210 226 248 / 0.4))",
              backdropFilter: "blur(7px)",
              WebkitBackdropFilter: "blur(7px)",
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.6), 0 6px 12px rgb(80 110 160 / 0.12)",
            }}
          />
        </Pin>
        <Pin label="Hawaii photo" x={468.9} y={269.9} w={46.2} h={56.2} z={7} proportional hover={{ scale: 1 }}>
          <Art name="hawaii-polaroid" alt="Hawaii" className="inset-0 h-full w-full" />
        </Pin>
        <Pin label="Sun" x={605} y={265} w={70} h={70} z={7} flat proportional hover={{ scale: 1 }}>
          <Art name="sun" alt="A gold sun pin" className="inset-0 w-full" />
        </Pin>

        {/* cookies, with a clip */}
        <Pin label="Cookies" x={18} y={203} w={184} h={138} rotate={-1} z={2} proportional hover={{ scale: 1 }}>
          <div className="relative h-full w-full overflow-visible">
            <Photo src="/images/about/cookie-rats.png" alt="Cookies shaped like rats" sizes="26vw" />
            <Art name="silver-pin-long" className="left-[32.2%] top-[-19.3%] w-[12.1%]" />
          </div>
        </Pin>
      </div>
    </div>

    {layoutMode && <LayoutPanel moved={moved} />}
    </LayoutContext.Provider>
  );
}

/** The panel in layout mode: where each piece you have moved now sits, ready to copy. */
function LayoutPanel({ moved }: { moved: Record<string, { x: number; y: number }> }) {
  const lines = Object.entries(moved).map(([label, p]) => `${label}: x ${p.x}, y ${p.y}`);
  return (
    <div className="fixed bottom-4 right-4 z-[70] w-72 bg-slate-950 p-4 text-sm text-slate-50 shadow-md">
      <p className="font-medium">Layout mode</p>
      <p className="mt-1 text-slate-50/70">
        Drag the pieces where you want them. The board is 733 wide and 366 tall; these are each piece's new x and y.
      </p>
      <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs">{lines.length ? lines.join("\n") : "Nothing moved yet."}</pre>
      <button
        type="button"
        disabled={!lines.length}
        onClick={() => navigator.clipboard?.writeText(lines.join("\n"))}
        className="mt-3 border border-slate-50/40 px-2 py-1 disabled:opacity-40"
      >
        Copy
      </button>
    </div>
  );
}
