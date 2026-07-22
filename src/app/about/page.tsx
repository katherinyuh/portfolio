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
    <div className="bg-slate-50">
      <div className="px-[120px] pt-10">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12"
      >
        {/* Left column: photo */}
        <div className="w-full md:w-[280px] shrink-0">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-200">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-muted">
                Photo
              </div>
            ) : (
              <Image
                src="/images/katherine.jpg"
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
            I&apos;m a product designer who co-creates with product managers, engineers, and
            product marketing managers to ship B2B interfaces. Currently a rising senior at
            UC Davis studying Cognitive Science, and a product design intern at IBM on the
            Z DevOps team.
          </p>
          <p className="text-base font-sans text-text-secondary leading-relaxed mb-3">
            Outside of work, I mentor designers at Design Interactive and build products for
            the UC Davis community at AggieWorks.
          </p>
        </div>
      </motion.div>
      </div>

      {/* Love letter to communities — spans the full remaining screen width */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="pl-8 mb-12"
      >
        <CommunitiesSection items={communities} />
      </motion.div>

    </div>
  );
}
