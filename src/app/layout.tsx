import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { ViewProvider } from "@/components/layout/ViewContext";
import { IntroScreen } from "@/components/ui/IntroScreen";
import { CursorCircle } from "@/components/ui/CursorCircle";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.bio,
};

// Lets the browser match its own UI (scrollbars, mobile address bar) to the visitor's theme.
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F4F5" },
    { media: "(prefers-color-scheme: dark)", color: "#08090A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <IntroScreen />
        <CursorCircle />
        <ViewProvider>
            {/* The page sits over the footer and has a screen's height of room under it; `clip-path` also trims the fixed
              sidebar to the page, so the footer is uncovered on the left too as the page slides up. */}
            <div className="relative z-10 mb-[100vh] min-h-screen bg-slate-50 [clip-path:inset(0)]">
            <Sidebar />
            <div className="lg:ml-80">
              <TopBar />
              <main className="min-h-[calc(100vh-3rem)]">{children}</main>
            </div>
          </div>
          <Footer />
        </ViewProvider>
        <Analytics />
      </body>
    </html>
  );
}
