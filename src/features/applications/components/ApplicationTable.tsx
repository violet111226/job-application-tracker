"use client";

import { ArrowDown, ArrowUp, BriefcaseBusiness, ExternalLink, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Application } from "@/types/application";
import { formatDate, formatSalary } from "@/lib/utils";

export function ApplicationTable({
  applications,
  sortDirection,
  onToggleSort,
  onView,
  onEdit,
  onDelete,
}: {
  applications: Application[];
  sortDirection: "asc" | "desc";
  onToggleSort: () => void;
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}) {
  const [openMenu, setOpenMenu] = useState<{
    application: Application;
    top: number;
    left: number;
    trigger: HTMLButtonElement;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    const activeMenu = openMenu;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !activeMenu.trigger.contains(target)) {
        setOpenMenu(null);
      }
    }

    function closeMenu() {
      setOpenMenu(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  function toggleMenu(application: Application, trigger: HTMLButtonElement) {
    if (openMenu?.application.id === application.id) {
      setOpenMenu(null);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = application.postingUrl ? 144 : 110;
    const gap = 6;
    const centeredTop = rect.top + (rect.height - menuHeight) / 2;
    const top = Math.max(8, Math.min(centeredTop, window.innerHeight - menuHeight - 8));
    const hasRoomOnLeft = rect.left >= menuWidth + gap + 8;
    const preferredLeft = hasRoomOnLeft
      ? rect.left - menuWidth - gap
      : rect.right + gap;
    const left = Math.max(8, Math.min(preferredLeft, window.innerWidth - menuWidth - 8));

    setOpenMenu({ application, top, left, trigger });
  }

  if (!applications.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><BriefcaseBusiness size={22} /></div>
        <h3>No applications found</h3>
        <p>Try adjusting your search or status filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-scroll">
        <table className="applications-table">
          <thead><tr><th>Company</th><th>Position</th><th>Location</th><th>Estimated Salary</th><th><button className="sort-button" onClick={onToggleSort} type="button">Date Applied {sortDirection === "desc" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}</button></th><th>Status</th><th className="actions-heading">Actions</th></tr></thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td><div className="company-cell"><span className={`company-mark mark-${application.company.length % 5}`}>{application.company.slice(0, 1)}</span><span className="company-name">{application.company}</span></div></td>
                <td className="position-cell">{application.position}</td>
                <td>{application.city || application.workArrangement}{application.province ? `, ${application.province}` : ""}</td>
                <td>{formatSalary(application.salaryMin, application.salaryMax, application.currency)}</td>
                <td>{formatDate(application.applicationDate)}</td>
                <td><StatusBadge status={application.status} /></td>
                <td>
                  <div className="row-actions">
                    <div className="actions-menu">
                      <button
                        aria-expanded={openMenu?.application.id === application.id}
                        aria-label={`Actions for ${application.position}`}
                        className="icon-button"
                        onClick={(event) => toggleMenu(application, event.currentTarget)}
                        type="button"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="application-cards">
        {applications.map((application) => (
          <article className="application-card" key={application.id}>
            <div className="application-card-top">
              <div className="company-cell"><span className={`company-mark mark-${application.company.length % 5}`}>{application.company.slice(0, 1)}</span><div><p className="company-name">{application.company}</p><p className="position-cell">{application.position}</p></div></div>
              <StatusBadge status={application.status} />
            </div>
            <div className="application-card-meta"><span>{formatDate(application.applicationDate)}</span><span>{application.city || application.workArrangement}</span><span>{formatSalary(application.salaryMin, application.salaryMax, application.currency)}</span></div>
            <div className="application-card-actions"><button className="text-link" onClick={() => onView(application)}>View details</button><button className="icon-button" onClick={() => onEdit(application)}>Edit</button><button className="icon-button delete-action" onClick={() => onDelete(application)}>Delete</button></div>
          </article>
        ))}
      </div>
      {openMenu
        ? createPortal(
            <div
              className="actions-popover"
              ref={menuRef}
              role="menu"
              style={{ top: openMenu.top, left: openMenu.left }}
            >
              <button onClick={() => { onView(openMenu.application); setOpenMenu(null); }} role="menuitem" type="button">View</button>
              <button onClick={() => { onEdit(openMenu.application); setOpenMenu(null); }} role="menuitem" type="button">Edit</button>
              {openMenu.application.postingUrl ? <a href={openMenu.application.postingUrl} target="_blank" rel="noreferrer" role="menuitem">Open posting <ExternalLink size={12} /></a> : null}
              <button className="menu-delete" onClick={() => { onDelete(openMenu.application); setOpenMenu(null); }} role="menuitem" type="button">Delete</button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
