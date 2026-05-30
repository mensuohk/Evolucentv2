import { Suspense } from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FundingProgress } from "@/components/evolucent/funding-progress";
import { ProjectLanguageReader } from "@/components/ProjectLanguageReader";
import { ProjectContributionPanel } from "@/components/evolucent/project-contribution-panel";
import { AIImpact } from "@/components/ai-impact";
import { WhatsAppShareButton } from "@/components/whatsapp-share-button";
import { getSessionSafe } from "@/lib/auth-session";
import { prisma } from "@/src/db";
import { formatGHS, formatRegion, formatTimestamp } from "@/lib/format";
import { ALL_PROJECTS } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

type VerificationStep = {
  id: string;
  label: string;
  description: string;
  status: "completed" | "active" | "pending";
  date?: string;
  verifier?: string;
};

type LedgerRow = {
  id: string;
  amount: number;
  alias: string;
  region: string;
  at: Date;
  method: "momo" | "bank" | "card";
};

const MOCK_BY_ID: Record<
  string,
  {
    title: string;
    region: string;
    category: string;
    raised: number;
    target: number;
    supporters: number;
    daysLeft: number;
    description: string;
    aiSummary: string;
    urgencyScore: number;
    steps: VerificationStep[];
    ledger: LedgerRow[];
  }
> = {
  "proj-kumasi-solar": {
    title: "Kumasi Central Market solar lighting",
    region: "ashanti region",
    category: "Infrastructure",
    raised: 34_200,
    target: 50_000,
    supporters: 1240,
    daysLeft: 12,
    description:
      "The Kumasi Central Market serves over 20,000 traders daily. This project installs commercial-grade solar streetlights across main arteries. Funds stay in escrow until independent audit clears release.",
    aiSummary:
      "Twi · English: Ɔhaw no yɛ sɛ anadwo hann nni hɔ — solar bɛboa ma aduanan tom. Every pesewa tracked on the public ledger.",
    urgencyScore: 84,
    steps: [
      {
        id: "1",
        label: "Problem identified",
        description: "",
        status: "completed",
        date: "Jan 12, 2026",
      },
      {
        id: "2",
        label: "Community voting",
        description: "",
        status: "completed",
        verifier: "4,230 votes",
      },
      { id: "3", label: "Funding active", description: "", status: "active" },
      {
        id: "4",
        label: "Independent audit",
        description: "",
        status: "pending",
        verifier: "KPMG Ghana (assigned)",
      },
      {
        id: "5",
        label: "Funds released",
        description: "",
        status: "pending",
      },
      { id: "6", label: "Project proof", description: "", status: "pending" },
    ],
    ledger: [],
  },
  default: {
    title: "Civic infrastructure project",
    region: "greater accra",
    category: "Roads",
    raised: 18_400,
    target: 60_000,
    supporters: 890,
    daysLeft: 21,
    description:
      "Citizens chose this. We publish every contribution in real time. Release happens only after independent verification.",
    aiSummary:
      "Nyansa tia: project yi yɛ sɛ ɛbɛboa kuw no — funds wɔ escrow mu.",
    urgencyScore: 72,
    steps: [
      {
        id: "1",
        label: "Problem identified",
        description: "",
        status: "completed",
        date: "Feb 2, 2026",
      },
      {
        id: "2",
        label: "Community voting",
        description: "",
        status: "completed",
        verifier: "2,102 votes",
      },
      { id: "3", label: "Funding active", description: "", status: "active" },
      {
        id: "4",
        label: "Independent audit",
        description: "",
        status: "pending",
      },
      {
        id: "5",
        label: "Funds released",
        description: "",
        status: "pending",
      },
      { id: "6", label: "Project proof", description: "", status: "pending" },
    ],
    ledger: [],
  },
};

function getMockProject(id: string) {
  return MOCK_BY_ID[id] ?? MOCK_BY_ID.default;
}

