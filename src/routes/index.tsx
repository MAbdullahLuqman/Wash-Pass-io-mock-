import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { cn } from "@/lib/utils";
import heroDriver from "@/assets/hero-driver-v2.jpg";
import heroOperator from "@/assets/hero-operator-v2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SparklePass Demo — One digital pass, every site near you" },
      {
        name: "description",
        content:
          "SparklePass Demo is the UK car wash marketplace: one digital pass for drivers, a demand engine and recurring revenue for operators.",
      },
      { property: "og:title", content: "SparklePass Demo — The car wash marketplace" },
      {
        property: "og:description",
        content:
          "Subscribe or pay per wash at hundreds of sites. Operators fill off-peak bays with zero hardware.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type AudienceKey = "drivers" | "operators";

const HERO_IMAGES: Record<AudienceKey, string> = {
  drivers: heroDriver,
  operators: heroOperator,
};

const AUDIENCES: Record<
  AudienceKey,
  {
    label: string;
    kicker: string;
    headline: [string, string];
    lede: string;
    cta: { to: string; label: string };
    steps: { n: string; title: string; body: string }[];
  }
> = {
  drivers: {
    label: "Drivers",
    kicker: "Issue 01 — The Pass",
    headline: ["One pass.", "Every wash."],
    lede: "Fourteen ninety-nine a month, unlimited washes across 486 UK sites. No cash, no per-site apps, no queue. Show the code, the bay opens, you drive off clean.",
    cta: { to: "/drivers", label: "See driver plans" },
    steps: [
      {
        n: "01",
        title: "Choose a plan",
        body: "Unlimited, Flexi credits, or pay-as-you-wash. Switch whenever.",
      },
      {
        n: "02",
        title: "Find a site",
        body: "Live map with wait times, wash types and off-peak pricing.",
      },
      {
        n: "03",
        title: "Scan and wash",
        body: "Attendant taps redeem. Receipt lands before you're dry.",
      },
    ],
  },
  operators: {
    label: "Operators",
    kicker: "Issue 02 — The Bay",
    headline: ["Empty bays", "cost you money."],
    lede: "SparklePass Demo routes paying drivers into your quiet hours and settles every Friday. No hardware to buy, no contract to sign, no software for you to build.",
    cta: { to: "/operators", label: "Grow my site" },
    steps: [
      {
        n: "01",
        title: "Apply in four minutes",
        body: "Bays, equipment, payout details. That's the whole form.",
      },
      {
        n: "02",
        title: "Go live the same week",
        body: "Any phone becomes the scanner. Nothing gets installed.",
      },
      {
        n: "03",
        title: "Get paid weekly",
        body: "Automated settlement, per-wash reporting, zero chargebacks.",
      },
    ],
  },
};

function Home() {
  const [tab, setTab] = useState<AudienceKey>("drivers");
  const a = AUDIENCES[tab];

  return (
    <PageShell>
      {/* ------------------------------- masthead ------------------------------- */}
      <section className="overflow-hidden border-b border-border">
        <div className="mx-auto w-[min(1180px,90vw)] pb-0 pt-6 md:pt-10">
          {/* audience switch */}
          <div className="flex items-center justify-center gap-4">
            {(Object.keys(AUDIENCES) as AudienceKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                  tab === key ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                For {AUDIENCES[key].label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              aria-label="Switch audience"
              onClick={() => setTab(tab === "drivers" ? "operators" : "drivers")}
              className="flex h-7 w-14 items-center rounded-full border border-border bg-secondary px-1"
            >
              <motion.span
                layout
                transition={SPRING}
                className={cn(
                  "size-5 rounded-full bg-primary shadow-sm",
                  tab === "operators" && "ml-auto",
                )}
              />
            </button>
          </div>

          {/* headline */}
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING}
              >
                <h1 className="font-display text-[clamp(2.8rem,7vw,5.9rem)] font-normal leading-[0.92] tracking-[-0.02em]">
                  {a.headline[0]}
                  <br />
                  <span className="relative inline-block px-3">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-[0.12em] top-[0.14em] -rotate-[1.4deg] rounded-[2px] bg-primary/25"
                    />
                    <span className="relative">{a.headline[1]}</span>
                  </span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.65] text-muted-foreground">
                  {a.lede}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to={a.cta.to}>
                <SpringButton size="lg">
                  {a.cta.label} <ArrowRight className="size-4" />
                </SpringButton>
              </Link>
              <Link
                to="/investors"
                className="rounded-full border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                Investor portal
              </Link>
            </div>
          </div>

          {/* audience imagery */}
          <div className="mt-10 grid gap-5 md:grid-cols-[1.45fr_0.75fr] md:gap-6">
            {(Object.keys(AUDIENCES) as AudienceKey[]).map((key) => {
              const item = AUDIENCES[key];
              const active = tab === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setTab(key)}
                  animate={{ y: active ? 0 : 8, opacity: active ? 1 : 0.88 }}
                  transition={SPRING}
                  className={cn(
                    "group relative block min-h-[270px] overflow-hidden rounded-t-[20px] text-left",
                    active ? "ring-1 ring-primary/40" : "ring-1 ring-border",
                  )}
                  style={{ backgroundColor: key === "drivers" ? "#dbeefc" : "#d9e3e8" }}
                >
                  <img
                    src={HERO_IMAGES[key]}
                    alt={
                      key === "drivers"
                        ? "Driver showing a SparklePass Demo QR code beside a freshly washed car"
                        : "SparklePass Demo operator dashboard and driver app preview"
                    }
                    width={1200}
                    height={912}
                    loading={key === "drivers" ? "eager" : "lazy"}
                    className="h-[270px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] md:h-[430px]"
                  />
                  <div className="absolute left-5 top-5 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                    For {item.label}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <p className="max-w-[70%] rounded-xl bg-background/90 px-4 py-3 font-display text-lg leading-tight backdrop-blur">
                      {item.headline[0]} {item.headline[1]}
                    </p>
                    <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <Ledger />
      <Method audience={tab} />
      <PullQuote />
      <OperatorLedger />
      <Closing />
    </PageShell>
  );
}

/* -------------------------------- ledger row ------------------------------- */

const METRICS = [
  { label: "Washes redeemed", start: 128420, step: 3, prefix: "" },
  { label: "Active drivers", start: 9184, step: 1, prefix: "" },
  { label: "Sites live", start: 486, step: 0, prefix: "" },
  { label: "Monthly GMV", start: 214800, step: 42, prefix: "£" },
];

function Ledger() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-[min(1180px,90vw)]">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {METRICS.map((m, i) => {
            const value = m.start + m.step * tick;
            return (
              <div
                key={m.label}
                className={cn(
                  "py-8 md:py-10",
                  i % 2 === 1 && "border-l border-border pl-6 md:pl-8",
                  i === 2 && "md:border-l md:pl-8",
                  i > 1 && "border-t border-border md:border-t-0",
                )}
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-3 font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-none tracking-[-0.01em] tabular-nums">
                  {m.prefix}
                  {value.toLocaleString("en-GB")}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------- method --------------------------------- */

function Method({ audience }: { audience: AudienceKey }) {
  const steps = AUDIENCES[audience].steps;

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-[min(1180px,90vw)] gap-16 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-4">
          <SectionLabel>The method</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] tracking-[-0.01em]">
            Three steps, and
            <br />
            <span className="italic">nothing else.</span>
          </h2>
          <p className="mt-6 max-w-xs text-[14px] leading-[1.7] text-muted-foreground">
            The marketplace only works if both sides can be explained in a sentence each. So they
            are.
          </p>
        </div>

        <ol className="md:col-span-7 md:col-start-6">
          {steps.map((s, i) => (
            <motion.li
              key={`${audience}-${s.n}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...SPRING, delay: 0.06 * i }}
              className="flex gap-8 border-t border-border py-8 last:border-b"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-primary">{s.n}</span>
              <div>
                <p className="font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-tight">
                  {s.title}
                </p>
                <p className="mt-2 max-w-md text-[14px] leading-[1.7] text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------- pull quote ------------------------------- */

function PullQuote() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid w-[min(1180px,90vw)] gap-12 py-24 md:grid-cols-12 md:py-32">
        <blockquote className="md:col-span-8">
          <p className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.01em]">
            “SparklePass Demo filled our Tuesday mornings. It's the first number I check every week —
            before the till.”
          </p>
          <footer className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-background/60">
            Danny R. — three-bay hand wash, Birmingham
          </footer>
        </blockquote>
        <div className="md:col-span-3 md:col-start-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/50">
            Utilisation, month three
          </p>
          <p className="mt-3 font-display text-[clamp(3rem,7vw,4.5rem)] leading-none tabular-nums">
            +31%
          </p>
          <p className="mt-4 text-[13px] leading-[1.7] text-background/70">
            Average lift across pilot sites, measured against their own pre-SparklePass-Demo baseline.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- functional ledger ---------------------------- */

const REDEMPTIONS = [
  {
    time: "09:04",
    site: "Shine & Go, Aston",
    type: "Full valet",
    plan: "Unlimited",
    value: "£11.50",
  },
  { time: "09:22", site: "Jet 24, Coventry Rd", type: "Jet wash", plan: "Flexi", value: "£4.00" },
  {
    time: "10:11",
    site: "Autobright, Digbeth",
    type: "Roll-over",
    plan: "Unlimited",
    value: "£6.75",
  },
  {
    time: "10:48",
    site: "Shine & Go, Aston",
    type: "Hand wash",
    plan: "Pay-as-you-wash",
    value: "£9.00",
  },
  {
    time: "11:05",
    site: "Mirror Finish, Selly Oak",
    type: "Full valet",
    plan: "Unlimited",
    value: "£11.50",
  },
];

function OperatorLedger() {
  const [selected, setSelected] = useState(0);
  const row = REDEMPTIONS[selected] ?? REDEMPTIONS[0]!;

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-[min(1180px,90vw)] py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Today's redemptions</SectionLabel>
            <h2 className="mt-6 max-w-lg font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] tracking-[-0.01em]">
              This is the actual operator view. Not a mockup of one.
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Settles Fri 17:00
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-foreground/20 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Time</span>
              <span>Site / wash</span>
              <span>Value</span>
            </div>
            {REDEMPTIONS.map((r, i) => (
              <button
                key={r.time}
                onClick={() => setSelected(i)}
                className={cn(
                  "grid w-full grid-cols-[64px_1fr_auto] items-baseline gap-4 border-b border-border py-4 text-left transition-colors",
                  selected === i ? "bg-elevated" : "hover:bg-elevated/60",
                )}
              >
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                  {r.time}
                </span>
                <span>
                  <span className="text-[15px]">{r.site}</span>
                  <span className="ml-2 text-[13px] text-muted-foreground">{r.type}</span>
                </span>
                <span className="font-mono text-[13px] tabular-nums">{r.value}</span>
              </button>
            ))}
            <div className="flex items-baseline justify-between border-b border-foreground/20 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Day total
              </span>
              <span className="font-display text-2xl tabular-nums">£42.75</span>
            </div>
          </div>

          <aside className="md:col-span-3 md:col-start-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Selected wash
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={SPRING}
                className="mt-4"
              >
                <p className="font-display text-[1.6rem] leading-tight">{row.type}</p>
                <dl className="mt-5 space-y-3 text-[13px]">
                  {[
                    ["Site", row.site],
                    ["Plan", row.plan],
                    ["Payout", row.value],
                    ["Status", "Verified"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-border pb-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                  <Check className="size-3.5" /> Scanned, no hardware
                </p>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- closing --------------------------------- */

function Closing() {
  return (
    <section className="mx-auto grid w-[min(1180px,90vw)] gap-12 py-24 md:grid-cols-12 md:py-32">
      <div className="md:col-span-7">
        <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.98] tracking-[-0.01em]">
          A clean car isn't a chore.
          <br />
          <span className="italic text-primary">It's a two-second scan.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link to="/drivers/signup">
            <SpringButton size="lg">
              Get the pass <ArrowRight className="size-4" />
            </SpringButton>
          </Link>
          <Link to="/operators/signup">
            <SpringButton variant="outline" size="lg">
              List my site
            </SpringButton>
          </Link>
        </div>
      </div>
      <div className="flex items-end md:col-span-4 md:col-start-9">
        <div className="w-full border-t border-border pt-6">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <QrCode className="size-3.5" /> 486 sites · 12 cities
          </p>
          <p className="mt-4 text-[14px] leading-[1.7] text-muted-foreground">
            Backing the UK's most fragmented £1.4bn service category.{" "}
            <Link
              to="/investors"
              className="text-foreground underline decoration-border underline-offset-4"
            >
              Read the pre-seed case
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
