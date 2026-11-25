import type { ApplicationStatus } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "status-applied",
  Assessment: "status-assessment",
  Interview: "status-interview",
  "Job Offer": "status-offer",
  Rejected: "status-rejected",
  Withdrawn: "status-withdrawn",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`status-pill ${statusStyles[status]}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
