"use client";

import { updateLeadStatus } from "../actions";
import { LEAD_STATUSES } from "@/lib/crm";
import type { LeadStatus } from "@/lib/types";

export function StatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  return (
    <form action={updateLeadStatus}>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor="lead-status">Estado</label>
      <select
        id="lead-status"
        name="status"
        defaultValue={status}
        key={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium outline-none focus:border-ring"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </form>
  );
}
