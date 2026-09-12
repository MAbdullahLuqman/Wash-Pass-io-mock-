import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Droplets, MapPin, Sparkles, Timer } from "lucide-react";
import { useState } from "react";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drivers/")({
  head: () => ({
    meta: [
      { title: "Driver Plans — Unlimited, Flexi & Pay-As-You-Wash | SparklePass Demo" },
      {
        name: "description",
        content:
          "One digital pass for 480+ UK car wash sites. Go unlimited from £14.99/month, buy Flexi credits, or pay as you wash.",
      },
      { property: "og:title", content: "SparklePass Demo for Drivers — one pass, every wash" },
      {
        property: "og:description",
        content: "Unlimited, Flexi and Pay-As-You-Wash plans for 480+ UK sites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Drivers,
});

const PLANS = [
  {
    id: "unlimited",
    name: "Unlimited",
    price: "£14.99",
    cadence: "/month",
    tagline: "For daily drivers and commuters.",
    features: ["Unlimited standard washes", "Priority off-peak bays", "2 vehicles per household", "Cancel anytime"],
    featured: true,
  },
  {
    id: "flexi",
    name: "Flexi",
    price: "£9.99",
    cadence: "/month",
    tagline: "4 credits a month, roll over twice.",
    features: ["4 wash credits monthly", "Credits roll over 60 days", "Upgrade mid-cycle", "Add premium washes"],
    featured: false,
  },
  {
    id: "payg",
    name: "Pay-As-You-Wash",
    price: "£4.50",
    cadence: "/wash",
    tagline: "No subscription, no commitment.",
    features: ["Pay per redemption", "Off-peak pricing", "Same QR redemption", "Digital receipts"],
    featured: false,
  },
];

function Drivers() {
  const [hovered, setHovered] = useState<string>("unlimited");

  return (
    <PageShell>
      <section className="mesh-bg grain relative overflow-hidden">
        <div className="mx-auto w-[min(1180px,90vw)] pb-16 pt-12 text-center">
          <SectionLabel>
            <Droplets className="size-3.5 text-primary" /> For drivers
          </SectionLabel>
          <h1 className="mx-auto mt-7 max-w-3xl text-balance font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.045em]">
            Your car, always clean. Without thinking about it.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            One pass works at every SparklePass Demo site. Pick the plan that matches how often you drive —
            switch or cancel whenever.
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,90vw)] pb-8">
        <div className="grid gap-3 md:grid-cols-3">
          {PLANS.map((p) => {
            const active = hovered === p.id;
            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                whileHover={{ y: -4 }}
                transition={SPRING}
                className={cn(
                  "panel relative overflow-hidden p-7",
                  active && "border-primary/30",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="planGlow"
                    transition={SPRING}
                    className="absolute inset-0 -z-10 bg-primary/[0.07]"
                  />
                )}
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium tracking-[-0.015em]">{p.name}</p>
                  {p.featured && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em]">
                  {p.price}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{p.cadence}</span>
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2.5 text-[13px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-foreground/85">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/drivers/signup" className="mt-7 block">
                  <SpringButton
                    variant={p.featured ? "primary" : "outline"}
                    className="w-full justify-center"
                  >
                    Choose {p.name} <ArrowRight className="size-4" />
                  </SpringButton>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,90vw)] gap-3 py-16 md:grid-cols-3">
        {[
          { icon: Timer, title: "4 minute average", body: "From arrival to drive-off at partner bays." },
          { icon: MapPin, title: "486 live sites", body: "With live wait times and off-peak deals." },
          { icon: Sparkles, title: "Premium add-ons", body: "Wax, interior and wheel packages on tap." },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: i * 0.05 }}
            className="panel p-6"
          >
            <f.icon className="size-4 text-primary" />
            <p className="mt-3 text-sm font-medium">{f.title}</p>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{f.body}</p>
          </motion.div>
        ))}
      </section>
    </PageShell>
  );
}
