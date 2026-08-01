"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations";
import { createReview, updateReview } from "@/lib/actions/reviews";

export default function ReviewForm({
  locale,
  mode,
  reviewId,
  bikes,
  defaultValues,
}: {
  locale: string;
  mode: "create" | "edit";
  reviewId?: string;
  bikes: { id: string; name: string }[];
  defaultValues?: ReviewFormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: defaultValues ?? {
      customerName: "",
      rating: 5,
      comment: "",
      bikeId: null,
      isFeatured: true,
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setFormError(null);
    const result = mode === "create" ? await createReview(values) : await updateReview(reviewId!, values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    router.push(`/${locale}/admin/reviews`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-border bg-white p-5">
      <Field label="Customer name">
        <input {...register("customerName")} className={inputClass} />
        {errors.customerName && <p className="mt-1 text-xs text-red-600">Required.</p>}
      </Field>

      <Field label="Rating (1-5)">
        <input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} className={inputClass} />
      </Field>

      <Field label="Comment">
        <textarea rows={4} {...register("comment")} className={inputClass} />
        {errors.comment && <p className="mt-1 text-xs text-red-600">Required.</p>}
      </Field>

      <Field label="About a specific bike (optional)">
        <select
          {...register("bikeId", { setValueAs: (v) => (v === "" ? null : v) })}
          className={inputClass}
        >
          <option value="">General review</option>
          {bikes.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.name}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" {...register("isFeatured")} className="h-4 w-4" />
        Show on homepage
      </label>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : mode === "create" ? "Create review" : "Save changes"}
      </button>
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
