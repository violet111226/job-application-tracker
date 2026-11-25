"use client";

import { CalendarDays, CalendarHeart, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useApplications } from "@/lib/application-store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function FollowUpsPage() {
  const { applications, clearFollowUp } = useApplications();
  const [today, setToday] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToday(new Date().toISOString().slice(0, 10));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const followUps = applications.filter((item) => item.followUpDate).sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""));
  const overdue = followUps.filter((item) => (item.followUpDate ?? "") < today);
  const upcoming = followUps.filter((item) => (item.followUpDate ?? "") >= today);

  function renderGroup(title: string, items: typeof followUps) {
    return items.length ? (
      <section className="panel follow-up-panel">
        <div className="panel-heading"><div><h2>{title}</h2><p>{items.length} reminder{items.length === 1 ? "" : "s"}</p></div></div>
        <div className="follow-up-list">
          {items.map((item) => (
            <article className="follow-up-item" key={item.id}>
              <span className={`follow-up-date${title === "Overdue" ? " overdue" : ""}`}><CalendarDays size={16} />{formatDate(item.followUpDate ?? "")}</span>
              <div className="follow-up-company"><span className={`company-mark mark-${item.company.length % 5}`}>{item.company.slice(0, 1)}</span><div><strong>{item.company}</strong><p>{item.position}</p></div></div>
              <StatusBadge status={item.status} />
              <button className="button-secondary complete-button" onClick={() => clearFollowUp(item.id)}><Check size={15} />Mark complete</button>
            </article>
          ))}
        </div>
      </section>
    ) : null;
  }

  return (
    <>
      <section className="page-heading"><div><div className="eyebrow">STAY TOP OF MIND</div><h1>Follow-ups</h1><p>A thoughtful follow-up can help you stand out.</p></div><span className="follow-up-count"><CalendarHeart size={16} />{followUps.length} scheduled</span></section>
      {followUps.length ? <div className="follow-up-groups">{renderGroup("Overdue", overdue)}{renderGroup("Upcoming", upcoming)}</div> : (
        <section className="panel empty-page"><div className="empty-icon"><CalendarHeart size={22} /></div><h2>No follow-ups scheduled</h2><p>Add a follow-up date to an application to see it here.</p></section>
      )}
    </>
  );
}
