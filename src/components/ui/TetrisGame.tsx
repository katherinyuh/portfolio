"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  COLS,
  ROWS,
  dropInterval,
  hardDrop,
  landingY,
  move,
  newGame,
  rotate,
  shapeOf,
  softDrop,
  stepDown,
  type Game,
} from "@/lib/tetris";

const CELL = 24; // size of a square on the canvas, before the screen's pixel density is applied

type Phase = "idle" | "playing" | "paused" | "over";

// The seven pieces, painted in the site's own colours (read from the page, so they follow the light or dark theme).
// Each is a token and how solid it is.
const PIECE_COLOURS: [string, number][] = [
  ["--surface-50", 1],
  ["--surface-100", 0.9],
  ["--surface-200", 0.75],
  ["--surface-300", 1],
  ["--surface-400", 1],
  ["--surface-300", 0.6],
  ["--surface-100", 0.55],
];

const colourOf = (token: string, alpha: number) => {
  const channels = getComputedStyle(document.documentElement).getPropertyValue(token).trim() || "255 255 255";
  return `rgb(${channels} / ${alpha})`;
};

/**
 * Tetris on a canvas. Click it (or press Enter while it is on screen) to play; ← → move, ↑ turns, ↓ drops a row,
 * space drops the piece all the way, P pauses. It pauses by itself when it is scrolled out of view (`onScreen`),
 * and only takes the arrow keys and space while a game is going, so the page scrolls as normal otherwise.
 */
