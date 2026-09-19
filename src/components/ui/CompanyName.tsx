import type { Project } from "@/lib/data";

/**
 * The company on a project card: its logo when the project has one, otherwise the name as text.
 * The logo is 0.73em tall, the height of the digits in the year beside it (Geist Mono digits are
 * 0.726em tall), and the row is baseline-aligned, so the logo's top and bottom line up with the digits.
 * It has a light-theme and a dark-theme version; the one matching the visitor's system theme shows.
 */
export function CompanyName({ project }: { project: Project }) {
  if (!project.logo) return <span>{project.company}</span>;

  return (
    <span className="inline-flex">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.logo.light}
        alt={project.company}
        draggable={false}
        className="block h-[0.73em] w-auto select-none dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.logo.dark}
        alt={project.company}
        draggable={false}
        className="hidden h-[0.73em] w-auto select-none dark:block"
      />
    </span>
  );
}
