import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Car, Check, CreditCard, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/site-shell";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { createDoc, isFirebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drivers/signup")({
  head: () => ({
    meta: [
      { title: "Create your SparklePass Demo — Driver sign up" },
      {
        name: "description",
        content:
          "Three steps to your digital pass: create your account, add your vehicle registration, pick a plan.",
      },
      { property: "og:title", content: "Driver sign up — SparklePass Demo" },
      { property: "og:description", content: "Create your account, add your vehicle, choose a plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Signup,
});

const STEPS = [
  { id: 0, label: "Account", icon: Mail },
  { id: 1, label: "Vehicle", icon: Car },
  { id: 2, label: "Plan", icon: CreditCard },
];

const PLANS = [
  { id: "unlimited", name: "Unlimited", price: "£14.99/mo" },
  { id: "flexi", name: "Flexi", price: "£9.99/mo" },
  { id: "payg", name: "Pay-As-You-Wash", price: "£4.50/wash" },
];

function Signup() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    reg: "",
    make: "",
    plan: "unlimited",
  });

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  async function finish() {
    setSaving(true);
    await createDoc("drivers", {
      email: data.email,
      reg: data.reg.toUpperCase(),
      make: data.make,
      plan: data.plan,
      status: "active",
    });
    setSaving(false);
    setDone(true);
    toast.success("Welcome to SparklePass Demo", {
      description: isFirebaseConfigured()
        ? "Driver created in Firestore · drivers"
        : "Saved locally (mock mode — Firebase not configured)",
    });
  }

  return (
    <PageShell>
      <div className="mesh-bg mx-auto w-[min(560px,92vw)] pb-24 pt-8">
        <h1 className="text-center font-display text-3xl font-semibold tracking-[-0.04em]">
          Create your pass
        </h1>
        <p className="mt-2 text-center text-[13px] text-muted-foreground">
          Takes about 60 seconds. No card needed for Pay-As-You-Wash.
        </p>

        {/* progress */}
        <div className="mt-9 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const active = step === i;
            const complete = step > i || done;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <button
                  onClick={() => !done && go(i)}
                  className="flex items-center gap-2.5"
                  disabled={done}
                >
                  <span
                    className={cn(
                      "relative grid size-9 place-items-center rounded-full transition-colors",
                      complete
                        ? "bg-success/15 text-success"
                        : active
                          ? "text-primary-foreground"
                          : "bg-elevated text-muted-foreground",
                    )}
                  >
                    {active && !complete && (
                      <motion.span
                        layoutId="stepPill"
                        transition={SPRING}
                        className="absolute inset-0 rounded-full bg-primary"
                      />
                    )}
                    <span className="relative">
                      {complete ? <Check className="size-4" /> : <s.icon className="size-4" />}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "hidden text-[13px] sm:block",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="mx-3 h-px flex-1 bg-border">
                    <motion.div
                      animate={{ width: step > i || done ? "100%" : "0%" }}
                      transition={SPRING}
                      className="h-px bg-primary"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="panel mt-6 overflow-hidden p-7">
          <AnimatePresence mode="wait" custom={dir}>
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING}
                className="py-4 text-center"
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="size-7" />
                </span>
                <p className="mt-5 text-lg font-medium tracking-[-0.02em]">Your pass is live</p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {data.reg.toUpperCase() || "Your vehicle"} is registered on the{" "}
                  {PLANS.find((p) => p.id === data.plan)?.name} plan.
                </p>
                <Link to="/app/pass" className="mt-7 inline-block">
                  <SpringButton size="lg">
                    Open my digital pass <ArrowRight className="size-4" />
                  </SpringButton>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -36 }}
                transition={SPRING}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <Field
                      label="Email"
                      type="email"
                      value={data.email}
                      onChange={(v) => setData({ ...data, email: v })}
                      placeholder="you@example.com"
                    />
                    <Field
                      label="Password"
                      type="password"
                      value={data.password}
                      onChange={(v) => setData({ ...data, password: v })}
                      placeholder="8+ characters"
                    />
                    <SpringButton
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => toast("Google sign-in ready once Firebase Auth is configured")}
                    >
                      Continue with Google
                    </SpringButton>
                  </>
                )}
                {step === 1 && (
                  <>
                    <Field
                      label="Vehicle registration"
                      value={data.reg}
                      onChange={(v) => setData({ ...data, reg: v.toUpperCase() })}
                      placeholder="AB12 CDE"
                      mono
                    />
                    <Field
                      label="Make & model"
                      value={data.make}
                      onChange={(v) => setData({ ...data, make: v })}
                      placeholder="VW Golf"
                    />
                    <p className="text-[12px] text-muted-foreground">
                      Attendants confirm your plate at redemption — no membership card needed.
                    </p>
                  </>
                )}
                {step === 2 && (
                  <div className="space-y-2.5">
                    {PLANS.map((p) => {
                      const active = data.plan === p.id;
                      return (
                        <motion.button
                          key={p.id}
                          whileTap={{ scale: 0.99 }}
                          transition={SPRING}
                          onClick={() => setData({ ...data, plan: p.id })}
                          className={cn(
                            "relative flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
                            active ? "border-primary/40" : "border-border hover:bg-elevated",
                          )}
                        >
                          {active && (
                            <motion.span
                              layoutId="signupPlan"
                              transition={SPRING}
                              className="absolute inset-0 -z-10 rounded-xl bg-primary/[0.09]"
                            />
                          )}
                          <span className="text-sm font-medium">{p.name}</span>
                          <span className="font-mono text-[13px] text-muted-foreground">
                            {p.price}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3">
                  <SpringButton
                    variant="ghost"
                    onClick={() => go(Math.max(0, step - 1))}
                    className={step === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="size-4" /> Back
                  </SpringButton>
                  {step < 2 ? (
                    <SpringButton onClick={() => go(step + 1)}>
                      Continue <ArrowRight className="size-4" />
                    </SpringButton>
                  ) : (
                    <SpringButton onClick={finish} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Creating
                        </>
                      ) : (
                        <>
                          Create my pass <ArrowRight className="size-4" />
                        </>
                      )}
                    </SpringButton>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-4 focus:ring-ring/20",
          mono && "font-mono tracking-[0.08em]",
        )}
      />
    </label>
  );
}