/** Derive a privacy-safe alias from a full name: "Kofi Asante" → "Kofi A." */
function toAlias(name: string | null): string {
  if (!name) return "Anonymous";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

/** Normalise Paystack/DB method string to the display union. */
function toDisplayMethod(method: string | null): "momo" | "bank" | "card" {
  if (method === "momo") return "momo";
  if (method === "bank") return "bank";
  return "card";
}

/** Skeleton for the AIImpact async server component */
function AIImpactSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-evolucent-off-white p-6 dark:bg-card shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 size-[18px] shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-[85%] animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 size-[18px] shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-[75%] animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 size-[18px] shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-[65%] animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

type PageProps = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const mock = getMockProject(id);
  const session = await getSessionSafe();

  // Fetch live data from DB. Contributions include user region + method for the ledger.
  const dbProject = await prisma.project.findUnique({
    where: { id },
    include: {
      contributions: {
        where: { status: "SUCCESS" },
        include: { user: { select: { name: true, region: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { contributions: { where: { status: "SUCCESS" } } } },
    },
  }).catch(() => null);

  // Prefer live DB values; fall back to mock for projects not yet in DB.
  const raised = dbProject?.currentAmount ?? mock.raised;
  const target = dbProject?.goalAmount ?? mock.target;
  const supporters = dbProject?._count.contributions ?? mock.supporters;

  const ledger: LedgerRow[] =
    dbProject && dbProject.contributions.length > 0
      ? dbProject.contributions.map((c) => ({
          id: c.paymentRef.slice(-6).toUpperCase(),
          amount: c.amount,
          alias: toAlias(c.user.name),
          region: c.user.region ?? "Ghana",
          at: c.createdAt,
          method: toDisplayMethod((c as { method?: string | null }).method ?? null),
        }))
      : mock.ledger;

  const p = {
    ...mock,
    raised,
    target,
    supporters,
    // Use DB description/title if available (more up-to-date)
    title: dbProject?.title ?? mock.title,
    description: dbProject?.description ?? mock.description,
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" className="gap-1 font-semibold" asChild>
            <Link href="/projects">
              <ChevronLeft className="size-4" />
              Back to projects
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <WhatsAppShareButton projectTitle={p.title} />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Bookmark"
            >
              <Bookmark className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-12 lg:gap-10">
        {/* ── Left column ── */}
        <div className="lg:col-span-7">
          {/* Hero image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted shadow-evolucent-card ring-1 ring-border/60">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  ALL_PROJECTS.find((proj) => proj.id === id)?.image ||
                  "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop"
                })`,
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full font-bold">
              {formatRegion(p.region)}
            </Badge>
            <Badge variant="outline" className="rounded-full font-bold">
              {p.category}
            </Badge>
            <Badge className="rounded-full border-0 bg-gold-light font-bold text-gold-dark">
              Urgency {p.urgencyScore}
            </Badge>
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {p.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Posted by Evolucent Civic Board ·{" "}
            <span className="font-medium text-civic-green">Verified ✓</span>
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            {p.description}
          </p>

          {/* AI Impact Summary (async server component — Suspense-wrapped) */}
          <div className="mt-8">
            <Suspense fallback={<AIImpactSkeleton />}>
              <AIImpact
                project={{
                  id,
                  title: p.title,
                  description: p.description,
                  impactSummary: p.aiSummary,
                }}
              />
            </Suspense>
          </div>

          {/* Language reader */}
          <div className="mt-8">
            <ProjectLanguageReader
              projectTitle={p.title}
              projectDescription={`${p.aiSummary}\n\n${p.description}`}
              projectRegion={formatRegion(p.region)}
              amountRaised={raised}
              targetAmount={target}
            />
          </div>

          {/* Verification timeline */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold">
              Verification timeline
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Funds move only when the board and auditors agree — 6/8 votes to
              release.
            </p>
            <ol className="mt-4 space-y-4 border-l-2 border-border pl-4">
              {p.steps.map((step) => (
                <li key={step.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-5.25 top-1.5 size-2.5 rounded-full border-2 border-background",
                      step.status === "completed" && "bg-civic-green",
                      step.status === "active" && "bg-gold",
                      step.status === "pending" && "bg-muted-foreground/40"
                    )}
                  />
                  <p className="font-display font-bold">{step.label}</p>
                  {step.date ? (
                    <p className="font-mono text-xs text-muted-foreground">
                      {step.date}
                    </p>
                  ) : null}
                  {step.verifier ? (
                    <p className="text-sm text-muted-foreground">
                      {step.verifier}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          {/* On-page transaction ledger */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold">
              Public transaction ledger
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every pesewa is visible — this is the core trust mechanism.
            </p>
            {ledger.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No contributions yet. Be the first!
              </p>
            ) : (
              <div className="mt-6 overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/50 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Contributor</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Method</th>
                        <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ledger.map((row) => (
                        <tr key={row.id} className="transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{row.alias || "Anonymous"}</span>
                              <span className="rounded-full bg-civic-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-civic-green">
                                Verified
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatTimestamp(row.at)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-1 font-mono text-[10px] font-medium text-muted-foreground">
                              {row.method.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold">
                            {formatGHS(row.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── Right column (sticky) ── */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
            <ProjectContributionPanel
              raised={raised}
              target={target}
              supporters={supporters}
              daysLeft={p.daysLeft}
              projectId={id}
              userEmail={session?.user?.email ?? undefined}
            />
            {/* Progress bar visible standalone on mobile */}
            <div className="lg:hidden">
              <FundingProgress raised={raised} target={target} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
