"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks, siteConfig, socials } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] flex flex-col bg-surface-100 border-r border-surface-300 z-50 px-4 py-6">
      {/* Identity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="w-9 h-9 rounded-full bg-accent-muted border border-accent/30 flex items-center justify-center mb-3">
          <span className="text-xs font-medium text-accent">KL</span>
        </div>
        <p className="text-sm font-medium text-text-primary">{siteConfig.name}</p>
        <p className="text-xs text-text-muted mt-0.5">{siteConfig.role}</p>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {navLinks.map((link, i) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={cn("nav-link", isActive && "active")}
              >
                <span className="text-text-muted group-hover:text-text-secondary text-xs uppercase tracking-widest w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
                {link.external && (
                  <span className="ml-auto text-text-muted text-xs">↗</span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Status indicator */}
      <div className="mt-6 mb-4 px-3 py-2 rounded-lg bg-surface-200 border border-surface-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-text-secondary">Open to opportunities</span>
        </div>
      </div>

      {/* Socials */}
      <div className="flex gap-3 px-1">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-150"
          >
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
