import type { PollProposal } from "@/lib/poll-proposals";
import { Award, TrendingUp } from "lucide-react";

const RANK_STYLES = [
  {
    bg: "bg-gradient-to-br from-gold-light via-gold to-gold-dark",
    color: "text-evolucent-black font-extrabold shadow-[0_2px_8px_rgba(245,166,35,0.3)]",
  },
  {
    bg: "bg-gradient-to-br from-white via-zinc-200 to-zinc-400",
    color: "text-zinc-900 font-bold border border-zinc-300/40",
  },
  {
    bg: "bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600",
    color: "text-amber-950 font-bold",
  },
] as const;

export function PollLeaderboard({ proposals }: { proposals: PollProposal[] }) {
  const sorted = [...proposals]
    .sort((a, b) => b.yesVotes - a.yesVotes)
    .slice(0, 3);

  return (
    <div className="rounded-2xl border border-evolucent-sand bg-white p-6 shadow-evolucent-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <Award className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-extrabold tracking-tight text-evolucent-black">
            Consensus Leaderboard
          </h2>
          <p className="text-xs text-muted-foreground">
            Top 3 proposals backed by citizens this cycle
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sorted.map((p, i) => {
          const pct = Math.round((p.yesVotes / p.totalVotes) * 100);
          const rank = RANK_STYLES[i] ?? RANK_STYLES[2];
          return (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between rounded-xl border border-evolucent-sand/60 bg-white p-5 transition-all duration-300 hover:shadow-evolucent-elevated hover:border-evolucent-border-strong/35"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm ${rank.bg} ${rank.color}`}
                >
                  {i + 1}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-mono text-base font-extrabold ${
                      i === 0 ? "text-gold-dark" : "text-civic-green-dark"
                    }`}
                  >
                    {pct}%
                  </span>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                    YES
                  </p>
                </div>
              </div>

              <div className="my-4">
                <p className="text-sm font-bold leading-snug text-evolucent-black group-hover:text-primary transition-colors duration-150 line-clamp-2">
                  {p.title}
                </p>
                <p className="mt-1.5 font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                  {p.region} · {p.category}
                </p>
              </div>

              <div className="space-y-1.5 mt-auto">
                <div className="h-1.5 overflow-hidden rounded-full bg-evolucent-sand/70">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      i === 0
                        ? "bg-gradient-to-r from-gold to-gold-dark shadow-[0_0_8px_rgba(245,166,35,0.4)]"
                        : "bg-civic-green"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                    <TrendingUp className="size-3 text-civic-green" />
                    {p.yesVotes.toLocaleString()} YES
                  </span>
                  <span>{p.totalVotes.toLocaleString()} total</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
