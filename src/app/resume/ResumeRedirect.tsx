"use client";

import { useEffect } from "react";

// A short pause so the analytics script can record this visit before the browser leaves the page.
const DELAY_MS = 500;

/** Sends the visitor on to the resume. If scripts are blocked, the link on the page still works. */
export function ResumeRedirect({ href }: { href: string }) {
  useEffect(() => {
    const id = window.setTimeout(() => window.location.replace(href), DELAY_MS);
    return () => window.clearTimeout(id);
  }, [href]);

  return (
    <div className="px-6 py-12 lg:px-12">
      <p className="text-base text-text-secondary">
        Opening my resume…{" "}
        <a href={href} className="text-text-primary underline underline-offset-4">
          Open it here
        </a>{" "}
        if nothing happens.
      </p>
    </div>
  );
}
