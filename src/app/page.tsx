import { projects, siteConfig } from "@/lib/data";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function HomePage() {
  return (
    <div className="px-16 py-10">
      {/* Header */}
      <div className="mb-10" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <h2 className="text-3xl font-serif font-medium text-text-primary mb-3">
          {siteConfig.bio}
        </h2>
        <div className="flex items-center gap-1 text-base font-sans text-text-muted">
          <span>Product Design intern @</span>
          <img src="/images/icons/ibm-logo.svg" alt="IBM" width={43} height={16} className="h-4 w-[43px]" />
          <span className="mx-1">•</span>
          <img src="/images/icons/framer-logo.svg" alt="Framer" width={60} height={16} className="h-4 w-[60px]" />
          <span>Campus Ambassador</span>
        </div>
        <p className="text-base font-sans text-text-muted mt-1">
          Fourth-year cognitive science @ UC Davis
        </p>
      </div>

      {/* Single-column list */}
      <div className="grid grid-cols-1 gap-16">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-base text-text-muted">
        More projects available on request — some work is under NDA.
      </p>
    </div>
  );
}
