"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-[250px] flex flex-col gap-2 bg-slate-50 border-r border-slate-100 z-50 pl-16 pr-[49px] pt-[80px] pb-6">
      {/* Identity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-medium text-text-primary">{siteConfig.name}</p>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
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
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
