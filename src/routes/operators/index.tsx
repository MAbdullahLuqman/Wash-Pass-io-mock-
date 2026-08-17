import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, CalendarClock, Calculator, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";

export const Route = createFileRoute("/operators/")({
  head: () => ({
    meta: [
      { title: "For Car Wash Operators — Fill off-peak bays | Wash Pass" },
      {
        name: "description",
        content:
          "Wash Pass sends paying drivers to your quiet hours, automates recurring revenue and settles weekly. No hardware, no lock-in.",
      },
      { property: "og:title", content: "Wash Pass for Operators" },
      {
        property: "og:description",
        content: "Monetise off-peak capacity with recurring subscription demand and zero hardware.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Operators,
});

const BENEFITS = [
  {
    icon: CalendarClock,
    title: "Monetise dead hours",
    body: "We steer subscription demand into your slowest windows with dynamic incentives.",
  },
  {
    icon: Banknote,
    title: "Predictable weekly payouts",
    body: "Automated settlement every Friday with per-wash reconciliation and no chargebacks.",
  },
  {
    icon: Smartphone,
    title: "Zero hardware",
    body: "Any phone or tablet becomes the scanner. Live in days, not months.",
  },
  {
    icon: TrendingUp,
    title: "+31% utilisation",
    body: "Average lift across pilot sites by month three, without discounting peak.",
  },
  {
    icon: ShieldCheck,
    title: "No lock-in",
    body: "Rolling 30-day terms. Cap daily redemptions whenever you're busy.",
  },
  {
    icon: Calculator,
    title: "Transparent economics",
    body: "Flat per-redemption rate. Model your uplift before you sign anything.",
  },
];

function Operators() {
  return (
    <PageShell>
      <section className="mesh-bg grain relative overflow-hidden">
        <div className="mx-auto w-[min(1180px,90vw)] pb-16 pt-12">
          <SectionLabel>For car wash operators</SectionLabel>
          <div className="mt-7 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h1 className="text-balance font-display text-[clamp(2.2rem,5.4vw,3.7rem)] font-semibold leading-[1.03] tracking-[-0.045em]">
              Your bays are empty half the day. We fix that.
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Wash Pass is a demand engine plus operating software for independent sites. You keep
              your brand, your prices and your peak — we bring subscribers into the gaps.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/operators/signup">
              <SpringButton size="lg">
                Apply to join <ArrowRight className="size-4" />
              </SpringButton>
            </Link>
            <Link to="/operators/calculator">
              <SpringButton variant="outline" size="lg">
                <Calculator className="size-4" /> Revenue calculator
              </SpringButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,90vw)] gap-3 py-16 md:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...SPRING, delay: (i % 3) * 0.05 }}
            whileHover={{ y: -3 }}
            className="panel p-6"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <b.icon className="size-4" />
            </span>
            <p className="mt-4 text-[15px] font-medium tracking-[-0.015em]">{b.title}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{b.body}</p>
          </motion.div>
        ))}
      </section>

      <section className="border-t border-border/70 bg-surface/20 py-20">
        <div className="mx-auto flex w-[min(1180px,90vw)] flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold leading-tight tracking-[-0.035em]">
              See what off-peak demand is worth to your site.
            </h2>
            <p className="mt-3 text-[14px] text-muted-foreground">
              Two sliders, instant projection. No email required.
            </p>
          </div>
          <Link to="/operators/calculator">
            <SpringButton size="lg">
              Open the calculator <ArrowRight className="size-4" />
            </SpringButton>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
