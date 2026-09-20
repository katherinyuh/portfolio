"use client";

import { AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCanvas } from "@/components/ui/ProjectCanvas";
import { useView } from "@/components/layout/ViewContext";

export function ProjectList({ projects }: { projects: Project[] }) {
  const { view } = useView();

  // The canvas is full-bleed; the list sits in the padded content area.
  if (view === "Canvas") return <ProjectCanvas projects={projects} />;

  return (
    <div className="pb-16 pt-4">
      <div className="flex flex-col">
        <AnimatePresence>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
