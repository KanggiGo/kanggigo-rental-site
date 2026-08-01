import { ScooterIcon } from "@/components/icons/Icons";

const GRADIENTS = [
  "from-primary to-primary-hover",
  "from-[#132941] to-[#1b3a5b]",
  "from-[#0d1c2e] to-accent",
  "from-[#0a1522] to-primary-hover",
];

function pickGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

/**
 * Stand-in for real bike photography, which doesn't exist yet for this new
 * brand. Renders a deterministic gradient + scooter mark instead of a photo.
 * Swap for `next/image` once real fleet photos are uploaded via /admin —
 * BikeCard/BikeGallery already prefer a real BikeImage.url when present.
 */
export default function BikeImagePlaceholder({
  seed,
  className = "",
}: {
  seed: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${pickGradient(seed)} ${className}`}
    >
      <ScooterIcon className="h-1/3 w-1/3 max-h-24 max-w-24 text-white/85" />
    </div>
  );
}
