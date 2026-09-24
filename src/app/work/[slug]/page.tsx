"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects, type CaseStudyBlock } from "@/lib/data";
import BeforeAfterSwitcher from "@/components/ui/BeforeAfterSwitcher";
import PhotoGallery from "@/components/ui/PhotoGallery";
import ImageFrame from "@/components/ui/ImageFrame";
import CardRow from "@/components/ui/CardRow";
import VideoFrame from "@/components/ui/VideoFrame";
import MediaRow from "@/components/ui/MediaRow";
import MentalModels from "@/components/ui/MentalModels";
import { LightboxProvider, useLightbox } from "@/components/ui/MediaLightbox";
import CountUpNumber from "@/components/ui/CountUpNumber";

const fallbackCaseStudy: CaseStudyBlock[] = [
  { type: "text", label: "Overview", content: "What was the problem? Who were you designing for?" },
  { type: "text", label: "Research", content: "What did you learn? Interview insights, survey data, heuristic findings…" },
  { type: "text", label: "Process", content: "How did you explore the problem space? Wireframes, flows, iterations…" },
  { type: "text", label: "Solution", content: "What did you ship? Key design decisions and rationale…" },
  { type: "text", label: "Outcomes", content: "What changed? Metrics, feedback, learnings…" },
];

// Spacing between the parts of a case study, all in rem, mobile first and larger on desktop (md and up):
//   text ↔ pictures   1.25rem → 2rem
//   between sections  3.5rem  → 6rem   (a section starts at a text block with a label)
//   a big headline to a button, 1rem → 1.5rem; the button to the picture below it is the text-to-picture gap
const GAP_TEXT_MEDIA = "mb-5 md:mb-8";
const GAP_SECTION = "mb-14 md:mb-24";

// The gap under a block, from what comes next.
function gapAfter(block: CaseStudyBlock, next?: CaseStudyBlock) {
  if (!next) return GAP_SECTION; // the end of the page
  if (next.type === "text" && next.label) return GAP_SECTION; // a new section
  return GAP_TEXT_MEDIA; // text and pictures (or pictures and pictures) within a section
}

// This would normally fetch from a CMS or MDX files
// For now it shows a structured template per project
export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <LightboxProvider>
      <CaseStudyContent params={params} />
    </LightboxProvider>
  );
}

