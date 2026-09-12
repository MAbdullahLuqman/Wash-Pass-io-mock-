import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, Flame, Mail, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { isFirebaseConfigured, listDocs, patchDoc } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Marketplace Control Center — SparklePass Demo Admin" },
      {
        name: "description",
        content:
          "Live SparklePass Demo marketplace operations: GMV, active drivers, onboarded sites, runway, operator approvals and SEIS investor leads.",
      },
      { property: "og:title", content: "SparklePass Demo Marketplace Control Center" },
      { property: "og:description", content: "Live marketplace metrics, approvals and investor leads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type App = {
  id: string;
  business: string;
  city: string;
  equipment: string;
  bays: number;
  status: string;
};

const SEED_APPS: App[] = [
  { id: "seed_1", business: "Crystal Hand Wash", city: "Leeds", equipment: "Hand wash", bays: 4, status: "pending" },
  { id: "seed_2", business: "JetPro Bays", city: "Bristol", equipment: "Jet wash bays", bays: 6, status: "pending" },
  { id: "seed_3", business: "Autobrite Express", city: "Croydon", equipment: "Roll-over automatic", bays: 2, status: "pending" },
];

const SEED_LEADS = [
  { id: "l1", name: "Helena Marsh", firm: "Northgate Angels", ticket: "£50k – £100k", status: "new" },
  { id: "l2", name: "Tom Ellery", firm: "Independent", ticket: "£25k – £50k", status: "in dataroom" },
  { id: "l3", name: "Sofia Rendell", firm: "Kite Syndicate", ticket: "£100k+", status: "call booked" },
];

function Dashboard() {
  const [apps, setApps] = useState<App[]>(SEED_APPS);
  const [leads, setLeads] = useState(SEED_LEADS);
  const [gmv, setGmv] = useState(214800);

  useEffect(() => {
    const stored = listDocs("operators") as unknown as App[];
    if (stored.length) setApps([...stored.map((s) => ({ ...s, bays: Number(s.bays) || 0 })), ...SEED_APPS]);
    const storedLeads = listDocs("investor_leads") as unknown as (typeof SEED_LEADS)[number][];
    if (storedLeads.length) setLeads([...storedLeads, ...SEED_LEADS]);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setGmv((v) => v + Math.round(Math.random() * 90)), 2600);
    return () => clearInterval(id);
  }, []);

  function decide(app: App, status: "approved" | "denied") {
    patchDoc("operators", app.id, { status });
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
    toast[status === "approved" ? "success" : "message"](
      `${app.business} ${status}`,
      {
        description: isFirebaseConfigured()
          ? "Firestore · operators updated"
          : "Mock mode — state persisted locally",
      },
    );
  }

  const pending = apps.filter((a) => a.status === "pending");

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto w-[min(1240px,94vw)] py-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-primary">Marketplace</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">
              Control center
            </h1>
          </div>
          <p className="text-[12px] text-muted-foreground">
            {isFirebaseConfigured() ? "Firestore connected" : "Mock data · Firebase not configured"}
          </p>
        </div>

        {/* metrics */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={TrendingUp}
            label="Monthly GMV"
            value={`£${gmv.toLocaleString("en-GB")}`}
            delta="+38% MoM"
          />
          <Metric icon={Users} label="Active drivers" value="9,184" delta="+22% MoM" />
          <Metric icon={Building2} label="Sites onboarded" value={`${486 + apps.filter((a) => a.status === "approved").length}`} delta="+61 this month" />
          <Metric icon={Flame} label="Burn / runway" value="£38.4k" delta="17.2 months" tone="warn" />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
          {/* applications */}
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-medium tracking-[-0.015em]">Operator applications</h2>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-primary">
                {pending.length} pending
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {apps.map((a) => (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={SPRING}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/40 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium tracking-[-0.01em]">{a.business}</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        {a.city} · {a.equipment} · {a.bays} bays
                      </p>
                    </div>
                    {a.status === "pending" ? (
                      <div className="flex gap-2">
                        <SpringButton size="sm" onClick={() => decide(a, "approved")}>
                          <Check className="size-3.5" /> Approve
                        </SpringButton>
                        <SpringButton
                          size="sm"
                          variant="outline"
                          onClick={() => decide(a, "denied")}
                        >
                          <X className="size-3.5" /> Deny
                        </SpringButton>
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[12px]",
                          a.status === "approved"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive",
                        )}
                      >
                        {a.status}
                      </span>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* leads */}
          <div className="panel p-6">
            <h2 className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.015em]">
              <Mail className="size-4 text-primary" /> SEIS investor leads
            </h2>
            <ul className="mt-4 divide-y divide-border/70">
              {leads.map((l) => (
                <motion.li
                  key={l.id}
                  whileHover={{ x: 3 }}
                  transition={SPRING}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{l.name || "Unnamed"}</p>
                    <p className="text-[12px] text-muted-foreground">{l.firm || "Independent"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[12px]">{l.ticket}</p>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {l.status}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  delta,
  tone = "up",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  tone?: "up" | "warn";
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={SPRING} className="panel p-5">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <AnimatePresence mode="popLayout">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, position: "absolute" }}
          transition={SPRING}
          className="mt-1.5 font-mono text-2xl font-semibold tracking-[-0.03em]"
        >
          {value}
        </motion.p>
      </AnimatePresence>
      <p
        className={cn(
          "mt-1 text-[12px]",
          tone === "warn" ? "text-muted-foreground" : "text-success",
        )}
      >
        {delta}
      </p>
    </motion.div>
  );
}
