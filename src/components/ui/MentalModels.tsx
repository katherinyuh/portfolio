import Image from "next/image";

/** "Familiar mental models": the finished design in motion (the video) beside the tools it drew on. */
export default function MentalModels({
  video,
  videoRatio = 16 / 9,
  reference,
}: {
  video?: string;
  videoRatio?: number;
  reference?: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <div className="w-full">
      {/* The design and the tools it drew on, side by side in one container */}
      {(video || reference) && (
        <div className="bg-surface-200 p-6 rounded-none sm:p-10">
          {/* Side by side, the two columns are sized in proportion to their shapes, so both come out the same height. */}
          <div
            className="grid grid-cols-1 items-start gap-8 sm:gap-10 sm:[grid-template-columns:var(--cols)]"
            style={{ ["--cols" as string]: `${videoRatio}fr ${reference ? reference.width / reference.height : 0}fr` }}
          >
            {video && (
              <figure className="w-full min-w-0">
                <video
                  src={video}
                  aria-label="The Clubly events page: switching between Published and Drafts, with Edit, Registration and Delete on each card"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block w-full"
                  style={{ aspectRatio: videoRatio }}
                />
              </figure>
            )}
            {reference && (
              <figure className="w-full min-w-0 max-sm:mx-auto max-sm:max-w-[280px]">
                <Image
                  src={reference.src}
                  alt={reference.alt}
                  width={reference.width}
                  height={reference.height}
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="block h-auto w-full"
                />
              </figure>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
