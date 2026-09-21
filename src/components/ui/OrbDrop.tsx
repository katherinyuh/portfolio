"use client";

import { useEffect, useRef, useState } from "react";
import { GRID_PHOTOS } from "@/lib/gridPhotos";
import { pushOrbs, type Pointer } from "@/lib/orbPush";

/** How far down each picture the crop is centred, 0 (top) to 1 (bottom): a little above the middle keeps faces in the circle. */
const PHOTO_FOCUS_Y = 0.4;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * A crowd of glass orbs, each with a different photo from the grid folder in it, that drop from the top of the screen and pile up along the bottom.
 * They fall under gravity, bounce off one another and the walls, and are pushed about by the mouse as it moves. They
 * drop again every time `active` turns on (the footer being uncovered) and are cleared away when it turns off.
 * It fills its parent, so put it in a box that is the size of the screen.
 */
export function OrbDrop({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [resized, setResized] = useState(0); // changes when the window does, so the orbs are sized and dropped afresh

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setResized((n) => n + 1), 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const cv = canvas.current;
    if (!active || !cv) return;
    let cancelled = false;
    let raf = 0;
    let spawner: ReturnType<typeof setInterval> | undefined;
    let teardown: (() => void) | undefined;

    (async () => {
      // The physics is loaded only when the footer is first uncovered, so it isn't part of the page's first load.
      const mod = await import("matter-js");
      if (cancelled) return;
      const Matter = (mod as unknown as { default?: typeof import("matter-js") }).default ?? mod;
      const { Engine, Bodies, Body, Composite } = Matter;

      const rect = cv.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const ctx = cv.getContext("2d")!;

      const R = Math.max(34, Math.min(90, W * 0.055));
      const count = Math.round((W / (2 * R)) * 2.1);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const engine = Engine.create({ gravity: { x: 0, y: 2.4, scale: 0.001 } });
      const wall = { isStatic: true, friction: 0.6 };
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + 60, W * 3, 120, wall), // floor
        Bodies.rectangle(-60, H / 2 - H, 120, H * 4, wall), // left
        Bodies.rectangle(W + 60, H / 2 - H, 120, H * 4, wall), // right
      ]);

      // Each orb gets its own photo, picked at random without repeats (until the folder runs out). They load while
      // the orbs fall; an orb whose photo isn't there yet is just glass.
      const deck = [...GRID_PHOTOS].sort(() => Math.random() - 0.5);
      const photos = new Map<Matter.Body, HTMLImageElement | null>();
      const orbs: Matter.Body[] = [];
      const addOrb = (y = -R * 2) => {
        const orb = Bodies.circle(R + Math.random() * (W - 2 * R), y, R, {
          restitution: 0.4,
          friction: 0.35,
          frictionAir: 0.004,
          density: 0.002,
        });
        Body.setAngle(orb, Math.random() * Math.PI * 2);
        Body.setAngularVelocity(orb, (Math.random() - 0.5) * 0.06);
        orbs.push(orb);
        photos.set(orb, null);
        loadImage(deck[(orbs.length - 1) % deck.length]).then((img) => photos.set(orb, img));
        Composite.add(engine.world, orb);
      };

      // The orbs get shoved wherever the pointer moves through them. There is nothing to click or drag: as long as the
      // mouse is moving over them they move, and they settle when it stops.
      const pointer: Pointer = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, seen: false };
      const onMove = (e: PointerEvent) => {
        const box = cv.getBoundingClientRect();
        pointer.x = e.clientX - box.left;
        pointer.y = e.clientY - box.top;
        if (!pointer.seen) {
          pointer.px = pointer.x;
          pointer.py = pointer.y;
          pointer.seen = true;
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const glass = () => {
        const c = getComputedStyle(document.documentElement).getPropertyValue("--surface-200").trim() || "242 237 230";
        return `rgb(${c})`;
      };

      const draw = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const bg = glass();
        for (const orb of orbs) {
          const { x, y } = orb.position;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(orb.angle);
          ctx.beginPath();
          ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.clip();
          ctx.fillStyle = bg;
          ctx.fillRect(-R, -R, 2 * R, 2 * R);
          const image = photos.get(orb);
          if (image) {
            // the picture fills the circle, cropped like `object-fit: cover`
            const s = Math.max((2 * R) / image.width, (2 * R) / image.height);
            const w = image.width * s;
            const h = image.height * s;
            ctx.drawImage(image, -w / 2, -R + (2 * R - h) * PHOTO_FOCUS_Y, w, h);
          }
          ctx.restore();

          // the glass: a soft shade round the edge and a bright spot that stays where the light is, however the orb turns
          ctx.save();
          ctx.translate(x, y);
          const shade = ctx.createRadialGradient(0, 0, R * 0.7, 0, 0, R);
          shade.addColorStop(0, "rgb(0 0 0 / 0)");
          shade.addColorStop(1, "rgb(0 0 0 / 0.22)");
          ctx.fillStyle = shade;
          ctx.beginPath();
          ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fill();
          const shine = ctx.createRadialGradient(-R * 0.35, -R * 0.45, 0, -R * 0.35, -R * 0.45, R * 0.4);
          shine.addColorStop(0, "rgb(255 255 255 / 0.7)");
          shine.addColorStop(1, "rgb(255 255 255 / 0)");
          ctx.fillStyle = shine;
          ctx.beginPath();
          ctx.arc(0, 0, R, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      };

      if (reduce) {
        // No motion: let them fall and settle out of sight, then show the pile.
        for (let i = 0; i < count; i++) addOrb(-R * 2 - i * R * 0.5);
        for (let i = 0; i < 900; i++) Engine.update(engine, 1000 / 60);
        draw();
      } else {
        let spawned = 0;
        spawner = setInterval(() => {
          if (spawned >= count) return clearInterval(spawner);
          addOrb();
          spawned++;
        }, 45);
        let last = performance.now();
        const frame = (now: number) => {
          pushOrbs(Body, orbs, R, pointer);
          // spinning dies away quickly, so the orbs roll a little and settle rather than spiralling
          for (const orb of orbs) Body.setAngularVelocity(orb, orb.angularVelocity * 0.94);
          Engine.update(engine, Math.min(now - last, 32));
          last = now;
          draw();
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      }

      teardown = () => {
        window.removeEventListener("pointermove", onMove);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        ctx.clearRect(0, 0, cv.width, cv.height);
      };
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (spawner) clearInterval(spawner);
      teardown?.();
    };
  }, [active, resized]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
