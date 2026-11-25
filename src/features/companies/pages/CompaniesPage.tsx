"use client";

import { Building2, ExternalLink, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useApplications } from "@/lib/application-store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddApplicationDialog } from "@/features/applications/components/AddApplicationDialog";

export default function CompaniesPage() {
  const { applications, saveApplication } = useApplications();
  const [dialogOpen, setDialogOpen] = useState(false);
  const companies = useMemo(() => {
    const map = new Map<string, typeof applications>();
    applications.forEach((application) => map.set(application.company, [...(map.get(application.company) ?? []), application]));
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [applications]);

  return (
    <>
      <section className="page-heading"><div><div className="eyebrow">YOUR NETWORK</div><h1>Companies</h1><p>Keep track of every team you’re excited to join.</p></div><button className="button-primary" onClick={() => setDialogOpen(true)}><Plus size={17} />Add Application</button></section>
      {companies.length ? (
        <div className="company-grid">
          {companies.map(([company, records]) => {
            const first = records[0];
            return (
              <article className="panel company-card" key={company}>
                <div className="company-card-heading"><span className={`company-mark company-mark-large mark-${company.length % 5}`}>{company.slice(0, 1)}</span><span className="company-card-count">{records.length} role{records.length === 1 ? "" : "s"}</span></div>
                <h2>{company}</h2>
                <p>{records.map((item) => item.position).join(", ")}</p>
                {first.industry ? <p className="company-industry">{first.industry}</p> : null}
                {first.city ? <p className="company-location">{first.city}{first.province ? `, ${first.province}` : ""} · {first.workArrangement}</p> : null}
                {first.companyWebsite ? <a className="text-link" href={first.companyWebsite} target="_blank" rel="noreferrer">Visit website <ExternalLink size={13} /></a> : null}
                <div className="company-card-statuses">{records.map((item) => <StatusBadge key={item.id} status={item.status} />)}</div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="panel empty-page"><div className="empty-icon"><Building2 size={22} /></div><h2>No companies yet</h2><p>Companies will appear when you add an application.</p></section>
      )}
      {dialogOpen ? <AddApplicationDialog onClose={() => setDialogOpen(false)} onSave={(item) => { saveApplication(item); setDialogOpen(false); }} /> : null}
    </>
  );
}
