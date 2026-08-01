"use client";

import { useState } from "react";
import Image from "next/image";
import BikeImagePlaceholder from "./BikeImagePlaceholder";

type GalleryImage = { url: string; altText: string };

export default function BikeGallery({
  images,
  seed,
}: {
  images: GalleryImage[];
  seed: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <BikeImagePlaceholder seed={seed} className="h-64 w-full rounded-xl sm:h-[420px]" />
    );
  }

  const [first, ...rest] = images;

  return (
    <>
      <div className="grid h-64 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[420px] sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="relative col-span-2 row-span-2 block h-full w-full"
        >
          <Image src={first.url} alt={first.altText} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" priority />
          {rest.length > 0 && (
            <span className="absolute bottom-2 end-2 rounded-full bg-ink-overlay px-3 py-1 text-xs font-medium text-white sm:hidden">
              +{rest.length} photos
            </span>
          )}
        </button>
        {rest.slice(0, 4).map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setOpenIndex(i + 1)}
            className="relative col-span-1 row-span-1 hidden h-full w-full sm:block"
          >
            <Image src={img.url} alt={img.altText} fill sizes="25vw" className="object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute end-4 top-4 text-3xl text-white"
            onClick={() => setOpenIndex(null)}
          >
            &times;
          </button>

          {openIndex > 0 && (
            <button
              type="button"
              aria-label="Previous"
              className="absolute start-4 text-4xl text-white"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : i));
              }}
            >
              ‹
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[openIndex].url}
              alt={images[openIndex].altText}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            aria-label="Next"
            className="absolute end-4 text-4xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i !== null ? (i + 1) % images.length : i));
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
