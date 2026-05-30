"use client";

import { useState } from "react";
import { PollCard } from "@/components/PollCard";
import { PollLeaderboard } from "@/components/PollLeaderboard";
import {
  POLL_CATEGORIES,
  POLL_PROPOSALS,
  type PollProposal,
} from "@/lib/poll-proposals";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse proposals",
    desc: "Read civic problems submitted from all 16 regions",
  },
  {
    step: "02",
    title: "Cast your vote",
    desc: "Vote YES to prioritise or NO to pass — one vote per project",
  },
  {
    step: "03",
    title: "Top projects get funded",
    desc: "Highest-voted proposals rise to the top of the funding queue",
  },
] as const;

export default function PollPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof POLL_CATEGORIES)[number]>("All");
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});

  const handleVote = (id: string, choice: "yes" | "no") => {
    setVotes((prev) => ({ ...prev, [id]: choice }));
  };

  const filtered: PollProposal[] =
    activeCategory === "All"
      ? POLL_PROPOSALS
      : POLL_PROPOSALS.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-evolucent-off-white">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Citizen Voice
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
            Your vote moves
            <br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">the public money.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Citizens decide which projects get funded first. Every vote shapes
            where the next pesewa goes. Real-time priorities powered by transparent consensus.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-gold" />
            </span>
            <span className="font-mono text-sm font-medium tracking-wide text-gold-light">
              14,302 votes cast this month
            </span>
          </div>
        </div>
      </section>

      {/* Floating Glass Steps */}
      <section className="border-y border-evolucent-sand bg-white/60 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-evolucent-sand/50 bg-white p-6 shadow-evolucent-card transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated"
              >
                <span className="mb-3 block font-mono text-[11px] font-bold tracking-widest text-primary/80 uppercase">
                  Step {item.step}
                </span>
                <p className="mb-2 font-display text-lg font-bold text-evolucent-black">
                  {item.title}
                </p>
                <p className="m-0 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Width Dashboard Content */}
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
        {/* Consensus Leaderboard Podium */}
        <section>
          <PollLeaderboard proposals={POLL_PROPOSALS} />
        </section>

        {/* Separator Line */}
        <div className="h-px bg-evolucent-sand/60" role="presentation" />

        {/* Active Proposals Grid Section */}
        <section>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-evolucent-black">
                Active Proposals
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Vote to prioritize upcoming projects in the funding queue.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {POLL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer rounded-full px-4.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-evolucent-card scale-[1.02]"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {filtered.map((proposal) => (
              <PollCard
                key={proposal.id}
                proposal={proposal}
                userVote={votes[proposal.id] ?? null}
                onVote={(choice) => handleVote(proposal.id, choice)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
