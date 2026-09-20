import type { Metadata } from "next";
import { resumeUrl } from "@/lib/data";
import { ResumeRedirect } from "./ResumeRedirect";

export const metadata: Metadata = {
  title: "Resume",
  robots: { index: false }, // the resume itself is what should be found, not this hop
};

// The sidebar links here, not straight to Google Drive, so every visit to /resume shows up in the site's analytics.
export default function ResumePage() {
  return <ResumeRedirect href={resumeUrl} />;
}
