"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { bikeFormSchema, type BikeFormValues } from "@/lib/validations";
import { createBike, updateBike } from "@/lib/actions/bikes";
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

export default function BikeForm({
  locale,
  mode,
  bikeId,
  defaultValues,
}: {
  locale: string;
  mode: "create" | "edit";
  bikeId?: string;
  defaultValues?: BikeFormValues;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof LOCALES)[number]>("en");
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BikeFormValues>({
    resolver: zodResolver(bikeFormSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      brand: "",
      category: "SCOOTER_AUTOMATIC",
      transmission: "AUTOMATIC",
      engineCc: 125,
      seats: 2,
      helmetsIncluded: 2,
      pricePerDay: 0,
      pricePerWeek: 0,
      pricePerMonth: 0,
      currency: "USD",
      status: "AVAILABLE",
      isFeatured: false,
      translations: emptyTranslations(),
      images: [],
    },
  });

  const enName = watch("translations.0.name");
  const imagesField = useFieldArray({ control, name: "images" });

  const onSubmit = async (values: BikeFormValues) => {
    setFormError(null);
    const normalizedImages = values.images.map((img, index) => ({ ...img, sortOrder: index }));
    const payload = { ...values, images: normalizedImages };

    const result = mode === "create" ? await createBike(payload) : await updateBike(bikeId!, payload);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    router.push(`/${locale}/admin/bikes`);
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

      const current = getValues("images");
      imagesField.append({
        url: data.url,
        altText: enName || "",
        sortOrder: current.length,
        isCoverImage: current.length === 0,
      });
    } catch {
      setFormError("Image upload failed. Please try a different file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const setCoverImage = (index: number) => {
    const current = getValues("images");
    current.forEach((_, i) => setValue(`images.${i}.isCoverImage`, i === index));
  };

  const onDragStart = (index: number) => {
    dragIndex.current = index;
  };
  const onDropRow = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) return;
    imagesField.move(dragIndex.current, index);
    dragIndex.current = null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Basic info</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Brand">
            <input {...register("brand")} className={inputClass} placeholder="Honda, Yamaha..." />
          </Field>

          <Field label="Bike type">
            <select {...register("category")} className={selectClass}>
              <option value="SCOOTER_AUTOMATIC">Automatic scooter</option>
              <option value="MANUAL">Manual</option>
              <option value="ADVENTURE">Adventure</option>
              <option value="ELECTRIC">Electric</option>
            </select>
          </Field>

          <Field label="Transmission">
            <select {...register("transmission")} className={selectClass}>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </Field>

          <Field label="Engine (cc)">
            <input type="number" {...register("engineCc", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Seats">
            <input type="number" {...register("seats", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Helmets included">
            <input type="number" {...register("helmetsIncluded", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Price per day (USD)">
            <input type="number" step="0.01" {...register("pricePerDay", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Price per week (USD)">
            <input type="number" step="0.01" {...register("pricePerWeek", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Price per month (USD)">
            <input type="number" step="0.01" {...register("pricePerMonth", { valueAsNumber: true })} className={inputClass} />
          </Field>

          <Field label="Originally quoted currency">
            <select {...register("currency")} className={selectClass}>
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="EUR">EUR</option>
              <option value="AUD">AUD</option>
              <option value="GBP">GBP</option>
            </select>
          </Field>

          <Field label="Status">
            <select {...register("status")} className={selectClass}>
              <option value="AVAILABLE">Available</option>
              <option value="MAINTENANCE">In maintenance</option>
              <option value="RETIRED">Retired</option>
            </select>
          </Field>

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
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" {...register("isFeatured")} className="h-4 w-4" />
          Featured on homepage
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
              <textarea rows={4} {...register(`translations.${index}.description` as const)} className={inputClass} />
            </Field>
          </div>
        ))}
        {errors.translations && (
          <p className="mt-2 text-xs text-red-600">All 4 languages need a name and description.</p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">Images</h2>
        <p className="mt-1 text-xs text-muted">
          Drag rows to reorder. The first image is the cover unless you set another. Bikes with no
          images fall back to a placeholder graphic on the site.
        </p>

        <div className="mt-4 space-y-2">
          {imagesField.fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropRow(index)}
              className="flex cursor-move items-center gap-3 rounded-md border border-border p-2"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-surface">
                <Image src={watch(`images.${index}.url`)} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <input
                {...register(`images.${index}.altText` as const)}
                placeholder="Alt text"
                className={inputClass + " flex-1"}
              />
              <label className="flex items-center gap-1 whitespace-nowrap text-xs text-muted">
                <input
                  type="radio"
                  checked={watch(`images.${index}.isCoverImage`)}
                  onChange={() => setCoverImage(index)}
                />
                Cover
              </label>
              <button
                type="button"
                onClick={() => imagesField.remove(index)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

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
          {isSubmitting ? "Saving..." : mode === "create" ? "Create bike" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";
const selectClass = inputClass;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-muted">
      {label}
      {children}
    </label>
  );
}
