"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Home,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/evolucent/animated-counter";
import { LiveCounterSlideshow } from "@/components/LiveCounterSlideshow";
import { FlagStripeBar, GhanaHeroDecoration } from "@/components/evolucent/ghana-hero-decoration";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    title: "Ignite Impact",
    description:
      "Fund verified projects — health clinics, solar streetlights, flood drainage. Every pesewa is escrow-protected and publicly tracked.",
    image: "/images/feature-transparent.png",
  },
  {
    title: "Spread The Word",
    description:
      "Rally your community. Share projects on socials, mobilise your district, and watch the numbers climb on the live ledger.",
    image: "/images/feature-community.png",
  },
  {
    title: "Connect Nationally",
    description:
      "Join citizens from all 16 regions. Vote on priorities, follow progress reports, and see the collective power of the fund.",
    image: "/images/feature-energy.png",
  },
];

const URGENT_PROJECTS = [
  {
    id: "proj-accra-drains",
    title: "Accra Flood Drain Clearance",
    region: "Greater Accra",
    image: "/images/project-flood.png",
    raised: 1_200,
    target: 15_000,
    daysLeft: 14,
  },
  {
    id: "proj-kumasi-solar",
    title: "Kumasi Market Solar Lighting",
    region: "Ashanti Region",
    image: "/images/project-solar.png",
    raised: 34_200,
    target: 50_000,
    daysLeft: 5,
  },
  {
    id: "proj-sunyani-market",
    title: "Sunyani Waste Segregation Hub",
    region: "Bono Region",
    image: "/images/project-waste.png",
    raised: 9_200,
    target: 35_000,
    urgent: true,
  },
];

const FAQ_ITEMS = [
  {
    q: "How does escrow protection work?",
    a: "Every contribution is deposited into a ring-fenced escrow account at one of our partner banks (Stanbic, Ecobank, or Fidelity). Funds are only released to verified contractors when an independent auditor confirms that a milestone has been achieved.",
  },
  {
    q: "Can I verify where my money goes?",
    a: "Yes. Every project has a public ledger page showing every pesewa received and every release made. Transaction hashes, auditor signatures, and photo evidence are published in real time.",
  },
  {
    q: "How are projects selected for funding?",
    a: "Projects are submitted by district assemblies or verified civic organisations. Citizens then vote on which proposals should be prioritised. The highest-voted projects enter the active funding queue.",
  },
  {
    q: "What happens if a project doesn't hit its target?",
    a: "If a project fails to reach its funding target within the campaign window, all contributions are returned to donors in full. No fees, no delays.",
  },
  {
    q: "Can I set up a recurring contribution?",
    a: "Absolutely. You can set up weekly or monthly auto-contributions via mobile money or bank transfer. You'll receive a receipt and impact update after each cycle.",
  },
];

export default function HomePage() {
  const pathname = usePathname();

  return (
    <div className="pb-24 md:pb-0">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-20 text-evolucent-off-white md:py-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>
        <GhanaHeroDecoration className="pointer-events-none absolute -right-8 top-16 size-[min(90vw,420px)] text-white opacity-[0.04]" />
        
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Ghana&apos;s Civic Fund
          </p>
          <h1 className="mb-6 max-w-4xl font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight">
            Fund, Fast As{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">Trust.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/70">
            Accelerate civic infrastructure with your contribution. Every pesewa
            is escrow-protected, auditor-verified, and tracked on a public
            ledger. <span className="font-semibold text-gold-light">Ɛyɛ ɔman no dwuma</span> — it is
            the nation&apos;s work.
          </p>

          <div className="mt-10 flex flex-wrap gap-4" id="contribute">
            <Button
              size="lg"
              className="h-14 rounded-xl bg-gold px-8 text-base font-bold text-black shadow-evolucent-elevated transition-all hover:bg-gold-dark active:scale-[0.98]"
              asChild
            >
              <Link href="/project/proj-accra-drains">Start contributing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border-white/20 bg-white/5 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
              asChild
            >
              <Link href="/projects">See all projects</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="font-display text-3xl font-bold text-white tracking-tight">
                <AnimatedCounter value={217924} />+
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                Citizens Joined
              </div>
            </div>
            <div className="hidden h-10 w-px bg-white/10 sm:block" />
            <div>
              <div className="font-display text-3xl font-bold text-white tracking-tight">
                <AnimatedCounter value={84} />
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                Active Projects
              </div>
            </div>
            <div className="hidden h-10 w-px bg-white/10 sm:block" />
            <div>
              <div className="font-display text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
                <span className="text-lg text-white/60">GHS</span>
                <AnimatedCounter value={2400000} />
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                Secure in Escrow
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="bg-evolucent-off-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 font-display text-lg font-bold text-evolucent-black">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── URGENT PROJECTS ─── */}
      <section className="bg-white py-16 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-evolucent-black">
              Urgent Fundraising!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Time is of the essence. Join our mission NOW to make an immediate
              impact. Every second counts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {URGENT_PROJECTS.map((project) => {
              const pct = Math.min(
                100,
                Math.round((project.raised / project.target) * 100)
              );
              return (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-evolucent-elevated"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {project.urgent && (
                      <Badge className="absolute left-3 top-3 border-0 bg-red-600 text-white text-[10px] font-bold rounded-full">
                        CRITICAL
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {project.region}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-5 rounded-full border-none bg-civic-green-light px-2 py-0 text-[10px] text-civic-green-dark"
                      >
                        <CheckCircle2 className="mr-0.5 size-3" /> Verified
                      </Badge>
                    </div>
                    <h3 className="mb-4 flex-1 font-display text-lg font-bold">
                      {project.title}
                    </h3>
                    <div>
                      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            project.urgent ? "bg-red-500" : "bg-civic-green"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span className="font-bold text-foreground">
                          GH₵{" "}
                          {project.raised.toLocaleString("en-GH")}
                        </span>
                        {project.daysLeft ? (
                          <span>{project.daysLeft} days left</span>
                        ) : (
                          <span className="font-bold text-red-600">Urgent</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-border bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-10 font-display text-3xl font-extrabold tracking-tight text-evolucent-black">
            Frequently Asked
            <br />
            Questions.
          </h2>
          <div className="divide-y divide-border">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group cursor-pointer py-5">
                <summary className="flex items-center justify-between font-display text-lg font-bold list-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xl text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pr-12 leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MOBILE NAV ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Mobile"
      >
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: BarChart2, label: "Projects", href: "/projects" },
            { icon: Activity, label: "Pulse", href: "/feed" },
            { icon: Wallet, label: "Contribute", href: "#contribute" },
            { icon: User, label: "Account", href: "#" },
          ].map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname === tab.href ||
                  (tab.href !== "#" &&
                    tab.href !== "#contribute" &&
                    pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {isActive ? (
                  <span className="mb-0.5 size-1.5 rounded-full bg-primary" />
                ) : (
                  <span className="mb-0.5 size-1.5" />
                )}
                <tab.icon
                  className={cn("size-5", isActive && "text-primary")}
                />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-muted/30 py-3 text-center text-xs text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="size-3.5 text-gold" aria-hidden />
          Built at KNUST · Powered by citizens · ✦ For Ghana. For Africa.
        </p>
      </footer>
    </div>
  );
}
