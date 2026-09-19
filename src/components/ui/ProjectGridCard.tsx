"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";

export function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        {/* Fixed frame so rows line up; the image is contained, never cropped */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-200">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="text-base font-medium text-text-primary transition-colors group-hover:text-red-700">
            {project.company}
          </h3>
          <span className="text-xs uppercase tracking-wide text-text-muted">
            {project.year}
          </span>
        </div>
        <p className="mt-1 text-sm leading-snug text-text-muted">{project.title}</p>
      </Link>
    </motion.article>
  );
}
