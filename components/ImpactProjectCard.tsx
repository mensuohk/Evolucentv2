"use client";

import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { CompletedImpactProject } from "@/lib/impact-projects";

export function ImpactProjectCard({
  project,
}: {
  project: CompletedImpactProject;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border-[1.5px] border-evolucent-sand bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-civic-green/30 bg-civic-green-light px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-civic-green-dark">
            ✓ Verified Complete
          </span>
          <span className="text-xs text-muted-foreground">
            · Audited by {project.auditor} · {project.completedDate}
          </span>
        </div>
        <span className="rounded-full border border-evolucent-sand bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {project.region}
        </span>
      </div>

      <BeforeAfterSlider
        beforeSrc={project.beforeImage}
        afterSrc={project.afterImage}
        beforeAlt={`Before: ${project.title}`}
        afterAlt={`After: ${project.title}`}
      />

      <div className="p-6">
        <h3 className="mb-2.5 font-display text-[22px] font-extrabold tracking-tight text-evolucent-black">
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mb-5 rounded-lg border border-evolucent-sand border-l-[3px] border-l-civic-green bg-evolucent-off-white px-4 py-3">
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-civic-green-dark">
            Real impact
          </p>
          <p className="m-0 text-sm leading-snug text-evolucent-black">
            {project.impact}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-4 border-y border-evolucent-sand py-4">
          {(
            [
              {
                label: "Total raised",
                value: `GHS ${project.amountRaised.toLocaleString()}`,
                color: undefined as string | undefined,
              },
              {
                label: "Supporters",
                value: project.supporters.toLocaleString(),
                color: undefined,
              },
              {
                label: "Funded",
                value: "100%",
                color: "text-civic-green",
              },
            ] as const
          ).map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={`mb-0.5 font-mono text-base font-bold ${stat.color ?? "text-evolucent-black"}`}
              >
                {stat.value}
              </p>
              <p className="m-0 text-[11px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <a
          href={`/project/${project.id}/report`}
          className="inline-flex items-center gap-1.5 border-b-[1.5px] border-civic-green pb-px text-[13px] font-semibold text-civic-green no-underline"
        >
          View full audit report →
        </a>
      </div>
    </div>
  );
}
