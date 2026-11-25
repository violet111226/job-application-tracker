"use client";

import { ChevronDown } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/application-store";
import type { ApplicationStatus } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "status-applied",
  Assessment: "status-assessment",
  Interview: "status-interview",
  "Job Offer": "status-offer",
  Rejected: "status-rejected",
  Withdrawn: "status-withdrawn",
};

export function EditableStatusBadge({
  status,
  label,
  onChange,
}: {
  status: ApplicationStatus;
  label: string;
  onChange: (status: ApplicationStatus) => void;
}) {
  return (
    <span className={`status-select-wrap ${statusStyles[status]}`}>
      <span aria-hidden="true" className="status-dot" />
      <select
        aria-label={`Change status for ${label}`}
        className="status-select"
        onChange={(event) => onChange(event.target.value as ApplicationStatus)}
        value={status}
      >
        {APPLICATION_STATUSES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="status-select-chevron" size={12} />
    </span>
  );
}
