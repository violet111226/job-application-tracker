import type { ApplicationStatus } from "@/types/application";

export function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
) {
  if (!min && !max) return "Not listed";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "PHP",
    maximumFractionDigits: 0,
  });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  return formatter.format(min ?? max ?? 0);
}

export function statusLabel(status: ApplicationStatus) {
  return status;
}
