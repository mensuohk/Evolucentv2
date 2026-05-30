"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/feed", label: "Feed" },
  { href: "/poll", label: "Poll" },
  { href: "/impact", label: "Impact" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ledger", label: "Ledger" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden h-full items-center gap-6 md:flex"
      aria-label="Primary"
    >
      {nav.map((item) => {
        const isProjectRoute = item.href === "/projects" && pathname.startsWith("/project/");
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/") || isProjectRoute;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex h-full items-center text-sm font-medium transition-colors hover:text-foreground",
              isActive
                ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:content-['']"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
