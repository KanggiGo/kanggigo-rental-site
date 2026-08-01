"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { locationFormSchema, type LocationFormValues } from "@/lib/validations";
import { createLocation, updateLocation } from "@/lib/actions/locations";
import { slugify } from "@/lib/utils";

const LOCALES = ["en", "id", "ru", "fr"] as const;
const LOCALE_LABELS: Record<(typeof LOCALES)[number], string> = {
  en: "English",
  id: "Indonesian",
  ru: "Russian",
  fr: "French",
};

function emptyTranslations() {
  return LOCALES.map((locale) => ({ locale, name: "", description: "" }));
}

export default function LocationForm({
  locale,
  mode,
  locationId,
  defaultValues,
}: {
  locale: string;
  mode: "create" | "edit";
  locationId?: string;
  defaultValues?: LocationFormValues;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof LOCALES)[number]>("en");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      isAirport: false,
      deliveryNote: "",
      translations: emptyTranslations(),
    },
  });

  const enName = watch("translations.0.name");

  const onSubmit = async (values: LocationFormValues) => {
    setFormError(null);
    const result = mode === "create" ? await createLocation(values) : await updateLocation(locationId!, values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    router.push(`/${locale}/admin/locations`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Basic info</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug">
            <div className="flex gap-2">
              <input {...register("slug")} className={inputClass} />
              <button
                type="button"
                onClick={() => setValue("slug", slugify(enName || ""))}
                className="shrink-0 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink hover:border-primary"
              >
                From name
              </button>
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </Field>

          <Field label="Delivery note (shown on the location page)">
            <input {...register("deliveryNote")} className={inputClass} />
          </Field>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" {...register("isAirport")} className="h-4 w-4" />
          This is an airport pick-up point
        </label>
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Translations</h2>
        <div className="mt-3 flex gap-2">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveTab(l)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                activeTab === l ? "bg-primary text-white" : "bg-surface text-muted"
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>

        {LOCALES.map((l, index) => (
          <div key={l} className={activeTab === l ? "mt-4 space-y-3" : "hidden"}>
            <Field label={`Name (${LOCALE_LABELS[l]})`}>
              <input {...register(`translations.${index}.name` as const)} className={inputClass} />
            </Field>
            <Field label={`Description (${LOCALE_LABELS[l]})`}>
              <textarea rows={3} {...register(`translations.${index}.description` as const)} className={inputClass} />
            </Field>
          </div>
        ))}
        {errors.translations && (
          <p className="mt-2 text-xs text-red-600">An English name is required.</p>
        )}
      </section>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create location" : "Save changes"}
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
