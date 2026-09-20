import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  width = "5xl",
  className,
}: {
  children: ReactNode;
  width?: "3xl" | "4xl" | "5xl" | "6xl";
  className?: string;
}) {
  const maxWidth = {
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
  }[width];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
        maxWidth,
        className,
      )}
    >
      {children}
    </div>
  );
}
