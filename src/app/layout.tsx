import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ViewProvider } from "@/components/layout/ViewContext";
import { IntroScreen } from "@/components/ui/IntroScreen";
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
      <body className={`${GeistSans.variable} font-sans`}>
        <IntroScreen />
        <ViewProvider>
          <div className="min-h-screen">
            <Sidebar />
            <div className="lg:ml-[320px]">
              <TopBar />
              <main className="min-h-[calc(100vh-3rem)]">{children}</main>
            </div>
          </div>
        </ViewProvider>
      </body>
    </html>
  );
}
