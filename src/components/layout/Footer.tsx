"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navLinks, siteConfig, socials } from "@/lib/data";
import { OrbDrop } from "@/components/ui/OrbDrop";

// How much of the screen the footer takes up (the layout leaves the same amount of room under the page).
const FOOTER_HEIGHT = 1;

/**
 * A footer the full screen tall. It stays put behind the page, and as you reach the bottom the page slides up
 * off it, so it is uncovered rather than scrolled to. (The page is what has the space under it: see the layout.)
 * Each time it is uncovered a crowd of orbs drops in and piles up along the bottom; they move as the mouse does.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [showing, setShowing] = useState(false);

  // How much of the footer has been uncovered: the page's bottom edge has moved up this far.
  useEffect(() => {
    const check = () => {
      const height = window.innerHeight * FOOTER_HEIGHT;
      const uncovered = window.scrollY + window.innerHeight - (document.documentElement.scrollHeight - height);
      setShowing(uncovered > height * 0.35);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // While it is still covered, keep the keyboard and screen readers out of it.
  useEffect(() => {
    if (root.current) (root.current as HTMLElement & { inert: boolean }).inert = !showing;
  }, [showing]);

  const link = "text-surface-50/80 underline-offset-4 transition-colors hover:text-surface-50 hover:underline";
  const label = "mb-3 text-sm text-surface-50/70";
  // The design's two columns: how to reach me, and the pages.
  const contact = socials.filter((s) => s.label === "LinkedIn" || s.label === "Email");

  return (
    <footer ref={root} className="fixed inset-x-0 bottom-0 z-0 h-screen overflow-hidden bg-red text-surface-50">
      {/* The orbs fill the whole footer, with the words over them */}
      <OrbDrop active={showing} />

      <div className="pointer-events-none relative flex flex-col gap-8 px-6 py-8 lg:flex-row lg:justify-between lg:px-8 lg:py-12">
        <div>
          <h2 className="text-3xl font-serif font-medium leading-snug">Thank you for being here!</h2>
          <p className="mt-3 text-base text-surface-50/80">Move your mouse through the orbs.</p>
          <p className="mt-8 text-sm text-surface-50/70">Supposed to be finished months ago by {siteConfig.name}</p>
        </div>

        <div className="flex gap-12 text-base lg:gap-16">
          <div>
            <h3 className={label}>Let's chat!</h3>
            <ul className="flex flex-col gap-2">
              {contact.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`pointer-events-auto ${link}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={label}>Sidebar 2.0</h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={`pointer-events-auto ${link}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`pointer-events-auto inline-flex items-center gap-1 ${link}`}
                >
                  Back to top <span aria-hidden>↑</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
