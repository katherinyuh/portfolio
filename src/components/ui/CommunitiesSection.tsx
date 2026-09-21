"use client";

import { PinnedBoard } from "@/components/ui/board/PinnedBoard";

/** "My work-life balance": a heading and a pinboard of the things I love (see PinnedBoard). */
export default function CommunitiesSection() {
  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-text-primary mb-2">
        My work-life balance 😎
      </h2>
      <p className="text-base font-sans text-text-muted mb-5 md:mb-8">Here are things I love</p>

      <PinnedBoard />
    </div>
  );
}
