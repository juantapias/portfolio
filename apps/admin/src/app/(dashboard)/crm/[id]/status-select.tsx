"use client";

import { updateLeadStatus } from "../actions";
import { LEAD_STATUSES } from "@/lib/crm";
import type { LeadStatus } from "@/lib/types";

export function StatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  return (
    <form action={updateLeadStatus} className="w-full md:w-auto">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor="lead-status">Estado</label>
      <select
        id="lead-status"
        name="status"
        defaultValue={status}
        key={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-base font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 md:h-9 md:w-auto md:text-sm"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </form>
  );
}
