"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

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
    <div className="px-8 py-10 max-w-[720px]">
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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-text-muted">{project.company}</span>
          <span className="text-surface-400">·</span>
          <span className="text-xs text-text-muted">{project.year}</span>
        </div>
        <h1 className="text-3xl font-medium text-text-primary mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-text-secondary leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Hero image placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full aspect-video bg-surface-200 rounded-xl border border-surface-300 mb-12 flex items-center justify-center"
      >
        <p className="text-xs text-text-muted">Add your hero image here</p>
      </motion.div>

      {/* Case study sections — fill these in */}
      {[
        { label: "Overview", placeholder: "What was the problem? Who were you designing for?" },
        { label: "Research", placeholder: "What did you learn? Interview insights, survey data, heuristic findings…" },
        { label: "Process", placeholder: "How did you explore the problem space? Wireframes, flows, iterations…" },
        { label: "Solution", placeholder: "What did you ship? Key design decisions and rationale…" },
        { label: "Outcomes", placeholder: "What changed? Metrics, feedback, learnings…" },
      ].map((section, i) => (
        <motion.section
          key={section.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
          className="mb-12"
        >
          <h2 className="text-xs text-text-muted uppercase tracking-widest mb-4">
            {section.label}
          </h2>
          <p className="text-sm text-text-muted italic">{section.placeholder}</p>
        </motion.section>
      ))}
    </div>
  );
}
