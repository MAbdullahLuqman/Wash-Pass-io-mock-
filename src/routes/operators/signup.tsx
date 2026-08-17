import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionLabel } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { createDoc, isFirebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operators/signup")({
  head: () => ({
    meta: [
      { title: "Operator Application — Join the Wash Pass network" },
      {
        name: "description",
        content:
          "Apply to join Wash Pass: tell us about your site, equipment, bay count and payout details. Live within a week.",
      },
      { property: "og:title", content: "Operator Application — Wash Pass" },
      { property: "og:description", content: "Join the network and fill your off-peak bays." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OperatorSignup,
});

const EQUIPMENT = ["Hand wash", "Jet wash bays", "Roll-over automatic", "Tunnel", "Mobile / valet"];

function OperatorSignup() {
  const [form, setForm] = useState({
    business: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    equipment: "Hand wash",
    bays: "3",
    accountName: "",
    sortCode: "",
    accountNumber: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    await createDoc("operators", {
      ...form,
      bays: Number(form.bays),
      status: "pending",
      sortCode: form.sortCode,
    });
    setState("done");
    toast.success("Application received", {
      description: isFirebaseConfigured()
        ? "Written to Firestore · operators"
        : "Saved locally (mock mode — Firebase not configured)",
    });
  }

  return (
    <PageShell>
      <div className="mesh-bg grain">
        <div className="mx-auto w-[min(760px,92vw)] pb-24 pt-10">
          <SectionLabel>
            <Building2 className="size-3.5 text-primary" /> Operator application
          </SectionLabel>
          <h1 className="mt-6 font-display text-[clamp(1.9rem,4.4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
            Join the network in four minutes.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            No hardware, no setup fee, rolling 30-day terms. We verify your details and activate your
            site — usually within a week.
          </p>

          <AnimatePresence mode="wait">
            {state === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING}
                className="panel glow mt-9 p-9 text-center"
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="size-7" />
                </span>
                <p className="mt-5 text-lg font-medium tracking-[-0.02em]">
                  {form.business || "Your site"} is in the queue
                </p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                  Our supply team reviews applications daily. You'll get onboarding instructions and
                  your attendant scanner link by email.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING}
                className="panel mt-9 space-y-8 p-7"
              >
                <Group title="Business">
                  <Field label="Trading name" value={form.business} onChange={set("business")} required />
                  <Field label="Contact name" value={form.contact} onChange={set("contact")} required />
                  <Field label="Email" type="email" value={form.email} onChange={set("email")} required />
                  <Field label="Phone" value={form.phone} onChange={set("phone")} />
                  <Field label="Town / city" value={form.city} onChange={set("city")} required />
                </Group>

                <Group title="Site capacity">
                  <div className="sm:col-span-2">
                    <span className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                      Wash equipment
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {EQUIPMENT.map((eq) => {
                        const active = form.equipment === eq;
                        return (
                          <motion.button
                            key={eq}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            transition={SPRING}
                            onClick={() => set("equipment")(eq)}
                            className={cn(
                              "relative rounded-full px-3.5 py-2 text-[12px] transition-colors",
                              active
                                ? "text-primary-foreground"
                                : "hairline text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {active && (
                              <motion.span
                                layoutId="equipPill"
                                transition={SPRING}
                                className="absolute inset-0 -z-10 rounded-full bg-primary"
                              />
                            )}
                            {eq}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  <Field label="Number of bays" type="number" value={form.bays} onChange={set("bays")} required />
                </Group>

                <Group title="Payout details">
                  <Field label="Account name" value={form.accountName} onChange={set("accountName")} />
                  <Field label="Sort code" value={form.sortCode} onChange={set("sortCode")} placeholder="00-00-00" mono />
                  <Field
                    label="Account number"
                    value={form.accountNumber}
                    onChange={set("accountNumber")}
                    placeholder="12345678"
                    mono
                  />
                </Group>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
                  <p className="text-[12px] text-muted-foreground">
                    Bank details are used for weekly settlement only.
                  </p>
                  <SpringButton type="submit" size="lg" disabled={state === "loading"}>
                    {state === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Submitting
                      </>
                    ) : (
                      <>
                        Submit application <ArrowRight className="size-4" />
                      </>
                    )}
                  </SpringButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.16em] text-primary">{title}</legend>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  mono?: boolean;
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
        className={cn(
          "mt-2 h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-4 focus:ring-ring/20",
          mono && "font-mono",
        )}
      />
    </label>
  );
}
