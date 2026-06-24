"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/work/${project.slug}`}>
        <motion.div
          className="case-card group"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] bg-surface-300 overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-accent/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {project.featured && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-surface-50/80 backdrop-blur-sm border border-surface-300 text-xs text-text-secondary">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="text-sm font-medium text-text-primary leading-snug group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <span className="text-xs text-text-muted ml-2 shrink-0 mt-0.5">
                {project.year}
              </span>
            </div>
            <p className="text-xs text-text-muted mb-3 leading-relaxed line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow hint */}
          <motion.div
            className="absolute bottom-4 right-4 text-text-muted"
            initial={{ x: 0, opacity: 0 }}
            whileHover={{ x: 3, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-xs">→</span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
