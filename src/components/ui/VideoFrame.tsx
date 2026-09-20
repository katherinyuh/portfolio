/** A single looping video in the beige media frame, at the full width of the frame. */
export default function VideoFrame({ src, alt, ratio }: { src: string; alt: string; ratio: number }) {
  return (
    <div className="bg-surface-200 p-6 rounded-none sm:p-10">
      <video
        src={src}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        className="block w-full"
        style={{ aspectRatio: ratio }}
      />
    </div>
  );
}
