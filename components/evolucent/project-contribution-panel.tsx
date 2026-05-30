"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/evolucent/animated-counter";
import { FundingProgress } from "@/components/evolucent/funding-progress";
import { formatGHS } from "@/lib/format";
import { verifyPayment } from "@/lib/actions/paystack";

// Paystack test card for judges: 4084 0840 8408 4081 · Exp 01/99 · CVV 408
const DEMO_EMAIL = "demo@evolucent.gh";

type ProjectContributionPanelProps = {
  projectId: string;
  raised: number;
  target: number;
  supporters: number;
  daysLeft: number;
  userEmail?: string;
};

export function ProjectContributionPanel({
  projectId,
  raised,
  target,
  supporters,
  daysLeft,
  userEmail,
}: ProjectContributionPanelProps) {
  const router = useRouter();
  const percent = Math.min(100, Math.round((raised / target) * 100));
  const [amount, setAmount] = React.useState("");
  const [email, setEmail] = React.useState(userEmail ?? "");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [demoMode] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#00875a", "#d4af37", "#ffffff"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#00875a", "#d4af37", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  async function handleFund() {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      toast.error("Enter a valid amount (min GHS 1)");
      return;
    }

    const resolvedEmail = demoMode ? DEMO_EMAIL : email.trim();
    if (!resolvedEmail || !resolvedEmail.includes("@")) {
      toast.error("Enter a valid email address to continue");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      toast.error("Payment not configured — contact support");
      return;
    }

    setIsProcessing(true);

    try {
      const PaystackPop = (window as Window & { PaystackPop?: new () => { newTransaction: (opts: Record<string, unknown>) => void } }).PaystackPop;
      if (!PaystackPop) {
        toast.error("Payment system is still loading. Please try again in a moment.");
        setIsProcessing(false);
        return;
      }
      
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: publicKey,
        email: resolvedEmail,
        amount: Math.round(numericAmount * 100), // pesewas
        currency: "GHS",
        metadata: { project_id: projectId },
        onSuccess: (txn: any) => {
          toast.loading("Verifying payment…", { id: "payment-verify" });
          (async () => {
            try {
              await verifyPayment(txn.reference, projectId);
              toast.dismiss("payment-verify");
              setAmount("");
              setShowSuccess(true);
              fireConfetti();
              router.refresh();
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : "Verification failed";
              toast.error(
                msg.includes("Unauthenticated")
                  ? "Sign in first to record your contribution."
                  : msg,
                { id: "payment-verify" }
              );
            } finally {
              setIsProcessing(false);
            }
          })();
        },
        onCancel: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled.");
        },
      });

    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
      <div className="overflow-hidden rounded-2xl border-[1.5px] border-border bg-card shadow-evolucent-elevated">
        <div className="p-5 md:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Live ledger
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-civic-green">
                <span className="size-1.5 animate-pulse-live rounded-full bg-civic-green" />
                Live
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <span className="mb-1 font-mono text-base text-muted-foreground">GHS</span>
              <AnimatedCounter
                value={raised}
                className="font-display text-4xl font-extrabold tabular-nums leading-none tracking-tight text-foreground md:text-5xl"
                format={(n) => Math.round(n).toLocaleString("en-GH")}
              />
            </div>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              raised of {formatGHS(target)}
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-6 space-y-3">
            <FundingProgress raised={raised} target={target} />
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{percent}% funded</span>
              <div className="flex gap-4">
                <span>{daysLeft} days left</span>
                <span>{supporters.toLocaleString("en-GH")} supporters</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4 border-t border-border/50 pt-6">
            <label className="block">
              <span className="sr-only">Amount (GHS)</span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="font-mono text-sm font-semibold text-muted-foreground">GHS</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = val.split(".");
                    if (parts.length > 2) {
                      val = parts[0] + "." + parts.slice(1).join("");
                    }
                    if (val.includes(".")) {
                      const [intPart, decPart] = val.split(".");
                      val = `${intPart}.${decPart.slice(0, 2)}`;
                    }
                    setAmount(val);
                  }}
                  disabled={isProcessing}
                  className="w-full rounded-xl border border-input bg-background/50 py-3 pl-14 pr-4 font-mono text-lg font-semibold focus:border-civic-green focus:outline-none focus:ring-1 focus:ring-civic-green disabled:opacity-50 transition-colors"
                />
              </div>
            </label>

            {!userEmail && !demoMode && (
              <label className="block">
                <span className="sr-only">Email for receipt</span>
                <input
                  type="email"
                  placeholder="Email for receipt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isProcessing}
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-civic-green focus:outline-none focus:ring-1 focus:ring-civic-green disabled:opacity-50 transition-colors"
                />
              </label>
            )}

            <Button
              className="mt-2 h-12 w-full rounded-xl bg-gold text-base font-bold text-black shadow-evolucent-card hover:bg-gold-dark disabled:opacity-60 transition-all active:scale-[0.98]"
              onClick={handleFund}
              disabled={isProcessing || !amount}
            >
              {isProcessing ? "Processing…" : "Contribute now"}
            </Button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="mx-4 max-w-sm rounded-[2rem] border border-border/40 bg-card p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="mx-auto mb-6 flex size-[88px] items-center justify-center rounded-full bg-civic-green/20">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="font-display text-[1.75rem] font-extrabold text-foreground tracking-tight leading-none">
              Medaase! <br className="hidden md:block" /> Thank You!
            </h2>
            <p className="mt-4 text-[15px] text-foreground/80 leading-relaxed">
              Your contribution is verified on the public ledger. You are making a real difference in Ghana today.
            </p>
            <Button
              className="mt-8 h-14 w-full rounded-xl bg-gold font-bold text-black shadow-evolucent-card hover:bg-gold-dark transition-all active:scale-[0.98]"
              onClick={() => setShowSuccess(false)}
            >
              Continue exploring
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
