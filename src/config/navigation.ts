export const navigation = [
  { href: "/", label: "Overview", description: "Product overview & live demo" },
  { href: "/opportunities", label: "Deals & Opportunities", description: "Review queue & seeded deals" },
  { href: "/prestocks", label: "PreStocks Catalog", description: "Optional benchmark price check" },
] as const;

export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
