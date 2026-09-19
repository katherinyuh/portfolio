"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

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
            Interned at <span className="font-medium text-text-primary">IBM</span> designing
            developer tools over the summer. Fourth-year cognitive science student at UC
            Davis.
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
                  className={cn("nav-link", isActive && "active")}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
