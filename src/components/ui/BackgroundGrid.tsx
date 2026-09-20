"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const gridItems = [
  { image: "/images/grid/rat.jpeg", caption: "rat friend" },
  { image: "/images/grid/bts.JPG", caption: "behind the scenes" },
  { image: "/images/grid/clublyeoy.JPG", caption: "clubly end of year" },
  { image: "/images/grid/ghirardelli.JPG", caption: "ghirardelli" },
  { image: "/images/grid/halloween.JPG", caption: "halloween" },
  { image: "/images/grid/honoluluhike.jpeg", caption: "honolulu hike" },
  { image: "/images/grid/mahjong.jpeg", caption: "mahjong night" },
  { image: "/images/grid/mendocino.JPG", caption: "mendocino" },
  { image: "/images/grid/skiing.jpeg", caption: "skiing" },
  { image: "/images/grid/banter.jpeg", caption: "banter" },
  { image: "/images/grid/beach.JPG", caption: "beach day" },
  { image: "/images/grid/isgm.jpeg", caption: "isgm" },
  { image: "/images/grid/kbbq.JPG", caption: "kbbq" },
  { image: "/images/grid/maze.JPG", caption: "corn maze" },
  { image: "/images/grid/timessquare.jpeg", caption: "times square" },
  { image: "/images/grid/dumplings.jpg", caption: "dumplings" },
  { image: "/images/grid/matcha.jpeg", caption: "matcha" },
  { image: "/images/grid/twice.jpeg", caption: "twice" },
  { image: "/images/grid/canoebeach.jpeg", caption: "canoe beach" },
  { image: "/images/grid/carmelbythesea.JPG", caption: "carmel-by-the-sea" },
  { image: "/images/grid/montereybeach.JPG", caption: "monterey beach" },
  { image: "/images/grid/tahoehike.JPG", caption: "tahoe hike" },
  { image: "/images/grid/heavenlyskiresortsummer.JPG", caption: "heavenly in the summer" },
  { image: "/images/grid/vikingsholm.JPG", caption: "vikingsholm" },
  { image: "/images/grid/PhoDuoiBo.jpeg", caption: "pho duoi bo" },
  { image: "/images/grid/diamondhead.JPG", caption: "diamond head" },
  { image: "/images/grid/Po’aibyPonoPotions.JPG", caption: "po’ai by pono potions" },
  { image: "/images/grid/earlybirdcoffee.JPG", caption: "early bird coffee" },
  { image: "/images/grid/centralpark.jpg", caption: "central park" },
  { image: "/images/grid/kokocrater.jpg", caption: "koko crater" },
  { image: "/images/grid/flowers.jpg", caption: "flowers" },
  { image: "/images/grid/heavenlyskisummer.jpg", caption: "heavenly in the summer" },
  { image: "/images/grid/DIbanquet2025.jpg", caption: "di banquet 2025" },
  { image: "/images/grid/givingup.jpg", caption: "giving up" },
  { image: "/images/grid/pineappledessert.jpg", caption: "pineapple dessert" },
  { image: "/images/grid/hotdog.jpg", caption: "hot dogs" },
  { image: "/images/grid/frozenyogurt.jpg", caption: "frozen yogurt" },
  { image: "/images/grid/mounttam.jpg", caption: "mount tam" },
  { image: "/images/grid/keshi.jpg", caption: "keshi" },
  { image: "/images/grid/preobhm.jpg", caption: "pre-race" },
  { image: "/images/grid/DIboard2025.jpg", caption: "di board 2025" },
  { image: "/images/grid/seattle.jpg", caption: "seattle" },
];

const COLS = 28;
const ROWS = 18;
const CELL = 80;
const REVEAL_MS = 5000;

// Photos that span more than one cell. Each one covers `w` columns × `h` rows
// starting at (col, row), zero-indexed. Keep them from overlapping.
const features = [
  { col: 2, row: 1, w: 2, h: 2, photo: "diamondhead.JPG" },
  { col: 9, row: 0, w: 2, h: 1, photo: "earlybirdcoffee.JPG" },
  { col: 6, row: 4, w: 2, h: 1, photo: "carmelbythesea.JPG" },
  { col: 11, row: 3, w: 2, h: 2, photo: "tahoehike.JPG" },
  { col: 1, row: 6, w: 2, h: 1, photo: "montereybeach.JPG" },
  { col: 13, row: 6, w: 2, h: 2, photo: "vikingsholm.JPG" },
  { col: 5, row: 7, w: 2, h: 2, photo: "heavenlyskiresortsummer.JPG" },
  { col: 9, row: 8, w: 2, h: 1, photo: "honoluluhike.jpeg" },
  { col: 17, row: 2, w: 2, h: 2, photo: "mendocino.JPG" },
  { col: 19, row: 7, w: 2, h: 1, photo: "beach.JPG" },
  { col: 16, row: 11, w: 2, h: 2, photo: "PhoDuoiBo.jpeg" },
  { col: 22, row: 4, w: 2, h: 1, photo: "skiing.jpeg" },
  { col: 4, row: 12, w: 2, h: 1, photo: "canoebeach.jpeg" },
  { col: 10, row: 13, w: 2, h: 2, photo: "Po’aibyPonoPotions.JPG" },
];

const photoFor = (file: string) => {
  const item = gridItems.find((g) => g.image.endsWith(`/${file}`));
  if (!item) throw new Error(`BackgroundGrid: no photo named ${file}`);
  return item;
};

type Cell = { id: number; col: number; row: number; w: number; h: number; item: (typeof gridItems)[number] };

// Feature tiles first, then single cells everywhere they haven't covered.
const cells: Cell[] = (() => {
  const taken = new Set<number>();
  const out: Cell[] = [];

  for (const f of features) {
    out.push({ id: f.row * COLS + f.col, col: f.col, row: f.row, w: f.w, h: f.h, item: photoFor(f.photo) });
    for (let r = f.row; r < f.row + f.h; r++) {
      for (let c = f.col; c < f.col + f.w; c++) taken.add(r * COLS + c);
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c;
      if (taken.has(id)) continue;
      // Offset each row so the same photo never lines up down a column.
      out.push({ id, col: c, row: r, w: 1, h: 1, item: gridItems[(c + r * 11) % gridItems.length] });
    }
  }
  return out;
})();

export function BackgroundGrid() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  function handleEnter(i: number) {
    if (timers.current.has(i)) return;

    setRevealed((prev) => new Set(prev).add(i));

    const t = setTimeout(() => {
      setRevealed((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
      timers.current.delete(i);
    }, REVEAL_MS);

    timers.current.set(i, t);
  }

  const template = {
    gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
    gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
  };
  const mask = "radial-gradient(ellipse 95% 88% at center, black 35%, transparent 78%)";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        {/* Grid lines: one outlined square per cell, so every line shows even under a large photo */}
        <div className="pointer-events-none absolute inset-0 grid" style={template}>
          {Array.from({ length: COLS * ROWS }, (_, i) => (
            <div key={i} className="border-[0.5px] border-surface-300/25" />
          ))}
        </div>

        {/* Photos: single cells and the larger tiles, on top of the lines */}
        <div className="absolute inset-0 grid" style={template}>
          {cells.map(({ id, col, row, w, h, item }) => (
            <div
              key={id}
              className="relative overflow-hidden"
              style={{
                gridColumn: `${col + 1} / span ${w}`,
                gridRow: `${row + 1} / span ${h}`,
              }}
              onMouseEnter={() => handleEnter(id)}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed.has(id) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
