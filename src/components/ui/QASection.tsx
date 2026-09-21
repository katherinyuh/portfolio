"use client";

import { useState } from "react";

export interface QAItem {
  question: string;
  /** Paragraphs of the answer. **Double asterisks** make a lead-in bold. */
  answer: string[];
}

// Chevrons exactly as supplied (chevron-up-r.svg, chevron-down-r.svg): 24px, filled. Down when a
// row is closed, up when it is open.
const CHEVRON_UP = "M12 6.93936L3.93933 15L4.99999 16.0607L12 9.06068L19 16.0607L20.0606 15L12 6.93936Z";
const CHEVRON_DOWN = "M12 14.9394L4.99999 7.93935L3.93933 9.00002L12 17.0607L20.0606 9.00002L19 7.93935L12 14.9394Z";

function Answer({ text }: { text: string }) {
  return (
    <p className="text-base font-sans leading-relaxed text-text-secondary">
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-text-primary">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

/** Questions that open to show the answer. Each one opens and closes on its own. */
export default function QASection({ items }: { items: QAItem[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <div>
      <h2 className="mb-4 text-xl font-serif font-medium text-text-primary">Q&amp;A</h2>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = !!open[i];
          return (
            <div key={item.question} className="bg-card rounded-none">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                aria-expanded={isOpen}
                aria-controls={`qa-answer-${i}`}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-base font-sans text-text-muted transition-colors hover:text-text-primary"
              >
                <span>{item.question}</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
                  <path
                    d={isOpen ? CHEVRON_UP : CHEVRON_DOWN}
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div
                id={`qa-answer-${i}`}
                role="region"
                className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-3 px-4 pb-4 pt-1">
                    {item.answer.map((paragraph) => (
                      <Answer key={paragraph} text={paragraph} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
