import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, QrCode, ScanLine, X } from "lucide-react";
import { useState } from "react";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { createDoc } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/operator/portal")({
  head: () => ({
    meta: [
      { title: "Attendant Scanner — SparklePass Demo Operator Portal" },
      {
        name: "description",
        content:
          "Fast-action attendant portal: scan a driver's SparklePass Demo QR, verify the plan and redeem a wash in one tap.",
      },
      { property: "og:title", content: "SparklePass Demo Attendant Scanner" },
      { property: "og:description", content: "Scan, verify and redeem washes in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portal,
});

type Result = { reg: string; plan: string; ok: boolean; note: string };

const SAMPLES: Result[] = [
  { reg: "AB12 CDE", plan: "Unlimited", ok: true, note: "Standard wash included" },
  { reg: "LM19 KRT", plan: "Flexi · 2 credits left", ok: true, note: "1 credit will be deducted" },
  { reg: "YT65 WPO", plan: "Pay-As-You-Wash", ok: true, note: "£4.50 charged to card" },
  { reg: "RD08 ZXA", plan: "Unlimited", ok: false, note: "Payment failed — collect in person" },
];

function Portal() {
  const [state, setState] = useState<"idle" | "scanning" | "result">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [log, setLog] = useState<Result[]>([]);

  function scan() {
    setState("scanning");
    setTimeout(() => {
      const r = SAMPLES[Math.floor(Math.random() * SAMPLES.length)]!;
      setResult(r);
      setState("result");
    }, 1200);
  }

  async function redeem() {
    if (!result) return;
    await createDoc("redemptions", { reg: result.reg, plan: result.plan, site: "Shine Lane · Hackney" });
    setLog((l) => [result, ...l].slice(0, 6));
    setState("idle");
    setResult(null);
  }

  return (
    <div className="mesh-bg grain min-h-screen">
      <div className="mx-auto w-[min(560px,94vw)] py-9">
        <p className="text-[11px] uppercase tracking-[0.16em] text-primary">Attendant portal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">
          Redeem a wash
        </h1>
        <p className="mt-3 text-[13px] text-muted-foreground">
          Shine Lane · Hackney · 3 bays · 41 redemptions today
        </p>

        <div className="panel mt-7 p-7">
          <div className="relative mx-auto grid aspect-square w-full max-w-[300px] place-items-center overflow-hidden rounded-3xl bg-background/60">
            <div className="absolute inset-6 rounded-2xl border border-primary/30" />
            {state === "scanning" && (
              <motion.div
                initial={{ top: "12%" }}
                animate={{ top: "84%" }}
                transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-x-6 h-px bg-primary shadow-[0_0_24px_var(--primary)]"
              />
            )}
            <AnimatePresence mode="wait">
              {state === "result" && result ? (
                <motion.div
                  key="res"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={SPRING}
                  className="px-6 text-center"
                >
                  <span
                    className={cn(
                      "mx-auto grid size-14 place-items-center rounded-full",
                      result.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {result.ok ? <Check className="size-7" /> : <X className="size-7" />}
                  </span>
                  <p className="mt-4 font-mono text-lg tracking-[0.08em]">{result.reg}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{result.plan}</p>
                  <p className="mt-3 text-[12px] text-foreground/80">{result.note}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground"
                >
                  {state === "scanning" ? (
                    <Loader2 className="mx-auto size-8 animate-spin text-primary" />
                  ) : (
                    <QrCode className="mx-auto size-10" />
                  )}
                  <p className="mt-3 text-[13px]">
                    {state === "scanning" ? "Reading pass…" : "Point at the driver's pass"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex gap-2">
            {state === "result" && result ? (
              <>
                <SpringButton
                  className="flex-1 justify-center"
                  onClick={redeem}
                  disabled={!result.ok}
                >
                  <Check className="size-4" /> Redeem wash
                </SpringButton>
                <SpringButton
                  variant="outline"
                  className="justify-center"
                  onClick={() => {
                    setState("idle");
                    setResult(null);
                  }}
                >
                  Cancel
                </SpringButton>
              </>
            ) : (
              <SpringButton
                size="lg"
                className="w-full justify-center"
                onClick={scan}
                disabled={state === "scanning"}
              >
                <ScanLine className="size-4" /> Scan pass
              </SpringButton>
            )}
          </div>
        </div>

        <div className="panel mt-3 p-6">
          <p className="text-[15px] font-medium tracking-[-0.015em]">Recent redemptions</p>
          {log.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">Nothing redeemed yet this session.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/70">
              <AnimatePresence initial={false}>
                {log.map((r, i) => (
                  <motion.li
                    key={`${r.reg}-${i}`}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING}
                    className="flex items-center justify-between py-3 text-[13px]"
                  >
                    <span className="font-mono tracking-[0.08em]">{r.reg}</span>
                    <span className="text-muted-foreground">{r.plan}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
