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
      <Link href={`/work/${project.slug}`} className="group block">
        {/* Details */}
        <div className="grid grid-cols-2 gap-8 mb-4 items-center">
          <div>
            <p className="text-base text-text-muted mb-2">{project.company}</p>
            <h3 className="text-lg font-serif font-medium text-text-primary leading-snug group-hover:text-red transition-colors mb-1">
              {project.title}
            </h3>
            <p className="text-base text-text-muted">{project.year}</p>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Thumbnail */}
        <motion.div
          className="relative aspect-[16/9] rounded-xl overflow-hidden bg-surface-300"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-red/10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
