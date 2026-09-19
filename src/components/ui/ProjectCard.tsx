"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { CardVideo } from "@/components/ui/CardVideo";
import { CompanyName } from "@/components/ui/CompanyName";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        {/* Details */}
        <div className="mb-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-8">
          <div>
            <div className="mb-2 flex items-baseline gap-2 text-base text-text-muted">
              <CompanyName project={project} />
              <span>·</span>
              <span className="font-mono">{project.year}</span>
            </div>
            <h3 className="text-lg font-serif font-medium leading-snug text-text-primary transition-colors group-hover:text-red">
              {project.title}
            </h3>
          </div>
          <p className="text-base leading-relaxed text-text-muted">{project.description}</p>
        </div>

        {/* Frame: 12px top/bottom and 80px left/right around the mock, which always shows in full */}
        <motion.div
          className="bg-surface-200 px-20 py-3"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="relative" style={{ aspectRatio: project.thumbnailRatio ?? 16 / 9 }}>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              className={`object-contain ${
                project.video ? "transition-opacity duration-200 group-hover:opacity-0" : ""
              }`}
            />
            {project.video && <CardVideo src={project.video} label={project.title} />}
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
