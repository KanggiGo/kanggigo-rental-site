import { NewsIcon } from "@/components/icons/Icons";

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

/** Stand-in cover for articles published without an uploaded image. */
export default function ArticleImagePlaceholder({
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
      <NewsIcon className="h-1/4 w-1/4 max-h-16 max-w-16 text-white/85" />
    </div>
  );
}
