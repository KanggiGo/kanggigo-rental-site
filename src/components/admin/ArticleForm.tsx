"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { articleFormSchema, type ArticleFormValues } from "@/lib/validations";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { slugify } from "@/lib/utils";

const CATEGORY_PRESETS = ["News", "Regulations", "Guides", "Events"];

export default function ArticleForm({
  locale,
  mode,
  articleId,
  defaultValues,
}: {
  locale: string;
  mode: "create" | "edit";
  articleId?: string;
  defaultValues?: ArticleFormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      coverImageUrl: "",
      category: "News",
      isPublished: true,
      publishedAt: new Date().toISOString().slice(0, 10),
    },
  });

  const title = watch("title");
  const coverImageUrl = watch("coverImageUrl");

  const onSubmit = async (values: ArticleFormValues) => {
    setFormError(null);
    const result = mode === "create" ? await createArticle(values) : await updateArticle(articleId!, values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    router.push(`/${locale}/admin/articles`);
    router.refresh();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "upload_failed");
      setValue("coverImageUrl", data.url);
    } catch {
      setFormError("Image upload failed. Please try a different file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Article</h2>

        <div className="mt-4 space-y-4">
          <Field label="Title">
            <input {...register("title")} className={inputClass} />
            {errors.title && <p className="mt-1 text-xs text-red-600">Required.</p>}
          </Field>

          <Field label="Slug">
            <div className="flex gap-2">
              <input {...register("slug")} className={inputClass} />
              <button
                type="button"
                onClick={() => setValue("slug", slugify(title || ""))}
                className="shrink-0 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink hover:border-primary"
              >
                From title
              </button>
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </Field>

          <Field label="Excerpt (shown on the news listing, max ~300 characters)">
            <textarea rows={2} {...register("excerpt")} className={inputClass} />
            {errors.excerpt && <p className="mt-1 text-xs text-red-600">Required.</p>}
          </Field>

          <Field label="Body">
            <textarea rows={12} {...register("body")} className={inputClass} />
            {errors.body && <p className="mt-1 text-xs text-red-600">Required.</p>}
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Category">
              <input {...register("category")} list="category-presets" className={inputClass} />
              <datalist id="category-presets">
                {CATEGORY_PRESETS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <Field label="Published date">
              <input type="date" {...register("publishedAt")} className={inputClass} />
            </Field>

            <label className="flex items-center gap-2 self-end pb-2 text-sm text-muted">
              <input type="checkbox" {...register("isPublished")} className="h-4 w-4" />
              Published (visible on the site)
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Cover image</h2>

        {coverImageUrl && (
          <div className="relative mt-3 h-40 w-full max-w-sm overflow-hidden rounded-md bg-surface">
            <Image src={coverImageUrl} alt="" fill sizes="384px" className="object-cover" />
          </div>
        )}

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileSelected}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="mt-1 text-xs text-muted">Uploading...</p>}
        </div>
      </section>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create article" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-muted">
      {label}
      {children}
    </label>
  );
}
