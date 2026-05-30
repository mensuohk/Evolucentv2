import { prisma } from "@/src/db";
import { ProjectsListing } from "@/components/ProjectsListing";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [activeCount, fundedCount, regionRows, contributorCount, dbProjects] =
    await Promise.all([
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "FUNDED" } }),
      prisma.project.findMany({
        select: { region: true },
        distinct: ["region"],
      }),
      prisma.contribution.count({ where: { status: "SUCCESS" } }),
      prisma.project.findMany({
        select: { id: true, currentAmount: true },
      }),
    ]).catch(() => [0, 0, [], 0, []] as const);

  const progressMap: Record<string, number> = {};
  dbProjects.forEach((p) => {
    progressMap[p.id] = p.currentAmount;
  });

  const stats = [
    { label: "Active Projects", value: activeCount.toString() },
    { label: "Completed", value: fundedCount.toString() },
    {
      label: "Regions Covered",
      value: `${(regionRows as { region: string }[]).length}/16`,
    },
    {
      label: "Total Contributors",
      value: (contributorCount as number).toLocaleString("en-GH"),
    },
  ] as const;

  return (
    <main className="min-h-screen bg-evolucent-off-white dark:bg-background">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            All Projects
          </p>
          <h1 className="mb-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
            Every pesewa.
            <br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">Every project. Public.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Browse all active, pending, and completed civic projects across
            Ghana&apos;s 16 regions.
          </p>
        </div>
      </section>

      <div className="bg-primary py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="font-display text-[22px] font-extrabold text-evolucent-black">
                {stat.value}
              </span>
              <span className="font-sans text-[13px] text-[#4A3800] dark:text-primary-foreground/90">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <ProjectsListing progressMap={progressMap} />
      </div>
    </main>
  );
}
