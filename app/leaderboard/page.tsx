import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trophy, Map } from "lucide-react";
import {
  getNationalContributors,
  getRegionsByGiving,
  type ContributorRow,
} from "@/lib/leaderboard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Leaderboards | Evolucent",
  description:
    "Top civic contributors nationwide and by region — plus which regions receive the most support.",
};

export const dynamic = "force-dynamic";

function contributorLabel(row: ContributorRow) {
  if (row.name?.trim()) return row.name.trim();
  if (row.email?.trim()) return row.email.split("@")[0] ?? row.email;
  return "Citizen";
}

function RankBadge({ rank }: { rank: number }) {
  const gold = rank === 1;
  const silver = rank === 2;
  const bronze = rank === 3;

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold shadow-sm",
        gold && "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-evolucent-black shadow-[0_2px_10px_rgba(245,166,35,0.4)]",
        silver && "bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 text-gray-900 border border-gray-400/30",
        bronze && "bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 text-amber-950",
        !gold && !silver && !bronze && "bg-white text-muted-foreground ring-1 ring-border shadow-none"
      )}
    >
      {rank}
    </div>
  );
}

export default async function LeaderboardPage() {
  const [national, regionGiving] = await Promise.all([
    getNationalContributors(10),
    getRegionsByGiving(16),
  ]);

  const maxRegionGhs =
    regionGiving.length > 0 ? regionGiving[0]!.totalGhs : 1;

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-gold">
            Civic Leaderboards
          </p>
          <h1 className="mb-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight text-evolucent-off-white">
            Who&apos;s building<br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">Ghana together</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            Rankings use total verified contributions on Evolucent. 
            Set your home region in your{" "}
            <Link
              href="/account/profile"
              className="font-semibold text-gold underline-offset-4 hover:underline"
            >
              Profile
            </Link>
            {" "}to represent your local area on the regional boards.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-16">
        
        {/* ─── NATIONWIDE CONTRIBUTORS ─── */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Trophy className="size-5 text-gold" />
                <h2 className="font-display text-2xl font-extrabold text-evolucent-black sm:text-3xl">
                  Nationwide Leaders
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">Top civic contributors across all 16 regions.</p>
            </div>
            <Badge className="hidden sm:inline-flex rounded-full border-none bg-civic-green-light px-3 py-1 font-mono text-xs text-civic-green-dark">
              All Regions
            </Badge>
          </div>

          {national.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
              <p className="text-muted-foreground">No contributions recorded yet. Be the first to back a project!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {national.map((row) => (
                <div
                  key={row.userId}
                  className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated hover:border-evolucent-border-strong/30"
                >
                  <RankBadge rank={row.rank} />
                  
                  <div className="relative">
                    {row.image ? (
                      <Image
                        src={row.image}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                    ) : (
                      <div
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light/40 to-gold/20 font-display text-lg font-bold text-gold-dark shadow-sm border-2 border-white"
                        aria-hidden
                      >
                        {contributorLabel(row).slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold text-evolucent-black text-lg leading-tight">
                      {contributorLabel(row)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">
                      {row.region ? row.region : "Region not set"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-extrabold text-civic-green-dark">
                      GH₵ {row.totalGhs.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {row.contributionCount} donations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>



        {/* ─── REGIONS BY GIVING ─── */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Map className="size-5 text-evolucent-black" />
                <h2 className="font-display text-2xl font-extrabold text-evolucent-black sm:text-3xl">
                  Regions by Civic Giving
                </h2>
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Total GH₵ contributed to projects based in each region — where is the support flowing?
              </p>
            </div>
          </div>

          {regionGiving.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
              <p className="text-muted-foreground">No regional totals yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {regionGiving.map((row) => {
                const pct = Math.round((row.totalGhs / maxRegionGhs) * 100);
                const isTop = row.rank === 1;
                return (
                  <div
                    key={row.region}
                    className="group rounded-2xl border border-black/5 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated hover:border-evolucent-border-strong/30"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RankBadge rank={row.rank} />
                        <span className="font-display text-lg font-bold text-evolucent-black">
                          {row.region}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={cn("font-mono text-lg font-extrabold", isTop ? "text-gold-dark" : "text-civic-green-dark")}>
                          GH₵ {row.totalGhs.toLocaleString()}
                        </span>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                          {row.contributionCount} donations
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-2 overflow-hidden rounded-full bg-evolucent-sand/50">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          isTop ? "bg-gradient-to-r from-gold to-gold-dark" : "bg-civic-green"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
