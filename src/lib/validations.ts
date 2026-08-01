import { z } from "zod";

const LOCALE_TUPLE = ["en", "id", "ru", "fr"] as const;

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const bookingFormSchema = z
  .object({
    bikeId: z.string().min(1),
    customerName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
    pickupLocationId: z.string().min(1),
    dropoffLocationId: z.string().min(1).optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    message: z.string().trim().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bikeTranslationSchema = z.object({
  locale: z.enum(LOCALE_TUPLE),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const bikeImageSchema = z.object({
  url: z.string().trim().min(1),
  altText: z.string().trim(),
  sortOrder: z.number().int().min(0),
  isCoverImage: z.boolean(),
});

export const bikeFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, numbers and hyphens only"),
    brand: z.string().trim().min(1),
    category: z.enum(["SCOOTER_AUTOMATIC", "MANUAL", "ADVENTURE", "ELECTRIC"]),
    transmission: z.enum(["AUTOMATIC", "MANUAL"]),
    engineCc: z.number().int().min(0),
    seats: z.number().int().min(1),
    helmetsIncluded: z.number().int().min(0),
    pricePerDay: z.number().min(0),
    pricePerWeek: z.number().min(0),
    pricePerMonth: z.number().min(0),
    currency: z.enum(["IDR", "USD", "EUR", "AUD", "GBP"]),
    status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
    isFeatured: z.boolean(),
    translations: z.array(bikeTranslationSchema).length(4),
    images: z.array(bikeImageSchema),
  })
  .refine((data) => data.translations.some((t) => t.locale === "en"), {
    message: "An English translation is required",
    path: ["translations"],
  });

export type BikeFormValues = z.infer<typeof bikeFormSchema>;

export const locationTranslationSchema = z.object({
  locale: z.enum(LOCALE_TUPLE),
  name: z.string().trim().min(1),
  description: z.string().trim(),
});

export const locationFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, numbers and hyphens only"),
    isAirport: z.boolean(),
    deliveryNote: z.string().trim(),
    translations: z.array(locationTranslationSchema).length(4),
  })
  .refine((data) => data.translations.some((t) => t.locale === "en"), {
    message: "An English translation is required",
    path: ["translations"],
  });

export type LocationFormValues = z.infer<typeof locationFormSchema>;

export const reviewFormSchema = z.object({
  customerName: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1),
  bikeId: z.string().nullable(),
  isFeatured: z.boolean(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const articleFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, numbers and hyphens only"),
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1),
  coverImageUrl: z.string().trim(),
  category: z.string().trim().min(1),
  isPublished: z.boolean(),
  publishedAt: z.string().min(1),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
