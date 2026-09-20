import Image from "next/image";

/** A single image in the beige media frame, at the full width of the frame. */
export default function ImageFrame({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="bg-surface-200 p-6 rounded-none">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="block h-auto w-full"
      />
    </div>
  );
}
