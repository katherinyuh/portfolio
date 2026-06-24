import { projects, siteConfig } from "@/lib/data";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function HomePage() {
  return (
    <div className="px-8 py-10 max-w-[900px]">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-3">
          Selected Work
        </p>
        <h1 className="text-2xl font-medium text-text-primary leading-snug mb-3">
          {siteConfig.bio}
        </h1>
        <p className="text-sm text-text-muted">
          Currently at IBM · Previously Laminar Systems, Clubly, Design Interactive
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-text-muted">
        More projects available on request — some work is under NDA.
      </p>
    </div>
  );
}
