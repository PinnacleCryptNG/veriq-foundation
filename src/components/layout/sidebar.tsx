import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="size-2 rounded-sm bg-primary"
      />
      <span className="text-[13px] font-semibold tracking-[0.22em] text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-14 items-center px-4">
        <Wordmark />
      </div>
      <div className="flex flex-1 flex-col px-3 py-3">
        <p className="mb-2 px-2.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        <SidebarNav />
      </div>
      <p className="border-t border-sidebar-border px-4 py-3 text-[11px] leading-4 text-muted-foreground">
        Analyst workspace. Review has not run on any record.
      </p>
    </aside>
  );
}
