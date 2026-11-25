"use client";

import { BriefcaseBusiness, CalendarDays, Plus, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "@/lib/application-store";
import { ApplicationFilters } from "@/features/applications/components/ApplicationFilters";
import { ApplicationTable } from "@/features/applications/components/ApplicationTable";
import { AddApplicationDialog } from "@/features/applications/components/AddApplicationDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Application } from "@/types/application";

export default function DashboardPage() {
  const router = useRouter();
  const { applications, isLoaded, usingSamples, saveApplication, deleteApplication } = useApplications();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [dialog, setDialog] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const counts = useMemo(() => ({
    "All Applications": applications.length,
    Applied: applications.filter((item) => item.status === "Applied").length,
    Assessment: applications.filter((item) => item.status === "Assessment").length,
    Interview: applications.filter((item) => item.status === "Interview").length,
    "Job Offer": applications.filter((item) => item.status === "Job Offer").length,
    Rejected: applications.filter((item) => item.status === "Rejected").length,
    Withdrawn: applications.filter((item) => item.status === "Withdrawn").length,
  }), [applications]);

  const visible = useMemo(() => applications
    .filter((item) => !search || `${item.company} ${item.position}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "desc"
      ? b.applicationDate.localeCompare(a.applicationDate)
      : a.applicationDate.localeCompare(b.applicationDate)), [applications, search, sort]);

  const stats = [
    { label: "Total Applications", count: applications.length, icon: BriefcaseBusiness, className: "metric-blue", detail: "Across your search" },
    { label: "Interviews", count: counts.Interview, icon: Users, className: "metric-violet", detail: "You’re moving forward" },
    { label: "Assessments", count: counts.Assessment, icon: CalendarDays, className: "metric-green", detail: "Show what you can do" },
    { label: "Job Offers", count: counts["Job Offer"], icon: Trophy, className: "metric-pink", detail: "A great next step" },
  ];

  return (
    <>
      <section className="page-heading dashboard-heading">
        <div><h1>Dashboard</h1><p>Manage your job search and track your applications.</p></div>
        <div className="heading-actions"><span className={`data-label${usingSamples ? "" : " data-label-saved"}`}><span className="data-label-dot" />{usingSamples ? "Sample data" : "Saved locally"}</span><button className="button-primary" onClick={() => setDialog("add")}><Plus size={17} />Add Application</button></div>
      </section>

      <section aria-label="Application statistics" className="metrics-grid dashboard-metrics">
        {stats.map(({ label, count, icon: Icon, className, detail }) => (
          <button className="metric-card" key={label} onClick={() => router.push("/applications")} type="button">
            <div className="metric-card-top"><span className="metric-label">{label}</span><span className={`metric-icon ${className}`}><Icon size={17} /></span></div>
            <div className="metric-count">{count}</div><div className="metric-detail">{detail}</div>
          </button>
        ))}
      </section>

      <section className="panel applications-panel">
        <div className="panel-heading applications-heading"><div><h2>Recent Applications</h2><p>{visible.length} application{visible.length === 1 ? "" : "s"}</p></div><button className="text-link" onClick={() => router.push("/applications")}>View all</button></div>
        <ApplicationFilters search={search} onSearch={setSearch} />
        {!isLoaded ? <div className="empty-state"><p>Loading your applications…</p></div> : (
          <ApplicationTable applications={visible.slice(0, 5)} sortDirection={sort} onToggleSort={() => setSort((value) => value === "desc" ? "asc" : "desc")} onView={(item) => { setSelected(item); setDialog("view"); }} onEdit={(item) => { setSelected(item); setDialog("edit"); }} onDelete={setDeleteTarget} />
        )}
      </section>

      {dialog ? <AddApplicationDialog application={selected ?? undefined} onView={dialog === "view"} onClose={() => { setDialog(null); setSelected(null); }} onSave={(item) => { saveApplication(item); setDialog(null); setSelected(null); }} /> : null}
      {deleteTarget ? <ConfirmDialog title="Delete application?" description={`Remove ${deleteTarget.position} at ${deleteTarget.company} from your tracker?`} onCancel={() => setDeleteTarget(null)} onConfirm={() => { deleteApplication(deleteTarget.id); setDeleteTarget(null); }} /> : null}
    </>
  );
}
