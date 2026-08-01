"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import { updateBookingStatus } from "@/lib/actions/bookings";

const STATUSES: BookingStatus[] = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"];

export default function BookingStatusSelect({ id, status }: { id: string; status: BookingStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(async () => {
          await updateBookingStatus(id, e.target.value as BookingStatus);
          router.refresh();
        })
      }
      className="rounded-md border border-border px-2 py-1.5 text-xs font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