export function TetrisGame({ onScreen }: { onScreen: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const nextCanvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game>(null as unknown as Game);
  if (!game.current) game.current = newGame();
  const [phase, setPhase] = useState<Phase>("idle");
  const [stats, setStats] = useState({ score: 0, lines: 0, level: 1 });

  const draw = useCallback(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const g = game.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cv.width !== COLS * CELL * dpr) {
      cv.width = COLS * CELL * dpr;
      cv.height = ROWS * CELL * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

    // the well, with faint lines between the squares
    ctx.fillStyle = "rgb(0 0 0 / 0.22)";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = "rgb(255 255 255 / 0.06)";
    for (let c = 1; c < COLS; c++) ctx.fillRect(c * CELL, 0, 1, ROWS * CELL);
    for (let r = 1; r < ROWS; r++) ctx.fillRect(0, r * CELL, COLS * CELL, 1);

    const square = (col: number, row: number, kind: number, alpha = 1) => {
      const [token, solid] = PIECE_COLOURS[kind - 1];
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colourOf(token, solid);
      ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
      ctx.globalAlpha = 1;
    };

    g.board.forEach((line, r) => line.forEach((kind, c) => kind && square(c, r, kind)));
    const p = g.piece;
    if (p && !g.over) {
      const ghost = landingY(g);
      p.cells.forEach((line, r) =>
        line.forEach((v, c) => {
          if (!v) return;
          if (ghost + r >= 0) square(p.x + c, ghost + r, p.kind, 0.22); // where it will land
          if (p.y + r >= 0) square(p.x + c, p.y + r, p.kind);
        })
      );
    }

    // the piece that comes next
    const nx = nextCanvas.current;
    const nctx = nx?.getContext("2d");
    if (nx && nctx) {
      const small = 14;
      if (nx.width !== 4 * small * dpr) {
        nx.width = 4 * small * dpr;
        nx.height = 3 * small * dpr;
      }
      nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nctx.clearRect(0, 0, 4 * small, 3 * small);
      const cells = shapeOf(g.next);
      const [token, solid] = PIECE_COLOURS[g.next - 1];
      nctx.fillStyle = colourOf(token, solid);
      // centre the filled squares in the little box
      const filled = cells.flatMap((line, r) => line.flatMap((v, c) => (v ? [{ r, c }] : [])));
      const minR = Math.min(...filled.map((f) => f.r));
      const maxR = Math.max(...filled.map((f) => f.r));
      const minC = Math.min(...filled.map((f) => f.c));
      const maxC = Math.max(...filled.map((f) => f.c));
      const offsetX = (4 - (maxC - minC + 1)) / 2 - minC;
      const offsetY = (3 - (maxR - minR + 1)) / 2 - minR;
      filled.forEach(({ r, c }) => nctx.fillRect((c + offsetX) * small + 1, (r + offsetY) * small + 1, small - 2, small - 2));
    }
  }, []);

  // Keep the numbers beside the board up to date, and end the game when the pieces reach the top.
  const commit = useCallback(
    (next: Game) => {
      game.current = next;
      draw();
      setStats((s) => (s.score === next.score && s.lines === next.lines && s.level === next.level ? s : { score: next.score, lines: next.lines, level: next.level }));
      if (next.over) setPhase("over");
    },
    [draw]
  );

  const start = useCallback(() => {
    commit(newGame());
    setPhase("playing");
  }, [commit]);

  // Draw the empty well as soon as there is one, and again when the theme changes.
  useEffect(() => {
    draw();
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    dark.addEventListener("change", draw);
    return () => dark.removeEventListener("change", draw);
  }, [draw]);

  // Gravity: the piece falls a row every so often, quicker each level.
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    let last = performance.now();
    let waited = 0;
    const frame = (now: number) => {
      waited += now - last;
      last = now;
      const interval = dropInterval(game.current.level);
      waited = Math.min(waited, interval * 3); // after a pause, don't try to catch up
      let next = game.current;
      while (waited >= interval && !next.over) {
        waited -= interval;
        next = stepDown(next);
      }
      if (next !== game.current) commit(next);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, commit]);

  // Scrolled out of view: pause.
  useEffect(() => {
    if (!onScreen) setPhase((p) => (p === "playing" ? "paused" : p));
  }, [onScreen]);

  // The keys. They only count while the game is on screen, and the ones the page would use (the arrows, space)
  // are only taken while a game is going.
  useEffect(() => {
    if (!onScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && (phase === "idle" || phase === "over")) {
        // (not when Enter is meant for a link or button that has the focus)
        if (e.target !== document.body) return;
        e.preventDefault();
        start();
        return;
      }
      if (phase !== "playing" && phase !== "paused") return;
      const key = e.key.toLowerCase();
      if (key === "p" || (key === "escape" && phase === "playing")) {
        e.preventDefault();
        setPhase(phase === "playing" ? "paused" : "playing");
        return;
      }
      if (phase !== "playing") return;
      const g = game.current;
      let next: Game | null = null;
      if (key === "arrowleft") next = move(g, -1);
      else if (key === "arrowright") next = move(g, 1);
      else if (key === "arrowdown") next = softDrop(g);
      else if (key === "arrowup" || key === "x") next = rotate(g, true);
      else if (key === "z") next = rotate(g, false);
      else if (key === " ") next = hardDrop(g);
      if (!next) return;
      e.preventDefault();
      commit(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onScreen, phase, start, commit]);

  // The same moves, for a screen with no keyboard.
  const press = (fn: (g: Game) => Game) => () => {
    if (phase === "playing") commit(fn(game.current));
  };

  const pad = "border border-surface-50/40 px-3 py-2 text-sm text-surface-50 active:bg-surface-50/20";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-4">
        <div className="relative aspect-[1/2] h-[min(36vh,30rem)] lg:h-[min(56vh,30rem)]">
          <canvas ref={canvas} aria-label="Tetris" className="block h-full w-full" />
          {phase !== "playing" && (
            <button
              type="button"
              onClick={phase === "paused" ? () => setPhase("playing") : start}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 px-4 text-center text-surface-50"
            >
              <span className="text-lg font-medium">
                {phase === "idle" ? "Play Tetris" : phase === "paused" ? "Paused" : "Game over"}
              </span>
              {phase === "over" && <span className="text-sm">Score {stats.score}</span>}
              <span className="text-sm text-surface-50/75">
                {phase === "paused" ? "Click or press P to carry on" : "Click or press Enter"}
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 text-surface-50">
          <div>
            <p className="mb-2 text-sm text-surface-50/70">Next</p>
            <canvas ref={nextCanvas} aria-hidden style={{ width: "3.5rem", height: "2.625rem" }} />
          </div>
          <div>
            <p className="text-sm text-surface-50/70">Score</p>
            <p className="text-xl font-medium tabular-nums">{stats.score}</p>
          </div>
          <div>
            <p className="text-sm text-surface-50/70">Lines</p>
            <p className="text-xl font-medium tabular-nums">{stats.lines}</p>
          </div>
          <div>
            <p className="text-sm text-surface-50/70">Level</p>
            <p className="text-xl font-medium tabular-nums">{stats.level}</p>
          </div>
        </div>
      </div>

      <p className="hidden text-center text-sm text-surface-50/70 [@media(hover:hover)]:block">
        ← → move · ↑ turn · ↓ soft drop · space drop · P pause
      </p>
      <div className="hidden gap-2 [@media(hover:none)]:flex">
        <button type="button" className={pad} onClick={press((g) => move(g, -1))}>
          Left
        </button>
        <button type="button" className={pad} onClick={press((g) => rotate(g, true))}>
          Turn
        </button>
        <button type="button" className={pad} onClick={press((g) => move(g, 1))}>
          Right
        </button>
        <button type="button" className={pad} onClick={press((g) => hardDrop(g))}>
          Drop
        </button>
      </div>
    </div>
  );
}
