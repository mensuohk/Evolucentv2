"use client";

import { signIn, useSession } from "next-auth/react";
import { CheckCircle, Flame, Clock } from "lucide-react";
import type { PollProposal } from "@/lib/poll-proposals";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Health: "bg-red-50 text-red-800 border border-red-200/50 dark:bg-red-950/20 dark:text-red-300",
  Water: "bg-civic-green-light text-civic-green-dark border border-civic-green/30 dark:bg-civic-green/10 dark:text-civic-green-light",
  Roads: "bg-evolucent-sand/60 text-amber-950 border border-evolucent-border/30 dark:bg-zinc-800/40 dark:text-zinc-300",
  Education: "bg-sky-50 text-sky-900 border border-sky-200/30 dark:bg-sky-950/20 dark:text-sky-300",
  Energy: "bg-amber-50 text-amber-950 border border-amber-200/30 dark:bg-amber-950/10 dark:text-amber-300",
  Infrastructure: "bg-evolucent-off-white text-muted-foreground border border-evolucent-sand/30 dark:bg-zinc-800/30 dark:text-zinc-400",
};

type Props = {
  proposal: PollProposal;
  userVote: "yes" | "no" | null;
  onVote: (choice: "yes" | "no") => void;
};

export function PollCard({ proposal, userVote, onVote }: Props) {
  const { data: session, status } = useSession();
  const voted = userVote !== null;

  const displayTotal = voted
    ? proposal.totalVotes + 1
    : proposal.totalVotes;
  const displayYes = voted && userVote === "yes"
    ? proposal.yesVotes + 1
    : proposal.yesVotes;
  const yesPct = Math.round((displayYes / displayTotal) * 100);
  const noPct = 100 - yesPct;

  const catStyle =
    CATEGORY_COLORS[proposal.category] ?? 
    "bg-evolucent-sand/50 text-muted-foreground border border-evolucent-sand";

  const urgencyColor =
    proposal.urgency >= 85
      ? "text-red-500 font-bold"
      : proposal.urgency >= 65
        ? "text-gold-dark font-bold"
        : "text-civic-green-dark font-semibold";

  const urgencyBar =
    proposal.urgency >= 85
      ? "bg-gradient-to-r from-red-500 to-rose-600"
      : proposal.urgency >= 65
        ? "bg-gradient-to-r from-gold to-gold-dark"
        : "bg-gradient-to-r from-civic-green to-teal-500";

  const tryVote = (choice: "yes" | "no") => {
    if (status === "loading") return;
    if (!session) {
      void signIn("google", { callbackUrl: "/poll" });
      return;
    }
    onVote(choice);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border-[1.5px] border-evolucent-sand bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-card",
        voted && userVote === "yes" && "ring-[1.5px] ring-civic-green/40"
      )}
    >
      {/* Native-style status band matching ImpactProjectCard */}
      {voted && (
        <div
          className={cn(
            "flex items-center justify-between border-b px-6 py-2.5 -mx-6 -mt-6 mb-4 text-[10px] font-bold uppercase tracking-widest",
            userVote === "yes"
              ? "bg-civic-green-light border-b-civic-green/30 text-civic-green-dark"
              : "bg-zinc-100 border-b-zinc-200 text-zinc-600"
          )}
        >
          <span>{userVote === "yes" ? "✓ Backed Proposal" : "✗ Passed Proposal"}</span>
          <span>Priority consensus registered</span>
        </div>
      )}

      {/* Top Metadata Tags */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
            catStyle
          )}
        >
          {proposal.category}
        </span>
        <span className="rounded-full border border-evolucent-sand bg-evolucent-off-white/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
          {proposal.region}
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground font-semibold">
          <Clock className="size-3 text-muted-foreground" />
          {proposal.daysLeft}d left
        </span>
      </div>

      <h3 className="mb-2 font-display text-lg font-extrabold leading-snug tracking-tight text-evolucent-black">
        {proposal.title}
      </h3>

      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {proposal.description}
      </p>

      {/* Urgency Section */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Flame className={cn("size-3.5", proposal.urgency >= 85 ? "text-red-500 animate-pulse" : "text-gold")} />
            Urgency Priority
          </span>
          <span className={cn("font-mono", urgencyColor)}>
            {proposal.urgency}/100
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-evolucent-sand/60">
          <div
            className={cn("h-full rounded-full transition-all duration-500", urgencyBar)}
            style={{ width: `${proposal.urgency}%` }}
          />
        </div>
      </div>

      {voted && (
        <div className="mb-5 space-y-4 animate-slide-in-feed">
          {/* Native-style Stat Strip matching ImpactProjectCard */}
          <div className="grid grid-cols-3 gap-4 border-y border-evolucent-sand py-3 text-center my-4 bg-evolucent-off-white/30">
            <div>
              <p className="font-mono text-sm font-bold text-evolucent-black">
                {displayTotal.toLocaleString()}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Voters</p>
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-evolucent-black truncate max-w-full px-1">
                {proposal.region}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Region</p>
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-civic-green-dark">
                {displayYes.toLocaleString()}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Backed It</p>
            </div>
          </div>

          {/* Consensus breakdown */}
          <div className="rounded-xl bg-evolucent-off-white/80 p-4 border border-evolucent-sand/40">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Priority breakdown
              </span>
              <span className="font-mono text-xs font-bold text-evolucent-black">
                {yesPct}% backing
              </span>
            </div>

            <div className="mb-2.5 flex h-2 overflow-hidden rounded-full bg-evolucent-sand">
              <div
                className="bg-gradient-to-r from-civic-green to-teal-500 transition-all duration-500 rounded-l-full"
                style={{ width: `${yesPct}%` }}
              />
              <div
                className="bg-zinc-300 transition-all duration-500 rounded-r-full"
                style={{ width: `${noPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-civic-green-dark">
                ✓ {yesPct}% Backed ({displayYes.toLocaleString()})
              </span>
              <span className="text-zinc-600">
                ✗ {noPct}% Passed ({(displayTotal - displayYes).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Priority update block matching Real Impact */}
          <div className="rounded-lg border border-evolucent-sand border-l-[3px] border-l-civic-green bg-evolucent-off-white px-4 py-3 text-sm">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-civic-green-dark">
              Proposal Priority Escalated
            </p>
            <p className="m-0 text-xs leading-normal text-muted-foreground">
              Thank you. Highly ranked proposals are audited and pushed to standard escrow funding queues automatically.
            </p>
          </div>
        </div>
      )}

      {!session && status !== "loading" && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          Sign in with Google to cast your vote — one vote per project.
        </p>
      )}

      {!voted ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => tryVote("yes")}
            disabled={status === "loading"}
            className="w-full cursor-pointer rounded-xl bg-civic-green py-3.5 text-sm font-bold tracking-tight text-white shadow-sm transition-all duration-200 hover:bg-civic-green-dark active:scale-[0.97] hover:shadow-evolucent-card disabled:opacity-50"
          >
            ✓ YES — Prioritise
          </button>
          <button
            type="button"
            onClick={() => tryVote("no")}
            disabled={status === "loading"}
            className="w-full cursor-pointer rounded-xl border border-evolucent-border bg-white py-3.5 text-sm font-bold tracking-tight text-muted-foreground transition-all duration-200 hover:border-evolucent-border-strong hover:text-foreground active:scale-[0.97] disabled:opacity-50"
          >
            ✗ Pass / Not Now
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold border",
            userVote === "yes"
              ? "bg-civic-green/10 border-civic-green/20 text-civic-green-dark"
              : "bg-zinc-100 border-zinc-200 text-zinc-600"
          )}
        >
          <CheckCircle className="size-4" />
          {userVote === "yes"
            ? "Proposal Backed Successfully"
            : "Proposal Passed Successfully"}
        </div>
      )}
    </div>
  );
}
