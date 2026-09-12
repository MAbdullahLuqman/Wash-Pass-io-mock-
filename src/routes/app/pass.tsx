import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Infinity as InfinityIcon, MapPin, Navigation, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SpringButton, SPRING } from "@/components/ui/spring-button";

export const Route = createFileRoute("/app/pass")({
  head: () => ({
    meta: [
      { title: "My SparklePass Demo — Digital pass & QR" },
      {
        name: "description",
        content:
          "Your live SparklePass Demo: rotating QR code, plan balance and the nearest partner sites with current wait times.",
      },
      { property: "og:title", content: "My SparklePass Demo" },
      { property: "og:description", content: "Scan to redeem your wash at any partner site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pass,
});

const SITES = [
  { name: "Shine Lane · Hackney", distance: "0.4 mi", wait: "No wait" },
  { name: "AquaJet · Dalston", distance: "1.1 mi", wait: "6 min" },
  { name: "Prestige Hand Wash", distance: "1.8 mi", wait: "No wait" },
];

/** Deterministic pseudo-QR matrix from a token — swaps every refresh cycle. */
function useQrMatrix(token: string) {
  return useMemo(() => {
    let seed = 0;
    for (let i = 0; i < token.length; i++) seed = (seed * 31 + token.charCodeAt(i)) % 100000;
    const size = 21;
    const cells: boolean[] = [];
    for (let i = 0; i < size * size; i++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      cells.push((seed >> 16) % 2 === 0);
    }
    return { size, cells };
  }, [token]);
}

function Pass() {
  const [token, setToken] = useState("WP-8241-QX");
  const [seconds, setSeconds] = useState(30);
  const { size, cells } = useQrMatrix(token);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setToken(`WP-${Math.floor(1000 + Math.random() * 8999)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`);
          return 30;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mesh-bg grain min-h-screen">
      <div className="mx-auto w-[min(430px,94vw)] py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]">
            <Sparkles className="size-4 text-primary" /> SparklePass Demo
          </Link>
          <span className="hairline rounded-full bg-surface/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            AB12 CDE
          </span>
        </div>

        {/* pass card */}
        <motion.div
          layoutId="passCard"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={SPRING}
          className="panel glow mt-6 overflow-hidden p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Plan</p>
              <p className="mt-1 text-lg font-medium tracking-[-0.02em]">Unlimited</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-[12px] text-success">
              <InfinityIcon className="size-3.5" /> Active
            </span>
          </div>

          <div className="relative mx-auto mt-7 w-fit">
            <motion.span
              animate={{ scale: [1, 1.14, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-3xl bg-primary/40 blur-xl"
            />
            <motion.div
              key={token}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING}
              className="relative rounded-3xl bg-foreground p-4"
            >
              <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${size}, 8px)` }}
                aria-label="SparklePass Demo QR code"
                role="img"
              >
                {cells.map((on, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-[1px]"
                    style={{ background: on ? "var(--background)" : "transparent" }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[12px]">
            <span className="font-mono tracking-[0.08em] text-muted-foreground">{token}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <RefreshCw className="size-3.5" /> refreshes in {seconds}s
            </span>
          </div>
        </motion.div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="panel p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              This month
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-[-0.03em]">7</p>
            <p className="text-[12px] text-muted-foreground">washes redeemed</p>
          </div>
          <div className="panel p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Saved</p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-[-0.03em] text-success">
              £16.50
            </p>
            <p className="text-[12px] text-muted-foreground">vs pay-per-wash</p>
          </div>
        </div>

        <div className="panel mt-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-[-0.015em]">Nearby sites</p>
            <SpringButton variant="ghost" size="sm">
              <Navigation className="size-3.5" /> Map
            </SpringButton>
          </div>
          <ul className="mt-3 divide-y divide-border/70">
            {SITES.map((s) => (
              <motion.li
                key={s.name}
                whileHover={{ x: 3 }}
                transition={SPRING}
                className="flex items-center justify-between py-3"
              >
                <span className="flex items-center gap-2.5 text-[13px]">
                  <MapPin className="size-4 text-primary" />
                  <span>
                    {s.name}
                    <span className="block text-[12px] text-muted-foreground">{s.distance}</span>
                  </span>
                </span>
                <span className="text-[12px] text-muted-foreground">{s.wait}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
