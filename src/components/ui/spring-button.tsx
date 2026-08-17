import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export const SPRING = { type: "spring" as const, damping: 28, stiffness: 350 };

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-[var(--shadow-glow)]",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-surface",
  outline:
    "hairline bg-surface/60 text-foreground hover:bg-elevated hover:border-primary/40 backdrop-blur",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  children?: React.ReactNode;
};

export function SpringButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={SPRING}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] outline-none transition-[background,box-shadow,color,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
