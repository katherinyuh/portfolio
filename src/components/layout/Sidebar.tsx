"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

// When the site was last built, in the visitor's own time zone with AM or PM. The time zone is only known in the
// browser, so it is filled in after the page loads.
const BUILT_AT = process.env.NEXT_PUBLIC_BUILD_TIME;
const formatLocal = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(iso));

export function Sidebar() {
  const pathname = usePathname();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  useEffect(() => {
    if (BUILT_AT) setLastUpdated(formatLocal(BUILT_AT));
  }, []);

  return (
    <aside className="z-40 flex flex-col border-b border-slate-200 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[320px] lg:border-b-0 lg:border-r">
      {/* Header */}
      <div className="shrink-0 px-6 pt-8 lg:px-8">
        <Link href="/" className="text-base font-medium text-text-primary">
          {siteConfig.name}
        </Link>
      </div>

      <div className="flex flex-col gap-8 px-6 py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-5 text-base text-text-secondary"
        >
          <p>{siteConfig.bio}</p>
          <p>
            Currently a fourth-year at UC Davis studying Cognitive Science, and previously a product design intern at <span className="font-medium text-text-primary">IBM</span> on the Z DevOps team.
            Open to 2027 opportunities.
          </p>
        </motion.div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((link, i) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
              >
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn("nav-link", isActive && "active")}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Pinned to the bottom of the sidebar */}
      {lastUpdated && (
        <p className="mt-auto px-6 pb-8 text-sm text-text-muted lg:px-8">Last updated: {lastUpdated}</p>
      )}
    </aside>
  );
}
