"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validations";
import type { LocationOption } from "@/lib/locations";
import { CashIcon } from "@/components/icons/Icons";

export default function BookingForm({
  bikeId,
  locations,
}: {
  bikeId: string;
  locations: LocationOption[];
}) {
  const t = useTranslations("BookingForm");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showDropoff, setShowDropoff] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bikeId,
      customerName: "",
      email: "",
      phone: "",
      pickupLocationId: locations[0]?.id ?? "",
      dropoffLocationId: undefined,
      startDate: "",
      endDate: "",
      message: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    setStatus("idle");
    try {
      const payload = { ...values, dropoffLocationId: showDropoff ? values.dropoffLocationId : undefined };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium text-muted">
          {t("name")}
        </label>
        <input id="booking-name" type="text" {...register("customerName")} className={inputClass} />
        {errors.customerName && <p className="mt-1 text-xs text-red-600">{t("nameRequired")}</p>}
      </div>

      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium text-muted">
          {t("email")}
        </label>
        <input id="booking-email" type="email" {...register("email")} className={inputClass} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{t("emailInvalid")}</p>}
      </div>

      <div>
        <label htmlFor="booking-phone" className="block text-sm font-medium text-muted">
          {t("phone")}
        </label>
        <input id="booking-phone" type="tel" {...register("phone")} className={inputClass} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{t("phoneRequired")}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="booking-start" className="block text-sm font-medium text-muted">
            {t("startDate")}
          </label>
          <input id="booking-start" type="date" {...register("startDate")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="booking-end" className="block text-sm font-medium text-muted">
            {t("endDate")}
          </label>
          <input id="booking-end" type="date" {...register("endDate")} className={inputClass} />
        </div>
      </div>
      {(errors.startDate || errors.endDate) && (
        <p className="text-xs text-red-600">{t("dateRequired")}</p>
      )}

      <div>
        <label htmlFor="booking-pickup" className="block text-sm font-medium text-muted">
          {t("pickupLocation")}
        </label>
        <select id="booking-pickup" {...register("pickupLocationId")} className={inputClass}>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {errors.pickupLocationId && <p className="mt-1 text-xs text-red-600">{t("locationRequired")}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={showDropoff}
          onChange={(e) => setShowDropoff(e.target.checked)}
          className="h-4 w-4"
        />
        {t("differentDropoff")}
      </label>

      {showDropoff && (
        <div>
          <label htmlFor="booking-dropoff" className="block text-sm font-medium text-muted">
            {t("dropoffLocation")}
          </label>
          <select id="booking-dropoff" {...register("dropoffLocationId")} className={inputClass}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="booking-message" className="block text-sm font-medium text-muted">
          {t("message")}
        </label>
        <textarea id="booking-message" rows={3} {...register("message")} className={inputClass} />
      </div>

      <p className="flex items-start gap-1.5 rounded-md bg-sand px-3 py-2 text-xs text-ink">
        <CashIcon className="h-4 w-4 shrink-0 text-accent" />
        {t("paymentNote")}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-primary hover:bg-accent-hover disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      {status === "success" && <p className="text-sm text-emerald-700">{t("success")}</p>}
      {status === "error" && <p className="text-sm text-red-600">{t("error")}</p>}
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";
