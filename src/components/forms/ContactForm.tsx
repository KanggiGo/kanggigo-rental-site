"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { ChatIcon } from "@/components/icons/Icons";

export default function ContactForm() {
  const t = useTranslations("ContactForm");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
      <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
        <ChatIcon className="h-5 w-5 shrink-0" />
        {t("title")}
      </h3>

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-muted">
          {t("name")}
        </label>
        <input id="contact-name" type="text" {...register("name")} className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{t("nameRequired")}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-muted">
          {t("email")}
        </label>
        <input id="contact-email" type="email" {...register("email")} className={inputClass} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{t("emailInvalid")}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-muted">
          {t("phone")}
        </label>
        <input id="contact-phone" type="tel" {...register("phone")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-muted">
          {t("message")}
        </label>
        <textarea id="contact-message" rows={4} {...register("message")} className={inputClass} />
        {errors.message && <p className="mt-1 text-xs text-red-600">{t("messageRequired")}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
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
