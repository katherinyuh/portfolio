"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CommunitiesSection from "@/components/ui/CommunitiesSection";
import QASection, { type QAItem } from "@/components/ui/QASection";

const qa: QAItem[] = [
  {
    question: "How did you end up in design?",
    answer: [
      "I was drawn to UI/UX before I even knew what it was. My passion started when I was accepted into a website development summer camp during my sophomore year in high school, where I not only discovered that I enjoyed coding, but I especially loved designing websites. When I started college, I was unsure of my future and applied as a chemistry major. However, when I joined Design Interactive’s UI/UX sprint, and everything clicked. I reconnected with my old passion and realized how much I truly loved creating products and spaces that are both functional and visually unique.",
    ],
  },
  {
    question: "What are your design practices?",
    answer: [
      "**Versaility:** \"Home page V1\", \"Home page V2\", \"Home page FINAL\" -- I create many design variations, each building on the last. They capture new ideas and serve as a record (mainly because I'm too sentimental to delete them) to reflect my creative growth.",
      "**Science based:** I apply concepts learned from my classes about memory and linguistics to design experiences that are cognitive to users.",
      "**Passion:** Design(eat + sleep + breathe)",
    ],
  },
  {
    question: "What is your favourite Figma shortcut?",
    answer: ["You only need to use option ⌥ + hover."],
  },
  {
    question: "5 ants rented an apartment with another 5 ants...",
    answer: ["now they are tenants!"],
  },
];

export default function AboutPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mb-16 bg-slate-50 px-[7.5rem] pt-10">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 mb-14 md:mb-24"
      >
        {/* Left column: photo */}
        <div className="w-full md:w-[17.5rem] shrink-0">
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
          <h2 className="text-3xl font-serif font-medium text-text-primary mb-6">
            Hello!
          </h2>
          <p className="text-base font-sans text-text-secondary leading-relaxed mb-3">
            {
              "I’m an ex-pharmaceutical chemistry major (and chronic emoji user) who wishes she had bought a better laptop if she’d known how much she’d end up using it…. But since becoming a designer, I've come very far, and I'm always looking ahead to what comes next for me and my career (personally, I want to beat Candy Crush Saga)."
            }
          </p>
        </div>
      </motion.div>

      {/* Q&A: questions that open to show the answer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-14 md:mb-24"
      >
        <QASection items={qa} />
      </motion.div>

      {/* Love letter to communities — same 7.5rem (120px) side padding as the intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-14 md:mb-24"
      >
        <CommunitiesSection />
      </motion.div>

    </div>
  );
}
