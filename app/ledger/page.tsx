import { prisma } from "@/src/db"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Activity, Link as LinkIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { LedgerFilters } from "@/components/evolucent/ledger-filters"

export const dynamic = "force-dynamic"

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>
}) {
  const { q, region } = await searchParams;

  const whereClause: any = { status: "SUCCESS" };
  
  if (q) {
    whereClause.OR = [
      { project: { title: { contains: q, mode: "insensitive" } } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { paymentRef: { contains: q, mode: "insensitive" } },
    ];
  }
  
  if (region) {
    whereClause.user = {
      ...whereClause.user,
      region,
    };
  }

  const contributions = await prisma.contribution.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, kycStatus: true, region: true } },
      project: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="size-4 text-civic-green" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-civic-green">
              Live Transactions
            </p>
          </div>
          <h1 className="mb-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight text-evolucent-off-white">
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">Public Ledger</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            Every confirmed contribution is recorded here in real-time — providing
            full transparency and accountability for all civic funding on Evolucent.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-16">
        <LedgerFilters />
        {contributions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <p className="text-muted-foreground">No confirmed contributions yet. Be the first to fund a project!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm ring-1 ring-black/5">
            <Table>
              <TableHeader className="bg-evolucent-off-white/50">
                <TableRow className="border-b border-black/5 hover:bg-transparent">
                  <TableHead className="font-display font-bold text-evolucent-black py-4">Project</TableHead>
                  <TableHead className="font-display font-bold text-evolucent-black py-4">Contributor</TableHead>
                  <TableHead className="text-right font-display font-bold text-evolucent-black py-4">Amount (GH₵)</TableHead>
                  <TableHead className="font-display font-bold text-evolucent-black py-4">Payment Ref</TableHead>
                  <TableHead className="font-display font-bold text-evolucent-black py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((c) => (
                  <TableRow 
                    key={c.id}
                    className="border-b border-black/5 transition-colors hover:bg-evolucent-sand/30"
                  >
                    <TableCell className="font-medium text-evolucent-black py-4">
                      {c.project.title}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-evolucent-black">
                            {c.user.name ?? "Anonymous"}
                          </span>
                          {c.user.kycStatus === "VERIFIED" && (
                            <Badge className="shrink-0 border-none bg-civic-green-light px-2 py-0 text-[10px] uppercase tracking-wider text-civic-green-dark">
                              <ShieldCheck className="mr-1 size-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {c.user.region && (
                          <span className="text-[11px] text-muted-foreground">
                            {c.user.region}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <span className="font-mono text-base font-extrabold text-civic-green-dark">
                        {c.amount.toLocaleString("en-GH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 rounded-md bg-evolucent-off-white px-2.5 py-1 w-max border border-black/5">
                        <LinkIcon className="size-3 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {c.paymentRef.length > 20
                            ? `${c.paymentRef.slice(0, 8)}…${c.paymentRef.slice(-6)}`
                            : c.paymentRef}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-evolucent-black">
                          {c.createdAt.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.createdAt.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  )
}
