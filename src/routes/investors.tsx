import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgePercent, Check, FileText, Loader2, PieChart, ShieldCheck, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { createDoc, isFirebaseConfigured } from "@/lib/firebase";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Wash Pass Pre-Seed — SEIS Investor Portal" },
      {
        name: "description",
        content:
          "Wash Pass pre-seed round: SEIS-approved with 50% income tax relief, £1.4bn UK market, two-sided marketplace traction and a 20+ year founder track record.",
      },
      { property: "og:title", content: "Wash Pass Pre-Seed — SEIS Investor Portal" },
      {
        property: "og:description",
        content: "Traction, market size and SEIS tax relief for the Wash Pass pre-seed round.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Investors,
});

const TRACTION = [
  { label: "Monthly GMV", value: "£214.8k", delta: "+38% MoM" },
  { label: "Active drivers", value: "9,184", delta: "+22% MoM" },
  { label: "Sites onboarded", value: "486", delta: "+61 this month" },
  { label: "Gross margin", value: "42%", delta: "blended" },
];

const MARKET = [
  { label: "TAM — UK vehicle cleaning spend", value: "£1.42bn", pct: 100 },
  { label: "SAM — subscription-ready urban demand", value: "£410m", pct: 29 },
  { label: "SOM — 3-year target share", value: "£38m", pct: 9 },
];

function Investors() {
  const [open, setOpen] = useState(false);

  return (
    <PageShell>
      <section className="mesh-bg grain relative overflow-hidden">
        <div className="mx-auto w-[min(1180px,90vw)] pb-20 pt-12">
          <SectionLabel>
            <ShieldCheck className="size-3.5 text-success" /> Pre-seed · SEIS advance assurance
          </SectionLabel>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <h1 className="text-balance font-display text-[clamp(2.2rem,5.4vw,3.8rem)] font-semibold leading-[1.03] tracking-[-0.045em]">
                Aggregating the UK's most fragmented{" "}
                <span className="text-gradient">£1.4bn</span> service category.
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
                Wash Pass turns a cash-heavy, offline industry into a subscription marketplace.
                Drivers get one pass for every site; operators get demand, software and recurring
                revenue. We are raising a pre-seed round under SEIS.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SpringButton size="lg" onClick={() => setOpen(true)}>
                  Request deck & data room <ArrowRight className="size-4" />
                </SpringButton>
                <SpringButton variant="outline" size="lg" onClick={() => setOpen(true)}>
                  Book founder call
                </SpringButton>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING}
              className="panel glow p-7"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-success/15 text-success">
                  <BadgePercent className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-semibold tracking-[-0.03em]">50% income tax relief</p>
                  <p className="text-[13px] text-muted-foreground">SEIS-eligible, up to £200k p.a.</p>
                </div>
              </div>
              <dl className="mt-7 space-y-3 text-[13px]">
                {[
                  ["Round", "£650k pre-seed"],
                  ["Instrument", "Ordinary shares, SEIS + EIS"],
                  ["CGT on exit", "0% after 3 years"],
                  ["Loss relief", "Up to 72.5% downside cover"],
                  ["Founder track record", "20+ years, 2 prior exits"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border/70 pb-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface/30">
        <div className="mx-auto grid w-[min(1180px,90vw)] gap-3 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRACTION.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.05 }}
              className="panel p-5"
            >
              <p className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                {t.label}
              </p>
              <p className="mt-3 font-mono text-2xl font-semibold tracking-[-0.03em]">{t.value}</p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-success">
                <TrendingUp className="size-3.5" /> {t.delta}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,90vw)] py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>
              <PieChart className="size-3.5" /> Market
            </SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.035em]">
              Bottom-up market sizing.
            </h2>
            <div className="mt-8 space-y-6">
              {MARKET.map((m, i) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono font-medium">{m.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ ...SPRING, delay: 0.1 * i }}
                      className="h-full rounded-full"
                      style={{ backgroundImage: "var(--gradient-primary)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-7">
            <SectionLabel>Use of funds</SectionLabel>
            <ul className="mt-6 space-y-4 text-[14px]">
              {[
                ["Supply onboarding (1,500 sites)", "38%"],
                ["Driver acquisition & retention", "27%"],
                ["Product & platform engineering", "24%"],
                ["Compliance, ops & runway buffer", "11%"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5">
                    <Check className="size-4 text-primary" /> {k}
                  </span>
                  <span className="font-mono text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[13px] leading-relaxed text-muted-foreground">
              18-month runway to 1,500 live sites and £1.1m annualised GMV, positioning a seed round
              on marketplace density rather than paid growth.
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>{open && <DeckModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </PageShell>
  );
}

function DeckModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", firm: "", ticket: "£10k – £25k" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    await createDoc("investor_leads", { ...form, source: "investor_portal", status: "new" });
    setState("done");
    toast.success("Data room access sent", {
      description: isFirebaseConfigured()
        ? "Saved to Firestore · investor_leads"
        : "Saved locally (mock mode — Firebase env vars not mounted)",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId="deckModal"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
        className="panel w-full max-w-md p-7 shadow-[var(--shadow-elevated)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <FileText className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">
              Investment deck & data room
            </h3>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              SEIS summary, financial model and cap table.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="mt-7 text-center"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success">
                <Check className="size-6" />
              </span>
              <p className="mt-4 text-[15px] font-medium">Access on its way</p>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                We'll email {form.email || "you"} within one working day.
              </p>
              <SpringButton className="mt-6 w-full" onClick={onClose}>
                Done
              </SpringButton>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-3"
            >
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <Field
                label="Firm / syndicate (optional)"
                value={form.firm}
                onChange={(v) => setForm({ ...form, firm: v })}
              />
              <div>
                <label className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                  Indicative ticket
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["£10k – £25k", "£25k – £50k", "£50k – £100k", "£100k+"].map((t) => (
                    <motion.button
                      key={t}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      transition={SPRING}
                      onClick={() => setForm({ ...form, ticket: t })}
                      className={`relative rounded-full px-3.5 py-2 text-[12px] transition-colors ${
                        form.ticket === t
                          ? "text-primary-foreground"
                          : "hairline text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {form.ticket === t && (
                        <motion.span
                          layoutId="ticketPill"
                          transition={SPRING}
                          className="absolute inset-0 -z-10 rounded-full bg-primary"
                        />
                      )}
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>
              <SpringButton type="submit" className="mt-3 w-full" disabled={state === "loading"}>
                {state === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    Send me access <ArrowRight className="size-4" />
                  </>
                )}
              </SpringButton>
              <p className="pt-1 text-center text-[11px] text-muted-foreground/80">
                For sophisticated / high-net-worth investors. Capital at risk.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-4 focus:ring-ring/20"
      />
    </label>
  );
}
