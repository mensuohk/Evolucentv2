"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CivicProject, ProjectUrgency } from "@/lib/projects-data";
import { formatRegion } from "@/lib/format";
import { cn } from "@/lib/utils";

function urgencyBadge(u: ProjectUrgency) {
  switch (u) {
    case "critical":
      return (
        <Badge className="rounded-full border-0 bg-red-600 text-white text-[10px] font-bold shadow-sm">
          Critical
        </Badge>
      );
    case "high":
      return (
        <Badge className="rounded-full border-0 bg-gold-light font-bold text-gold-dark text-[10px]">
          High Priority
        </Badge>
      );
    case "funded":
      return (
        <Badge className="rounded-full border-0 bg-civic-green text-white text-[10px] font-bold">
          ✓ Complete
        </Badge>
      );
    default:
      return (
        <Badge className="rounded-full border-0 bg-blue-50 text-blue-600 text-[10px] font-bold">
          Active
        </Badge>
      );
  }
}

type ProjectsGridProps = {
  projects: CivicProject[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function ProjectsGrid({
  projects,
  page,
  pageSize,
  onPageChange,
}: ProjectsGridProps) {
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = projects.slice(start, start + pageSize);

  if (projects.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card py-16 text-center text-muted-foreground">
        No projects match these filters. Try adjusting category or region.
      </p>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((p) => {
          const pct = Math.min(100, Math.round((p.raised / p.target) * 100));
          const progressColor =
            p.urgency === "critical"
              ? "bg-red-500"
              : p.urgency === "funded"
                ? "bg-civic-green"
                : "bg-civic-green";

          return (
            <Link
              key={p.id}
              href={`/project/${p.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Urgency badge on image */}
                <div className="absolute left-3 top-3">
                  {urgencyBadge(p.urgency)}
                </div>

                {/* Region badge on image */}
                <div className="absolute right-3 top-3">
                  <Badge className="rounded-full border-0 bg-white/90 text-[10px] font-bold text-evolucent-black backdrop-blur-sm">
                    {formatRegion(p.region)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {p.category}
                  </span>
                  <Badge
                    variant="outline"
                    className="h-4 rounded-full border-none bg-civic-green-light px-1.5 py-0 text-[9px] text-civic-green-dark"
                  >
                    <CheckCircle2 className="mr-0.5 size-2.5" /> Verified
                  </Badge>
                </div>

                <h3 className="mb-2 font-display text-lg font-bold leading-snug text-evolucent-black">
                  {p.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {p.blurb}
                </p>

                {/* Progress */}
                <div>
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        progressColor
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="font-bold text-foreground">
                      GH₵ {p.raised.toLocaleString("en-GH")}
                    </span>
                    <span>
                      {p.supporters.toLocaleString("en-GH")} supporters · {pct}
                      %
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center text-sm font-semibold text-primary transition-colors group-hover:text-gold-dark">
                  {p.urgency === "funded" ? "View impact" : "Contribute now"}
                  <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              type="button"
              variant={n === safePage ? "default" : "outline"}
              size="sm"
              className={cn(
                "min-w-10",
                n === safePage && "bg-primary text-primary-foreground"
              )}
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
