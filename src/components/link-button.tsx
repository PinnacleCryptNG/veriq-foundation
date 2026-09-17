import type { ComponentProps } from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "href"> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

export function LinkButton({
  className,
  variant,
  size,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
