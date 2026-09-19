"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useView, views } from "@/components/layout/ViewContext";

function Breadcrumb() {
  const pathname = usePathname();
  const crumb = "text-text-muted transition-colors hover:text-text-primary";

  if (pathname === "/about") return <span className="text-text-primary">About</span>;

  if (pathname.startsWith("/work/")) {
    const project = projects.find((p) => p.slug === pathname.split("/")[2]);
    return (
      <>
        <Link href="/" className={crumb}>
          Work
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-text-primary">{project?.company ?? "Case study"}</span>
      </>
    );
  }

  return <span className="text-text-primary">Work</span>;
}

export function TopBar() {
  const pathname = usePathname();
  const { view, setView } = useView();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-6 text-sm lg:px-12">
      <nav className="flex items-center gap-2" aria-label="Breadcrumb">
        <Breadcrumb />
      </nav>

      {/* View switcher — only on the projects page */}
      {pathname === "/" && (
        <div className="flex items-center gap-1" role="group" aria-label="Project view">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "rounded-none px-2.5 py-1 text-xs transition-colors",
                view === v
                  ? "bg-slate-200 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
