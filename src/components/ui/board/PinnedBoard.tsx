"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { motion, useMotionValue, type TargetAndTransition } from "framer-motion";
import { DiscPlayer } from "./DiscPlayer";

// Handwriting for the little labels (the polaroid caption, the photo strip, the sticky note): the one place, with the
// captions on the photos, where the site doesn't use Geist.
const schoolbell = localFont({ src: "../../../fonts/Schoolbell-Regular.ttf", display: "swap" });

// Everything is laid out on a board 733 wide and 366 tall, and every size and position is turned into a share of the
// board's width, so the whole thing scales with the page.
const BOARD_W = 733;
const BOARD_H = 366;
const cq = (px: number) => `${(px / BOARD_W) * 100}cqw`;

const SHADOW = "drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.2)) drop-shadow(0 5px 8px rgb(0 0 0 / 0.13))";

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
  /** No shadow around the shape (for things that are already see-through or have their own). */
  flat?: boolean;
  className?: string;
  style?: CSSProperties;
  /** What it does when the mouse is over it, instead of the usual small lift. */
  hover?: TargetAndTransition;
}

/**
 * One thing on the board. You can pick it up and drag it about; let go and it springs back to where it was pinned,
 * like the pieces on pinned-board.framer.website.
 */
function Pin({ label, x, y, w, h, rotate = 0, z = 1, children, cursor, onTap, flat, className = "", style, hover }: PinProps) {
  // With a mouse you can pick pieces up. On a touch screen they stay put, so a finger on the board scrolls it instead.
  const [mouse, setMouse] = useState(false);
  useEffect(() => setMouse(window.matchMedia("(pointer: fine)").matches), []);
  const layout = useContext(LayoutContext);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      className={`absolute select-none ${mouse ? "cursor-grab touch-none" : ""} ${className}`}
      style={{ left: cq(x), top: cq(y), width: cq(w), height: cq(h), zIndex: z, rotate, x: dragX, y: dragY, filter: flat ? undefined : SHADOW, ...style }}
      drag={mouse}
      dragSnapToOrigin={!layout.active}
      dragMomentum={!layout.active}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 22 }}
      whileHover={layout.active ? undefined : hover ?? { scale: 1.03 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      whileDrag={{ scale: 1.07, zIndex: 60, cursor: "grabbing" }}
      onTap={onTap}
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

// The polaroid's paper: cream with tiny red hearts, in a staggered grid (a repeating tile, sized as a share of the card).
const HEARTS_PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 54 38%22%3E%3Cg transform=%22translate%2834 15%29%22%3E%3Cpath d=%22M2 3.8 C0.2 2.4 0 1.4 0 0.9 C0 0.3 0.5 0 1 0 C1.4 0 1.8 0.3 2 0.7 C2.2 0.3 2.6 0 3 0 C3.5 0 4 0.3 4 0.9 C4 1.4 3.8 2.4 2 3.8Z%22 fill=%22%23D9384A%22/%3E%3C/g%3E%3Cg transform=%22translate%286 -2%29%22%3E%3Cpath d=%22M2 3.8 C0.2 2.4 0 1.4 0 0.9 C0 0.3 0.5 0 1 0 C1.4 0 1.8 0.3 2 0.7 C2.2 0.3 2.6 0 3 0 C3.5 0 4 0.3 4 0.9 C4 1.4 3.8 2.4 2 3.8Z%22 fill=%22%23D9384A%22/%3E%3C/g%3E%3Cg transform=%22translate%286 36%29%22%3E%3Cpath d=%22M2 3.8 C0.2 2.4 0 1.4 0 0.9 C0 0.3 0.5 0 1 0 C1.4 0 1.8 0.3 2 0.7 C2.2 0.3 2.6 0 3 0 C3.5 0 4 0.3 4 0.9 C4 1.4 3.8 2.4 2 3.8Z%22 fill=%22%23D9384A%22/%3E%3C/g%3E%3C/svg%3E\") 0 0 / 49% 25% repeat, #f7eadb";

// The small pieces of art, drawn in Figma and exported as SVG (in public/images/board). Each fills the width of the
// box it is put in and keeps its own shape.
function Art({ name, alt = "", className = "", style }: { name: string; alt?: string; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/board/${name}.svg`} alt={alt} draggable={false} className={`pointer-events-none absolute select-none ${className}`} style={style} />
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
    <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div ref={board} className="relative w-full min-w-[42rem] [container-type:inline-size]" style={{ aspectRatio: `${BOARD_W} / ${BOARD_H}` }}>
        {/* polaroid: the half marathon, on hearts paper with a beige pin over its top edge */}
        <Pin label="Polaroid" x={28} y={40} w={83.6} h={116.6} rotate={-1} z={2}>
          <div className="relative h-full w-full" style={{ background: HEARTS_PAPER }}>
            <div className="absolute left-[3.5%] top-[2.9%] h-[68.5%] w-[91.3%] overflow-hidden bg-surface-200">
              <Photo src="/images/about/half-marathon.jpg" alt="Running the Bay Bridge Half" position="50% 55%" />
            </div>
            <p
              className={`${schoolbell.className} absolute inset-x-0 bottom-[6%] text-center leading-none text-text-primary`}
              style={{ fontSize: cq(11.5) }}
            >
              Bay Bridge Half
            </p>
            <Art name="beige-pin" className="left-[19.5%] top-[-28%] w-[30.4%]" />
          </div>
        </Pin>

        {/* photo strip: communities. A black strip tilted a little to the left, three photos, a silver pin and a label. */}
        <Pin label="Photo strip" x={136} y={24} w={82} h={214.8} rotate={4} z={3}>
          <div className="relative h-full w-full bg-[#1f1f1f]">
            {[
              { src: "/images/about/design-interactive.jpg", alt: "Design Interactive", top: "1%" },
              { src: "/images/board/aw-dabbing.jpg", alt: "The AggieWorks team dabbing", top: "29.7%" },
              { src: "/images/board/aw-spring-2026.jpg", alt: "The AggieWorks team, spring 2026", top: "58.4%" },
            ].map((photo) => (
              <div key={photo.src} className="absolute left-[4.1%] h-[25.9%] w-[91.8%] overflow-hidden bg-[#2b2b2b]" style={{ top: photo.top }}>
                <Photo src={photo.src} alt={photo.alt} sizes="14vw" />
              </div>
            ))}
            <p
              className={`${schoolbell.className} absolute inset-x-0 bottom-[3.6%] text-center leading-none text-surface-50`}
              style={{ fontSize: cq(11) }}
            >
              Communities
            </p>
            <Art name="silver-pin" className="left-[31%] top-[-4.3%] z-10 w-[23.2%]" />
          </div>
        </Pin>

        {/* to-do note: one piece of art, with the binder clip and the list */}
        <Pin label="To-do list" x={230} y={90} w={129.4} h={183.3} z={5}>
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
        <Pin label="Keychain" x={366.4} y={28} w={73.2} h={136.6} rotate={1} z={3}>
          <div className="absolute inset-x-0 bottom-0 top-[20.5%]">
            {/* the photo shows through the window in the holder */}
            <div className="absolute left-[15.3%] top-[11.7%] h-[78.5%] w-[69.6%] overflow-hidden">
              <Photo src="/images/about/real-rats.jpg" alt="Real rats" position="50% 30%" sizes="10vw" />
            </div>
            <Art name="green-card-holder" className="inset-0 h-full w-full" />
          </div>
          <Art name="keychain-top" className="left-[31.1%] top-0 w-[37.8%]" />
          <motion.div
            className="absolute"
            style={{ left: "calc(22.7% - 20px)", top: "calc(23.2% - 8px)", width: "57.9%", transformOrigin: "47% 2%", rotate: 8 }}
            whileHover={{ rotate: [-14, 9, -25, 1, -20, -9, -14], transition: { duration: 1.7, ease: "easeInOut" } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/board/keychain-bottom.svg" alt="" draggable={false} className="block w-full select-none" />
          </motion.div>
        </Pin>

        {/* the record player: tap it to play */}
        <Pin label="Record" x={455} y={32} w={115} h={115} z={2} cursor={playing ? "Pause" : "Play"} onTap={() => setPlaying((p) => !p)} flat className="[&>div]:drop-shadow-[0_5px_8px_rgb(0_0_0/0.25)]">
          <DiscPlayer src="/images/board/sweet-boy.jpg" alt="Sweet Boy" playing={playing} />
        </Pin>

        {/* blossom sticker */}
        <Pin label="Flower" x={603} y={12} w={52.4} h={56.2} rotate={8} z={2}>
          <Art name="flower" alt="A pink flower" className="inset-0 w-full" />
        </Pin>

        {/* name tag */}
        <Pin label="Name tag" x={585} y={71} w={131} h={74.7} rotate={1} z={3} flat>
          <Art name="name-tag" alt="A name tag that says I love my dog" className="inset-0 w-full" />
        </Pin>

        {/* hamburger cat */}
        <Pin label="Hamburger cat" x={378} y={189} w={61} h={59} rotate={-4} z={4}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/board/hamburger-cat.png" alt="A cat sticker shaped like a hamburger" draggable={false} className="h-full w-full select-none object-contain" />
        </Pin>

        {/* Banter: tips to the left when you point at him */}
        <Pin label="Banter" x={221.5} y={270} w={65} h={75} rotate={-2} z={6} hover={{ rotate: -16, scale: 1.06 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/board/banter-sticker.svg" alt="Banter, my dog" draggable={false} className="h-full w-full select-none object-contain" />
        </Pin>

        {/* the books, spaced evenly across the folder: point at one and it slides up out of the stack, straightens and shows its whole cover; move away and it slips back */}
        <Pin label="Crazy Rich Asians" x={456} y={154} w={100} h={154} rotate={-2} z={1} hover={{ y: -56, rotate: 0, scale: 1.03, zIndex: 4 }}>
          <Photo src="/images/board/crazy-rich-asians.jpg" alt="Crazy Rich Asians" sizes="12vw" />
        </Pin>
        <Pin label="A Ticket to the Boneyard" x={604} y={158} w={98} h={150} rotate={2} z={2} hover={{ y: -58, rotate: 0, scale: 1.03, zIndex: 4 }}>
          <Photo src="/images/board/a-ticket-to-the-boneyard.jpg" alt="A Ticket to the Boneyard" sizes="12vw" />
        </Pin>
        <Pin label="Strange Pictures" x={525} y={163} w={108} h={166} rotate={1} z={3} hover={{ y: -80, rotate: 0, scale: 1.03, zIndex: 4 }}>
          <Photo src="/images/board/strange-pictures.jpg" alt="Strange Pictures" sizes="12vw" />
        </Pin>

        {/* clear folder, with Hawaii and a sun pin on it */}
        <Pin label="Clear folder" x={443} y={260} w={271} h={74} z={6} flat>
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
        <Pin label="Hawaii photo" x={470} y={270} w={44} h={56} rotate={-6} z={7}>
          <div className="relative h-full w-full bg-surface-50 p-[7%]">
            <div className="relative h-full w-full overflow-hidden">
              <Photo src="/images/about/Hawaii.svg?v=2" alt="Hawaii" sizes="8vw" unoptimized />
            </div>
          </div>
        </Pin>
        <Pin label="Sun" x={605} y={265} w={70} h={70} z={7} flat>
          <Art name="sun" alt="A gold sun pin" className="inset-0 w-full" />
        </Pin>

        {/* cookies, with a clip */}
        <Pin label="Cookies" x={18} y={203} w={184} h={138} rotate={-1} z={2}>
          <div className="relative h-full w-full overflow-visible">
            <Photo src="/images/about/cookie-rats.jpg" alt="Cookies shaped like rats" sizes="26vw" />
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
