import type { Project } from "@/lib/data";

/**
 * The company on a project card: its logo when the project has one, otherwise the name as text.
 * The logo is 0.73em tall, the height of the digits in the year beside it (Geist Mono digits are
 * 0.726em tall), and the row is baseline-aligned, so the logo's top and bottom line up with the digits.
 * It has a light-theme and a dark-theme version (or, if only a light one is given, a white silhouette of it
 * in dark mode); the one matching the visitor's system theme shows.
 */
export function CompanyName({ project }: { project: Project }) {
  if (!project.logo) return <span>{project.company}</span>;
  const { light, dark } = project.logo;

  // No dark-theme file: use the light one for both themes, turned into a white silhouette in dark mode.
  if (!dark) {
    return (
      <span className="inline-flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={light}
          alt={project.company}
          draggable={false}
          className="block h-[0.73em] w-auto select-none dark:[filter:brightness(0)_invert(1)]"
        />
      </span>
    );
  }

  return (
    <span className="inline-flex">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light}
        alt={project.company}
        draggable={false}
        className="block h-[0.73em] w-auto select-none dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt={project.company}
        draggable={false}
        className="hidden h-[0.73em] w-auto select-none dark:block"
      />
    </span>
  );
}
