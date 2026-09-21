"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { CardVideo } from "@/components/ui/CardVideo";
import { CompanyName } from "@/components/ui/CompanyName";

type Props = {
  project: Project;
  index: number;
};

// The pictures in a row, in order: the project's own list, or its thumbnail and hero.
function galleryOf(project: Project): NonNullable<Project["gallery"]> {
  if (project.gallery?.length) return project.gallery;
  const items = [{ src: project.thumbnail, ratio: project.thumbnailRatio ?? 4 / 3 }];
  if (project.hero && project.hero !== project.thumbnail) {
    items.push({ src: project.hero, ratio: project.heroRatio ?? 4 / 3 });
  }
  return items;
}

/**
 * A strip of pictures that scrolls sideways: trackpad or shift + wheel, or drag with the mouse.
 * It runs off the right edge of the page. Clicking a picture opens the case study (unless it was a drag).
 */
function Strip({ project }: { project: Project }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [grabbing, setGrabbing] = useState(false);
  const soon = !!project.comingSoon;

  // The first picture plays the project's demo clip while it is hovered.
  const tiles = galleryOf(project).map((g, i) => {
    const hasClip = i === 0 && !!project.video && !soon;
    return (
      <div
        key={g.src}
        className={`h-full shrink-0 bg-surface-200 ${g.cover ? "" : "p-3"} ${hasClip ? "group" : ""}`}
        style={{ aspectRatio: `${g.ratio}` }}
      >
        <div className="relative h-full w-full">
          <Image
            src={g.src}
            alt={g.alt ?? project.title}
            fill
            sizes="480px"
            draggable={false}
            className={`pointer-events-none select-none ${g.cover ? "object-cover" : "object-contain"} ${
              hasClip ? "transition-opacity duration-200 group-hover:opacity-0" : ""
            }`}
            style={g.cover ? { objectPosition: g.position } : undefined}
          />
          {hasClip && <CardVideo src={project.video!} label={project.title} />}
        </div>
      </div>
    );
  });

  return (
    <div
      ref={scroller}
      className={`flex h-[11.25rem] gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:h-60 [&::-webkit-scrollbar]:hidden ${
        soon ? "" : grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !scroller.current) return;
        drag.current = { down: true, startX: e.clientX, startScroll: scroller.current.scrollLeft, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.down || !scroller.current) return;
        const dx = e.clientX - d.startX;
        if (Math.abs(dx) > 4) {
          d.moved = true;
          setGrabbing(true);
        }
        scroller.current.scrollLeft = d.startScroll - dx;
      }}
      onPointerUp={() => {
        drag.current.down = false;
        setGrabbing(false);
      }}
      onPointerLeave={() => {
        drag.current.down = false;
        setGrabbing(false);
      }}
      onClickCapture={(e) => {
        // a drag ends in a click: swallow it so it doesn't open the case study
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
    >
      <div className="flex h-full gap-2">{tiles}</div>
    </div>
  );
}

export function ProjectCard({ project, index }: Props) {
  const router = useRouter();
  // A project with no case study yet: nothing opens, nothing reacts to hover, and the pointer says so.
  const soon = !!project.comingSoon;

  const row = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      {/* Left: company | year, then the title, then the description */}
      <div className="pr-6 lg:pr-0">
        <div className="mb-2 flex items-center gap-3 text-base text-text-muted">
          <CompanyName project={project} />
          <span aria-hidden className="h-4 w-px bg-surface-300" />
          <span className="font-mono">{project.year}</span>
        </div>
        <h3
          className={`text-lg font-serif font-medium leading-snug text-text-primary ${
            soon ? "" : "transition-colors group-hover/row:text-red"
          }`}
        >
          {soon ? (
            project.title
          ) : (
            // A real link for keyboard and screen-reader users; the rest of the row opens it on click too.
            <Link href={`/work/${project.slug}`} onClick={(e) => e.stopPropagation()}>
              {project.title}
            </Link>
          )}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-text-muted">{project.description}</p>
      </div>

      {/* Right: the pictures. The strip runs off the right edge of the page. */}
      <div className="min-w-0">
        <Strip project={project} />
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group/row py-6 pl-6 lg:pl-12 ${soon ? "" : "cursor-pointer"}`}
      // the mouse circle turns into these words over the row
      data-cursor-label={soon ? "Coming soon" : "View"}
      onClick={soon ? undefined : () => router.push(`/work/${project.slug}`)}
    >
      {row}
    </motion.article>
  );
}
