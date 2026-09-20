import Image from "next/image";
import type { MediaRowItem } from "@/lib/data";

/** A row of same-size media (looping videos or images) side by side, all aligned to the top, 24px apart. */
export default function MediaRow({ items }: { items: MediaRowItem[] }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 bg-surface-200 p-6 rounded-none sm:p-10">
      {items.map((item) => {
        const frame = "w-[270px] max-w-full";
        return item.kind === "video" ? (
          <video
            key={item.src}
            src={item.src}
            aria-label={item.alt}
            autoPlay
            loop
            muted
            playsInline
            className={`block ${frame}`}
            style={{ aspectRatio: item.ratio }}
          />
        ) : (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className={`block h-auto ${frame}`}
            style={{ aspectRatio: item.ratio }}
          />
        );
      })}
    </div>
  );
}
