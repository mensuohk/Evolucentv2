import { ImpactProjectCard } from "@/components/ImpactProjectCard";
import { ImpactStatsStrip } from "@/components/ImpactStatsStrip";
import { COMPLETED_IMPACT_PROJECTS } from "@/lib/impact-projects";

const TOTAL_RELEASED = COMPLETED_IMPACT_PROJECTS.reduce(
  (sum, p) => sum + p.amountRaised,
  0,
);
const TOTAL_SUPPORTERS = COMPLETED_IMPACT_PROJECTS.reduce(
  (sum, p) => sum + p.supporters,
  0,
);

export default function ImpactPage() {
  const n = COMPLETED_IMPACT_PROJECTS.length;

  return (
    <main className="min-h-screen">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-civic-green">
            Verified Impact
          </p>
          <h1 className="mb-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
            This is what your
            <br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">money built.</span>
          </h1>
          <p className="mb-7 max-w-xl text-base leading-relaxed text-white/70">
            Every project here is independently verified complete. Before and
            after proof is public. Every pesewa is accounted for.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { value: `${n}`, label: "Projects complete" },
              {
                value: `GHS ${(TOTAL_RELEASED / 1000).toFixed(0)}K`,
                label: "Released & verified",
              },
              {
                value: TOTAL_SUPPORTERS.toLocaleString(),
                label: "Citizens contributed",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2"
              >
                <span className="font-mono text-sm font-bold text-civic-green">
                  {stat.value}
                </span>
                <span className="font-mono text-xs text-white/70 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImpactStatsStrip
        completed={n}
        totalReleased={TOTAL_RELEASED}
        totalSupporters={TOTAL_SUPPORTERS}
      />

      <div className="mx-auto max-w-[1152px] px-6 py-12">
        <div className="mb-8 flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-[26px] font-extrabold tracking-tight text-evolucent-black">
            Completed & verified
          </h2>
          <span className="rounded-full bg-civic-green-light px-2.5 py-0.5 font-mono text-[13px] text-civic-green">
            {n} projects
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {COMPLETED_IMPACT_PROJECTS.map((project) => (
            <ImpactProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-14 rounded-[20px] bg-evolucent-black px-6 py-10 text-center md:px-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
            The Zero Waste Pledge
          </p>
          <h3 className="mb-3 font-display text-[28px] font-extrabold tracking-tight text-evolucent-off-white">
            Every pesewa. Accounted for.
          </h3>
          <p className="mx-auto mb-6 max-w-[520px] text-[15px] leading-relaxed text-[#a8a49c]">
            We publish a full public financial report every month — total in,
            total out, every project, every bank statement. Nothing hidden.
          </p>
          <a
            href="/reports"
            className="inline-block rounded-[10px] bg-gold px-7 py-3 text-sm font-semibold tracking-tight text-evolucent-black no-underline"
          >
            View monthly reports →
          </a>
        </div>
      </div>
    </main>
  );
}
