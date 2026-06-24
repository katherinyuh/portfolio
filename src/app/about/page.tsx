"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";

const experience = [
  {
    company: "IBM",
    role: "Product Design Intern",
    period: "Summer 2025",
    description: "Enterprise UX for workflow tooling across IBM Cloud.",
  },
  {
    company: "Design Interactive",
    role: "Leadership",
    period: "2023–Present",
    description: "Leading design operations and mentoring student designers at UC Davis.",
  },
  {
    company: "Laminar Systems",
    role: "UX Designer",
    period: "2024",
    description: "Designed user flows and UI for an engineering data platform.",
  },
  {
    company: "Clubly.org",
    role: "Product Designer",
    period: "2024",
    description: "Redesigned the club discovery and event management experience.",
  },
  {
    company: "Benevolent Bandwidth",
    role: "Design Lead",
    period: "2023",
    description: "Brand identity and website for a nonprofit bridging the digital divide.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-8 py-10 max-w-[640px]">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-xs text-text-muted uppercase tracking-widest mb-3">About</p>
        <h1 className="text-2xl font-medium text-text-primary mb-4">
          Hey, I&apos;m Katherine
        </h1>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            I&apos;m a Cognitive Science student at UC Davis (graduating June 2027)
            with a focus on UX and Product Design. I think about how people make sense
            of systems — and I try to make those systems make more sense.
          </p>
          <p>
            I&apos;m drawn to the space between research and craft: understanding why
            people behave the way they do, then designing experiences that meet them there.
          </p>
          <p>
            Outside of work, I&apos;m into Zone 2 cardio, strength training, and probably
            thinking too hard about visual hierarchy.
          </p>
        </div>
      </motion.div>

      {/* Experience */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="text-xs text-text-muted uppercase tracking-widest mb-6">Experience</p>
        <div className="space-y-6">
          {experience.map((item, i) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
              className="flex gap-4 group"
            >
              <div className="mt-1 w-0.5 shrink-0 bg-surface-300 group-hover:bg-accent/50 transition-colors duration-300 rounded-full" />
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-medium text-text-primary">{item.company}</span>
                  <span className="text-xs text-text-muted">{item.period}</span>
                </div>
                <p className="text-xs text-text-muted mb-1">{item.role}</p>
                <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-12"
      >
        <p className="text-xs text-text-muted uppercase tracking-widest mb-6">Education</p>
        <div className="flex gap-4">
          <div className="mt-1 w-0.5 shrink-0 bg-surface-300 rounded-full" />
          <div>
            <span className="text-sm font-medium text-text-primary">UC Davis</span>
            <p className="text-xs text-text-muted mt-0.5">B.S. Cognitive Science · Expected June 2027</p>
            <p className="text-xs text-text-muted mt-1">Focus: UX & Product Design</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
