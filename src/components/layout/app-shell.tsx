import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full bg-background">
      <Sidebar />
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
