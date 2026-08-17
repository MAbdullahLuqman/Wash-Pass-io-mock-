import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SpringButton, SPRING } from "@/components/ui/spring-button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/drivers", label: "Drivers" },
  { to: "/operators", label: "Operators" },
  { to: "/operators/calculator", label: "Revenue calculator" },
  { to: "/investors", label: "Investors" },
];

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 w-[min(1180px,94vw)]">
        <div className="panel flex h-14 items-center justify-between px-3 pl-4 shadow-[var(--shadow-elevated)]">
          <Link to="/" className="brand" aria-label="Wash Pass home">
            <BrandMark />
            <span className="brand-word">
              wash
              <br />
              pass
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13px] transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navPill"
                      transition={SPRING}
                      className="absolute inset-0 -z-10 rounded-full bg-elevated"
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/app/pass" className="hidden sm:block">
              <SpringButton variant="ghost" size="sm">
                My pass
              </SpringButton>
            </Link>
            <Link to="/drivers/signup">
              <SpringButton size="sm">Get the pass</SpringButton>
            </Link>
            <SpringButton
              variant="ghost"
              size="sm"
              className="px-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </SpringButton>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING}
              className="panel mt-2 flex flex-col p-2 md:hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-12">
      <div className="mx-auto flex w-[min(1180px,90vw)] flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <div className="brand">
            <BrandMark />
            <span className="brand-word">
              wash
              <br />
              pass
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            The UK car wash marketplace. One pass for drivers, a demand engine for operators.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-[13px] sm:grid-cols-3">
          <FooterCol
            title="Drivers"
            items={[
              { to: "/drivers", label: "Plans" },
              { to: "/drivers/signup", label: "Sign up" },
              { to: "/app/pass", label: "Digital pass" },
            ]}
          />
          <FooterCol
            title="Operators"
            items={[
              { to: "/operators", label: "Why Wash Pass" },
              { to: "/operators/calculator", label: "Revenue calculator" },
              { to: "/operators/signup", label: "Apply" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { to: "/investors", label: "Investors (SEIS)" },
              { to: "/admin/dashboard", label: "Admin" },
              { to: "/operator/portal", label: "Operator portal" },
            ]}
          />
        </div>
      </div>
      <p className="mx-auto mt-10 w-[min(1180px,90vw)] text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Wash Pass Ltd. SEIS advance assurance approved. Figures shown
        are illustrative projections.
      </p>
    </footer>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground/70">{title}</p>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="text-muted-foreground transition-colors hover:text-primary">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.02 }}
        className="pt-24"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="rule-label">
      <span className="h-px w-8 bg-foreground/30" />
      {children}
    </span>
  );
}
