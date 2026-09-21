// Tetris, with no drawing and no timers in it: just the rules. Every function takes a game and gives back the next
// one, so the game is easy to test and the screen code only has to draw what it is given.

export const COLS = 10;
export const ROWS = 20;

/** 0 is empty; 1 to 7 is the kind of piece that filled the square. */
export type Board = number[][];

// The seven pieces, in the order I, O, T, S, Z, J, L (kinds 1 to 7). Each is a square grid; the others are turned from it.
const SHAPES: number[][][] = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
];

export interface Piece {
  kind: number; // 1 to 7
  cells: number[][];
  x: number; // column of the grid's left edge (can be off the board)
  y: number; // row of the grid's top edge
}

export interface Game {
  board: Board;
  piece: Piece | null;
  next: number; // kind of the piece that comes after this one
  bag: number[]; // kinds still to come out of the current shuffle
  score: number;
  lines: number;
  level: number;
  over: boolean;
}

export type Random = () => number;

export const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

/** Kinds come out in shuffled sets of seven, so you never wait long for any one of them. */
function drawFromBag(bag: number[], random: Random): { kind: number; bag: number[] } {
  let rest = bag;
  if (rest.length === 0) {
    rest = [1, 2, 3, 4, 5, 6, 7];
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
  }
  return { kind: rest[0], bag: rest.slice(1) };
}

export const shapeOf = (kind: number) => SHAPES[kind - 1].map((row) => [...row]);

const turnClockwise = (cells: number[][]) => cells[0].map((_, c) => cells.map((row) => row[c]).reverse());
const turnAnticlockwise = (cells: number[][]) => cells[0].map((_, c) => cells.map((row) => row[row.length - 1 - c]));

export function collides(board: Board, cells: number[][], x: number, y: number): boolean {
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (!cells[r][c]) continue;
      const bx = x + c;
      const by = y + r;
      if (bx < 0 || bx >= COLS || by >= ROWS) return true;
      if (by >= 0 && board[by][bx]) return true;
    }
  }
  return false;
}

function newPiece(kind: number): Piece {
  const cells = shapeOf(kind);
  return { kind, cells, x: Math.floor((COLS - cells[0].length) / 2), y: kind === 1 ? -1 : 0 };
}

/** Puts the next piece at the top. If there is no room for it, the game is over. */
function spawn(game: Game, random: Random): Game {
  const piece = newPiece(game.next);
  const drawn = drawFromBag(game.bag, random);
  const over = collides(game.board, piece.cells, piece.x, piece.y);
  return { ...game, piece, next: drawn.kind, bag: drawn.bag, over };
}

export function newGame(random: Random = Math.random): Game {
  const first = drawFromBag([], random);
  const second = drawFromBag(first.bag, random);
  return spawn(
    { board: emptyBoard(), piece: null, next: first.kind, bag: second.bag, score: 0, lines: 0, level: 1, over: false },
    random
  );
}

/** How long a piece takes to fall one row, in milliseconds. It gets quicker every level. */
export const dropInterval = (level: number) => Math.max(90, 800 - (level - 1) * 70);

const LINE_POINTS = [0, 100, 300, 500, 800];

/** Sets the piece down for good, clears any full rows, scores them and brings in the next piece. */
function lock(game: Game, random: Random): Game {
  if (!game.piece) return game;
  const board = game.board.map((row) => [...row]);
  const { cells, x, y, kind } = game.piece;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c] && y + r >= 0) board[y + r][x + c] = kind;
    }
  }
  const kept = board.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0));
  const lines = game.lines + cleared;
  const level = Math.floor(lines / 10) + 1;
  const score = game.score + LINE_POINTS[cleared] * game.level;
  return spawn({ ...game, board: kept, piece: null, score, lines, level }, random);
}

export function move(game: Game, dx: number): Game {
  const p = game.piece;
  if (!p || game.over || collides(game.board, p.cells, p.x + dx, p.y)) return game;
  return { ...game, piece: { ...p, x: p.x + dx } };
}

/** Turns the piece, pushing it a little sideways if that is what it takes to fit next to a wall or another piece. */
export function rotate(game: Game, clockwise = true): Game {
  const p = game.piece;
  if (!p || game.over || p.kind === 2) return game;
  const cells = clockwise ? turnClockwise(p.cells) : turnAnticlockwise(p.cells);
  for (const kick of [0, -1, 1, -2, 2]) {
    if (!collides(game.board, cells, p.x + kick, p.y)) return { ...game, piece: { ...p, cells, x: p.x + kick } };
  }
  return game;
}

/** One row down. Returns the game with the piece moved, or locked in place if it can't go any lower. */
export function stepDown(game: Game, random: Random = Math.random, bonus = 0): Game {
  const p = game.piece;
  if (!p || game.over) return game;
  if (!collides(game.board, p.cells, p.x, p.y + 1)) {
    return { ...game, piece: { ...p, y: p.y + 1 }, score: game.score + bonus };
  }
  return lock(game, random);
}

export const softDrop = (game: Game, random: Random = Math.random) => stepDown(game, random, 1);

/** How far down the piece is going to land, for the faint outline of where it will end up. */
export function landingY(game: Game): number {
  const p = game.piece;
  if (!p) return 0;
  let y = p.y;
  while (!collides(game.board, p.cells, p.x, y + 1)) y++;
  return y;
}

export function hardDrop(game: Game, random: Random = Math.random): Game {
  const p = game.piece;
  if (!p || game.over) return game;
  const y = landingY(game);
  return lock({ ...game, piece: { ...p, y }, score: game.score + (y - p.y) * 2 }, random);
}
