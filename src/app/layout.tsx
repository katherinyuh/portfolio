import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.bio,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-[240px] flex-1 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
