"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CommunitiesSection from "@/components/ui/CommunitiesSection";

const communities = [
  {
    image: "/images/community-1.jpg",
    title: "My dog!!!",
    description: "",
  },
  {
    image: "/images/community-2.jpg",
    title: "Dying in a half marathon",
    description: "",
  },
  {
    image: "/images/community-3.jpg",
    title: "Design Interactive (Fall 2025)",
    description: "",
  },
  {
    image: "/images/community-4.jpg",
    title: "AggieWorks",
    description: "",
  },
  {
    image: "/images/community-1.jpg",
    title: "Cookie rats",
    description: "",
  },
  {
    image: "/images/community-2.jpg",
    title: "Real rats",
    description: "",
  },
];

export default function AboutPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-slate-50 px-[120px] pt-10">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12"
      >
        {/* Left column: photo */}
        <div className="w-full md:w-[280px] shrink-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-200">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-muted">
                Photo
              </div>
            ) : (
              <Image
                src="/images/katherine.png"
                alt="Katherine"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>

        {/* Right column: intro text */}
        <div className="flex-1 max-w-prose">
          <h2 className="text-3xl font-serif font-medium text-text-primary mb-4">
            Hello! My name is Katherine!
          </h2>
          <p className="text-base font-sans text-text-secondary leading-relaxed mb-3">
            {
              "I’m an ex-pharmaceutical chemistry major (and chronic emoji user) who wishes she had bought a better laptop if she’d known how much she’d end up using it…. But since becoming a designer, I've come very far, and I'm always looking ahead to what comes next for me and my career (personally, I want to beat Candy Crush Saga)."
            }
          </p>
        </div>
      </motion.div>

      {/* Love letter to communities — same 120px side padding as the intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <CommunitiesSection items={communities} />
      </motion.div>

    </div>
  );
}
