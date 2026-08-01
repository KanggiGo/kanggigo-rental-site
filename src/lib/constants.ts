export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+000000000";

export const SITE_NAME = "KanggiGo Rental";

export const CONTACT_EMAIL = "hello@kanggigo-rental.example";

export const POPULAR_LOCATION_SLUGS = [
  "canggu",
  "seminyak",
  "uluwatu",
  "ubud",
  "sanur",
  "denpasar-airport",
];

export const BIKE_CATEGORIES = [
  "SCOOTER_AUTOMATIC",
  "MANUAL",
  "ADVENTURE",
  "ELECTRIC",
] as const;

export type BikeCategorySlug = (typeof BIKE_CATEGORIES)[number];
