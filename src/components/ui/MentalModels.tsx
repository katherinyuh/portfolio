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
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-10">
            {video && (
              <figure className="w-full sm:min-w-0 sm:flex-[1.7]">
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
              <figure className="w-full max-w-[280px] sm:min-w-0 sm:flex-1">
                <Image
                  src={reference.src}
                  alt={reference.alt}
                  width={reference.width}
                  height={reference.height}
                  sizes="(min-width: 640px) 280px, 100vw"
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
