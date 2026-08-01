type LogoProps = {
  /** `default` = full lockup for light backgrounds, `reversed` = full lockup
   * for navy backgrounds, `icon` = compact mark for tight spaces (e.g. favicon-adjacent use). */
  variant?: "default" | "reversed" | "icon";
  className?: string;
  priority?: boolean;
};

const SOURCES = {
  default: { src: "/logo/kanggigo-rental-logo.svg", width: 1800, height: 360 },
  reversed: { src: "/logo/kanggigo-rental-logo-reversed.png", width: 1800, height: 360 },
  icon: { src: "/logo/kanggigo-rental-icon.svg", width: 1024, height: 1024 },
} as const;

const DEFAULT_CLASS = {
  default: "h-8 w-auto sm:h-9",
  reversed: "h-8 w-auto sm:h-9",
  icon: "h-9 w-9",
} as const;

export default function Logo({ variant = "default", className, priority }: LogoProps) {
  const { src, width, height } = SOURCES[variant];

  // Plain <img> rather than next/image: these are small, already-optimized
  // logo files (an SVG lockup and PNG variants), and next/image's optimizer
  // refuses local SVGs unless you opt in to `dangerouslyAllowSVG` — not
  // worth the complexity for a static logo mark.
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt="KanggiGo Rental"
      className={className ?? DEFAULT_CLASS[variant]}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
