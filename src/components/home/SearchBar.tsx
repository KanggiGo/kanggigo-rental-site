"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { LocationOption } from "@/lib/locations";

export default function SearchBar({ locations }: { locations: LocationOption[] }) {
  const t = useTranslations("Home");
  const router = useRouter();

  const [pickup, setPickup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickup) params.set("pickup", pickup);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    router.push(qs ? `/bikes?${qs}` : "/bikes");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full max-w-3xl grid-cols-1 gap-3 rounded-xl bg-white-panel p-4 shadow-lg backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-2 lg:p-3"
    >
      <Field label={t("searchPickup")}>
        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full rounded-md border border-border px-2 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">{t("anyLocation")}</option>
          {locations.map((loc) => (
            <option key={loc.slug} value={loc.slug}>
              {loc.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("searchStartDate")}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-md border border-border px-2 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </Field>

      <Field label={t("searchEndDate")}>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-md border border-border px-2 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </Field>

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary hover:bg-accent-hover lg:mt-6"
      >
        {t("searchButton")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-start text-xs font-medium text-muted">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