// Click any picture or video in the case study and it pops out over the page, life-size; click the dimmed
// background (or press Escape) to close it again. Split out from the page so it can call useLightbox(), which
// only works inside the LightboxProvider above.
function CaseStudyContent({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  const openLightbox = useLightbox();

  if (!project) notFound();

  return (
    <div className="w-full px-4 py-10 md:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={project.liveUrl ? "mb-4 md:mb-6" : GAP_TEXT_MEDIA}
      >
        <h1 className="text-2xl font-serif font-medium text-text-primary leading-snug">
          {project.title}
        </h1>
      </motion.div>

      {/* Live site link */}
      {project.liveUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={GAP_TEXT_MEDIA}
        >
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-none bg-slate-950 px-2 py-1 text-base text-slate-50 transition-colors hover:bg-slate-800"
          >
            View our live website
          </a>
        </motion.div>
      )}

      {/* Hero image (placeholder until the project has one) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={
          project.hero
            ? `relative ${GAP_TEXT_MEDIA} w-full bg-surface-200`
            : `relative w-full aspect-video bg-surface-200 ${GAP_TEXT_MEDIA} flex items-center justify-center overflow-hidden`
        }
        style={
          project.hero
            ? { aspectRatio: project.heroRatio ?? project.thumbnailRatio ?? 16 / 9 }
            : undefined
        }
      >
        {project.heroVideo ? (
          <video
            src={project.heroVideo.src}
            aria-label={project.title}
            autoPlay
            loop
            muted
            playsInline
            onClick={() => openLightbox({ type: "video", src: project.heroVideo!.src, alt: project.title })}
            className="absolute block cursor-zoom-in"
            style={{
              left: `${project.heroVideo.box.x}%`,
              top: `${project.heroVideo.box.y}%`,
              width: `${project.heroVideo.box.w}%`,
              height: `${project.heroVideo.box.h}%`,
            }}
          />
        ) : project.hero ? (
          <Image
            src={project.hero}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            onClick={() => openLightbox({ type: "image", src: project.hero!, alt: project.title })}
            className="object-contain cursor-zoom-in"
          />
        ) : (
          <p className="text-xs text-text-muted">Add your hero image here</p>
        )}
      </motion.div>

      {/* Case study sections */}
      {(project.caseStudy ?? fallbackCaseStudy).map((block, i, blocks) => {
        const gap = gapAfter(block, blocks[i + 1]);
        return block.type === "image" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`w-full aspect-video bg-surface-200 ${gap} flex items-center justify-center`}
          >
            <p className="text-xs text-text-muted">{block.caption}</p>
          </motion.div>
        ) : block.type === "mentalModels" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`${gap} w-full`}
          >
            <MentalModels
              video={block.video}
              videoRatio={block.videoRatio}
              references={block.references}
            />
          </motion.div>
        ) : block.type === "photoGallery" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`mx-auto ${gap} w-full max-w-prose`}
          >
            <PhotoGallery items={block.items} />
          </motion.div>
        ) : block.type === "closing" ? (
          // The column width is set on a wrapper: max-w-prose is measured in characters, so on the big
          // text itself it would come out wider than the page.
          <div key={i} className={`mx-auto ${gap} w-full max-w-prose`}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="text-2xl font-serif font-medium leading-snug text-text-primary"
            >
              {block.text}
            </motion.p>
          </div>
        ) : block.type === "imageFrame" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`mx-auto ${gap} w-full max-w-prose`}
          >
            <ImageFrame src={block.src} alt={block.alt} width={block.width} height={block.height} />
          </motion.div>
        ) : block.type === "cards" ? (
          // The cards animate themselves when scrolled into view, so this wrapper stays still.
          <div key={i} className={`mx-auto ${gap} w-full max-w-prose`}>
            <CardRow items={block.items} />
          </div>
        ) : block.type === "video" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={block.width === "prose" ? `mx-auto ${gap} w-full max-w-prose` : `${gap} w-full`}
          >
            <VideoFrame src={block.src} alt={block.alt} ratio={block.ratio} tightY={block.tightY} />
          </motion.div>
        ) : block.type === "mediaRow" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={block.width === "prose" ? `mx-auto ${gap} w-full max-w-prose` : `${gap} w-full`}
          >
            <MediaRow items={block.items} stacked={block.stacked} tightY={block.tightY} />
          </motion.div>
        ) : block.type === "beforeAfter" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`mx-auto ${gap} max-w-prose w-full`}
          >
            <BeforeAfterSwitcher
              beforeImage={block.beforeImage}
              afterImage={block.afterImage}
              beforeVideo={block.beforeVideo}
              afterVideo={block.afterVideo}
              beforeLabel={block.beforeLabel}
              afterLabel={block.afterLabel}
              caption={block.caption}
              beforeRatio={block.beforeRatio}
              beforeNotes={block.beforeNotes}
              beforeNotesPosition={block.beforeNotesPosition}
              afterRatio={block.afterRatio}
            />
          </motion.div>
        ) : (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            className={`mx-auto max-w-prose ${gap}`}
          >
            {block.label && (
              <p className="text-xs font-sans text-text-muted uppercase tracking-wider mb-4">
                {block.label}
              </p>
            )}
            {block.heading && (
              <h3
                className={`text-xl font-medium leading-snug text-text-primary ${
                  block.content ? "mb-3" : ""
                }`}
              >
                {block.heading}
              </h3>
            )}
            {(Array.isArray(block.content) ? block.content : block.content ? [block.content] : []).map((paragraph, j) => {
              // A short line that is bold from start to end, with no full stop, is a sub-heading for the paragraph
              // after it. (A bold sentence that ends in a full stop is just a bold paragraph.)
              const subheading = (t: string) => /^\*\*[^*]+\*\*$/.test(t) && !/[.!?]\*\*$/.test(t);
              const isSubheading = subheading(paragraph);
              const heading = paragraph.slice(2, -2);
              return isSubheading ? (
                <h4 key={j} className={`text-base font-medium text-text-primary ${j > 0 ? "mt-3" : ""}`}>
                  {/\d/.test(heading) ? <CountUpNumber text={heading} /> : heading}
                </h4>
              ) : (
                <p
                  key={j}
                  className={`text-base text-text-secondary ${project.caseStudy ? "" : "italic"} ${j > 0 ? "mt-3" : ""}`}
                >
                  {paragraph.split("**").map((part, k) =>
                    k % 2 === 1 ? (
                      <strong key={k} className="font-semibold dark:text-text-primary">
                        {/\d/.test(part) ? <CountUpNumber text={part} /> : part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </motion.section>
        );
      })}
    </div>
  );
}
