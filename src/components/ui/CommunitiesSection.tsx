"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Community {
  image: string;
  title: string;
  description: string;
}

interface CommunitiesSectionProps {
  items: Community[];
}

export default function CommunitiesSection({ items }: CommunitiesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-text-primary mb-1">
        My work-life balance 😎
      </h2>
      <p className="text-base font-sans text-text-muted mb-8">Here are things I love (not ordered):</p>

      <div className="flex gap-12 items-start">
        {/* Left: 2-column × 3-row image grid, fills all space up to the text panel */}
        <div
          className="flex-[3] grid grid-cols-2 gap-3"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden bg-surface-200 cursor-default"
              style={{
                opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.3,
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              {imageErrors[i] ? (
                <div className="absolute inset-0 bg-surface-200" />
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [i]: true }))
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Right: contextual text panel */}
        <div className="flex-[1] max-w-[220px] shrink-0 self-stretch flex items-center">
          <AnimatePresence mode="wait">
            {hoveredIndex === null ? (
              <motion.p
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs uppercase tracking-widest text-text-muted"
              >
                HOVER AN IMAGE 👀
              </motion.p>
            ) : (
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-base font-sans text-text-secondary leading-relaxed">
                  {items[hoveredIndex].title}
                </p>
                {items[hoveredIndex].description && (
                  <p className="text-base font-sans text-text-secondary leading-relaxed mt-3">
                    {items[hoveredIndex].description}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
