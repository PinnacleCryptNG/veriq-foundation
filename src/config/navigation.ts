export const navigation = [
  { href: "/", label: "Overview" },
  { href: "/opportunities", label: "Opportunities" },
] as const;

export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
