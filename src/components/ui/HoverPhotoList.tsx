"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HoverPhotoItem {
  label: string;
  image: string;
}

interface HoverPhotoListProps {
  items: HoverPhotoItem[];
}

export default function HoverPhotoList({ items }: HoverPhotoListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef}>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <span
            key={item.label}
            className="text-2xl font-serif text-text-primary leading-[2] cursor-default w-fit"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {item.label}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed pointer-events-none z-50"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 100,
            }}
          >
            <div className="w-[280px] h-[200px] rounded-lg overflow-hidden bg-surface-200 shadow-md">
              {imageErrors[activeIndex] ? (
                <div className="w-full h-full bg-surface-200" />
              ) : (
                <Image
                  src={items[activeIndex].image}
                  alt={items[activeIndex].label}
                  width={280}
                  height={200}
                  className="object-cover w-full h-full"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [activeIndex]: true }))
                  }
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
