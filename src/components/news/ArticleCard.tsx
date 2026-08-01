import Image from "next/image";
import type { Article } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import ArticleImagePlaceholder from "./ArticleImagePlaceholder";

export default function ArticleCard({ article, locale }: { article: Article; locale: string }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ArticleImagePlaceholder
            seed={article.id}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute start-3 top-3 rounded-full bg-ink-overlay px-2.5 py-1 text-xs font-medium text-white">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {formatDate(article.publishedAt, locale)}
        </p>
        <h3 className="font-heading text-base font-semibold leading-snug text-ink">{article.title}</h3>
        <p className="mt-auto line-clamp-3 text-sm text-muted">{article.excerpt}</p>
      </div>
    </Link>
  );
}
