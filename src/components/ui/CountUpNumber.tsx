"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// The first run of digits in the phrase (with thousands separators or one decimal point), e.g. the "200" in
// "200+ events" or the "15" in "over 15k users". Everything else in the phrase — a leading $, a trailing
// K/M/%/+, surrounding words — is left exactly as written and just carried along on either side of it.
const NUMBER = /\d[\d,]*(\.\d+)?/;

function formatted(value: number, decimals: number, hasCommas: boolean) {
  const n = decimals ? value.toFixed(decimals) : Math.round(value).toString();
  return hasCommas ? Number(n.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: decimals }) : n;
}

// A small whole number (like the 15 in "15k users", or the 8 in "8 students") counts up one at a time —
// 1, 2, 3, … — instead of easing through a continuous curve, so each step reads as its own tick.
const STEP_MAX = 50;
const STEP_MS = 90;

/**
 * A bold case-study callout with a number in it. The first time it scrolls into view, that number counts up
 * to its real value; the rest of the phrase (units, a $ sign, the words around it) just sits still.
 */
export default function CountUpNumber({ text }: { text: string }) {
  const match = useMemo(() => text.match(NUMBER), [text]);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const decimals = match?.[1] ? match[1].length - 1 : 0;
  const hasCommas = match ? match[0].includes(",") : false;
  const target = match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  const stepped = !decimals && !hasCommas && target > 1 && target <= STEP_MAX;

  const [display, setDisplay] = useState(() => formatted(stepped ? 1 : 0, decimals, hasCommas));

  useEffect(() => {
    if (!inView || !match) return;

    if (stepped) {
      let current = 1;
      setDisplay(formatted(current, decimals, hasCommas));
      const id = setInterval(() => {
        current += 1;
        setDisplay(formatted(current, decimals, hasCommas));
        if (current >= target) clearInterval(id);
      }, STEP_MS);
      return () => clearInterval(id);
    }

    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(formatted(v, decimals, hasCommas)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!match) return <>{text}</>;

  return (
    <span ref={ref}>
      {text.slice(0, match.index)}
      {display}
      {text.slice((match.index ?? 0) + match[0].length)}
    </span>
  );
}
