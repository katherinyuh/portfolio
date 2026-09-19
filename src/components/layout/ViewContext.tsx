"use client";

import { createContext, useContext, useState } from "react";

export const views = ["Canvas", "Grid", "List"] as const;
export type View = (typeof views)[number];

const ViewContext = createContext<{ view: View; setView: (v: View) => void } | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("Canvas");
  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>;
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside <ViewProvider>");
  return ctx;
}
