"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects, siteConfig, type CaseStudyBlock } from "@/lib/data";

const STROKE = "#DADADD";
const IMAGE_STROKE = [`1px 0`, `-1px 0`, `0 1px`, `0 -1px`]
  .map((offset) => `drop-shadow(${offset} 0 ${STROKE})`)
  .join(" ");

const fallbackCaseStudy: CaseStudyBlock[] = [
  { type: "text", label: "Overview", content: "What was the problem? Who were you designing for?" },
  { type: "text", label: "Research", content: "What did you learn? Interview insights, survey data, heuristic findings…" },
  { type: "text", label: "Process", content: "How did you explore the problem space? Wireframes, flows, iterations…" },
  { type: "text", label: "Solution", content: "What did you ship? Key design decisions and rationale…" },
  { type: "text", label: "Outcomes", content: "What changed? Metrics, feedback, learnings…" },
];

// This would normally fetch from a CMS or MDX files
// For now it shows a structured template per project
export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) notFound();

  return (
    <div className="px-16 py-10 w-full">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          ← Back
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <p className="text-base text-text-muted mb-3">{project.company}</p>
        <div className="grid grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-2xl font-serif font-medium text-text-primary leading-snug mb-1">
              {project.title}
            </h1>
            <p className="text-base text-text-muted">{siteConfig.role}, {project.year}</p>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            {project.description}
          </p>
        </div>
      </motion.div>

      {/* Live site link */}
      {project.liveUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6"
        >
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-none bg-slate-950 px-2 py-1 text-base text-slate-50 transition-colors hover:bg-slate-800"
          >
            View our live website
          </a>
        </motion.div>
      )}

      {/* Hero image (placeholder until the project has one) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={
          project.hero
            ? "relative mb-12 w-full bg-surface-200"
            : "relative w-full aspect-video bg-surface-200 border border-surface-300 mb-12 flex items-center justify-center overflow-hidden"
        }
        style={project.hero ? { aspectRatio: project.thumbnailRatio ?? 16 / 9 } : undefined}
      >
        {project.hero ? (
          <Image
            src={project.hero}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-contain"
            // 1px light stroke that follows the visible image, not the transparent margin around it
            style={{ filter: IMAGE_STROKE }}
          />
        ) : (
          <p className="text-xs text-text-muted">Add your hero image here</p>
        )}
      </motion.div>

      {/* Case study sections */}
      {(project.caseStudy ?? fallbackCaseStudy).map((block, i) =>
        block.type === "image" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className="w-full aspect-video bg-surface-200 border border-surface-300 mb-12 flex items-center justify-center"
          >
            <p className="text-xs text-text-muted">{block.caption}</p>
          </motion.div>
        ) : (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className="mb-12"
          >
            {block.label && (
              <p className="text-xs font-sans text-text-muted uppercase tracking-wider mb-4">
                {block.label}
              </p>
            )}
            {(Array.isArray(block.content) ? block.content : [block.content]).map((paragraph, j) => (
              <p
                key={j}
                className={`text-base text-text-muted max-w-prose ${project.caseStudy ? "" : "italic"} ${j > 0 ? "mt-3" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </motion.section>
        )
      )}
    </div>
  );
}
