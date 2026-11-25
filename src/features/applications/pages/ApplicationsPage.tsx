"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useApplications } from "@/lib/application-store";
import { ApplicationFilters } from "../components/ApplicationFilters";
import { ApplicationTable } from "../components/ApplicationTable";
import { AddApplicationDialog } from "../components/AddApplicationDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Application } from "@/types/application";

export default function ApplicationsPage() {
  const { applications, isLoaded, saveApplication, deleteApplication } = useApplications();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [dialog, setDialog] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const visible = useMemo(() => applications
    .filter((item) => !search || `${item.company} ${item.position} ${item.city}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "desc" ? b.applicationDate.localeCompare(a.applicationDate) : a.applicationDate.localeCompare(b.applicationDate)), [applications, search, sort]);

  return (
    <>
      <section className="page-heading"><div><div className="eyebrow">YOUR JOB SEARCH</div><h1>Applications</h1><p>Every opportunity, organized in one place.</p></div><button className="button-primary" onClick={() => setDialog("add")}><Plus size={17} />Add Application</button></section>
      <section className="panel applications-panel">
        <div className="panel-heading applications-heading"><div><h2>All Applications</h2><p>{visible.length} of {applications.length} records</p></div></div>
        <ApplicationFilters search={search} onSearch={setSearch} />
        {!isLoaded ? <div className="empty-state"><p>Loading your applications…</p></div> : <ApplicationTable applications={visible} sortDirection={sort} onToggleSort={() => setSort((value) => value === "desc" ? "asc" : "desc")} onView={(item) => { setSelected(item); setDialog("view"); }} onEdit={(item) => { setSelected(item); setDialog("edit"); }} onDelete={setDeleteTarget} />}
      </section>
      {dialog ? <AddApplicationDialog application={selected ?? undefined} onView={dialog === "view"} onClose={() => { setDialog(null); setSelected(null); }} onSave={(item) => { saveApplication(item); setDialog(null); setSelected(null); }} /> : null}
      {deleteTarget ? <ConfirmDialog title="Delete application?" description={`Remove ${deleteTarget.position} at ${deleteTarget.company} from your tracker?`} onCancel={() => setDeleteTarget(null)} onConfirm={() => { deleteApplication(deleteTarget.id); setDeleteTarget(null); }} /> : null}
    </>
  );
}
