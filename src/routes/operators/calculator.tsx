import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Banknote, Gauge, Percent, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";

export const Route = createFileRoute("/operators/calculator")({
  head: () => ({
    meta: [
      { title: "Revenue Calculator — Project your off-peak uplift | Wash Pass" },
      {
        name: "description",
        content:
          "Drag two sliders to project the extra annual revenue Wash Pass off-peak demand can add to your car wash site.",
      },
      { property: "og:title", content: "Wash Pass Operator Revenue Calculator" },
      {
        property: "og:description",
        content: "Model extra annual revenue from off-peak Wash Pass demand in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculatorPage,
});

const NET_RATE = 0.86; // operator share after platform fee
const DAYS = 340;

function CalculatorPage() {
  const [bays, setBays] = useState(3);
  const [volume, setVolume] = useState(38);
  const [price, setPrice] = useState(7);

  const model = useMemo(() => {
    const capacity = bays * 26; // washes/day at full utilisation
    const spare = Math.max(capacity - volume, 0);
    const incrementalPerDay = Math.min(spare, Math.round(bays * 6 + volume * 0.22));
    const annualExtraWashes = incrementalPerDay * DAYS;
    const annualExtra = annualExtraWashes * price * NET_RATE;
    const baseline = volume * price * DAYS;
    const utilisationBefore = Math.min((volume / capacity) * 100, 100);
    const utilisationAfter = Math.min(((volume + incrementalPerDay) / capacity) * 100, 100);
    return {
      incrementalPerDay,
      annualExtraWashes,
      annualExtra,
      baseline,
      uplift: baseline ? (annualExtra / baseline) * 100 : 0,
      utilisationBefore,
      utilisationAfter,
      monthly: annualExtra / 12,
    };
  }, [bays, volume, price]);

  const gbp = (n: number) =>
    `£${Math.round(n).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

  return (
    <PageShell>
      <div className="mesh-bg grain">
        <div className="mx-auto w-[min(1180px,90vw)] pb-24 pt-10">
          <SectionLabel>
            <Gauge className="size-3.5 text-primary" /> Operator revenue calculator
          </SectionLabel>
          <h1 className="mt-6 max-w-2xl text-balance font-display text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
            What is your idle capacity actually worth?
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Adjust your site profile. Projections assume {DAYS} trading days and an{" "}
            {Math.round(NET_RATE * 100)}% operator share after platform fees.
          </p>

          <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_1fr]">
            {/* controls */}
            <div className="panel p-7">
              <Slider
                label="Wash bays"
                value={bays}
                min={1}
                max={12}
                onChange={setBays}
                format={(v) => `${v} ${v === 1 ? "bay" : "bays"}`}
              />
              <Slider
                label="Current washes per day"
                value={volume}
                min={5}
                max={220}
                step={1}
                onChange={setVolume}
                format={(v) => `${v} / day`}
              />
              <Slider
                label="Average wash price"
                value={price}
                min={4}
                max={25}
                step={1}
                onChange={setPrice}
                format={(v) => `£${v}.00`}
              />

              <div className="mt-8 space-y-4 border-t border-border/70 pt-6">
                <UtilBar label="Utilisation today" pct={model.utilisationBefore} tone="muted" />
                <UtilBar label="With Wash Pass" pct={model.utilisationAfter} tone="primary" />
              </div>
            </div>

            {/* projection */}
            <div className="space-y-3">
              <motion.div layout transition={SPRING} className="panel glow p-7">
                <p className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                  Projected extra annual revenue
                </p>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={Math.round(model.annualExtra)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, position: "absolute" }}
                    transition={SPRING}
                    className="mt-3 font-display text-[clamp(2.4rem,6vw,3.6rem)] font-semibold tracking-[-0.05em] text-gradient"
                  >
                    {gbp(model.annualExtra)}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-success">
                  <TrendingUp className="size-4" /> +{model.uplift.toFixed(1)}% on current revenue
                </p>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard
                  icon={Banknote}
                  label="Extra per month"
                  value={gbp(model.monthly)}
                  note="net of platform fee"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Extra washes / day"
                  value={`${model.incrementalPerDay}`}
                  note="routed to off-peak"
                />
                <StatCard
                  icon={Gauge}
                  label="Extra washes / year"
                  value={model.annualExtraWashes.toLocaleString("en-GB")}
                  note={`${DAYS} trading days`}
                />
                <StatCard
                  icon={Percent}
                  label="Utilisation gain"
                  value={`+${Math.max(model.utilisationAfter - model.utilisationBefore, 0).toFixed(0)} pts`}
                  note="bay occupancy"
                />
              </div>

              <div className="panel flex flex-wrap items-center justify-between gap-4 p-6">
                <p className="text-[14px] tracking-[-0.01em]">
                  Ready to capture it? Onboarding takes about a week.
                </p>
                <Link to="/operators/signup">
                  <SpringButton>
                    Apply now <ArrowRight className="size-4" />
                  </SpringButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="font-mono text-[15px] font-medium"
        >
          {format(value)}
        </motion.span>
      </div>
      <div className="relative mt-4 h-2 rounded-full bg-elevated">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, backgroundImage: "var(--gradient-primary)" }}
        />
        <motion.span
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[var(--shadow-elevated)]"
          animate={{ left: `${pct}%` }}
          transition={SPRING}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
        />
      </div>
    </div>
  );
}

function UtilBar({ label, pct, tone }: { label: string; pct: number; tone: "muted" | "primary" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-elevated">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={SPRING}
          className="h-full rounded-full"
          style={{
            backgroundImage: tone === "primary" ? "var(--gradient-primary)" : "none",
            backgroundColor: tone === "primary" ? undefined : "var(--muted-foreground)",
          }}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={SPRING} className="panel p-5">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="mt-1.5 font-mono text-xl font-semibold tracking-[-0.03em]"
      >
        {value}
      </motion.p>
      <p className="mt-1 text-[12px] text-muted-foreground/80">{note}</p>
    </motion.div>
  );
}
