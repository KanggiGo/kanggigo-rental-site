"use client";

import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">Something went wrong</h1>
      <p className="max-w-md text-muted">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
