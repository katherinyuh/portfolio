"use client";

import { AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectGridCard } from "@/components/ui/ProjectGridCard";
import { ProjectCanvas } from "@/components/ui/ProjectCanvas";
import { useView } from "@/components/layout/ViewContext";

export function ProjectList({ projects }: { projects: Project[] }) {
  const { view } = useView();

  // The canvas is full-bleed and always shows every project.
  if (view === "Canvas") {
    return <ProjectCanvas projects={projects} allProjects={projects} />;
  }

  return (
    <div className="px-6 pb-16 pt-8 lg:px-12">
      {view === "Grid" ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {projects.map((project, i) => (
              <ProjectGridCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          <AnimatePresence>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
